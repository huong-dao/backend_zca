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
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import { CreateMultipleZaloGroupsDto } from './dto/create-multiple-zalo-groups.dto';
import type {
  CreateMultipleZaloGroupsResult,
  ZaloGroupRecord,
} from './dto/create-multiple-zalo-groups-result.dto';
import {
  FindZaloGroupsByAccountQuery,
  FindZaloGroupsDto,
} from './dto/find-zalo-groups.dto';
import { InviteMemberToZaloGroupDto } from './dto/invite-member-to-zalo-group.dto';
import { UpsertZaloGroupDto } from './dto/upsert-zalo-group.dto';

const zaloGroupSelect = {
  id: true,
  groupName: true,
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
  ) {}

  async findAll(query: FindZaloGroupsDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.zaloGroup.count(),
      this.prismaService.zaloGroup.findMany({
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
          isUpdateName: false,
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
    const where: Prisma.ZaloAccountGroupWhereInput = {
      zaloAccountId,
      ...(nameNeedle
        ? {
            group: {
              groupName: {
                contains: nameNeedle,
                mode: 'insensitive',
              },
            },
          }
        : {}),
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
   * Resolves the group via optional internal `groupId`, else via `groupName` + that master’s mapping.
   * Resolves the invitee uid via `findUser(phone)` on that session (friend-graph id), then `addUserToGroup`.
   */
  async inviteMemberToGroup(dto: InviteMemberToZaloGroupDto) {
    const groupIdFromBody = dto.groupId?.trim();

    const master = await this.prismaService.zaloAccount.findUnique({
      where: { id: dto.masterZaloAccountId },
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

    let mapping: { groupId: string; groupZaloId: string };

    if (groupIdFromBody) {
      await this.ensureGroupExists(groupIdFromBody);

      const byId = await this.prismaService.zaloAccountGroup.findFirst({
        where: {
          zaloAccountId: master.id,
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

      mapping = byId;
    } else {
      const groupName = dto.groupName?.trim() ?? '';
      if (!groupName) {
        throw new BadRequestException('Provide groupId or groupName.');
      }

      const byName = await this.prismaService.zaloAccountGroup.findFirst({
        where: {
          zaloAccountId: master.id,
          group: { groupName },
        },
        select: { groupId: true, groupZaloId: true },
        orderBy: { joinedAt: 'asc' },
      });

      if (!byName) {
        throw new NotFoundException(
          'No Zalo group with this name is linked to the given master account.',
        );
      }

      mapping = byName;
    }

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

      const child = await this.prismaService.zaloAccount.findUnique({
        where: { id: dto.childZaloAccountId },
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

    const dbSync = await this.linkChildToGroupInDbAfterInvite({
      zaloGroupId,
      groupZaloId: mapping.groupZaloId,
      childZaloAccountId: dto.childZaloAccountId,
    });

    return {
      success: true as const,
      masterGroupZaloId: mapping.groupZaloId,
      inviteUid,
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
    const zaloAccount = await this.prismaService.zaloAccount.findUnique({
      where: { id: zaloAccountId },
      select: { id: true },
    });

    if (!zaloAccount) {
      throw new NotFoundException('Zalo account not found.');
    }

    const normalizedGroups = dto.groups.map((group) => ({
      groupName: group.group_name.trim(),
      groupZaloId: group.group_zalo_id.trim(),
    }));

    const uniqueGroups = new Map<
      string,
      { groupName: string; groupZaloId: string }
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
    const existingGroups: Array<{ groupZaloId: string }> =
      await this.prismaService.zaloAccountGroup.findMany({
        where: {
          zaloAccountId,
          groupZaloId: {
            in: requestedGroupZaloIds,
          },
        },
        select: {
          groupZaloId: true,
        },
      });

    const existingGroupZaloIds = new Set<string>(
      existingGroups.map((group) => group.groupZaloId),
    );

    const groupsToCreate = requestedGroupZaloIds
      .filter((groupZaloId) => !existingGroupZaloIds.has(groupZaloId))
      .map((groupZaloId) => uniqueGroups.get(groupZaloId)!);

    const created = await this.prismaService.$transaction(async (tx) => {
      const createdGroups: ZaloGroupRecord[] = [];

      for (const group of groupsToCreate) {
        const createdGroup = await tx.zaloGroup.create({
          data: {
            groupName: group.groupName,
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

      return createdGroups;
    });

    return {
      created,
      skipped: {
        existingGroupZaloIds: Array.from(existingGroupZaloIds),
        duplicateInputGroupZaloIds: Array.from(duplicateInputGroupZaloIds),
      },
      summary: {
        requested: dto.groups.length,
        uniqueRequested: requestedGroupZaloIds.length,
        created: created.length,
        skippedExisting: existingGroupZaloIds.size,
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
    const zaloAccount = await this.prismaService.zaloAccount.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!zaloAccount) {
      throw new NotFoundException('Zalo account not found.');
    }
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

  private async linkChildToGroupInDbAfterInvite(opts: {
    zaloGroupId: string;
    groupZaloId: string;
    childZaloAccountId?: string;
  }): Promise<{
    persisted: boolean;
    created: boolean;
    reason?: string;
    childZaloAccountId?: string;
    groupZaloId?: string;
    groupId?: string;
  }> {
    const { zaloGroupId, groupZaloId, childZaloAccountId: childId } = opts;

    if (!childId) {
      return {
        persisted: false,
        created: false,
        reason:
          'No childZaloAccountId: skipped DB link (pass childZaloAccountId to persist after invite).',
      };
    }

    const existingSameGroup =
      await this.prismaService.zaloAccountGroup.findFirst({
        where: { zaloAccountId: childId, groupId: zaloGroupId },
      });

    if (existingSameGroup) {
      await this.refreshZaloAccountGroupCount(childId);
      return {
        persisted: true,
        created: false,
        reason:
          'Child already linked to this ZaloGroup in DB; refreshed groupCount only.',
        childZaloAccountId: childId,
        groupZaloId: existingSameGroup.groupZaloId,
        groupId: zaloGroupId,
      };
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.zaloAccountGroup.create({
        data: {
          groupZaloId,
          zaloAccountId: childId,
          groupId: zaloGroupId,
        },
      });
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
      created: true,
      childZaloAccountId: childId,
      groupZaloId,
      groupId: zaloGroupId,
    };
  }

  private async refreshZaloAccountGroupCount(
    zaloAccountId: string,
  ): Promise<void> {
    const groupCount = await this.prismaService.zaloAccountGroup.count({
      where: { zaloAccountId },
    });
    await this.prismaService.zaloAccount.update({
      where: { id: zaloAccountId },
      data: { groupCount },
    });
  }

  private async createOrUpdate(dto: UpsertZaloGroupDto, id?: string) {
    if (id) {
      return this.prismaService.zaloGroup.update({
        where: { id },
        data: {
          groupName: dto.group_name,
          isUpdateName: true,
        },
        select: zaloGroupSelect,
      });
    }

    return this.prismaService.zaloGroup.create({
      data: {
        groupName: dto.group_name,
      },
      select: zaloGroupSelect,
    });
  }
}
