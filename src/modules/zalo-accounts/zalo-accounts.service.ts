import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ZaloService } from '../zalo/zalo.service';
import { AddChildAccountDto } from './dto/add-child-account.dto';
import { ConfirmLoginDto } from './dto/confirm-login.dto';
import { CreateZaloAccountDto } from './dto/create-zalo-account.dto';

const zaloAccountSelect = {
  id: true,
  zaloId: true,
  phone: true,
  name: true,
  isMaster: true,
  masterId: true,
  groupCount: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ZaloAccountsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly zaloService: ZaloService,
  ) {}

  async findAll() {
    return this.prismaService.zaloAccount.findMany({
      select: {
        ...zaloAccountSelect,
        master: {
          select: {
            id: true,
            zaloId: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            zaloId: true,
            name: true,
            groupCount: true,
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
  }

  async findOne(id: string) {
    const account = await this.prismaService.zaloAccount.findUnique({
      where: { id },
      select: {
        ...zaloAccountSelect,
        master: {
          select: {
            id: true,
            zaloId: true,
            name: true,
            phone: true,
          },
        },
        children: {
          select: {
            id: true,
            zaloId: true,
            phone: true,
            name: true,
            groupCount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        groupMaps: {
          select: {
            id: true,
            joinedAt: true,
            group: {
              select: {
                id: true,
                groupName: true,
                groupZaloId: true,
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

    return account;
  }

  async syncFromGroups() {
    return this.zaloService.syncAccountsFromGroups();
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
        masterId: null,
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

    return this.zaloService.loginQR(dto.masterId, dto.phone);
  }

  async confirmLogin(dto: ConfirmLoginDto) {
    if (!dto.sessionId.trim()) {
      throw new BadRequestException('sessionId is required.');
    }

    return this.zaloService.confirmLogin(dto.sessionId);
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

    if (account.isMaster) {
      return this.prismaService.zaloAccount.findUnique({
        where: { id },
        select: zaloAccountSelect,
      });
    }

    return this.prismaService.zaloAccount.update({
      where: { id },
      data: {
        isMaster: true,
        masterId: null,
      },
      select: zaloAccountSelect,
    });
  }
}
