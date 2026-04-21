import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
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
    private readonly zaloActionsService: ZaloActionsService,
    private readonly zaloLoginSessions: ZaloLoginSessionsService,
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

  async send(appUserId: string, dto: SendMessageDto) {
    const account = await this.prismaService.zaloAccount.findUnique({
      where: { id: dto.zaloAccountId },
      select: { id: true, zaloId: true, isMaster: true },
    });

    if (!account) {
      throw new NotFoundException('Zalo account not found.');
    }

    if (account.isMaster) {
      throw new BadRequestException(
        'This endpoint sends as a child account only; use a child zaloAccountId.',
      );
    }

    const zaloUid = account.zaloId?.trim();
    if (!zaloUid) {
      throw new BadRequestException(
        'Child Zalo account has no zalo_id; set or sync it before sending.',
      );
    }

    const session =
      await this.zaloLoginSessions.findLatestFullForAppUserAndZaloUid(
        appUserId,
        zaloUid,
      );

    const mapping = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        zaloAccountId: dto.zaloAccountId,
        groupId: dto.groupId,
      },
      select: { groupZaloId: true },
    });

    if (!mapping) {
      throw new NotFoundException(
        'This Zalo account is not linked to the given group.',
      );
    }

    const { result } = await this.zaloActionsService.sendMessage({
      sessionId: session.id,
      text: dto.text.trim(),
      threadId: mapping.groupZaloId,
    });

    const { messageZaloId, cliMsgId } =
      MessagesService.extractIdsFromZaloSendResult(result);

    const messageRow = await this.prismaService.message.create({
      data: {
        content: dto.text.trim(),
        senderId: dto.zaloAccountId,
        groupId: dto.groupId,
        messageZaloId,
        cliMsgId,
        uidFrom: zaloUid,
        sentAt: new Date(),
        status: 'SENT',
      },
      select: {
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
      },
    });

    return { result, message: messageRow };
  }

  /** Best-effort parse of zca-js `sendMessage` return (shape may vary by version). */
  private static extractIdsFromZaloSendResult(res: unknown): {
    messageZaloId: string | null;
    cliMsgId: string | null;
  } {
    if (!res || typeof res !== 'object') {
      return { messageZaloId: null, cliMsgId: null };
    }
    const r = res as Record<string, unknown>;

    const fromMsgBlock = (block: unknown) => {
      if (!block || typeof block !== 'object') {
        return { messageZaloId: null as string | null, cliMsgId: null as string | null };
      }
      const m = block as Record<string, unknown>;
      const messageZaloId =
        m.msgId != null
          ? String(m.msgId)
          : m.messageId != null
            ? String(m.messageId)
            : null;
      const cliMsgId =
        m.cliMsgId != null
          ? String(m.cliMsgId)
          : m.cli_msg_id != null
            ? String(m.cli_msg_id)
            : null;
      return { messageZaloId, cliMsgId };
    };

    let messageZaloId: string | null = null;
    let cliMsgId: string | null = null;

    const main = fromMsgBlock(r.message);
    messageZaloId = main.messageZaloId;
    cliMsgId = main.cliMsgId;

    const atts = r.attachment;
    if (!messageZaloId && Array.isArray(atts)) {
      for (const a of atts) {
        const parsed = fromMsgBlock(a);
        if (parsed.messageZaloId) {
          messageZaloId = parsed.messageZaloId;
          if (!cliMsgId && parsed.cliMsgId) {
            cliMsgId = parsed.cliMsgId;
          }
          break;
        }
      }
    }

    return { messageZaloId, cliMsgId };
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
