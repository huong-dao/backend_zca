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
import { ThreadType } from 'zca-js';
import type { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigsService } from '../configs/configs.service';
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import {
  extractIdsFromZaloSendResult,
  listZaloSendBubbleIds,
  type ZaloSendBubbleIds,
} from '../../zalo/parse-zalo-send-message-result';
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
  peerPhone: true,
  parentId: true,
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
    const where = {
      ...(status && { status }),
      parentId: null,
    };

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
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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

      const bubbles = listZaloSendBubbleIds(result);
      const sentAt = new Date();
      const createSelect = {
        id: true,
        messageZaloId: true,
        cliMsgId: true,
        uidFrom: true,
        content: true,
        senderId: true,
        groupId: true,
        peerPhone: true,
        parentId: true,
        sentAt: true,
        status: true,
        createdAt: true,
      } as const;

      if (bubbles.length === 0) {
        const { messageZaloId, cliMsgId } = extractIdsFromZaloSendResult(result);
        const messageRow = await this.prismaService.message.create({
          data: {
            content: contentForDb,
            senderId: dto.zaloAccountId,
            groupId: dto.groupId,
            peerPhone: null,
            messageZaloId,
            cliMsgId,
            uidFrom: zaloUid,
            sentAt,
            status: 'SENT',
          },
          select: createSelect,
        });
        return { result, message: messageRow, messages: [messageRow] };
      }

      const contents = MessagesService.buildBubbleContents(
        textPart,
        fileList,
        bubbles,
        contentForDb,
      );
      const rows = await this.prismaService.$transaction(async (tx) => {
        const out: Prisma.MessageGetPayload<{
          select: typeof createSelect;
        }>[] = [];
        let parentRowId: string | null = null;
        for (let idx = 0; idx < bubbles.length; idx++) {
          const bubble = bubbles[idx]!;
          const content = contents[idx] ?? contentForDb;
          const row = await tx.message.create({
            data: {
              content,
              senderId: dto.zaloAccountId,
              groupId: dto.groupId,
              peerPhone: null,
              messageZaloId: bubble.messageZaloId,
              cliMsgId: bubble.cliMsgId,
              uidFrom: zaloUid,
              sentAt,
              status: 'SENT',
              parentId: idx === 0 ? null : parentRowId!,
            },
            select: createSelect,
          });
          if (idx === 0) {
            parentRowId = row.id;
          }
          out.push(row);
        }
        return out;
      });

      return { result, message: rows[0], messages: rows };
    } finally {
      await MessagesService.unlinkTempPaths(tempPaths);
    }
  }

  /**
   * One line of `content` per Zalo bubble (text first, then each attachment file name).
   * Matches `listZaloSendBubbleIds` / zca `responses.message` + `responses.attachment[]`.
   */
  private static buildBubbleContents(
    textPart: string,
    files: Express.Multer.File[],
    bubbles: ZaloSendBubbleIds[],
    fallbackSingle: string,
  ): string[] {
    if (bubbles.length === 0) {
      return [fallbackSingle];
    }
    return bubbles.map((b) => {
      if (b.source === 'message') {
        return textPart.length > 0 ? textPart : '(tin nhắn)';
      }
      const i = b.attachmentIndex ?? 0;
      const name = files[i]?.originalname?.trim() || `file_${i + 1}`;
      return `Đính kèm: ${name}`;
    });
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
   * Thu hồi tin trên Zalo (`api.undo` — `docs/Zalo_Integration.mdc`) rồi gắn `status: RECALL`.
   * Chỉ user đang có session QR cho `zalo_id` của người gửi mới gọi được.
   */
  async undo(appUserId: string, id: string) {
    const found = await this.prismaService.message.findUnique({
      where: { id },
      select: {
        id: true,
        parentId: true,
        status: true,
        messageZaloId: true,
        cliMsgId: true,
        groupId: true,
        peerPhone: true,
        senderId: true,
        sender: {
          select: {
            zaloId: true,
            status: true,
            isDeleted: true,
          },
        },
        childMessages: {
          where: { status: 'SENT' },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            messageZaloId: true,
            cliMsgId: true,
            status: true,
          },
        },
      },
    });

    if (!found) {
      throw new NotFoundException('Message not found.');
    }

    if (found.sender.isDeleted) {
      throw new BadRequestException(
        'Cannot undo: sender Zalo account was removed.',
      );
    }

    if (found.sender.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Cannot undo: this Zalo account is not active (status must be ACTIVE).',
      );
    }

    const zaloUid = found.sender.zaloId?.trim();
    if (!zaloUid) {
      throw new BadRequestException('Cannot undo: sender has no zalo_id.');
    }

    if (found.status === 'RECALL') {
      return this.prismaService.message.findUniqueOrThrow({
        where: { id: found.id },
        select: messageWithSenderGroupSelect,
      });
    }

    if (found.status !== 'SENT') {
      throw new BadRequestException(
        `Message cannot be undone in status ${found.status}.`,
      );
    }

    const toUndo: Array<{
      id: string;
      messageZaloId: string | null;
      cliMsgId: string | null;
    }> = [];
    if (found.parentId) {
      toUndo.push({
        id: found.id,
        messageZaloId: found.messageZaloId,
        cliMsgId: found.cliMsgId,
      });
    } else {
      toUndo.push(
        {
          id: found.id,
          messageZaloId: found.messageZaloId,
          cliMsgId: found.cliMsgId,
        },
        ...found.childMessages,
      );
    }

    for (const row of toUndo) {
      const msgZalo = row.messageZaloId?.trim() ?? '';
      const cli = row.cliMsgId?.trim() ?? '';
      if (!msgZalo || !cli) {
        throw new BadRequestException(
          'Cannot undo: message is missing Zalo msgId and/or cliMsgId (required for api.undo).',
        );
      }
    }

    const session =
      await this.zaloLoginSessions.findLatestFullForAppUserAndZaloUid(
        appUserId,
        zaloUid,
      );

    let threadId: string;
    let threadType: ThreadType;
    if (found.groupId) {
      const mapping = await this.prismaService.zaloAccountGroup.findFirst({
        where: {
          zaloAccountId: found.senderId,
          groupId: found.groupId,
        },
        select: { groupZaloId: true },
      });
      threadId = mapping?.groupZaloId?.trim() ?? '';
      if (!threadId) {
        throw new BadRequestException(
          'Cannot undo: ZaloAccountGroup has no group_zalo_id for this sender and group.',
        );
      }
      threadType = ThreadType.Group;
    } else {
      const phone = found.peerPhone?.trim();
      if (!phone) {
        throw new BadRequestException(
          'Cannot undo: DM message has no peer phone stored.',
        );
      }
      const { user } = await this.zaloActionsService.findUser({
        sessionId: session.id,
        phoneNumber: phone,
      });
      const u = user as { uid?: string } | undefined;
      const raw = u?.uid;
      threadId = raw != null ? String(raw).trim() : '';
      if (!threadId) {
        throw new BadRequestException(
          'Cannot undo: could not resolve peer Zalo id for this DM.',
        );
      }
      threadType = ThreadType.User;
    }

    const zcaResults: unknown[] = [];
    for (const row of toUndo) {
      const msgZalo = row.messageZaloId!.trim();
      const cli = row.cliMsgId!.trim();
      const { result } = await this.zaloActionsService.undo({
        sessionId: session.id,
        msgId: msgZalo,
        cliMsgId: cli,
        threadId,
        threadType,
      });
      zcaResults.push(result);
    }

    const idList = toUndo.map((m) => m.id);
    await this.prismaService.message.updateMany({
      where: { id: { in: idList } },
      data: { status: 'RECALL' },
    });

    const [messageRow, messages] = await Promise.all([
      this.prismaService.message.findUniqueOrThrow({
        where: { id: found.id },
        select: messageWithSenderGroupSelect,
      }),
      this.prismaService.message.findMany({
        where: { id: { in: idList } },
        orderBy: { createdAt: 'asc' },
        select: messageWithSenderGroupSelect,
      }),
    ]);

    return {
      result: zcaResults[zcaResults.length - 1],
      results: zcaResults,
      message: messageRow,
      messages,
    };
  }
}
