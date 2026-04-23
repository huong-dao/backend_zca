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
import { randomUUID } from 'node:crypto';
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

/** Avoid hung workers leaving child `INACTIVE` forever if Zalo never responds. */
const ZALO_CHILD_SCAN_API_TIMEOUT_MS = 120_000;

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

  private async withZaloCallTimeout<T>(
    promise: Promise<T>,
    label: string,
  ): Promise<T> {
    const ms = ZALO_CHILD_SCAN_API_TIMEOUT_MS;
    return new Promise<T>((resolve, reject) => {
      const t = setTimeout(
        () =>
          reject(
            new Error(
              `Zalo child scan API timeout after ${ms}ms (${label}).`,
            ),
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
        // Unique id: a job stuck in "active" on Zalo would block re-enqueue with a fixed id in Bull.
        jobId: `child-scan-${zaloAccountId}-${randomUUID()}`,
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
        jobId: `child-scan-${childZaloAccountId}-${randomUUID()}`,
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
      this.logger.error(
        `child-group-scan: invalid job payload (jobId=${String(job.id)})`,
      );
      if (p?.zaloAccountId) {
        await this.prisma.zaloAccount.updateMany({
          where: { id: p.zaloAccountId, status: 'INACTIVE' },
          data: { status: 'ACTIVE' },
        });
        this.logger.warn(
          `child-group-scan: reverted INACTIVE for zaloAccountId=${p.zaloAccountId} (invalid payload)`,
        );
      }
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
    const masterIds = await this.getMasterIdsForChild(zaloAccountId);
    if (masterIds.length === 0) {
      this.logger.warn(
        `Child scan: no master in zalo_account_relations for child zaloAccountId=${zaloAccountId}; cannot link groups — skip.`,
      );
      return false;
    }

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
      masterIds,
      workList,
      ttl,
    );
    if (workList.length === 0) {
      this.logger.log(
        `Child scan: nothing to do (empty work list) zaloAccountId=${zaloAccountId}`,
      );
      return false;
    }

    this.logger.log(
      `Child scan: start zaloAccountId=${zaloAccountId} masters=${masterIds.length} workItems=${workList.length}`,
    );

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
      const res = await this.withZaloCallTimeout(
        zca.getGroupInfo(arg),
        `getGroupInfo(${String(Array.isArray(arg) ? arg.length : 1)} ids)`,
      );
      const grid = this.readGrid(res);
      for (const gridId of chunk) {
        const entry = grid?.[gridId];
        if (entry) {
          await this.setCache(zaloUid, gridId, entry, ttl);
          await this.tryLinkChildToMasterGroup(
            zaloAccountId,
            masterIds,
            gridId,
            entry,
          );
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
          jobId: `child-scan-${zaloAccountId}-c-${randomUUID()}`,
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

  private async getMasterIdsForChild(childId: string): Promise<string[]> {
    const rows = await this.prisma.zaloAccountRelation.findMany({
      where: { childId },
      select: { masterId: true },
    });
    return rows.map((r) => r.masterId);
  }

  /**
   * Build list of grid ids to resolve (excludes child already has ZaloAccountGroup for that group_zalo_id).
   */
  private async buildWorkListFromGetAllGroups(
    sessionId: string,
    zaloAccountId: string,
    zaloUid: string,
  ): Promise<string[]> {
    const { gridVerMap } = await this.withZaloCallTimeout(
      this.withZaloSessionShort(sessionId, async (zca) => {
        const g = await zca.getAllGroups();
        return { gridVerMap: g?.gridVerMap ?? {} };
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
    masterIds: string[],
    workList: string[],
    ttl: number,
  ): Promise<string[]> {
    const next: string[] = [];
    for (const gridId of workList) {
      const cached = await this.getCache(zaloUid, gridId);
      if (cached?.globalId) {
        await this.tryLinkChildToMasterGroup(
          zaloAccountId,
          masterIds,
          gridId,
          cached,
        );
        continue;
      }
      next.push(gridId);
    }
    return next;
  }

  /**
   * Link child → ZaloGroup only when:
   * 1) getGroupInfo provides globalId;
   * 2) a `ZaloGroup` row with that globalId **already exists** (created via master / app, not here);
   * 3) at least one of the child's masters already has a `ZaloAccountGroup` row for that `group_id`.
   * Then add child's `ZaloAccountGroup` with `group_zalo_id` = this device's grid id.
   */
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
      this.logger.warn(
        `Child scan: no globalId for grid ${groupZaloId}, skip link.`,
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
          `Child scan: backfilled globalId on ZaloGroup id=${only.id} from child grid ${groupZaloId}.`,
        );
        group = { id: only.id };
      } else {
        this.logger.warn(
          unSynced.length === 0
            ? `Child scan: no ZaloGroup with globalId=${globalFromZ} and no master-mapped group row to backfill. Skip grid group_zalo_id=${groupZaloId}.`
            : `Child scan: ${unSynced.length} master groups still missing globalId in DB; cannot guess which to match. Run master group metadata sync (GROUP_SYNC) or keep a single unsynced group. globalId from Zalo=${globalFromZ} grid ${groupZaloId}.`,
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
      this.logger.debug(
        `Child scan: ZaloGroup id=${group.id} (globalId=${globalFromZ}) is not among this child's masters' groups; skip grid ${groupZaloId}.`,
      );
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
