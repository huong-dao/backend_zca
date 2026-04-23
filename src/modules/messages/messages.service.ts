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

const messageWithSenderGroupSelect = {
  ...messageSelect,
  sender: {
    select: {
      id: true,
      zaloId: true,
      name: true,
      phone: true,
      status: true,
      isDeleted: true,
      deletedAt: true,
    },
  },
  group: {
    select: {
      id: true,
      groupName: true,
      originName: true,
    },
  },
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
        select: messageWithSenderGroupSelect,
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
    const account = await this.prismaService.zaloAccount.findFirst({
      where: { id: dto.zaloAccountId, isDeleted: false },
      select: { id: true, zaloId: true, isMaster: true, status: true },
    });

    if (!account) {
      throw new NotFoundException('Zalo account not found or removed.');
    }

    if (account.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Cannot send messages: this Zalo account is not active (status must be ACTIVE).',
      );
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
      select: { id: true, groupZaloId: true },
    });

    if (!mapping) {
      throw new NotFoundException(
        'This Zalo account is not linked to the given group.',
      );
    }

    const groupZaloId = mapping.groupZaloId?.trim() ?? '';
    if (!groupZaloId) {
      throw new BadRequestException(
        'ZaloAccountGroup has no group_zalo_id; run child group scan or re-link the account to this group.',
      );
    }

    const { result } = await this.zaloActionsService.sendMessage({
      sessionId: session.id,
      text: dto.text.trim(),
      threadId: groupZaloId,
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
        return {
          messageZaloId: null as string | null,
          cliMsgId: null as string | null,
        };
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

  /**
   * Soft "delete" for the app: sets `status` to `RECALL` (row kept). Only the
   * authenticated app user who has a QR session for the message sender’s `zalo_id`
   * (same child account used to send) can recall.
   */
  async recall(appUserId: string, id: string) {
    const found = await this.prismaService.message.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        sender: {
          select: {
            zaloId: true,
            status: true,
            isDeleted: true,
          },
        },
      },
    });

    if (!found) {
      throw new NotFoundException('Message not found.');
    }

    if (found.sender.isDeleted) {
      throw new BadRequestException(
        'Cannot recall: sender Zalo account was removed.',
      );
    }

    if (found.sender.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Cannot recall: this Zalo account is not active (status must be ACTIVE).',
      );
    }

    const zaloUid = found.sender.zaloId?.trim();
    if (!zaloUid) {
      throw new BadRequestException('Cannot recall: sender has no zalo_id.');
    }

    if (found.status === 'RECALL') {
      return this.prismaService.message.findUniqueOrThrow({
        where: { id: found.id },
        select: messageWithSenderGroupSelect,
      });
    }

    if (found.status !== 'SENT') {
      throw new BadRequestException(
        `Message cannot be recalled in status ${found.status}.`,
      );
    }

    await this.zaloLoginSessions.findLatestFullForAppUserAndZaloUid(
      appUserId,
      zaloUid,
    );

    return this.prismaService.message.update({
      where: { id: found.id },
      data: { status: 'RECALL' },
      select: messageWithSenderGroupSelect,
    });
  }
}
