import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isDeepStrictEqual } from 'node:util';
import type { API } from 'zca-js';
import { ZaloApiError } from 'zca-js';
import type { Prisma } from '../../../generated/prisma';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
  ZcaApiHelper,
} from '../../zalo';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import { PrismaService } from '../../database/prisma/prisma.service';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { ChildGroupSyncService } from '../background-jobs/child-group-sync.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import {
  CREATE_MULTIPLE_ZALO_GROUPS_MODE_UPDATE_ORIGIN_NAME,
  CreateMultipleZaloGroupsDto,
} from './dto/create-multiple-zalo-groups.dto';
import type {
  CreateMultipleZaloGroupsResult,
  ZaloGroupRecord,
} from './dto/create-multiple-zalo-groups-result.dto';
import {
  FindZaloGroupsByAccountQuery,
  FindZaloGroupsDto,
} from './dto/find-zalo-groups.dto';
import { InviteMemberToZaloGroupDto } from './dto/invite-member-to-zalo-group.dto';
import { RemoveMemberFromZaloGroupDto } from './dto/remove-member-from-zalo-group.dto';
import { UpsertZaloGroupDto } from './dto/upsert-zalo-group.dto';

const zaloGroupSelect = {
  id: true,
  groupName: true,
  originName: true,
  isUpdateName: true,
  createdAt: true,
  updatedAt: true,
} as const;

const pendingNameUpdateSelect = {
  ...zaloGroupSelect,
  accountMaps: {
    select: {
      groupZaloId: true,
    },
    take: 1,
  },
  _count: {
    select: {
      accountMaps: true,
      messages: true,
    },
  },
} as const;

type PendingNameUpdateGroup = Prisma.ZaloGroupGetPayload<{
  select: typeof pendingNameUpdateSelect;
}>;

const zaloAccountGroupSelect = {
  groupZaloId: true,
  group: {
    select: {
      ...zaloGroupSelect,
      _count: {
        select: {
          accountMaps: true,
          messages: true,
        },
      },
    },
  },
} as const;

type ZaloAccountGroupRecord = Prisma.ZaloAccountGroupGetPayload<{
  select: typeof zaloAccountGroupSelect;
}>;

type ZaloGroupByAccountItem = {
  id: string;
  groupName: string;
  originName: string | null;
  groupZaloId: string;
  isUpdateName: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    accountMaps: number;
    messages: number;
  };
};

type PaginatedZaloGroupByAccountResult = {
  data: ZaloGroupByAccountItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

@Injectable()
export class ZaloGroupsService {
  private readonly logger = new Logger(ZaloGroupsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly loginSessions: ZaloLoginSessionsService,
    private readonly childGroupSync: ChildGroupSyncService,
  ) {}

  async findAll(query: FindZaloGroupsDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const globalExact = query.global_id?.trim();
    const whereZaloGroup: Prisma.ZaloGroupWhereInput | undefined =
      globalExact && globalExact.length > 0
        ? { globalId: globalExact }
        : undefined;

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.zaloGroup.count({ where: whereZaloGroup }),
      this.prismaService.zaloGroup.findMany({
        where: whereZaloGroup,
        skip,
        take: limit,
        select: {
          ...zaloGroupSelect,
          accountMaps: {
            take: 1,
            select: {
              groupZaloId: true,
            },
          },
          _count: {
            select: {
              accountMaps: true,
              messages: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const formattedData = data.map((group) => {
      const groupZaloId = group.accountMaps?.[0]?.groupZaloId || null;
      const { accountMaps: _accountMaps, ...rest } = group;
      void _accountMaps;
      return {
        ...rest,
        groupZaloId,
      };
    });

    return {
      data: formattedData,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async findAllPendingNameUpdate() {
    const groups: PendingNameUpdateGroup[] =
      await this.prismaService.zaloGroup.findMany({
        where: {
          OR: [{ isUpdateName: false }, { globalId: null }, { globalId: '' }],
        },
        select: pendingNameUpdateSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });

    return groups.map(({ accountMaps, ...group }) => ({
      ...group,
      groupZaloId: accountMaps[0]?.groupZaloId ?? null,
    }));
  }

  async findAllByZaloAccountId(
    zaloAccountId: string,
    query: FindZaloGroupsByAccountQuery,
  ): Promise<PaginatedZaloGroupByAccountResult> {
    const { page = 1, limit = 20 } = query;
    if (page < 1 || limit < 1) {
      throw new BadRequestException('page and limit must be at least 1.');
    }
    const skip = (page - 1) * limit;

    await this.ensureZaloAccountExists(zaloAccountId);

    const nameNeedle = query.group_name?.trim();
    const globalExact = query.global_id?.trim();

    const groupWhere: Prisma.ZaloGroupWhereInput = {
      ...(nameNeedle
        ? {
            groupName: {
              contains: nameNeedle,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(globalExact
        ? {
            globalId: globalExact,
          }
        : {}),
    };

    const where: Prisma.ZaloAccountGroupWhereInput = {
      zaloAccountId,
      ...(Object.keys(groupWhere).length > 0 ? { group: groupWhere } : {}),
    };

    const [total, data]: [number, ZaloAccountGroupRecord[]] =
      await this.prismaService.$transaction([
        this.prismaService.zaloAccountGroup.count({ where }),
        this.prismaService.zaloAccountGroup.findMany({
          where,
          skip,
          take: limit,
          select: zaloAccountGroupSelect,
          orderBy: {
            joinedAt: 'desc',
          },
        }),
      ]);

    return {
      data: data.map(({ groupZaloId, group }) => ({
        ...group,
        groupZaloId,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async create(dto: UpsertZaloGroupDto) {
    return this.createOrUpdate(dto);
  }

  /**
   * Invite a child Zalo user into a group using the **master** login session.
   * Resolves the group by **`globalId`** (preferred), or internal `groupId`, or `groupName` + master mapping.
   * Resolves the invitee uid via `findUser(phone)`, then `addUserToGroup` — **no DB rows are created/updated** here;
   * mapping for your app can rely on `ZaloGroup.global_id` + child accounts separately.
   */
  async inviteMemberToGroup(
    dto: InviteMemberToZaloGroupDto,
    appUserId: string,
  ) {
    const master = await this.prismaService.zaloAccount.findFirst({
      where: { id: dto.masterZaloAccountId, isDeleted: false },
      select: { id: true, isMaster: true },
    });

    if (!master) {
      throw new NotFoundException('Master Zalo account not found.');
    }

    if (!master.isMaster) {
      throw new BadRequestException(
        'masterZaloAccountId must reference a master account (isMaster = true).',
      );
    }

    const mapping = await this.resolveGroupMappingForInviteOrRemove(
      master.id,
      dto.globalId,
      dto.groupId,
      dto.groupName,
    );

    let phone = dto.phoneNumber?.trim() ?? '';

    if (dto.childZaloAccountId) {
      const relation = await this.prismaService.zaloAccountRelation.findFirst({
        where: {
          masterId: dto.masterZaloAccountId,
          childId: dto.childZaloAccountId,
        },
        select: { id: true },
      });

      if (!relation) {
        throw new BadRequestException(
          'childZaloAccountId is not registered as a child of this master.',
        );
      }

      const child = await this.prismaService.zaloAccount.findFirst({
        where: { id: dto.childZaloAccountId, isDeleted: false },
        select: { phone: true, isMaster: true },
      });

      if (!child) {
        throw new NotFoundException('Child Zalo account not found.');
      }

      if (child.isMaster) {
        throw new BadRequestException(
          'childZaloAccountId must not be a master account.',
        );
      }

      if (!phone && child.phone?.trim()) {
        phone = child.phone.trim();
      }
    }

    if (!phone) {
      throw new BadRequestException(
        'Provide phoneNumber or childZaloAccountId with a stored phone on the child account.',
      );
    }

    const { profile, zaloResult } = await this.withZaloSession(
      dto.sessionId,
      async (zca) => {
        const p = await zca.findUser(phone);
        const r = await zca.addUserToGroup(p.uid, mapping.groupZaloId);
        return { profile: p, zaloResult: r };
      },
    );

    if (!this.isZaloAddUserToGroupSuccess(zaloResult)) {
      const errMembers = this.extractZaloAddUserErrorMembers(zaloResult);
      throw new BadRequestException(
        errMembers.length > 0
          ? `Zalo addUserToGroup failed for: ${errMembers.join(', ')}`
          : 'Zalo addUserToGroup did not complete successfully.',
      );
    }

    const inviteUid = profile.uid;

    if (dto.childZaloAccountId) {
      try {
        await this.childGroupSync.enqueueAfterInvite(
          appUserId,
          dto.childZaloAccountId,
        );
      } catch (e) {
        this.logger.warn(
          `Post-invite child scan enqueue failed: ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    }

    return {
      success: true as const,
      masterGroupZaloId: mapping.groupZaloId,
      inviteUid,
      findUser: {
        display_name: profile.display_name ?? profile.zalo_name,
        globalId: profile.globalId,
      },
      zalo: zaloResult,
    };
  }

  /**
   * Remove a user from a group using the **master** session (`removeUserFromGroup`), same resolution as
   * {@link inviteMemberToGroup} for group + member (`findUser` by phone / child).
   * Optionally unlinks the child in `zalo_account_groups` when `childZaloAccountId` is set.
   */
  async removeMemberFromGroup(dto: RemoveMemberFromZaloGroupDto) {
    const master = await this.prismaService.zaloAccount.findFirst({
      where: { id: dto.masterZaloAccountId, isDeleted: false },
      select: { id: true, isMaster: true },
    });

    if (!master) {
      throw new NotFoundException('Master Zalo account not found.');
    }

    if (!master.isMaster) {
      throw new BadRequestException(
        'masterZaloAccountId must reference a master account (isMaster = true).',
      );
    }

    const mapping = await this.resolveGroupMappingForInviteOrRemove(
      master.id,
      dto.globalId,
      dto.groupId,
      dto.groupName,
    );

    const zaloGroupId = mapping.groupId;

    let phone = dto.phoneNumber?.trim() ?? '';

    if (dto.childZaloAccountId) {
      const relation = await this.prismaService.zaloAccountRelation.findFirst({
        where: {
          masterId: dto.masterZaloAccountId,
          childId: dto.childZaloAccountId,
        },
        select: { id: true },
      });

      if (!relation) {
        throw new BadRequestException(
          'childZaloAccountId is not registered as a child of this master.',
        );
      }

      const child = await this.prismaService.zaloAccount.findFirst({
        where: { id: dto.childZaloAccountId, isDeleted: false },
        select: { phone: true, isMaster: true },
      });

      if (!child) {
        throw new NotFoundException('Child Zalo account not found.');
      }

      if (child.isMaster) {
        throw new BadRequestException(
          'childZaloAccountId must not be a master account.',
        );
      }

      if (!phone && child.phone?.trim()) {
        phone = child.phone.trim();
      }
    }

    if (!phone) {
      throw new BadRequestException(
        'Provide phoneNumber or childZaloAccountId with a stored phone on the child account.',
      );
    }

    const { profile, zaloResult } = await this.withZaloSession(
      dto.sessionId,
      async (zca) => {
        const p = await zca.findUser(phone);
        const r = await zca.removeUserFromGroup(p.uid, mapping.groupZaloId);
        return { profile: p, zaloResult: r };
      },
    );

    if (!this.isZaloRemoveUserFromGroupSuccess(zaloResult)) {
      const errMembers = this.extractZaloAddUserErrorMembers(zaloResult);
      throw new BadRequestException(
        errMembers.length > 0
          ? `Zalo removeUserFromGroup failed for: ${errMembers.join(', ')}`
          : 'Zalo removeUserFromGroup did not complete successfully.',
      );
    }

    const dbSync = await this.unlinkChildFromGroupInDbAfterRemove({
      zaloGroupId,
      childZaloAccountId: dto.childZaloAccountId,
    });

    return {
      success: true as const,
      masterGroupZaloId: mapping.groupZaloId,
      removedMemberUid: profile.uid,
      findUser: {
        display_name: profile.display_name ?? profile.zalo_name,
        globalId: profile.globalId,
      },
      zalo: zaloResult,
      dbSync,
    };
  }

  async createMultiple(
    zaloAccountId: string,
    dto: CreateMultipleZaloGroupsDto,
  ): Promise<CreateMultipleZaloGroupsResult> {
    const zaloAccount = await this.prismaService.zaloAccount.findFirst({
      where: { id: zaloAccountId, isDeleted: false },
      select: { id: true },
    });

    if (!zaloAccount) {
      throw new NotFoundException('Zalo account not found.');
    }

    const normalizedGroups = dto.groups.map((group) => {
      const groupName = group.group_name.trim();
      return {
        groupName,
        groupZaloId: group.group_zalo_id.trim(),
        globalId: group.global_id?.trim() || undefined,
        /** Set once on create from `group_name`; never updated later. */
        originName: groupName,
      };
    });

    const uniqueGroups = new Map<
      string,
      {
        groupName: string;
        groupZaloId: string;
        globalId?: string;
        originName: string;
      }
    >();
    const duplicateInputGroupZaloIds = new Set<string>();

    for (const group of normalizedGroups) {
      if (uniqueGroups.has(group.groupZaloId)) {
        duplicateInputGroupZaloIds.add(group.groupZaloId);
        continue;
      }

      uniqueGroups.set(group.groupZaloId, group);
    }

    const requestedGroupZaloIds = [...uniqueGroups.keys()];
    const existingMappings = await this.prismaService.zaloAccountGroup.findMany(
      {
        where: {
          zaloAccountId,
          groupZaloId: {
            in: requestedGroupZaloIds,
          },
        },
        select: {
          groupZaloId: true,
          groupId: true,
        },
      },
    );

    const existingGroupZaloIds = new Set<string>(
      existingMappings.map((m) => m.groupZaloId),
    );

    const firstMappingByGroupZaloId = new Map<string, { groupId: string }>();
    for (const m of existingMappings) {
      if (!firstMappingByGroupZaloId.has(m.groupZaloId)) {
        firstMappingByGroupZaloId.set(m.groupZaloId, { groupId: m.groupId });
      }
    }

    const isUpdateOriginNameMode =
      dto.mode === CREATE_MULTIPLE_ZALO_GROUPS_MODE_UPDATE_ORIGIN_NAME;

    const groupsToCreate = requestedGroupZaloIds
      .filter((groupZaloId) => !existingGroupZaloIds.has(groupZaloId))
      .map((groupZaloId) => uniqueGroups.get(groupZaloId)!);

    const { created, updatedOriginName } =
      await this.prismaService.$transaction(async (tx) => {
        const updatedOriginNameRows: ZaloGroupRecord[] = [];

        if (isUpdateOriginNameMode) {
          for (const [groupZaloId, { groupId }] of firstMappingByGroupZaloId) {
            const group = uniqueGroups.get(groupZaloId);
            if (!group) {
              continue;
            }
            const row = await tx.zaloGroup.update({
              where: { id: groupId },
              data: { originName: group.originName },
              select: zaloGroupSelect,
            });
            updatedOriginNameRows.push(row);
          }
        }

        const createdGroups: ZaloGroupRecord[] = [];

        for (const group of groupsToCreate) {
          const createdGroup = await tx.zaloGroup.create({
            data: {
              groupName: group.groupName,
              originName: group.originName,
              ...(group.globalId ? { globalId: group.globalId } : {}),
            },
            select: zaloGroupSelect,
          });

          await tx.zaloAccountGroup.create({
            data: {
              groupZaloId: group.groupZaloId,
              zaloAccountId,
              groupId: createdGroup.id,
            },
          });

          createdGroups.push(createdGroup);
        }

        const groupCount = await tx.zaloAccountGroup.count({
          where: { zaloAccountId },
        });

        await tx.zaloAccount.update({
          where: { id: zaloAccountId },
          data: { groupCount },
        });

        return {
          created: createdGroups,
          updatedOriginName: updatedOriginNameRows,
        };
      });

    const skippedExistingIds = isUpdateOriginNameMode
      ? []
      : [...existingGroupZaloIds];
    const skippedExistingCount = isUpdateOriginNameMode
      ? 0
      : existingGroupZaloIds.size;

    return {
      created,
      updatedOriginName,
      skipped: {
        existingGroupZaloIds: skippedExistingIds,
        duplicateInputGroupZaloIds: Array.from(duplicateInputGroupZaloIds),
      },
      summary: {
        requested: dto.groups.length,
        uniqueRequested: requestedGroupZaloIds.length,
        created: created.length,
        updatedOriginName: updatedOriginName.length,
        skippedExisting: skippedExistingCount,
        skippedDuplicateInput: duplicateInputGroupZaloIds.size,
      },
    };
  }

  async update(id: string, dto: UpsertZaloGroupDto) {
    await this.ensureGroupExists(id);

    return this.createOrUpdate(dto, id);
  }

  async remove(id: string) {
    await this.ensureGroupExists(id);

    await this.prismaService.zaloGroup.delete({
      where: { id },
    });

    return {
      message: 'Zalo group deleted successfully.',
    };
  }

  private async ensureGroupExists(id: string) {
    const group = await this.prismaService.zaloGroup.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundException('Zalo group not found.');
    }
  }

  private async ensureZaloAccountExists(id: string) {
    const zaloAccount = await this.prismaService.zaloAccount.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });

    if (!zaloAccount) {
      throw new NotFoundException('Zalo account not found.');
    }
  }

  private async resolveGroupMappingForMaster(
    masterZaloAccountId: string,
    groupId: string | undefined,
    groupName: string | undefined,
  ): Promise<{ groupId: string; groupZaloId: string }> {
    const groupIdFromBody = groupId?.trim();
    if (groupIdFromBody) {
      await this.ensureGroupExists(groupIdFromBody);
      const byId = await this.prismaService.zaloAccountGroup.findFirst({
        where: {
          zaloAccountId: masterZaloAccountId,
          groupId: groupIdFromBody,
        },
        select: { groupId: true, groupZaloId: true },
        orderBy: { joinedAt: 'asc' },
      });

      if (!byId) {
        throw new NotFoundException(
          'This Zalo group is not linked to the given master account (no ZaloAccountGroup mapping).',
        );
      }
      return { groupId: byId.groupId, groupZaloId: byId.groupZaloId };
    }

    const name = groupName?.trim() ?? '';
    if (!name) {
      throw new BadRequestException('Provide groupId or groupName.');
    }

    const byName = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        zaloAccountId: masterZaloAccountId,
        group: { groupName: name },
      },
      select: { groupId: true, groupZaloId: true },
      orderBy: { joinedAt: 'asc' },
    });

    if (!byName) {
      throw new NotFoundException(
        'No Zalo group with this name is linked to the given master account.',
      );
    }
    return { groupId: byName.groupId, groupZaloId: byName.groupZaloId };
  }

  /**
   * Prefer `globalId` (Zalo’s canonical group id) → `zalo_groups.global_id` + master’s `ZaloAccountGroup`
   * row to obtain `group_zalo_id` for zca-js. Otherwise `groupId` / `groupName` as in
   * {@link resolveGroupMappingForMaster}.
   */
  private async resolveGroupMappingForInviteOrRemove(
    masterZaloAccountId: string,
    globalId: string | undefined,
    groupId: string | undefined,
    groupName: string | undefined,
  ): Promise<{ groupId: string; groupZaloId: string }> {
    const gid = globalId?.trim();
    if (gid) {
      return this.resolveGroupMappingForMasterByGlobalId(
        masterZaloAccountId,
        gid,
      );
    }
    return this.resolveGroupMappingForMaster(
      masterZaloAccountId,
      groupId,
      groupName,
    );
  }

  private async resolveGroupMappingForMasterByGlobalId(
    masterZaloAccountId: string,
    globalId: string,
  ): Promise<{ groupId: string; groupZaloId: string }> {
    const group = await this.prismaService.zaloGroup.findFirst({
      where: { globalId },
      select: { id: true },
    });
    if (!group) {
      throw new NotFoundException(
        'No Zalo group with this global_id. Sync or set global_id on the group first.',
      );
    }
    const map = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        zaloAccountId: masterZaloAccountId,
        groupId: group.id,
      },
      select: { groupId: true, groupZaloId: true },
      orderBy: { joinedAt: 'asc' },
    });
    if (!map) {
      throw new NotFoundException(
        'This Zalo group is not linked to the given master account (no ZaloAccountGroup mapping).',
      );
    }
    return { groupId: map.groupId, groupZaloId: map.groupZaloId };
  }

  private async withZaloSession<T>(
    sessionId: string,
    run: (zca: ZcaApiHelper, api: API) => Promise<T>,
  ): Promise<T> {
    const full = await this.loginSessions.findOneFullBySessionId(sessionId);
    const prevCreds: ZaloSessionCredentialsPayload = full.credentials;

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

  private isZaloAddUserToGroupSuccess(result: unknown): boolean {
    if (result == null || typeof result !== 'object') {
      return false;
    }
    const r = result as Record<string, unknown>;
    const em = r.errorMembers;
    if (Array.isArray(em) && em.length > 0) {
      return false;
    }
    const ed = r.error_data;
    if (ed != null && typeof ed === 'object') {
      for (const v of Object.values(ed as Record<string, unknown>)) {
        if (Array.isArray(v) && v.length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  private isZaloRemoveUserFromGroupSuccess(result: unknown): boolean {
    if (result == null || typeof result !== 'object') {
      return false;
    }
    const em = (result as Record<string, unknown>).errorMembers;
    if (!Array.isArray(em)) {
      return true;
    }
    return em.length === 0;
  }

  private extractZaloAddUserErrorMembers(result: unknown): string[] {
    if (result == null || typeof result !== 'object') {
      return [];
    }
    const r = result as Record<string, unknown>;
    const em = r.errorMembers;
    if (!Array.isArray(em)) {
      return [];
    }
    return em.filter((x): x is string => typeof x === 'string');
  }

  private async unlinkChildFromGroupInDbAfterRemove(opts: {
    zaloGroupId: string;
    childZaloAccountId?: string;
  }): Promise<{
    persisted: boolean;
    reason?: string;
    childZaloAccountId?: string;
    groupId?: string;
  }> {
    const childId = opts.childZaloAccountId;

    if (!childId) {
      return {
        persisted: false,
        reason:
          'No childZaloAccountId: skipped DB unlink (pass childZaloAccountId to update zalo_account_groups).',
      };
    }

    const row = await this.prismaService.zaloAccountGroup.findFirst({
      where: { zaloAccountId: childId, groupId: opts.zaloGroupId },
    });

    if (!row) {
      return {
        persisted: false,
        reason:
          'No ZaloAccountGroup row for this child and group; nothing removed in DB.',
        childZaloAccountId: childId,
        groupId: opts.zaloGroupId,
      };
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.zaloAccountGroup.delete({ where: { id: row.id } });
      const groupCount = await tx.zaloAccountGroup.count({
        where: { zaloAccountId: childId },
      });
      await tx.zaloAccount.update({
        where: { id: childId },
        data: { groupCount },
      });
    });

    return {
      persisted: true,
      childZaloAccountId: childId,
      groupId: opts.zaloGroupId,
    };
  }

  private optionalGlobalIdFromDto(dto: UpsertZaloGroupDto): {
    globalId?: string | null;
  } {
    const out: { globalId?: string | null } = {};
    if (dto.global_id !== undefined) {
      const t = dto.global_id?.trim();
      out.globalId = t && t.length > 0 ? t : null;
    }
    return out;
  }

  private async createOrUpdate(dto: UpsertZaloGroupDto, id?: string) {
    const globalMeta = this.optionalGlobalIdFromDto(dto);

    if (id) {
      return this.prismaService.zaloGroup.update({
        where: { id },
        data: {
          groupName: dto.group_name,
          isUpdateName: true,
          ...globalMeta,
        },
        select: zaloGroupSelect,
      });
    }

    const trimmedName = dto.group_name.trim();
    return this.prismaService.zaloGroup.create({
      data: {
        groupName: trimmedName,
        originName: trimmedName,
        ...globalMeta,
      },
      select: zaloGroupSelect,
    });
  }
}
