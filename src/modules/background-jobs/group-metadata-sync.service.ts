import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDeepStrictEqual } from 'node:util';
import type { API } from 'zca-js';
import { ZaloApiError } from 'zca-js';
import type { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
  ZcaApiHelper,
} from '../../zalo';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';

const pendingGroupWhere: Prisma.ZaloGroupWhereInput = {
  OR: [{ isUpdateName: false }, { globalId: null }, { globalId: '' }],
};

type GroupInfoMapEntry = { name?: string; globalId?: string };

@Injectable()
export class GroupMetadataSyncService {
  private readonly logger = new Logger(GroupMetadataSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly loginSessions: ZaloLoginSessionsService,
    private readonly config: ConfigService,
  ) {}

  async runSyncBatch() {
    const chunkSize =
      this.config.get<number>('groupSync.getGroupInfoBatchSize') ?? 20;
    const maxCallsPerRun =
      this.config.get<number>('groupSync.maxGetGroupInfoCallsPerRun') ?? 10;
    const maxGroupsPerFetch =
      this.config.get<number | undefined>('groupSync.maxGroupsPerFetch') ??
      Math.max(1, chunkSize * maxCallsPerRun);

    const groups = await this.prisma.zaloGroup.findMany({
      where: pendingGroupWhere,
      take: maxGroupsPerFetch,
      orderBy: { createdAt: 'asc' },
      select: { id: true, groupName: true, isUpdateName: true, globalId: true },
    });

    if (groups.length === 0) {
      this.logger.debug('Group metadata sync: no pending groups.');
      return {
        candidates: 0,
        withMaster: 0,
        getGroupInfoCalls: 0,
        updated: 0,
        skippedNoMaster: 0,
        skippedNoSession: 0,
        failed: 0,
        skippedGlobalIdConflict: 0,
      };
    }

    const rows: Array<{
      groupId: string;
      groupZaloId: string;
      zaloUid: string;
    }> = [];
    let skippedNoMaster = 0;

    for (const g of groups) {
      const mapping = await this.prisma.zaloAccountGroup.findFirst({
        where: {
          groupId: g.id,
          zaloAccount: {
            isMaster: true,
            isDeleted: false,
            zaloId: { not: null },
          },
        },
        orderBy: { joinedAt: 'asc' },
        select: {
          groupZaloId: true,
          zaloAccount: { select: { zaloId: true } },
        },
      });
      const zaloUid = mapping?.zaloAccount?.zaloId?.trim();
      if (!mapping || !zaloUid) {
        skippedNoMaster += 1;
        continue;
      }
      rows.push({
        groupId: g.id,
        groupZaloId: mapping.groupZaloId,
        zaloUid,
      });
    }

    if (rows.length === 0) {
      this.logger.log(
        `Group metadata sync: ${groups.length} candidate(s), none with master + zaloId; skippedNoMaster=${skippedNoMaster}.`,
      );
      return {
        candidates: groups.length,
        withMaster: 0,
        getGroupInfoCalls: 0,
        updated: 0,
        skippedNoMaster,
        skippedNoSession: 0,
        failed: 0,
        skippedGlobalIdConflict: 0,
      };
    }

    const byZalo = new Map<string, typeof rows>();
    for (const r of rows) {
      const list = byZalo.get(r.zaloUid) ?? [];
      list.push(r);
      byZalo.set(r.zaloUid, list);
    }

    let updated = 0;
    let skippedNoSession = 0;
    let failed = 0;
    let skippedGlobalIdConflict = 0;
    let apiCalls = 0;

    for (const [zaloUid, batch] of byZalo) {
      const full = await this.tryGetLatestSession(zaloUid);
      if (!full) {
        skippedNoSession += batch.length;
        this.logger.warn(
          `Group metadata sync: no zalo_login_sessions for zalo_uid=${zaloUid}; skip ${batch.length} group(s).`,
        );
        continue;
      }

      for (let i = 0; i < batch.length; i += chunkSize) {
        if (apiCalls >= maxCallsPerRun) {
          this.logger.debug(
            `Group metadata sync: hit maxGetGroupInfoCallsPerRun=${maxCallsPerRun}; remaining group(s) deferred to next tick.`,
          );
          break;
        }
        const slice = batch.slice(i, i + chunkSize);
        const groupZaloIds = slice.map((b) => b.groupZaloId);
        apiCalls += 1;

        try {
          const grid = await this.withZaloSessionBySessionId(
            full.id,
            full.credentials,
            async (zca) => {
              const arg: string | string[] =
                groupZaloIds.length === 1 ? groupZaloIds[0] : groupZaloIds;
              return zca.getGroupInfo(arg);
            },
          );
          for (const item of slice) {
            const result = await this.applyGroupInfoFromZaloResponse(
              item.groupId,
              item.groupZaloId,
              grid,
            );
            if (result === 'updated') {
              updated += 1;
            } else if (result === 'globalId_conflict') {
              skippedGlobalIdConflict += 1;
            } else {
              failed += 1;
            }
          }
        } catch (err) {
          failed += slice.length;
          this.logger.error(
            `Group metadata sync failed for zalo_uid=${zaloUid} (${slice.length} group(s) in chunk): ${err instanceof Error ? err.message : String(err)}`,
            err instanceof Error ? err.stack : undefined,
          );
        }
      }

      if (apiCalls >= maxCallsPerRun) {
        break;
      }
    }

    this.logger.log(
      `Group metadata sync done: candidates=${groups.length} withMaster=${rows.length} getGroupInfoCalls=${apiCalls}/${maxCallsPerRun} chunkSize=${chunkSize} updated=${updated} skippedNoMaster=${skippedNoMaster} skippedNoSession=${skippedNoSession} failed=${failed} skippedGlobalIdConflict=${skippedGlobalIdConflict}`,
    );

    return {
      candidates: groups.length,
      withMaster: rows.length,
      getGroupInfoCalls: apiCalls,
      updated,
      skippedNoMaster,
      skippedNoSession,
      failed,
      skippedGlobalIdConflict,
    };
  }

  private async tryGetLatestSession(zaloUid: string): Promise<{
    id: string;
    credentials: ZaloSessionCredentialsPayload;
  } | null> {
    try {
      return await this.loginSessions.findLatestByZaloUid(zaloUid);
    } catch (e) {
      if (e instanceof NotFoundException) {
        return null;
      }
      throw e;
    }
  }

  private async withZaloSessionBySessionId<T>(
    sessionId: string,
    prevCreds: ZaloSessionCredentialsPayload,
    run: (zca: ZcaApiHelper, api: API) => Promise<T>,
  ): Promise<T> {
    let api: API;
    try {
      api = await createZcaApiFromCredentials(prevCreds);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Zalo login from stored session failed (sessionId=${sessionId}): ${detail}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw badRequestForZaloSessionRestoreFailure(detail);
    }

    const zca = new ZcaApiHelper(api);
    try {
      const out = await run(zca, api);
      await this.persistRefreshedCredentials(sessionId, api, prevCreds);
      await this.loginSessions.touchBySessionId(sessionId);
      return out;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err instanceof ZaloApiError) {
        const code = err.code != null ? `[${err.code}] ` : '';
        throw new BadRequestException(
          `${code}${err.message || 'Zalo API rejected the operation.'}`,
        );
      }
      throw new InternalServerErrorException(
        err instanceof Error ? err.message : 'Zalo API error.',
      );
    }
  }

  private async persistRefreshedCredentials(
    sessionId: string,
    api: API,
    prev: ZaloSessionCredentialsPayload,
  ): Promise<void> {
    let nextCookies: Record<string, unknown>[];
    try {
      nextCookies = await snapshotSerializedCookiesFromApi(api, prev.cookies);
    } catch {
      return;
    }

    const next: ZaloSessionCredentialsPayload = {
      imei: prev.imei,
      userAgent: prev.userAgent,
      cookies: nextCookies,
    };

    if (!isDeepStrictEqual(next, prev)) {
      await this.loginSessions.updateCredentialsForSessionById(sessionId, next);
    }
  }

  private readGrid(
    res: unknown,
  ): Record<string, GroupInfoMapEntry> | undefined {
    if (res == null || typeof res !== 'object') {
      return undefined;
    }
    const m = (res as { gridInfoMap?: unknown }).gridInfoMap;
    if (m == null || typeof m !== 'object') {
      return undefined;
    }
    return m as Record<string, GroupInfoMapEntry>;
  }

  private async applyGroupInfoFromZaloResponse(
    groupId: string,
    groupZaloId: string,
    response: unknown,
  ): Promise<'updated' | 'globalId_conflict' | 'failed'> {
    const grid = this.readGrid(response);
    const entry = grid?.[groupZaloId];
    if (entry == null) {
      this.logger.warn(
        `Group metadata sync: no gridInfoMap entry for groupZaloId=${groupZaloId} (groupId=${groupId}).`,
      );
      return 'failed';
    }

    const nameFromZalo =
      typeof entry.name === 'string' ? entry.name.trim() : '';
    const globalFromZalo =
      typeof entry.globalId === 'string' ? entry.globalId.trim() : '';

    if (!nameFromZalo && !globalFromZalo) {
      this.logger.warn(
        `Group metadata sync: empty name and globalId from Zalo for groupZaloId=${groupZaloId} (groupId=${groupId}).`,
      );
      return 'failed';
    }

    try {
      await this.prisma.zaloGroup.update({
        where: { id: groupId },
        data: {
          ...(nameFromZalo
            ? { groupName: nameFromZalo, isUpdateName: true }
            : {}),
          ...(globalFromZalo ? { globalId: globalFromZalo } : {}),
        },
      });
      return 'updated';
    } catch (e) {
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002' &&
        globalFromZalo
      ) {
        this.logger.warn(
          `Group metadata sync: globalId unique conflict for groupId=${groupId}; applying name only.`,
        );
        try {
          if (nameFromZalo) {
            await this.prisma.zaloGroup.update({
              where: { id: groupId },
              data: { groupName: nameFromZalo, isUpdateName: true },
            });
          }
          return 'globalId_conflict';
        } catch (e2) {
          this.logger.error(
            `Group metadata sync: follow-up update failed (groupId=${groupId}): ${e2 instanceof Error ? e2.message : String(e2)}`,
          );
          return 'failed';
        }
      }
      this.logger.error(
        `Group metadata sync: Prisma update failed (groupId=${groupId}): ${e instanceof Error ? e.message : String(e)}`,
      );
      return 'failed';
    }
  }
}
