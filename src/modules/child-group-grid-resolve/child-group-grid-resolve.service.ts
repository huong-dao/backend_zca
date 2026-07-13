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

/**
 * Đồng bộ inline (không Bull): sau khi master `addUserToGroup`, lấy `group_zalo_id` **phía child**
 * qua getAllGroups + getGroupInfo + cùng quy tắc link như child scan.
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
  async tryResolveChildGroupZaloIdAfterMasterInvite(params: {
    zaloAccountId: string;
    groupId: string;
    sessionId: string;
  }): Promise<string | null> {
    try {
      return await this.resolveChildGroupZaloIdAfterMasterInvite(params);
    } catch (e) {
      this.logger.debug(
        `tryResolveChildGroupZaloId: ${e instanceof Error ? e.message : String(e)}`,
      );
      return null;
    }
  }

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

    const targetGroup = await this.prisma.zaloGroup.findFirst({
      where: { id: groupId },
      select: { globalId: true },
    });
    const targetGlobalId = targetGroup?.globalId?.trim();
    if (targetGlobalId) {
      const matched = await this.resolveChildGridMatchingGlobalId({
        zaloAccountId,
        groupId,
        sessionId,
        targetGlobalId,
        masterIds,
      });
      if (matched) {
        return matched;
      }
    }

    const workList = await this.listUnmappedChildGridIds(
      sessionId,
      zaloAccountId,
    );
    if (workList.length === 0) {
      throw new BadRequestException(
        'Không có grid nhóm mới trên Zalo (getAllGroups) để map — kiểm tra child đã vào nhóm chưa.',
      );
    }

    const batchSize = this.config.get<number>(
      'childGroupSync.getGroupInfoBatchSize',
    ) ?? 20;
    const maxCalls =
      this.config.get<number>(
        'childGroupSync.maxGetGroupInfoCallsPerRun',
      ) ?? 10;

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

    for (let c = 0; c < callsLimit; c += 1) {
      const base = c * batchSize;
      const chunk = workList.slice(base, base + batchSize);
      if (chunk.length === 0) {
        break;
      }
      const arg: string | string[] =
        chunk.length === 1 ? chunk[0]! : chunk;
      const res = await this.withZaloCallTimeout(
        zca.getGroupInfo(arg),
        `getGroupInfo(${String(Array.isArray(arg) ? arg.length : 1)} ids)`,
      );
      const grid = this.readGrid(res);
      for (const gridId of chunk) {
        const entry = grid?.[gridId];
        if (entry) {
          await this.tryLinkChildToMasterGroup(
            zaloAccountId,
            masterIds,
            gridId,
            entry,
            groupId,
          );
        }
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

    throw new BadRequestException(
      'Đã gọi getGroupInfo nhưng chưa map được group_zalo_id phía child (thiếu globalId trên ZaloGroup, hoặc child chưa trong nhóm). Thử chạy đồng bộ metadata nhóm / quét nhóm child.',
    );
  }

  /**
   * Tìm grid phía child có `globalId` trùng nhóm đích (sau master mời) — retry vì Zalo có thể chậm cập nhật getAllGroups.
   */
  private async resolveChildGridMatchingGlobalId(args: {
    zaloAccountId: string;
    groupId: string;
    sessionId: string;
    targetGlobalId: string;
    masterIds: string[];
  }): Promise<string | null> {
    const batchSize =
      this.config.get<number>('childGroupSync.getGroupInfoBatchSize') ?? 20;
    const maxAttempts = 3;
    const delayMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (attempt > 0) {
        await this.sleep(delayMs);
      }

      const gridIds = await this.listChildGridIdsFromZalo(args.sessionId);
      if (gridIds.length === 0) {
        continue;
      }

      const full = await this.loginSessions.findOneFullBySessionId(
        args.sessionId,
      );
      let ap: API;
      try {
        ap = await createZcaApiFromCredentials(full.credentials);
      } catch {
        continue;
      }
      let prev: ZaloSessionCredentialsPayload = full.credentials;
      const zca = new ZcaApiHelper(ap);

      try {
        for (let base = 0; base < gridIds.length; base += batchSize) {
          const chunk = gridIds.slice(base, base + batchSize);
          const arg: string | string[] = chunk.length === 1 ? chunk[0]! : chunk;
          const res = await this.withZaloCallTimeout(
            zca.getGroupInfo(arg),
            `getGroupInfo(targetGlobalId, ${chunk.length})`,
          );
          const grid = this.readGrid(res);
          for (const gridId of chunk) {
            const entry = grid?.[gridId];
            const globalFromZ = entry?.globalId?.trim();
            if (!entry || !globalFromZ || globalFromZ !== args.targetGlobalId) {
              continue;
            }
            await this.tryLinkChildToMasterGroup(
              args.zaloAccountId,
              args.masterIds,
              gridId,
              entry,
              args.groupId,
            );
            const row = await this.prisma.zaloAccountGroup.findFirst({
              where: {
                zaloAccountId: args.zaloAccountId,
                groupId: args.groupId,
              },
              select: { groupZaloId: true },
            });
            const mapped = row?.groupZaloId?.trim();
            if (mapped) {
              return mapped;
            }
          }
        }
      } finally {
        prev = await this.persistCredsAndReturnNext(args.sessionId, ap, prev);
        await this.loginSessions.touchBySessionId(args.sessionId);
      }
    }

    return null;
  }

  private async listChildGridIdsFromZalo(sessionId: string): Promise<string[]> {
    const gridVerMap = await this.withZaloCallTimeout(
      this.withZaloSessionShort(sessionId, async (zca) => {
        const g = await zca.getAllGroups();
        return g?.gridVerMap ?? {};
      }),
      'getAllGroups',
    );
    return Object.keys((gridVerMap as Record<string, string>) || {}).filter(
      (k) => k.length > 0,
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

  /** Cùng điều kiện với child scan — tạo/cập nhật `zalo_account_groups` với grid phía child. */
  private async tryLinkChildToMasterGroup(
    zaloAccountId: string,
    masterIds: string[],
    groupZaloId: string,
    entry: GridInfoEntry,
    preferredGroupId?: string,
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
    let group: { id: string } | null = null;
    if (preferredGroupId) {
      const preferred = await this.prisma.zaloGroup.findFirst({
        where: { id: preferredGroupId },
        select: { id: true, globalId: true },
      });
      if (preferred?.globalId?.trim() === globalFromZ) {
        group = { id: preferred.id };
      }
    }
    if (!group) {
      group = await this.prisma.zaloGroup.findFirst({
        where: { globalId: globalFromZ },
        select: { id: true },
      });
    }
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
    await this.upsertChildGroupMapping(zaloAccountId, group.id, groupZaloId);
  }

  private async upsertChildGroupMapping(
    zaloAccountId: string,
    groupInternalId: string,
    groupZaloId: string,
  ): Promise<void> {
    const gridTrim = groupZaloId.trim();
    if (!gridTrim) {
      return;
    }
    const existing = await this.prisma.zaloAccountGroup.findFirst({
      where: { zaloAccountId, groupId: groupInternalId },
      select: { id: true, groupZaloId: true },
    });
    if (existing?.groupZaloId?.trim()) {
      return;
    }
    if (existing) {
      await this.prisma.zaloAccountGroup.update({
        where: { id: existing.id },
        data: { groupZaloId: gridTrim },
      });
    } else {
      try {
        await this.prisma.zaloAccountGroup.create({
          data: {
            zaloAccountId,
            groupZaloId: gridTrim,
            groupId: groupInternalId,
          },
        });
      } catch (e) {
        if (
          e &&
          typeof e === 'object' &&
          'code' in e &&
          (e as { code: string }).code === 'P2002'
        ) {
          const again = await this.prisma.zaloAccountGroup.findFirst({
            where: { zaloAccountId, groupId: groupInternalId },
            select: { id: true, groupZaloId: true },
          });
          if (again && !again.groupZaloId?.trim()) {
            await this.prisma.zaloAccountGroup.update({
              where: { id: again.id },
              data: { groupZaloId: gridTrim },
            });
          }
          return;
        }
        throw e;
      }
    }
    const groupCount = await this.prisma.zaloAccountGroup.count({
      where: { zaloAccountId },
    });
    await this.prisma.zaloAccount.update({
      where: { id: zaloAccountId },
      data: { groupCount },
    });
  }
}
