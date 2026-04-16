import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigsService } from '../configs/configs.service';
import { ZaloService } from '../zalo/zalo.service';
import { ZaloThreadType } from '../zalo/zalo.types';
import { FindMessagesDto } from './dto/find-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';

const messageSelect = {
  id: true,
  messageZaloId: true,
  cliMsgId: true,
  uidFrom: true,
  content: true,
  senderId: true,
  groupId: true,
  sentAt: true,
  status: true,
  createdAt: true,
} as const;

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configsService: ConfigsService,
    private readonly zaloService: ZaloService,
  ) {}

  async findAll(query: FindMessagesDto) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = status ? { status } : undefined;

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.message.count({ where }),
      this.prismaService.message.findMany({
        where,
        skip,
        take: limit,
        select: {
          ...messageSelect,
          sender: {
            select: {
              id: true,
              zaloId: true,
              name: true,
              phone: true,
            },
          },
          group: {
            select: {
              id: true,
              groupName: true,
              groupZaloId: true,
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

  async send(dto: SendMessageDto) {
    const masterAccount = await this.prismaService.zaloAccount.findUnique({
      where: { id: dto.masterId },
      select: {
        id: true,
        isMaster: true,
        zaloId: true,
        name: true,
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

    const group = await this.prismaService.zaloGroup.findUnique({
      where: { id: dto.groupId },
      select: {
        id: true,
        groupName: true,
        groupZaloId: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Zalo group not found.');
    }

    const senderCandidates = await this.prismaService.zaloAccount.findMany({
      where: {
        masterId: dto.masterId,
        isMaster: false,
      },
      orderBy: [{ groupCount: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        zaloId: true,
        isMaster: true,
        name: true,
        groupCount: true,
      },
    });

    const senderAccount = senderCandidates.find((candidate) =>
      this.zaloService.hasActiveSession(candidate.id),
    );

    if (!senderAccount) {
      await this.zaloService.assertAnyActiveSession(
        senderCandidates.map((candidate) => candidate.id),
      );

      throw new BadRequestException(
        'No active child Zalo session found under the provided master account.',
      );
    }

    const membership = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        zaloAccountId: senderAccount.id,
        groupId: group.id,
      },
      select: {
        id: true,
      },
    });

    if (!senderAccount.zaloId) {
      throw new BadRequestException(
        'The selected child account is missing zaloId.',
      );
    }

    if (!membership) {
      await this.zaloService.addUserToGroup(
        masterAccount.id,
        senderAccount.zaloId,
        group.groupZaloId,
      );

      await this.prismaService.zaloAccountGroup.create({
        data: {
          zaloAccountId: senderAccount.id,
          groupId: group.id,
        },
      });

      const updatedGroupCount = await this.prismaService.zaloAccountGroup.count(
        {
          where: {
            zaloAccountId: senderAccount.id,
          },
        },
      );

      await this.prismaService.zaloAccount.update({
        where: {
          id: senderAccount.id,
        },
        data: {
          groupCount: updatedGroupCount,
        },
      });
    }

    const messageIntervalMinutes =
      await this.configsService.getMessageIntervalMinutes();

    const lastMessage = await this.prismaService.message.findFirst({
      where: {
        senderId: senderAccount.id,
        groupId: group.id,
      },
      orderBy: {
        sentAt: 'desc',
      },
      select: {
        id: true,
        sentAt: true,
      },
    });

    if (lastMessage?.sentAt) {
      const diffInMinutes =
        (Date.now() - lastMessage.sentAt.getTime()) / (1000 * 60);

      if (diffInMinutes < messageIntervalMinutes) {
        throw new BadRequestException(
          `message_interval violation. Wait at least ${messageIntervalMinutes} minute(s) between messages for the same sender and group.`,
        );
      }
    }

    try {
      const result = await this.zaloService.sendMessage(
        senderAccount.id,
        dto.content,
        group.groupZaloId,
        ZaloThreadType.Group,
      );

      return this.prismaService.message.create({
        data: {
          messageZaloId: result.message ? String(result.message.msgId) : null,
          cliMsgId: result.cliMsgId,
          uidFrom: senderAccount.zaloId,
          content: dto.content,
          senderId: senderAccount.id,
          groupId: group.id,
          sentAt: new Date(),
          status: 'SENT',
        },
        select: {
          ...messageSelect,
          sender: {
            select: {
              id: true,
              zaloId: true,
              name: true,
              phone: true,
            },
          },
          group: {
            select: {
              id: true,
              groupName: true,
              groupZaloId: true,
            },
          },
        },
      });
    } catch (error) {
      await this.prismaService.message.create({
        data: {
          cliMsgId: null,
          uidFrom: senderAccount.zaloId,
          content: dto.content,
          senderId: senderAccount.id,
          groupId: group.id,
          sentAt: new Date(),
          status: 'FAILED',
        },
      });

      throw error;
    }
  }

  async recall(id: string) {
    const message = await this.prismaService.message.findUnique({
      where: { id },
      select: {
        id: true,
        messageZaloId: true,
        cliMsgId: true,
        uidFrom: true,
        senderId: true,
        groupId: true,
        status: true,
        group: {
          select: {
            groupZaloId: true,
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    if (message.status === 'RECALL') {
      return {
        id: message.id,
        status: message.status,
      };
    }

    if (message.status !== 'SENT') {
      throw new BadRequestException('Only sent messages can be recalled.');
    }

    if (!message.messageZaloId || !message.cliMsgId || !message.uidFrom) {
      throw new BadRequestException(
        'Message recall data is incomplete for this record.',
      );
    }

    const result = await this.zaloService.undoMessage(
      message.senderId,
      {
        cliMsgId: message.cliMsgId,
        msgId: message.messageZaloId,
      },
      message.group.groupZaloId,
      ZaloThreadType.Group,
    );

    const recalledMessage = await this.prismaService.message.update({
      where: { id: message.id },
      data: {
        status: 'RECALL',
      },
      select: {
        ...messageSelect,
      },
    });

    return {
      ...recalledMessage,
      undoStatus: result.status,
    };
  }
}
