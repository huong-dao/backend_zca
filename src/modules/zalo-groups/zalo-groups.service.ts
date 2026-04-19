import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateMultipleZaloGroupsDto } from './dto/create-multiple-zalo-groups.dto';
import type {
  CreateMultipleZaloGroupsResult,
  ZaloGroupRecord,
} from './dto/create-multiple-zalo-groups-result.dto';
import { FindZaloGroupsDto } from './dto/find-zalo-groups.dto';
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
  constructor(private readonly prismaService: PrismaService) {}

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

    return {
      data,
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
    query: FindZaloGroupsDto,
  ): Promise<PaginatedZaloGroupByAccountResult> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    await this.ensureZaloAccountExists(zaloAccountId);

    const [total, data]: [number, ZaloAccountGroupRecord[]] =
      await this.prismaService.$transaction([
        this.prismaService.zaloAccountGroup.count({
          where: { zaloAccountId },
        }),
        this.prismaService.zaloAccountGroup.findMany({
          where: { zaloAccountId },
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
