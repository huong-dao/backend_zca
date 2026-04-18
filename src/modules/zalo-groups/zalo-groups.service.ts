import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateMultipleZaloGroupsDto } from './dto/create-multiple-zalo-groups.dto';
import type { CreateMultipleZaloGroupsResult } from './dto/create-multiple-zalo-groups-result.dto';
import { FindZaloGroupsDto } from './dto/find-zalo-groups.dto';
import { UpsertZaloGroupDto } from './dto/upsert-zalo-group.dto';

const zaloGroupSelect = {
  id: true,
  groupName: true,
  groupZaloId: true,
  createdAt: true,
  updatedAt: true,
} as const;

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

  async create(dto: UpsertZaloGroupDto) {
    return this.createOrUpdate(dto);
  }

  async createMultiple(
    dto: CreateMultipleZaloGroupsDto,
  ): Promise<CreateMultipleZaloGroupsResult> {
    const normalizedGroups = dto.groups.map((group) => ({
      groupName: group.group_name.trim(),
      groupZaloId: group.group_zalo_id.trim(),
    }));

    const uniqueGroups = new Map<string, { groupName: string; groupZaloId: string }>();
    const duplicateInputGroupZaloIds = new Set<string>();

    for (const group of normalizedGroups) {
      if (uniqueGroups.has(group.groupZaloId)) {
        duplicateInputGroupZaloIds.add(group.groupZaloId);
        continue;
      }

      uniqueGroups.set(group.groupZaloId, group);
    }

    const requestedGroupZaloIds = [...uniqueGroups.keys()];
    const existingGroups = await this.prismaService.zaloGroup.findMany({
      where: {
        groupZaloId: {
          in: requestedGroupZaloIds,
        },
      },
      select: {
        groupZaloId: true,
      },
    });
    const existingGroupZaloIds = new Set(
      existingGroups.map((group) => group.groupZaloId),
    );

    const groupsToCreate = requestedGroupZaloIds
      .filter((groupZaloId) => !existingGroupZaloIds.has(groupZaloId))
      .map((groupZaloId) => uniqueGroups.get(groupZaloId)!);

    const created = await this.prismaService.$transaction(
      groupsToCreate.map((group) =>
        this.prismaService.zaloGroup.create({
          data: {
            groupName: group.groupName,
            groupZaloId: group.groupZaloId,
          },
          select: zaloGroupSelect,
        }),
      ),
    );

    return {
      created,
      skipped: {
        existingGroupZaloIds: [...existingGroupZaloIds],
        duplicateInputGroupZaloIds: [...duplicateInputGroupZaloIds],
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

  private async createOrUpdate(dto: UpsertZaloGroupDto, id?: string) {
    const duplicatedGroup = await this.prismaService.zaloGroup.findFirst({
      where: {
        groupZaloId: dto.group_zalo_id,
        ...(id
          ? {
              id: {
                not: id,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });

    if (duplicatedGroup) {
      throw new ConflictException(
        id
          ? 'Another Zalo group already uses this group.'
          : 'Zalo group already exists.',
      );
    }

    if (id) {
      return this.prismaService.zaloGroup.update({
        where: { id },
        data: {
          groupName: dto.group_name,
          groupZaloId: dto.group_zalo_id,
        },
        select: zaloGroupSelect,
      });
    }

    return this.prismaService.zaloGroup.create({
      data: {
        groupName: dto.group_name,
        groupZaloId: dto.group_zalo_id,
      },
      select: zaloGroupSelect,
    });
  }
}
