import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
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
  constructor(private readonly prismaService: PrismaService) {}

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
    await Promise.resolve();

    void dto;

    throw new BadRequestException(
      'Sending messages is now handled in the frontend, not by the backend.',
    );
  }

  async recall(id: string) {
    const message = await this.prismaService.message.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    throw new BadRequestException(
      'Recalling messages is now handled in the frontend, not by the backend.',
    );
  }
}
