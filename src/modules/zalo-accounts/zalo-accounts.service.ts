import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AddChildAccountDto } from './dto/add-child-account.dto';
import { CreateZaloAccountDto } from './dto/create-zalo-account.dto';
import { UpdateGroupDataDto } from './dto/update-zalo-account-group-data';
import { SearchZaloAccountsDto } from './dto/search.dto';

const zaloAccountSelect = {
  id: true,
  zaloId: true,
  phone: true,
  name: true,
  isMaster: true,
  groupCount: true,
  groupData: true,
  createdAt: true,
  updatedAt: true,
} as const;

type ZaloAccountBaseRecord = {
  id: string;
  zaloId: string | null;
  phone: string | null;
  name: string | null;
  isMaster: boolean;
  groupCount: number;
  groupData: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type FindAllAccountRecord = ZaloAccountBaseRecord & {
  masters: Array<{
    id: string;
    createdAt: Date;
    master: {
      id: string;
      zaloId: string | null;
      name: string | null;
    };
  }>;
  children: Array<{
    id: string;
    createdAt: Date;
    child: {
      id: string;
      zaloId: string | null;
      name: string | null;
      groupCount: number;
    };
  }>;
};

type FindOneAccountRecord = ZaloAccountBaseRecord & {
  masters: Array<{
    id: string;
    createdAt: Date;
    master: {
      id: string;
      zaloId: string | null;
      name: string | null;
      phone: string | null;
      isMaster: boolean;
      groupCount: number;
      createdAt: Date;
    };
  }>;
  children: Array<{
    id: string;
    createdAt: Date;
    child: {
      id: string;
      zaloId: string | null;
      phone: string | null;
      name: string | null;
      isMaster: boolean;
      groupCount: number;
      groupData: unknown;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  groupMaps: Array<{
    id: string;
    joinedAt: Date;
    groupZaloId: string;
    group: {
      id: string;
      groupName: string;
    };
  }>;
};

@Injectable()
export class ZaloAccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(dto: SearchZaloAccountsDto) {
    const accounts: FindAllAccountRecord[] =
      await this.prismaService.zaloAccount.findMany({
        where: {
          OR: [
            { name: { contains: dto.keyword, mode: 'insensitive' } },
            { phone: { contains: dto.keyword, mode: 'insensitive' } },
          ],
        },
        select: {
          ...zaloAccountSelect,
          masters: {
            select: {
              id: true,
              createdAt: true,
              master: {
                select: {
                  id: true,
                  zaloId: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          children: {
            select: {
              id: true,
              createdAt: true,
              child: {
                select: {
                  id: true,
                  zaloId: true,
                  name: true,
                  groupCount: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: [
          { isMaster: 'desc' },
          { groupCount: 'asc' },
          { createdAt: 'desc' },
        ],
      });

    return accounts.map((account) => ({
      ...account,
      masters: account.masters.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        ...relation.master,
      })),
      children: account.children.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        ...relation.child,
      })),
    }));
  }

  async findAll() {
    const accounts: FindAllAccountRecord[] =
      await this.prismaService.zaloAccount.findMany({
        select: {
          ...zaloAccountSelect,
          masters: {
            select: {
              id: true,
              createdAt: true,
              master: {
                select: {
                  id: true,
                  zaloId: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          children: {
            select: {
              id: true,
              createdAt: true,
              child: {
                select: {
                  id: true,
                  zaloId: true,
                  name: true,
                  groupCount: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: [
          { isMaster: 'desc' },
          { groupCount: 'asc' },
          { createdAt: 'desc' },
        ],
      });

    return accounts.map((account) => ({
      ...account,
      masters: account.masters.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        ...relation.master,
      })),
      children: account.children.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        ...relation.child,
      })),
    }));
  }

  async findOne(id: string) {
    const account: FindOneAccountRecord | null =
      await this.prismaService.zaloAccount.findUnique({
        where: { id },
        select: {
          ...zaloAccountSelect,
          masters: {
            select: {
              id: true,
              createdAt: true,
              master: {
                select: {
                  id: true,
                  zaloId: true,
                  name: true,
                  phone: true,
                  isMaster: true,
                  groupCount: true,
                  createdAt: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          children: {
            select: {
              createdAt: true,
              id: true,
              child: {
                select: {
                  id: true,
                  zaloId: true,
                  phone: true,
                  name: true,
                  isMaster: true,
                  groupCount: true,
                  groupData: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          groupMaps: {
            select: {
              id: true,
              joinedAt: true,
              groupZaloId: true,
              group: {
                select: {
                  id: true,
                  groupName: true,
                },
              },
            },
            orderBy: {
              joinedAt: 'desc',
            },
          },
        },
      });

    if (!account) {
      throw new NotFoundException('Zalo account not found.');
    }

    return {
      ...account,
      masters: account.masters.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        ...relation.master,
      })),
      children: account.children.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        ...relation.child,
      })),
    };
  }

  async create(dto: CreateZaloAccountDto) {
    const existingAccount = await this.prismaService.zaloAccount.findUnique({
      where: { zaloId: dto.zaloId },
      select: { id: true },
    });

    if (existingAccount) {
      throw new ConflictException('Zalo account already exists.');
    }

    return this.prismaService.zaloAccount.create({
      data: {
        zaloId: dto.zaloId,
        phone: dto.phone,
        name: dto.name,
        isMaster: false,
      },
      select: zaloAccountSelect,
    });
  }

  async addChild(dto: AddChildAccountDto) {
    const masterAccount = await this.prismaService.zaloAccount.findUnique({
      where: { id: dto.masterId },
      select: {
        id: true,
        isMaster: true,
      },
    });

    if (!masterAccount) {
      throw new NotFoundException('Master Zalo account not found.');
    }

    if (!masterAccount.isMaster) {
      throw new BadRequestException(
        'The provided masterId does not belong to a master account.',
      );
    }

    throw new BadRequestException(
      'QR login for adding child accounts is now handled in the frontend.',
    );
  }

  async setMaster(id: string) {
    const account = await this.prismaService.zaloAccount.findUnique({
      where: { id },
      select: {
        id: true,
        isMaster: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Zalo account not found.');
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.zaloAccount.update({
        where: { id },
        data: {
          isMaster: true,
        },
      });

      await tx.zaloAccountRelation.deleteMany({
        where: {
          childId: id,
        },
      });
    });

    return this.findOne(id);
  }

  async updateGroupDataById(id: string, dto: UpdateGroupDataDto) {
    return this.prismaService.zaloAccount.update({
      where: { id },
      data: { groupData: dto.groupData },
      select: zaloAccountSelect,
    });
  }
}
