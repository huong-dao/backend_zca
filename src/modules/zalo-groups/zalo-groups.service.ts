import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ZaloService } from '../zalo/zalo.service';
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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly zaloService: ZaloService,
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
    const { groupId, groupInfo } = await this.zaloService.findGroupByName(
      dto.group_name,
    );

    const existingGroup = await this.prismaService.zaloGroup.findUnique({
      where: {
        groupZaloId: groupId,
      },
      select: {
        id: true,
      },
    });

    if (existingGroup) {
      throw new ConflictException('Zalo group already exists.');
    }

    return this.prismaService.zaloGroup.create({
      data: {
        groupName: groupInfo.name,
        groupZaloId: groupId,
      },
      select: zaloGroupSelect,
    });
  }

  async update(id: string, dto: UpsertZaloGroupDto) {
    await this.ensureGroupExists(id);

    const { groupId, groupInfo } = await this.zaloService.findGroupByName(
      dto.group_name,
    );

    const duplicatedGroup = await this.prismaService.zaloGroup.findFirst({
      where: {
        groupZaloId: groupId,
        id: {
          not: id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicatedGroup) {
      throw new ConflictException(
        'Another Zalo group already uses this group.',
      );
    }

    return this.prismaService.zaloGroup.update({
      where: { id },
      data: {
        groupName: groupInfo.name,
        groupZaloId: groupId,
      },
      select: zaloGroupSelect,
    });
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
}
