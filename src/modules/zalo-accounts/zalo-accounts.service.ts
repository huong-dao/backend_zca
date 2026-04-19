import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AddChildAccountDto } from './dto/add-child-account.dto';
import { CreateZaloAccountDto } from './dto/create-zalo-account.dto';
import { CreateZaloAccountFriendDto } from './dto/create-zalo-account-friend.dto';
import { FilterZaloAccountsDto } from './dto/filter-zalo-accounts.dto';
import { SearchZaloAccountsDto } from './dto/search.dto';
import { UpdateGroupDataDto } from './dto/update-zalo-account-group-data';

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
  friends: Array<{
    id: string;
    createdAt: Date;
    status: 'PENDING' | 'APPROVE' | 'CANCEL';
    friend: {
      id: string;
      zaloId: string | null;
      phone: string | null;
      name: string | null;
      isMaster: boolean;
      groupCount: number;
    };
  }>;
  friendOf: Array<{
    id: string;
    createdAt: Date;
    status: 'PENDING' | 'APPROVE' | 'CANCEL';
    master: {
      id: string;
      zaloId: string | null;
      phone: string | null;
      name: string | null;
      isMaster: boolean;
      groupCount: number;
    };
  }>;
};

type ZaloAccountFriendSummary = {
  relationId: string;
  linkedAt: Date;
  status: 'PENDING' | 'APPROVE' | 'CANCEL';
  id: string;
  zaloId: string | null;
  phone: string | null;
  name: string | null;
  isMaster: boolean;
  groupCount: number;
};

type ListedZaloAccount = ZaloAccountBaseRecord & {
  masters: Array<{
    relationId: string;
    linkedAt: Date;
    id: string;
    zaloId: string | null;
    name: string | null;
  }>;
  children: Array<{
    relationId: string;
    linkedAt: Date;
    id: string;
    zaloId: string | null;
    name: string | null;
    groupCount: number;
  }>;
  friends: ZaloAccountFriendSummary[];
};

type CreatedZaloAccountFriend = {
  id: string;
  createdAt: Date;
  status: 'PENDING' | 'APPROVE' | 'CANCEL';
  master: {
    id: string;
    zaloId: string | null;
    phone: string | null;
    name: string | null;
    isMaster: boolean;
  };
  friend: {
    id: string;
    zaloId: string | null;
    phone: string | null;
    name: string | null;
    isMaster: boolean;
  };
};

export type RemovedZaloAccountFriendResult = {
  message: string;
  deleted: CreatedZaloAccountFriend;
};

export type UpdatedZaloAccountFriendStatusResult = {
  message: string;
  updated: CreatedZaloAccountFriend;
};

type AddChildResult = {
  master: FindOneAccountResponse;
  linkedChildIds: string[];
  skippedExistingChildIds: string[];
  duplicateInputChildIds: string[];
  summary: {
    requested: number;
    uniqueRequested: number;
    linked: number;
    skippedExisting: number;
    skippedDuplicateInput: number;
  };
};

type FindOneAccountResponse = ZaloAccountBaseRecord & {
  masters: Array<{
    relationId: string;
    linkedAt: Date;
    id: string;
    zaloId: string | null;
    name: string | null;
    phone: string | null;
    isMaster: boolean;
    groupCount: number;
    createdAt: Date;
  }>;
  children: Array<{
    relationId: string;
    linkedAt: Date;
    id: string;
    zaloId: string | null;
    phone: string | null;
    name: string | null;
    isMaster: boolean;
    groupCount: number;
    groupData: unknown;
    createdAt: Date;
    updatedAt: Date;
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
  friends: ZaloAccountFriendSummary[];
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
  friends: Array<{
    id: string;
    createdAt: Date;
    status: 'PENDING' | 'APPROVE' | 'CANCEL';
    friend: {
      id: string;
      zaloId: string | null;
      phone: string | null;
      name: string | null;
      isMaster: boolean;
      groupCount: number;
    };
  }>;
  friendOf: Array<{
    id: string;
    createdAt: Date;
    status: 'PENDING' | 'APPROVE' | 'CANCEL';
    master: {
      id: string;
      zaloId: string | null;
      phone: string | null;
      name: string | null;
      isMaster: boolean;
      groupCount: number;
    };
  }>;
};

@Injectable()
export class ZaloAccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async search(dto: SearchZaloAccountsDto): Promise<ListedZaloAccount[]> {
    return this.findAccounts({
      OR: [
        { name: { contains: dto.keyword, mode: 'insensitive' } },
        { phone: { contains: dto.keyword, mode: 'insensitive' } },
      ],
    });
  }

  async findAll(): Promise<ListedZaloAccount[]> {
    return this.findAccounts();
  }

  async filterByType(dto: FilterZaloAccountsDto): Promise<ListedZaloAccount[]> {
    return this.findAccounts({
      isMaster: dto.type === 'master',
    });
  }

  async createFriend(
    dto: CreateZaloAccountFriendDto,
  ): Promise<CreatedZaloAccountFriend> {
    if (dto.masterId === dto.friendId) {
      throw new BadRequestException(
        'A Zalo account cannot be linked as a friend to itself.',
      );
    }

    const [masterAccount, friendAccount, existingRelation] = await Promise.all([
      this.prismaService.zaloAccount.findUnique({
        where: { id: dto.masterId },
        select: { id: true, zaloId: true, name: true },
      }),
      this.prismaService.zaloAccount.findUnique({
        where: { id: dto.friendId },
        select: { id: true, zaloId: true, name: true },
      }),
      this.prismaService.zaloAccountFriend.findFirst({
        where: {
          OR: [
            {
              masterId: dto.masterId,
              friendId: dto.friendId,
            },
            {
              masterId: dto.friendId,
              friendId: dto.masterId,
            },
          ],
        },
        select: {
          id: true,
          status: true,
        },
      }),
    ]);

    if (!masterAccount) {
      throw new NotFoundException('Source Zalo account not found.');
    }

    if (!friendAccount) {
      throw new NotFoundException('Friend Zalo account not found.');
    }

    if (existingRelation) {
      if (existingRelation.status === 'CANCEL') {
        return this.prismaService.zaloAccountFriend.update({
          where: { id: existingRelation.id },
          data: {
            status: 'PENDING',
          },
          select: {
            id: true,
            createdAt: true,
            status: true,
            master: {
              select: {
                id: true,
                zaloId: true,
                phone: true,
                name: true,
                isMaster: true,
              },
            },
            friend: {
              select: {
                id: true,
                zaloId: true,
                phone: true,
                name: true,
                isMaster: true,
              },
            },
          },
        });
      }

      throw new ConflictException('Friend relationship already exists.');
    }

    return this.prismaService.zaloAccountFriend.create({
      data: {
        masterId: dto.masterId,
        friendId: dto.friendId,
        status: 'PENDING',
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        master: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
          },
        },
        friend: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
          },
        },
      },
    });
  }

  async removeFriend(
    dto: CreateZaloAccountFriendDto,
  ): Promise<RemovedZaloAccountFriendResult> {
    if (dto.masterId === dto.friendId) {
      throw new BadRequestException(
        'A Zalo account cannot remove a friend relationship with itself.',
      );
    }

    const relation = await this.prismaService.zaloAccountFriend.findFirst({
      where: {
        OR: [
          {
            masterId: dto.masterId,
            friendId: dto.friendId,
          },
          {
            masterId: dto.friendId,
            friendId: dto.masterId,
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        master: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
          },
        },
        friend: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
          },
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Friend relationship not found.');
    }

    await this.prismaService.zaloAccountFriend.delete({
      where: { id: relation.id },
    });

    return {
      message: 'Friend relationship removed successfully.',
      deleted: relation,
    };
  }

  async approveFriend(
    dto: CreateZaloAccountFriendDto,
  ): Promise<UpdatedZaloAccountFriendStatusResult> {
    const updated = await this.updateFriendStatus(dto, 'APPROVE');

    return {
      message: 'Friend relationship approved successfully.',
      updated,
    };
  }

  async cancelFriend(
    dto: CreateZaloAccountFriendDto,
  ): Promise<UpdatedZaloAccountFriendStatusResult> {
    const updated = await this.updateFriendStatus(dto, 'CANCEL');

    return {
      message: 'Friend relationship cancelled successfully.',
      updated,
    };
  }

  async findOne(id: string): Promise<FindOneAccountResponse> {
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
          friends: {
            select: {
              id: true,
              createdAt: true,
              status: true,
              friend: {
                select: {
                  id: true,
                  zaloId: true,
                  phone: true,
                  name: true,
                  isMaster: true,
                  groupCount: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          friendOf: {
            select: {
              id: true,
              createdAt: true,
              status: true,
              master: {
                select: {
                  id: true,
                  zaloId: true,
                  phone: true,
                  name: true,
                  isMaster: true,
                  groupCount: true,
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
      friends: this.buildFriendSummaries(account),
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

  async addChild(dto: AddChildAccountDto): Promise<AddChildResult> {
    const childIds = dto.childIds.filter(
      (childId): childId is string => typeof childId === 'string',
    );

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

    const uniqueChildIds = new Set<string>();
    const duplicateInputChildIds = new Set<string>();

    for (const childId of childIds) {
      if (childId === dto.masterId) {
        throw new BadRequestException(
          'A master account cannot be added as its own child.',
        );
      }

      if (uniqueChildIds.has(childId)) {
        duplicateInputChildIds.add(childId);
        continue;
      }

      uniqueChildIds.add(childId);
    }

    const requestedChildIds = [...uniqueChildIds];
    const childAccounts = await this.prismaService.zaloAccount.findMany({
      where: {
        id: {
          in: requestedChildIds,
        },
      },
      select: {
        id: true,
        isMaster: true,
      },
    });

    if (childAccounts.length !== requestedChildIds.length) {
      throw new NotFoundException(
        'One or more child Zalo accounts were not found.',
      );
    }

    const masterChildIds = childAccounts
      .filter((account) => account.isMaster)
      .map((account) => account.id);

    if (masterChildIds.length > 0) {
      throw new BadRequestException(
        'Master accounts cannot be added as child accounts.',
      );
    }

    const existingRelations =
      await this.prismaService.zaloAccountRelation.findMany({
        where: {
          masterId: dto.masterId,
          childId: {
            in: requestedChildIds,
          },
        },
        select: {
          childId: true,
        },
      });

    const existingChildIds = new Set<string>(
      existingRelations.map((relation) => relation.childId),
    );

    const childIdsToLink = requestedChildIds.filter(
      (childId) => !existingChildIds.has(childId),
    );

    if (childIdsToLink.length > 0) {
      await this.prismaService.zaloAccountRelation.createMany({
        data: childIdsToLink.map((childId) => ({
          masterId: dto.masterId,
          childId,
        })),
      });
    }

    return {
      master: await this.findOne(dto.masterId),
      linkedChildIds: childIdsToLink,
      skippedExistingChildIds: Array.from(existingChildIds),
      duplicateInputChildIds: Array.from(duplicateInputChildIds),
      summary: {
        requested: childIds.length,
        uniqueRequested: requestedChildIds.length,
        linked: childIdsToLink.length,
        skippedExisting: existingChildIds.size,
        skippedDuplicateInput: duplicateInputChildIds.size,
      },
    };
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

  private async findAccounts(
    where?: Prisma.ZaloAccountWhereInput,
  ): Promise<ListedZaloAccount[]> {
    const accounts: FindAllAccountRecord[] =
      await this.prismaService.zaloAccount.findMany({
        where,
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
          friends: {
            select: {
              id: true,
              createdAt: true,
              status: true,
              friend: {
                select: {
                  id: true,
                  zaloId: true,
                  phone: true,
                  name: true,
                  isMaster: true,
                  groupCount: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          friendOf: {
            select: {
              id: true,
              createdAt: true,
              status: true,
              master: {
                select: {
                  id: true,
                  zaloId: true,
                  phone: true,
                  name: true,
                  isMaster: true,
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
      friends: this.buildFriendSummaries(account),
    }));
  }

  private async updateFriendStatus(
    dto: CreateZaloAccountFriendDto,
    status: 'APPROVE' | 'CANCEL',
  ): Promise<CreatedZaloAccountFriend> {
    if (dto.masterId === dto.friendId) {
      throw new BadRequestException(
        'A Zalo account cannot update a friend relationship with itself.',
      );
    }

    const relation = await this.prismaService.zaloAccountFriend.findFirst({
      where: {
        OR: [
          {
            masterId: dto.masterId,
            friendId: dto.friendId,
          },
          {
            masterId: dto.friendId,
            friendId: dto.masterId,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!relation) {
      throw new NotFoundException('Friend relationship not found.');
    }

    return this.prismaService.zaloAccountFriend.update({
      where: { id: relation.id },
      data: { status },
      select: {
        id: true,
        createdAt: true,
        status: true,
        master: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
          },
        },
        friend: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
          },
        },
      },
    });
  }

  private buildFriendSummaries(account: {
    friends: FindAllAccountRecord['friends'];
    friendOf: FindAllAccountRecord['friendOf'];
  }): ZaloAccountFriendSummary[] {
    return [
      ...account.friends.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        status: relation.status,
        ...relation.friend,
      })),
      ...account.friendOf.map((relation) => ({
        relationId: relation.id,
        linkedAt: relation.createdAt,
        status: relation.status,
        ...relation.master,
      })),
    ];
  }
}
