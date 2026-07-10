import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDeepStrictEqual } from 'node:util';
import type { API } from 'zca-js';
import { ZaloApiError } from 'zca-js';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
  ZcaApiHelper,
} from '../../zalo';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';

type GridInfoEntry = { name?: string; globalId?: string };

const ZALO_RESOLVE_API_TIMEOUT_MS = 120_000;
/** After master invite, Zalo may lag before the group appears on the child session. */
const CHILD_GRID_APPEAR_RETRY_ATTEMPTS = 4;
const CHILD_GRID_APPEAR_RETRY_DELAY_MS = 2_000;

/**
 * Đồng bộ inline (không Bull): sau khi master `addUserToGroup`, lấy `group_zalo_id` **phía child**
 * qua getAllGroups + getGroupInfo + cùng quy tắc link như child scan.
 *
 * Vì sao cần bước này: grid id (`group_zalo_id`) **khác nhau theo từng tài khoản**.
 * Master mời bằng grid của master; `sendMessage` bằng session child phải dùng grid của child.
 * Cầu nối là `globalId` (canonical) từ `getGroupInfo` ↔ `ZaloGroup.globalId`.
 */
@Injectable()
export class ChildGroupGridResolveService {
  private readonly logger = new Logger(ChildGroupGridResolveService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly loginSessions: ZaloLoginSessionsService,
    private readonly config: ConfigService,
  ) {}

  /**
   * @returns `group_zalo_id` trên session child cho `groupId` nội bộ, sau khi DB đã có map (create).
   */
  async resolveChildGroupZaloIdAfterMasterInvite(params: {
    zaloAccountId: string;
    groupId: string;
    sessionId: string;
  }): Promise<string> {
    const { zaloAccountId, groupId, sessionId } = params;

    const existing = await this.prisma.zaloAccountGroup.findFirst({
      where: { zaloAccountId, groupId },
      select: { groupZaloId: true },
    });
    const existingTrim = existing?.groupZaloId?.trim();
    if (existingTrim) {
      return existingTrim;
    }

    const targetGroup = await this.prisma.zaloGroup.findFirst({
      where: { id: groupId },
      select: { id: true, globalId: true, groupName: true },
    });
    if (!targetGroup) {
      throw new BadRequestException('ZaloGroup không tồn tại để map phía child.');
    }
    const expectedGlobalId = targetGroup.globalId?.trim() || '';

    const masterIds = await this.getMasterIdsForChild(zaloAccountId);
    if (masterIds.length === 0) {
      throw new BadRequestException(
        'Child không có master trong zalo_account_relations; không thể map nhóm.',
      );
    }

    const account = await this.prisma.zaloAccount.findFirst({
      where: { id: zaloAccountId, isDeleted: false },
      select: { zaloId: true },
    });
    const zaloUid = account?.zaloId?.trim();
    if (!zaloUid) {
      throw new BadRequestException('Tài khoản child thiếu zalo_id.');
    }

    const batchSize =
      this.config.get<number>('childGroupSync.getGroupInfoBatchSize') ?? 20;
    const maxCalls =
      this.config.get<number>('childGroupSync.maxGetGroupInfoCallsPerRun') ??
      10;

    let lastWorkListLen = 0;
    let scannedGrids = 0;
    let sawExpectedGlobalId = false;

    for (
      let attempt = 1;
      attempt <= CHILD_GRID_APPEAR_RETRY_ATTEMPTS;
      attempt += 1
    ) {
      const workList = await this.listUnmappedChildGridIds(
        sessionId,
        zaloAccountId,
      );
      lastWorkListLen = workList.length;

      if (workList.length === 0) {
        if (attempt < CHILD_GRID_APPEAR_RETRY_ATTEMPTS) {
          this.logger.log(
            `resolve grid: child getAllGroups chưa có grid mới (attempt ${attempt}/${CHILD_GRID_APPEAR_RETRY_ATTEMPTS}); chờ ${CHILD_GRID_APPEAR_RETRY_DELAY_MS}ms.`,
          );
          await this.sleep(CHILD_GRID_APPEAR_RETRY_DELAY_MS);
          continue;
        }
        throw new BadRequestException(
          expectedGlobalId
            ? `Child getAllGroups không có grid nhóm mới sau khi mời — session child chưa thấy nhóm (globalId=${expectedGlobalId}, group="${targetGroup.groupName ?? groupId}"). Kiểm tra child đã vào nhóm trên Zalo (không chỉ pending duyệt).`
            : 'Không có grid nhóm mới trên Zalo (getAllGroups) để map — kiểm tra child đã vào nhóm chưa.',
        );
      }

      const full = await this.loginSessions.findOneFullBySessionId(sessionId);
      let ap: API;
      try {
        ap = await createZcaApiFromCredentials(full.credentials);
      } catch (e) {
        this.logger.error(
          `resolve grid: session restore failed: ${e instanceof Error ? e.message : String(e)}`,
        );
        throw badRequestForZaloSessionRestoreFailure(
          e instanceof Error ? e.message : String(e),
        );
      }
      let prev: ZaloSessionCredentialsPayload = full.credentials;
      const zca = new ZcaApiHelper(ap);
      const callsLimit = maxCalls;
      scannedGrids = 0;
      sawExpectedGlobalId = false;

      for (let c = 0; c < callsLimit; c += 1) {
        const base = c * batchSize;
        const chunk = workList.slice(base, base + batchSize);
        if (chunk.length === 0) {
          break;
        }
        scannedGrids += chunk.length;
        const arg: string | string[] =
          chunk.length === 1 ? chunk[0]! : chunk;
        const res = await this.withZaloCallTimeout(
          zca.getGroupInfo(arg),
          `getGroupInfo(${String(Array.isArray(arg) ? arg.length : 1)} ids)`,
        );
        const grid = this.readGrid(res);
        for (const gridId of chunk) {
          const entry = grid?.[gridId];
          if (!entry) {
            continue;
          }
          const gFromZ =
            typeof entry.globalId === 'string' ? entry.globalId.trim() : '';
          if (expectedGlobalId && gFromZ && gFromZ === expectedGlobalId) {
            sawExpectedGlobalId = true;
          }
          await this.tryLinkChildToMasterGroup(
            zaloAccountId,
            masterIds,
            gridId,
            entry,
          );
        }
        prev = await this.persistCredsAndReturnNext(sessionId, ap, prev);
        await this.loginSessions.touchBySessionId(sessionId);

        const nowRow = await this.prisma.zaloAccountGroup.findFirst({
          where: { zaloAccountId, groupId },
          select: { groupZaloId: true },
        });
        const nowTrim = nowRow?.groupZaloId?.trim();
        if (nowTrim) {
          return nowTrim;
        }
      }

      // Target group not linked this attempt — maybe invite not visible yet on child.
      if (attempt < CHILD_GRID_APPEAR_RETRY_ATTEMPTS && !sawExpectedGlobalId) {
        this.logger.log(
          `resolve grid: chưa thấy globalId đích trên child (attempt ${attempt}/${CHILD_GRID_APPEAR_RETRY_ATTEMPTS}, unmapped=${workList.length}, scanned=${scannedGrids}); retry.`,
        );
        await this.sleep(CHILD_GRID_APPEAR_RETRY_DELAY_MS);
        continue;
      }
      break;
    }

    if (!expectedGlobalId) {
      throw new BadRequestException(
        `Đã gọi getGroupInfo (${scannedGrids}/${lastWorkListLen} grid chưa map) nhưng ZaloGroup id=${groupId} chưa có globalId trong DB — chạy đồng bộ metadata nhóm (master) trước.`,
      );
    }
    if (!sawExpectedGlobalId) {
      throw new BadRequestException(
        `Child đã có ${lastWorkListLen} grid chưa map; đã getGroupInfo ${scannedGrids} grid nhưng không thấy globalId=${expectedGlobalId} của nhóm "${targetGroup.groupName ?? groupId}". Thường là child chưa vào nhóm trên Zalo (invite chưa thành / đang chờ duyệt), hoặc grid đích nằm ngoài giới hạn quét — chạy quét nhóm child đầy đủ.`,
      );
    }
    throw new BadRequestException(
      `Đã thấy globalId=${expectedGlobalId} trên session child nhưng chưa tạo được zalo_account_groups (master chưa map nhóm này, hoặc race). Kiểm tra master có dòng zalo_account_groups cho group id=${groupId}.`,
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async getMasterIdsForChild(childId: string): Promise<string[]> {
    const rows = await this.prisma.zaloAccountRelation.findMany({
      where: { childId },
      select: { masterId: true },
    });
    return rows.map((r) => r.masterId);
  }

  /**
   * Grid id từ getAllGroups mà child **chưa** có dòng zalo_account_groups tương ứng.
   */
  private async listUnmappedChildGridIds(
    sessionId: string,
    zaloAccountId: string,
  ): Promise<string[]> {
    const gridVerMap = await this.withZaloCallTimeout(
      this.withZaloSessionShort(sessionId, async (zca) => {
        const g = await zca.getAllGroups();
        return g?.gridVerMap ?? {};
      }),
      'getAllGroups',
    );
    const keys = Object.keys(
      (gridVerMap as Record<string, string>) || {},
    ).filter((k) => k.length > 0);
    if (keys.length === 0) {
      return [];
    }
    const have = new Set(
      (
        await this.prisma.zaloAccountGroup.findMany({
          where: {
            zaloAccountId,
            groupZaloId: { in: keys },
          },
          select: { groupZaloId: true },
        })
      ).map((r) => r.groupZaloId),
    );
    return keys.filter((k) => !have.has(k));
  }

  private async withZaloCallTimeout<T>(
    promise: Promise<T>,
    label: string,
  ): Promise<T> {
    const ms = ZALO_RESOLVE_API_TIMEOUT_MS;
    return new Promise<T>((resolve, reject) => {
      const t = setTimeout(
        () =>
          reject(
            new Error(`Zalo API timeout after ${ms}ms (${label}).`),
          ),
        ms,
      );
      promise
        .then((v) => {
          clearTimeout(t);
          resolve(v);
        })
        .catch((e) => {
          clearTimeout(t);
          reject(e);
        });
    });
  }

  private async withZaloSessionShort<T>(
    sessionId: string,
    run: (zca: ZcaApiHelper) => Promise<T>,
  ): Promise<T> {
    const full = await this.loginSessions.findOneFullBySessionId(sessionId);
    let ap: API;
    try {
      ap = await createZcaApiFromCredentials(full.credentials);
    } catch (err) {
      const d = err instanceof Error ? err.message : String(err);
      throw badRequestForZaloSessionRestoreFailure(d);
    }
    const zca = new ZcaApiHelper(ap);
    try {
      return await run(zca);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      if (e instanceof ZaloApiError) {
        throw e;
      }
      throw new InternalServerErrorException(
        e instanceof Error ? e.message : 'Zalo API error',
      );
    } finally {
      await this.persistCreds(sessionId, ap, full.credentials);
      await this.loginSessions.touchBySessionId(sessionId);
    }
  }

  private async persistCreds(
    sessionId: string,
    api: API,
    prev: ZaloSessionCredentialsPayload,
  ): Promise<void> {
    await this.persistCredsAndReturnNext(sessionId, api, prev);
  }

  private async persistCredsAndReturnNext(
    sessionId: string,
    api: API,
    prev: ZaloSessionCredentialsPayload,
  ): Promise<ZaloSessionCredentialsPayload> {
    let nextCookies: Record<string, unknown>[];
    try {
      nextCookies = await snapshotSerializedCookiesFromApi(api, prev.cookies);
    } catch {
      return prev;
    }
    const next: ZaloSessionCredentialsPayload = {
      imei: prev.imei,
      userAgent: prev.userAgent,
      cookies: nextCookies,
    };
    if (!isDeepStrictEqual(next, prev)) {
      await this.loginSessions.updateCredentialsForSessionById(sessionId, next);
    }
    return isDeepStrictEqual(next, prev) ? prev : next;
  }

  private readGrid(
    res: unknown,
  ): Record<string, GridInfoEntry> | undefined {
    if (res == null || typeof res !== 'object') {
      return undefined;
    }
    const m = (res as { gridInfoMap?: unknown }).gridInfoMap;
    if (m == null || typeof m !== 'object') {
      return undefined;
    }
    return m as Record<string, GridInfoEntry>;
  }

  /** Cùng điều kiện với child scan — tạo `zalo_account_groups` với grid phía child. */
  private async tryLinkChildToMasterGroup(
    zaloAccountId: string,
    masterIds: string[],
    groupZaloId: string,
    entry: GridInfoEntry,
  ): Promise<void> {
    const globalFromZ =
      typeof entry.globalId === 'string' && entry.globalId.trim()
        ? entry.globalId.trim()
        : null;
    if (!globalFromZ) {
      this.logger.debug(
        `resolve grid: no globalId for grid ${groupZaloId}, skip.`,
      );
      return;
    }
    let group: { id: string } | null = await this.prisma.zaloGroup.findFirst({
      where: { globalId: globalFromZ },
      select: { id: true },
    });
    if (!group) {
      const masterMapRows = await this.prisma.zaloAccountGroup.findMany({
        where: { zaloAccountId: { in: masterIds } },
        select: { groupId: true },
      });
      const masterGroupIds = [...new Set(masterMapRows.map((r) => r.groupId))];
      const unSynced = await this.prisma.zaloGroup.findMany({
        where: {
          id: { in: masterGroupIds },
          OR: [{ globalId: null }, { globalId: '' }],
        },
        select: { id: true, groupName: true },
      });
      if (unSynced.length === 1) {
        const only = unSynced[0]!;
        const nameFromZ =
          typeof entry.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : only.groupName;
        await this.prisma.zaloGroup.update({
          where: { id: only.id },
          data: {
            globalId: globalFromZ,
            groupName: nameFromZ,
            isUpdateName: true,
            ...(nameFromZ ? { originName: nameFromZ } : {}),
          },
        });
        this.logger.log(
          `resolve grid: backfilled globalId on ZaloGroup id=${only.id} from child grid ${groupZaloId}.`,
        );
        group = { id: only.id };
      } else {
        this.logger.debug(
          unSynced.length === 0
            ? `resolve grid: no ZaloGroup for globalId=${globalFromZ}.`
            : `resolve grid: ambiguous unsynced master groups (${unSynced.length}).`,
        );
        return;
      }
    }
    const masterHasGroup = await this.prisma.zaloAccountGroup.findFirst({
      where: {
        groupId: group.id,
        zaloAccountId: { in: masterIds },
        zaloAccount: { isMaster: true, isDeleted: false },
      },
      select: { id: true },
    });
    if (!masterHasGroup) {
      return;
    }
    const exists = await this.prisma.zaloAccountGroup.findFirst({
      where: { zaloAccountId, groupId: group.id },
    });
    if (exists) {
      return;
    }
    try {
      await this.prisma.zaloAccountGroup.create({
        data: { zaloAccountId, groupZaloId, groupId: group.id },
      });
      const groupCount = await this.prisma.zaloAccountGroup.count({
        where: { zaloAccountId },
      });
      await this.prisma.zaloAccount.update({
        where: { id: zaloAccountId },
        data: { groupCount },
      });
    } catch (e) {
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002'
      ) {
        return;
      }
      throw e;
    }
  }
}
