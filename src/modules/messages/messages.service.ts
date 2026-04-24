import { randomUUID } from 'node:crypto';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Express } from 'express';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigsService } from '../configs/configs.service';
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import { extractIdsFromZaloSendResult } from '../../zalo/parse-zalo-send-message-result';
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
    private readonly configsService: ConfigsService,
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

  async send(
    appUserId: string,
    dto: SendMessageDto,
    files?: Express.Multer.File[],
  ) {
    const account = await this.prismaService.zaloAccount.findFirst({
      where: { id: dto.zaloAccountId, isDeleted: false },
      select: { id: true, zaloId: true, name: true, isMaster: true, status: true },
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

    const intervalMinutes = await this.configsService.getMessageIntervalMinutes();
    if (intervalMinutes > 0) {
      const [zaloGroup, lastMessage] = await Promise.all([
        this.prismaService.zaloGroup.findUnique({
          where: { id: dto.groupId },
          select: { groupName: true },
        }),
        this.prismaService.message.findFirst({
          where: {
            senderId: dto.zaloAccountId,
            groupId: dto.groupId,
          },
          orderBy: { createdAt: 'desc' },
          select: { sentAt: true, createdAt: true },
        }),
      ]);
      if (lastMessage) {
        const lastAt = lastMessage.sentAt ?? lastMessage.createdAt;
        const intervalMs = intervalMinutes * 60_000;
        const elapsed = Date.now() - lastAt.getTime();
        if (elapsed < intervalMs) {
          const childName =
            account.name?.trim() || 'Tài khoản này';
          const groupLabel = zaloGroup?.groupName?.trim() || 'nhóm này';
          const remainingMs = intervalMs - elapsed;
          const waitMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
          const agoMinutes = Math.floor(elapsed / 60_000);
          const agoLabel =
            agoMinutes >= 1 ? `${agoMinutes} phút` : 'chưa đầy 1 phút';
          throw new BadRequestException(
            `${childName} vừa gửi tin nhắn vào group ${groupLabel} cách đây ${agoLabel}, bạn cần chờ thêm ${waitMinutes} phút nữa để gửi tin nhắn tiếp theo vào nhóm này`,
          );
        }
      }
    }

    const textPart = dto.text?.trim() ?? '';
    const fileList = files?.length ? files : [];
    if (!textPart && !fileList.length) {
      throw new BadRequestException(
        'Cần nội dung tin nhắn (text) hoặc ít nhất một file đính kèm.',
      );
    }

    const contentForDb = (() => {
      if (textPart && fileList.length) {
        const names = fileList
          .map((f) => f.originalname || 'file')
          .join(', ');
        return `${textPart}\n\n(Đính kèm: ${names})`;
      }
      if (textPart) return textPart;
      return `Đính kèm: ${fileList.map((f) => f.originalname || 'file').join(', ')}`;
    })();

    let tempPaths: string[] = [];
    try {
      if (fileList.length) {
        tempPaths = await MessagesService.writeMulterFilesToTemp(fileList);
      }
      const { result } = await this.zaloActionsService.sendMessage({
        sessionId: session.id,
        text: textPart,
        threadId: groupZaloId,
        ...(tempPaths.length
          ? { attachmentLocalPaths: tempPaths }
          : {}),
      });

      const { messageZaloId, cliMsgId } = extractIdsFromZaloSendResult(result);

      const messageRow = await this.prismaService.message.create({
        data: {
          content: contentForDb,
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
    } finally {
      await MessagesService.unlinkTempPaths(tempPaths);
    }
  }

  private static async writeMulterFilesToTemp(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const paths: string[] = [];
    for (const f of files) {
      const base = (f.originalname || 'file')
        .replace(/[^a-zA-Z0-9._\-\s\u00C0-\u024F]/g, '_')
        .slice(0, 120);
      const p = join(tmpdir(), `zca-msg-${randomUUID()}-${base}`);
      await writeFile(p, f.buffer);
      paths.push(p);
    }
    return paths;
  }

  private static async unlinkTempPaths(paths: string[]): Promise<void> {
    if (!paths.length) return;
    await Promise.all(
      paths.map((p) => unlink(p).catch(() => undefined)),
    );
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
