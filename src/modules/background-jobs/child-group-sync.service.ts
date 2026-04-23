import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDeepStrictEqual } from 'node:util';
import { InjectQueue } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
  ZcaApiHelper,
} from '../../zalo';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import type { API } from 'zca-js';
import { ZaloApiError } from 'zca-js';
import { CHILD_GROUP_SCAN_QUEUE } from './constants';

export type ChildGroupScanJobPayload = {
  zaloAccountId: string;
  appUserId: string;
  sessionId: string;
  /**
   * If undefined, job runs getAllGroups first to build the list of grid ids to process.
   * If present, work remaining remote/cache steps only.
   */
  workGridIds: string[] | null;
};

type GridInfoEntry = { name?: string; globalId?: string };

@Injectable()
export class ChildGroupSyncService {
  private readonly logger = new Logger(ChildGroupSyncService.name);
  private redis: Redis | null = null;

  constructor(
    @InjectQueue(CHILD_GROUP_SCAN_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly loginSessions: ZaloLoginSessionsService,
    private readonly config: ConfigService,
  ) {
    this.ensureRedis();
  }

  private ensureRedis(): void {
    if (this.redis) {
      return;
    }
    const url = this.config.get<string>('groupSync.redis.url');
    if (url) {
      this.redis = new Redis(url, { maxRetriesPerRequest: null });
      return;
    }
    this.redis = new Redis({
      host: this.config.get<string>('groupSync.redis.host') ?? '127.0.0.1',
      port: this.config.get<number>('groupSync.redis.port') ?? 6379,
      password: this.config.get<string | undefined>('groupSync.redis.password'),
      username: this.config.get<string | undefined>(
        'groupSync.redis.username',
      ),
      maxRetriesPerRequest: null,
    });
  }

  isEnabled(): boolean {
    return this.config.get('groupSync.enabled') === true;
  }

  /**
   * Manual "quét nhóm" — sets INACTIVE, enqueues; frontend uses `zalo_accounts.status` for UI.
   */
  async startChildGroupScan(
    appUserId: string,
    zaloAccountId: string,
    sessionId: string,
  ): Promise<{ enqueued: boolean; zaloAccountId: string; status: string }> {
    this.assertEnabled();
    const account = await this.prisma.zaloAccount.findFirst({
      where: { id: zaloAccountId, isDeleted: false },
      select: { id: true, isMaster: true, zaloId: true, status: true, name: true },
    });
    if (!account) {
      throw new NotFoundException('Zalo account not found.');
    }
    if (account.isMaster) {
      throw new BadRequestException('Only a child Zalo account can be scanned.');
    }
    if (account.status === 'INACTIVE') {
      throw new ConflictException(
        'A group scan is already in progress (status is INACTIVE).',
      );
    }
    const zaloUid = account.zaloId?.trim();
    if (!zaloUid) {
      throw new BadRequestException('Child account has no zalo_id set.');
    }
    await this.loginSessions.findLatestFullForAppUserAndZaloUid(
      appUserId,
      zaloUid,
    );
    const sessionRow = await this.prisma.zaloLoginSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, zaloUid: true },
    });
    if (!sessionRow || sessionRow.userId !== appUserId) {
      throw new BadRequestException('sessionId is not valid for the current user.');
    }
    if (sessionRow.zaloUid !== zaloUid) {
      throw new BadRequestException('sessionId does not belong to this Zalo account.');
    }

    await this.prisma.zaloAccount.update({
      where: { id: zaloAccountId },
      data: { status: 'INACTIVE' },
    });

    await this.queue.add(
      'sync',
      {
        zaloAccountId,
        appUserId,
        sessionId,
        workGridIds: null,
      } satisfies ChildGroupScanJobPayload,
      {
        jobId: `child-scan-${zaloAccountId}`,
        removeOnComplete: 50,
        removeOnFail: 20,
      },
    );
    this.logger.log(`Child group scan enqueued: zaloAccountId=${zaloAccountId}`);

    return { enqueued: true, zaloAccountId, status: 'INACTIVE' };
  }

  /**
   * After master invites child — same mapping pipeline, no duplicate scan if one is running.
   */
  async enqueueAfterInvite(
    appUserId: string,
    childZaloAccountId: string,
  ): Promise<void> {
    this.assertEnabled();
    const child = await this.prisma.zaloAccount.findFirst({
      where: { id: childZaloAccountId, isDeleted: false, isMaster: false },
      select: { zaloId: true, status: true },
    });
    if (!child?.zaloId?.trim()) {
      this.logger.warn(
        `Skip post-invite child scan: no zalo_id (childZaloAccountId=${childZaloAccountId})`,
      );
      return;
    }
    if (child.status === 'INACTIVE') {
      this.logger.log(
        `Post-invite scan skipped: child already INACTIVE (childZaloAccountId=${childZaloAccountId})`,
      );
      return;
    }
    const zaloUid = child.zaloId.trim();
    let sessionId: string;
    try {
      const full = await this.loginSessions.findLatestFullForAppUserAndZaloUid(
        appUserId,
        zaloUid,
      );
      sessionId = full.id;
    } catch (e) {
      this.logger.warn(
        `Post-invite child scan: no session for app user + child (childZaloAccountId=${childZaloAccountId}): ${e instanceof Error ? e.message : String(e)}`,
      );
      return;
    }
    await this.prisma.zaloAccount.update({
      where: { id: childZaloAccountId },
      data: { status: 'INACTIVE' },
    });
    await this.queue.add(
      'sync',
      {
        zaloAccountId: childZaloAccountId,
        appUserId,
        sessionId,
        workGridIds: null,
      } satisfies ChildGroupScanJobPayload,
      {
        jobId: `child-scan-${childZaloAccountId}`,
        removeOnComplete: 50,
        removeOnFail: 20,
      },
    );
    this.logger.log(
      `Post-invite child scan enqueued: childZaloAccountId=${childZaloAccountId}`,
    );
  }

  private assertEnabled(): void {
    if (!this.isEnabled()) {
      throw new BadRequestException(
        'Child group scan is disabled. Set GROUP_SYNC_ENABLED=true and configure Redis (same as master group metadata sync).',
      );
    }
  }

  async runScanFromJob(job: Job<ChildGroupScanJobPayload>): Promise<void> {
    const p = job.data;
    if (!p?.zaloAccountId || !p.sessionId) {
      this.logger.error('child-group-scan: invalid job payload');
      return;
    }
    let continuationScheduled = false;
    try {
      continuationScheduled = await this.runScanPayload(p);
    } catch (e) {
      this.logger.error(
        `child-group-scan failed: ${e instanceof Error ? e.message : String(e)}`,
        e instanceof Error ? e.stack : undefined,
      );
      await this.prisma.zaloAccount.updateMany({
        where: { id: p.zaloAccountId, status: 'INACTIVE' },
        data: { status: 'ACTIVE' },
      });
      throw e;
    }
    if (!continuationScheduled) {
      await this.prisma.zaloAccount.updateMany({
        where: { id: p.zaloAccountId, status: 'INACTIVE' },
        data: { status: 'ACTIVE' },
      });
      this.logger.log(
        `Child group scan finished; status=ACTIVE (zaloAccountId=${p.zaloAccountId})`,
      );
    }
  }

  /** @returns true if a delayed continuation was scheduled (child stays INACTIVE). */
  private async runScanPayload(
    p: ChildGroupScanJobPayload,
  ): Promise<boolean> {
    const { zaloAccountId, sessionId, appUserId } = p;
    const account = await this.prisma.zaloAccount.findFirst({
      where: { id: zaloAccountId, isDeleted: false },
      select: { zaloId: true, name: true },
    });
    if (!account?.zaloId?.trim()) {
      this.logger.error(`Child scan: missing zalo_id (${zaloAccountId})`);
      return false;
    }
    const zaloUid = account.zaloId.trim();
    const batchSize = this.config.get<number>(
      'childGroupSync.getGroupInfoBatchSize',
    ) ?? 20;
    const maxCalls = this.config.get<number>(
      'childGroupSync.maxGetGroupInfoCallsPerRun',
    ) ?? 10;
    const delay = this.config.get<number>('childGroupSync.continueDelayMs') ?? 180_000;
    const ttl = this.config.get<number>('childGroupSync.cacheTtlSec') ?? 604_800;

    let workList: string[] =
      p.workGridIds == null
        ? await this.buildWorkListFromGetAllGroups(
            sessionId,
            zaloAccountId,
            zaloUid,
          )
        : [...p.workGridIds];

    workList = await this.applyCacheAndShrink(
      zaloUid,
      zaloAccountId,
      workList,
      ttl,
    );
    if (workList.length === 0) {
      return false;
    }

    const maxIdsThisRun = maxCalls * batchSize;
    const toProcessThisRun = workList.slice(0, maxIdsThisRun);
    const nextRound = workList.slice(maxIdsThisRun);

    const full = await this.loginSessions.findOneFullBySessionId(sessionId);
    let ap: API;
    try {
      ap = await createZcaApiFromCredentials(full.credentials);
    } catch (e) {
      this.logger.error(
        `Child scan: zalo session restore failed: ${e instanceof Error ? e.message : String(e)}`,
      );
      throw e;
    }
    let prev: ZaloSessionCredentialsPayload = full.credentials;
    const zca = new ZcaApiHelper(ap);
    const callsLimit = maxCalls;
    for (let c = 0; c < callsLimit; c += 1) {
      const base = c * batchSize;
      const chunk = toProcessThisRun.slice(base, base + batchSize);
      if (chunk.length === 0) {
        break;
      }
      const arg: string | string[] =
        chunk.length === 1 ? chunk[0]! : chunk;
      const res = await zca.getGroupInfo(arg);
      const grid = this.readGrid(res);
      for (const gridId of chunk) {
        const entry = grid?.[gridId];
        if (entry) {
          await this.setCache(zaloUid, gridId, entry, ttl);
          await this.upsertGroupAndLink(zaloAccountId, gridId, entry);
        }
      }
      prev = await this.persistCredsAndReturnNext(sessionId, ap, prev);
    }
    await this.loginSessions.touchBySessionId(sessionId);

    if (nextRound.length > 0) {
      await this.queue.add(
        'sync',
        {
          zaloAccountId,
          appUserId,
          sessionId,
          workGridIds: nextRound,
        } satisfies ChildGroupScanJobPayload,
        {
          delay,
          jobId: `child-scan-${zaloAccountId}-c-${Date.now()}`,
          removeOnComplete: 50,
          removeOnFail: 20,
        },
      );
      this.logger.log(
        `Child scan: continuation in ${delay}ms (${nextRound.length} grid ids left)`,
      );
      return true;
    }
    return false;
  }

  /**
   * Build list of grid ids to resolve (excludes child already has ZaloAccountGroup for that group_zalo_id).
   */
  private async buildWorkListFromGetAllGroups(
    sessionId: string,
    zaloAccountId: string,
    zaloUid: string,
  ): Promise<string[]> {
    const { gridVerMap } = await this.withZaloSessionShort(sessionId, async (zca) => {
      const g = await zca.getAllGroups();
      return { gridVerMap: g?.gridVerMap ?? {} };
    });
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
      await this.persistCreds(
        sessionId,
        ap,
        full.credentials as ZaloSessionCredentialsPayload,
      );
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

  private cacheKey(zaloUid: string, gridId: string): string {
    return `zca:gi:${zaloUid}:${gridId}`;
  }

  private async getCache(
    zaloUid: string,
    gridId: string,
  ): Promise<GridInfoEntry | null> {
    if (!this.redis) {
      return null;
    }
    const raw = await this.redis.get(this.cacheKey(zaloUid, gridId));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as GridInfoEntry;
    } catch {
      return null;
    }
  }

  private async setCache(
    zaloUid: string,
    gridId: string,
    entry: GridInfoEntry,
    ttlSec: number,
  ): Promise<void> {
    if (!this.redis) {
      return;
    }
    await this.redis.set(
      this.cacheKey(zaloUid, gridId),
      JSON.stringify(entry),
      'EX',
      ttlSec,
    );
  }

  private async applyCacheAndShrink(
    zaloUid: string,
    zaloAccountId: string,
    workList: string[],
    ttl: number,
  ): Promise<string[]> {
    const next: string[] = [];
    for (const gridId of workList) {
      const cached = await this.getCache(zaloUid, gridId);
      if (cached?.globalId) {
        await this.upsertGroupAndLink(zaloAccountId, gridId, cached);
        continue;
      }
      next.push(gridId);
    }
    return next;
  }

  private async upsertGroupAndLink(
    zaloAccountId: string,
    groupZaloId: string,
    entry: GridInfoEntry,
  ): Promise<void> {
    const nameFromZ =
      typeof entry.name === 'string' && entry.name.trim()
        ? entry.name.trim()
        : 'Group';
    const globalFromZ =
      typeof entry.globalId === 'string' && entry.globalId.trim()
        ? entry.globalId.trim()
        : null;
    if (!globalFromZ) {
      this.logger.warn(
        `Child scan: no globalId for grid ${groupZaloId}, skip link.`,
      );
      return;
    }
    const group = await this.findOrCreateGroupByGlobalId(
      globalFromZ,
      nameFromZ,
    );
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

  private async findOrCreateGroupByGlobalId(
    globalId: string,
    groupName: string,
  ) {
    const found = await this.prisma.zaloGroup.findFirst({
      where: { globalId },
      select: { id: true },
    });
    if (found) {
      return found;
    }
    try {
      return await this.prisma.zaloGroup.create({
        data: {
          groupName,
          globalId,
          originName: groupName,
          isUpdateName: true,
        },
        select: { id: true },
      });
    } catch (e) {
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        (e as { code: string }).code === 'P2002'
      ) {
        const again = await this.prisma.zaloGroup.findFirst({
          where: { globalId },
          select: { id: true },
        });
        if (again) {
          return again;
        }
      }
      throw e;
    }
  }
}
