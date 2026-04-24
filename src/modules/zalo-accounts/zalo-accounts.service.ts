import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isDeepStrictEqual } from 'node:util';
import type { API } from 'zca-js';
import { ZaloApiError } from 'zca-js';
import type { Prisma, ZaloAccountStatus } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
} from '../../zalo';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import { ZcaApiHelper } from '../../zalo/zca-api.helper';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
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
  status: true,
  isDeleted: true,
  deletedAt: true,
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
  status: ZaloAccountStatus;
  isDeleted: boolean;
  deletedAt: Date | null;
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
      status: ZaloAccountStatus;
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
    status: ZaloAccountStatus;
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
    status: ZaloAccountStatus;
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
      originName: string | null;
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
      status: ZaloAccountStatus;
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
      originName: string | null;
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

/** zca-js `sendFriendRequest`: already friends or reciprocal accept. */
const ZALO_SENDREQ_ALREADY_LINKED_CODES = new Set([222, 225]);

/** Zalo may reject empty `msg` with a generic invalid-params error. */
const DEFAULT_FRIEND_REQUEST_MESSAGE = 'Xin kết bạn với tôi nhé';

const friendRelationSelect = {
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
} as const;

@Injectable()
export class ZaloAccountsService {
  private readonly logger = new Logger(ZaloAccountsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly loginSessions: ZaloLoginSessionsService,
  ) {}

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

  /**
   * One master per `ZaloGroup` in this product: the account that has a `ZaloAccountGroup` row
   * for the group and `isMaster = true`.
   */
  async findMasterZaloAccountForGroup(groupId: string) {
    const map = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        groupId,
        zaloAccount: { isMaster: true, isDeleted: false, status: 'ACTIVE' },
      },
      select: {
        zaloAccount: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
            status: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
    return map?.zaloAccount ?? null;
  }

  /**
   * Child of the given master with lowest `groupCount`, then stable by `id`.
   */
  async findChildZaloWithMinGroupForMaster(masterId: string) {
    const rels = await this.prismaService.zaloAccountRelation.findMany({
      where: { masterId },
      include: {
        child: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
            groupCount: true,
            status: true,
            isDeleted: true,
          },
        },
      },
    });
    const active = rels
      .map((r) => r.child)
      .filter(
        (c) => !c.isDeleted && c.status === 'ACTIVE' && !c.isMaster && c.zaloId,
      );
    if (active.length === 0) {
      return null;
    }
    active.sort(
      (a, b) =>
        a.groupCount - b.groupCount || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
    return active[0] ?? null;
  }

  /**
   * For DM (no group): one child+master pair with globally lowest `groupCount` (tie-breaker `id`).
   */
  async findChildAndMasterForPublicDm() {
    const rels = await this.prismaService.zaloAccountRelation.findMany({
      where: {
        master: { isMaster: true, isDeleted: false, status: 'ACTIVE' },
        child: { isDeleted: false, isMaster: false, status: 'ACTIVE' },
      },
      include: {
        child: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
            groupCount: true,
            status: true,
            isDeleted: true,
          },
        },
        master: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            isMaster: true,
            status: true,
          },
        },
      },
    });
    if (rels.length === 0) {
      return null;
    }
    const withZalo = rels.filter((r) => r.child.zaloId);
    if (withZalo.length === 0) {
      return null;
    }
    withZalo.sort(
      (a, b) =>
        a.child.groupCount - b.child.groupCount ||
        a.child.id.localeCompare(b.child.id),
    );
    const b = withZalo[0]!;
    return { child: b.child, master: b.master };
  }

  /**
   * Idempotent: ensure Zalo friendship + `zalo_account_friends` APPROVE (master / child for public send).
   */
  async ensureMasterChildFriendshipForAutomation(
    masterAccountId: string,
    childAccountId: string,
  ): Promise<void> {
    if (masterAccountId === childAccountId) {
      throw new BadRequestException(
        'Master and child Zalo account ids must differ.',
      );
    }

    const [masterAccount, childAccount, approved] = await Promise.all([
      this.prismaService.zaloAccount.findFirst({
        where: { id: masterAccountId, isDeleted: false },
        select: { id: true, zaloId: true, phone: true, isMaster: true },
      }),
      this.prismaService.zaloAccount.findFirst({
        where: { id: childAccountId, isDeleted: false },
        select: { id: true, zaloId: true, phone: true, isMaster: true },
      }),
      this.prismaService.zaloAccountFriend.findFirst({
        where: {
          OR: [
            { masterId: masterAccountId, friendId: childAccountId },
            { masterId: childAccountId, friendId: masterAccountId },
          ],
          status: 'APPROVE',
        },
        select: { id: true },
      }),
    ]);

    if (!masterAccount || !childAccount) {
      throw new NotFoundException('Master or child Zalo account not found.');
    }
    if (!masterAccount.isMaster) {
      throw new BadRequestException('First id must be a master account.');
    }
    if (childAccount.isMaster) {
      throw new BadRequestException('Second id must be a child account.');
    }
    if (!masterAccount.zaloId || !childAccount.zaloId) {
      throw new BadRequestException(
        'Both Zalo accounts must have zalo_id for friend automation.',
      );
    }
    if (approved) {
      return;
    }

    await this.pairZaloAccountsAsFriends(
      { zaloId: masterAccount.zaloId, phone: masterAccount.phone },
      { zaloId: childAccount.zaloId, phone: childAccount.phone },
    );

    const anyRow = await this.prismaService.zaloAccountFriend.findFirst({
      where: {
        OR: [
          { masterId: masterAccountId, friendId: childAccountId },
          { masterId: childAccountId, friendId: masterAccountId },
        ],
      },
      select: { id: true },
    });

    if (anyRow) {
      await this.prismaService.zaloAccountFriend.update({
        where: { id: anyRow.id },
        data: { status: 'APPROVE' },
      });
    } else {
      await this.prismaService.zaloAccountFriend.create({
        data: {
          masterId: masterAccountId,
          friendId: childAccountId,
          status: 'APPROVE',
        },
      });
    }
  }

  /**
   * Master zca session: `findUser(phone)` + `addUserToGroup` for the child, then `zalo_account_groups` upsert.
   */
  async addChildZaloToGroupByMasterZaloId(params: {
    masterZaloAccountId: string;
    childZaloAccountId: string;
    childPhoneForFindUser: string;
    groupZaloId: string;
    groupInternalId: string;
  }): Promise<void> {
    const existing = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        zaloAccountId: params.childZaloAccountId,
        groupId: params.groupInternalId,
      },
      select: { id: true },
    });
    if (existing) {
      return;
    }

    const master = await this.prismaService.zaloAccount.findFirst({
      where: {
        id: params.masterZaloAccountId,
        isDeleted: false,
        isMaster: true,
        status: 'ACTIVE',
      },
      select: { zaloId: true },
    });
    if (!master?.zaloId) {
      throw new BadRequestException('Master has no zalo_id or is not active.');
    }

    const phone = params.childPhoneForFindUser.trim();
    if (!phone) {
      throw new BadRequestException('Child phone is required to add to group.');
    }

    const zaloResult = await this.withZaloUidSession(
      master.zaloId,
      async (zca) => {
        const p = await zca.findUser(phone);
        return zca.addUserToGroup(p.uid, params.groupZaloId);
      },
    );

    if (!this.isZaloAddUserToGroupResultOk(zaloResult)) {
      throw new BadRequestException(
        'Zalo addUserToGroup did not complete successfully for the child user.',
      );
    }

    await this.prismaService.zaloAccountGroup.upsert({
      where: {
        zaloAccountId_groupId: {
          zaloAccountId: params.childZaloAccountId,
          groupId: params.groupInternalId,
        },
      },
      create: {
        zaloAccountId: params.childZaloAccountId,
        groupId: params.groupInternalId,
        groupZaloId: params.groupZaloId,
      },
      update: { groupZaloId: params.groupZaloId },
    });
  }

  private isZaloAddUserToGroupResultOk(result: unknown): boolean {
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

  async createFriend(
    dto: CreateZaloAccountFriendDto,
  ): Promise<CreatedZaloAccountFriend> {
    if (dto.masterId === dto.friendId) {
      throw new BadRequestException(
        'A Zalo account cannot be linked as a friend to itself.',
      );
    }

    const [masterAccount, friendAccount, existingRelation] = await Promise.all([
      this.prismaService.zaloAccount.findFirst({
        where: { id: dto.masterId, isDeleted: false },
        select: { id: true, zaloId: true, name: true, phone: true },
      }),
      this.prismaService.zaloAccount.findFirst({
        where: { id: dto.friendId, isDeleted: false },
        select: { id: true, zaloId: true, name: true, phone: true },
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

    if (!masterAccount.zaloId || !friendAccount.zaloId) {
      throw new BadRequestException(
        'Both Zalo accounts must have a zaloId (link QR session / sync profile) before making friends.',
      );
    }

    if (existingRelation?.status === 'APPROVE') {
      throw new ConflictException('Friend relationship already approved.');
    }

    await this.pairZaloAccountsAsFriends(
      {
        zaloId: masterAccount.zaloId,
        phone: masterAccount.phone,
      },
      {
        zaloId: friendAccount.zaloId,
        phone: friendAccount.phone,
      },
    );

    if (existingRelation) {
      return this.prismaService.zaloAccountFriend.update({
        where: { id: existingRelation.id },
        data: { status: 'APPROVE' },
        select: friendRelationSelect,
      });
    }

    return this.prismaService.zaloAccountFriend.create({
      data: {
        masterId: dto.masterId,
        friendId: dto.friendId,
        status: 'APPROVE',
      },
      select: friendRelationSelect,
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
      await this.prismaService.zaloAccount.findFirst({
        where: { id, isDeleted: false },
        select: {
          ...zaloAccountSelect,
          masters: {
            where: { master: { isDeleted: false } },
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
            where: { child: { isDeleted: false } },
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
                  status: true,
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
            where: { friend: { isDeleted: false } },
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
            where: { master: { isDeleted: false } },
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
                  originName: true,
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
    const existingAccount = await this.prismaService.zaloAccount.findFirst({
      where: { zaloId: dto.zaloId, isDeleted: false },
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

    const masterAccount = await this.prismaService.zaloAccount.findFirst({
      where: { id: dto.masterId, isDeleted: false },
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
        isDeleted: false,
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
    const account = await this.prismaService.zaloAccount.findFirst({
      where: { id, isDeleted: false },
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
    const found = await this.prismaService.zaloAccount.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!found) {
      throw new NotFoundException('Zalo account not found.');
    }
    return this.prismaService.zaloAccount.update({
      where: { id },
      data: { groupData: dto.groupData },
      select: zaloAccountSelect,
    });
  }

  /**
   * Soft delete: mark account as removed; it will be excluded from listings and business logic.
   * Also **hard-deletes** all `ZaloLoginSession` rows whose `zalo_uid` matches this account’s `zaloId`
   * (the persisted QR / cookie session for that Zalo identity). Historical messages still reference
   * `senderId`; `GET /messages` exposes `sender.isDeleted` for the UI.
   */
  async softDelete(id: string) {
    const account = await this.prismaService.zaloAccount.findUnique({
      where: { id },
      select: { id: true, isDeleted: true, zaloId: true },
    });
    if (!account) {
      throw new NotFoundException('Zalo account not found.');
    }
    const zaloUid = account.zaloId?.trim() ?? '';
    if (account.isDeleted) {
      const loginSessionsRemoved = zaloUid
        ? (
            await this.prismaService.zaloLoginSession.deleteMany({
              where: { zaloUid },
            })
          ).count
        : 0;
      return {
        message: 'Zalo account was already removed.',
        id: account.id,
        isDeleted: true as const,
        loginSessionsRemoved,
      };
    }
    const now = new Date();
    let loginSessionsRemoved = 0;
    await this.prismaService.$transaction(async (tx) => {
      if (zaloUid) {
        const r = await tx.zaloLoginSession.deleteMany({
          where: { zaloUid },
        });
        loginSessionsRemoved = r.count;
      }
      await tx.zaloAccount.update({
        where: { id },
        data: { isDeleted: true, deletedAt: now },
      });
    });
    return {
      message: 'Zalo account removed.',
      id,
      isDeleted: true as const,
      deletedAt: now,
      loginSessionsRemoved,
    };
  }

  private async findAccounts(
    where?: Prisma.ZaloAccountWhereInput,
  ): Promise<ListedZaloAccount[]> {
    const accounts: FindAllAccountRecord[] =
      await this.prismaService.zaloAccount.findMany({
        where: { isDeleted: false, ...where },
        select: {
          ...zaloAccountSelect,
          masters: {
            where: { master: { isDeleted: false } },
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
            where: { child: { isDeleted: false } },
            select: {
              id: true,
              createdAt: true,
              child: {
                select: {
                  id: true,
                  zaloId: true,
                  name: true,
                  groupCount: true,
                  status: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          friends: {
            where: { friend: { isDeleted: false } },
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
            where: { master: { isDeleted: false } },
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

  /**
   * Master Zalo session sends `sendFriendRequest` to the friend's uid; the friend's
   * session then `acceptFriendRequest` from the master uid. If Zalo reports the pair
   * is already linked (sendFriendRequest codes 222 / 225), accept is skipped.
   */
  private async pairZaloAccountsAsFriends(
    master: { zaloId: string; phone: string | null },
    friend: { zaloId: string; phone: string | null },
  ): Promise<void> {
    let skipAccept = false;

    await this.withZaloUidSession(master.zaloId, async (zca) => {
      const friendToid = await this.resolvePeerZaloUserIdForFriendApi(
        zca,
        friend,
        'friend account',
      );
      try {
        await zca.sendFriendRequest(DEFAULT_FRIEND_REQUEST_MESSAGE, friendToid);
      } catch (err) {
        if (
          err instanceof ZaloApiError &&
          err.code != null &&
          ZALO_SENDREQ_ALREADY_LINKED_CODES.has(err.code)
        ) {
          skipAccept = true;
          return;
        }
        throw err;
      }
    });

    if (skipAccept) {
      return;
    }

    await this.withZaloUidSession(friend.zaloId, async (zca) => {
      const masterToid = await this.resolvePeerZaloUserIdForFriendApi(
        zca,
        master,
        'master account',
      );
      try {
        await zca.acceptFriendRequest(masterToid);
      } catch (err) {
        if (
          err instanceof ZaloApiError &&
          err.code != null &&
          ZALO_SENDREQ_ALREADY_LINKED_CODES.has(err.code)
        ) {
          return;
        }
        throw err;
      }
    });
  }

  /**
   * Friend APIs expect the same uid shape as `findUser` / `getOwnId` (not necessarily
   * `globalId` or other profile fields). Prefer resolving by phone when available.
   */
  private async resolvePeerZaloUserIdForFriendApi(
    zca: ZcaApiHelper,
    account: { zaloId: string | null; phone: string | null },
    label: string,
  ): Promise<string> {
    const phone = account.phone?.replace(/\s+/g, '').trim() ?? '';
    if (phone) {
      try {
        const info = await zca.findUser(phone);
        const uid = info?.uid != null ? String(info.uid).trim() : '';
        if (uid) {
          return uid;
        }
      } catch {
        // fall through to zaloId
      }
    }

    const rawId = account.zaloId?.trim();
    if (rawId) {
      try {
        const info = await zca.getUserInfo(rawId);
        const merged = {
          ...info.unchanged_profiles,
          ...info.changed_profiles,
        } as Record<string, { userId?: string }>;
        for (const p of Object.values(merged)) {
          const uid = p?.userId != null ? String(p.userId).trim() : '';
          if (uid) {
            return uid;
          }
        }
      } catch {
        // use raw id below
      }
      return rawId;
    }

    throw new BadRequestException(
      `Cannot resolve Zalo user id for ${label}: add a phone number or valid zaloId (profile userId / uid).`,
    );
  }

  private async withZaloUidSession<T>(
    zaloUid: string,
    run: (zca: ZcaApiHelper, api: API) => Promise<T>,
  ): Promise<T> {
    const full = await this.loginSessions.findLatestByZaloUid(zaloUid);
    const sessionId = full.id;
    const prevCreds: ZaloSessionCredentialsPayload = full.credentials;

    let api: API;
    try {
      api = await createZcaApiFromCredentials(prevCreds);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Zalo login failed for zaloUid=${zaloUid} sessionId=${sessionId}: ${detail}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw badRequestForZaloSessionRestoreFailure(detail);
    }

    const zca = new ZcaApiHelper(api);
    try {
      const out = await run(zca, api);
      await this.persistRefreshedZaloSession(sessionId, api, prevCreds);
      await this.loginSessions.touchBySessionId(sessionId);
      return out;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      if (err instanceof ZaloApiError) {
        const code = err.code != null ? `[${err.code}] ` : '';
        throw new BadRequestException(
          `${code}${err.message || 'Zalo API rejected the friend operation.'}`,
        );
      }
      throw new InternalServerErrorException(
        err instanceof Error ? err.message : 'Zalo API error.',
      );
    }
  }

  private async persistRefreshedZaloSession(
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
