import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Express } from 'express';
import { ThreadType } from 'zca-js';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConfigsService } from '../configs/configs.service';
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import {
  buildAttachmentContentForDb,
} from '../../common/utils/attachment-files.util';
import {
  copyStorageFileForResend,
  readStorageFileAsMulter,
  saveMulterFilesToStorage,
  savedMediaToAttachmentPaths,
  type SavedMediaFile,
} from '../../common/utils/media-storage.util';
import {
  isValidVietnamPhoneForPublicTarget,
  normalizeVietnamPhone,
} from '../../zalo/vietnam-phone';
import { FindMessagesDto } from './dto/find-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { buildMessagesWhereInput } from './build-messages-where.util';
import { extractTextFromStoredContent } from './extract-stored-text.util';
import {
  logFailedMessage,
  type LogFailedMessageInput,
} from './log-failed-message.util';
import {
  linkMediaToFailedMessage,
  messageCreateSelect,
  persistSentMessagesWithMedia,
} from './persist-sent-messages.util';

const messageWithSenderGroupSelect = {
  ...messageCreateSelect,
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

type SendTarget =
  | { kind: 'group'; groupId: string; threadId: string }
  | { kind: 'dm'; peerPhone: string; threadId: string };

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configsService: ConfigsService,
    private readonly zaloActionsService: ZaloActionsService,
    private readonly zaloLoginSessions: ZaloLoginSessionsService,
  ) {}

  private async recordFailureAndThrow(
    base: Omit<LogFailedMessageInput, 'failureReason'>,
    failureReason: string,
    error: Error,
    savedMedia: SavedMediaFile[] = [],
  ): Promise<never> {
    const failedId = await logFailedMessage(this.prismaService, {
      ...base,
      failureReason,
    });
    if (failedId && savedMedia.length) {
      await linkMediaToFailedMessage(
        this.prismaService,
        failedId,
        new Date(),
        savedMedia,
      );
    }
    throw error;
  }

  async findAll(query: FindMessagesDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = buildMessagesWhereInput(query);

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
    const groupId = dto.groupId?.trim();
    const peerRaw = dto.peerPhone?.trim();
    if (groupId && peerRaw) {
      throw new BadRequestException(
        'Chỉ được truyền groupId hoặc peerPhone, không được cả hai.',
      );
    }
    if (!groupId && !peerRaw) {
      throw new BadRequestException(
        'Cần groupId (gửi nhóm) hoặc peerPhone (gửi DM).',
      );
    }

    const textPart = dto.text?.trim() ?? '';
    const fileList = files?.length ? files : [];
    const contentForDb = buildAttachmentContentForDb(textPart, fileList);

    const account = await this.prismaService.zaloAccount.findFirst({
      where: { id: dto.zaloAccountId, isDeleted: false },
      select: { id: true, zaloId: true, name: true, isMaster: true, status: true },
    });

    if (!account) {
      throw new NotFoundException('Zalo account not found or removed.');
    }

    const failureBase: Omit<LogFailedMessageInput, 'failureReason'> = {
      senderId: dto.zaloAccountId,
      groupId: groupId ?? null,
      peerPhone: peerRaw ? normalizeVietnamPhone(peerRaw) : null,
      content: contentForDb,
      uidFrom: account.zaloId?.trim() || null,
    };

    const savedMedia = fileList.length
      ? await saveMulterFilesToStorage(fileList)
      : [];

    if (account.status !== 'ACTIVE') {
      return await this.recordFailureAndThrow(
        failureBase,
        'Cannot send messages: this Zalo account is not active (status must be ACTIVE).',
        new BadRequestException(
          'Cannot send messages: this Zalo account is not active (status must be ACTIVE).',
        ),
        savedMedia,
      );
    }

    if (account.isMaster) {
      return await this.recordFailureAndThrow(
        failureBase,
        'This endpoint sends as a child account only; use a child zaloAccountId.',
        new BadRequestException(
          'This endpoint sends as a child account only; use a child zaloAccountId.',
        ),
        savedMedia,
      );
    }

    const zaloUid = account.zaloId?.trim();
    if (!zaloUid) {
      return await this.recordFailureAndThrow(
        failureBase,
        'Child Zalo account has no zalo_id; set or sync it before sending.',
        new BadRequestException(
          'Child Zalo account has no zalo_id; set or sync it before sending.',
        ),
        savedMedia,
      );
    }

    let session;
    try {
      session =
        await this.zaloLoginSessions.findLatestFullForAppUserAndZaloUid(
          appUserId,
          zaloUid,
        );
    } catch (e) {
      if (e instanceof NotFoundException) {
        return await this.recordFailureAndThrow(
          failureBase,
          e.message,
          e,
          savedMedia,
        );
      }
      throw e;
    }

    let target: SendTarget;
    if (groupId) {
      target = await this.resolveGroupTarget(
        dto.zaloAccountId,
        groupId,
        failureBase,
        savedMedia,
      );
      await this.enforceMessageIntervalForGroup({
        zaloAccountId: dto.zaloAccountId,
        groupId,
        accountName: account.name,
        failureBase,
        savedMedia,
      });
    } else {
      const normalizedPhone = normalizeVietnamPhone(peerRaw!);
      if (!isValidVietnamPhoneForPublicTarget(normalizedPhone)) {
        return await this.recordFailureAndThrow(
          { ...failureBase, peerPhone: normalizedPhone },
          'peerPhone không hợp lệ (số di động VN 10 chữ số).',
          new BadRequestException(
            'peerPhone không hợp lệ (số di động VN 10 chữ số).',
          ),
          savedMedia,
        );
      }
      target = await this.resolveDmTarget(
        session.id,
        normalizedPhone,
        { ...failureBase, peerPhone: normalizedPhone },
        savedMedia,
      );
      await this.enforceMessageIntervalForDm({
        zaloAccountId: dto.zaloAccountId,
        peerPhone: normalizedPhone,
        accountName: account.name,
        failureBase: { ...failureBase, peerPhone: normalizedPhone },
        savedMedia,
      });
    }

    if (!textPart && !fileList.length) {
      return await this.recordFailureAndThrow(
        failureBase,
        'Cần nội dung tin nhắn (text) hoặc ít nhất một file đính kèm.',
        new BadRequestException(
          'Cần nội dung tin nhắn (text) hoặc ít nhất một file đính kèm.',
        ),
        savedMedia,
      );
    }

    return this.executeSend({
      sessionId: session.id,
      target,
      textPart,
      fileList,
      contentForDb,
      failureBase,
      senderId: dto.zaloAccountId,
      zaloUid,
      savedMedia,
    });
  }

  async resend(appUserId: string, messageId: string) {
    const found = await this.prismaService.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        parentId: true,
        content: true,
        senderId: true,
        groupId: true,
        peerPhone: true,
        status: true,
        sender: {
          select: {
            id: true,
            zaloId: true,
            name: true,
            isMaster: true,
            status: true,
            isDeleted: true,
          },
        },
        childMessages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            media: {
              orderBy: { attachmentIndex: 'asc' },
              select: {
                id: true,
                fileName: true,
                mimeType: true,
                sizeBytes: true,
                storagePath: true,
                attachmentIndex: true,
              },
            },
          },
        },
        media: {
          orderBy: { attachmentIndex: 'asc' },
          select: {
            id: true,
            fileName: true,
            mimeType: true,
            sizeBytes: true,
            storagePath: true,
            attachmentIndex: true,
          },
        },
      },
    });

    if (!found) {
      throw new NotFoundException('Message not found.');
    }

    if (found.sender.isDeleted) {
      throw new BadRequestException(
        'Cannot resend: sender Zalo account was removed.',
      );
    }

    const root =
      found.parentId != null
        ? await this.prismaService.message.findUniqueOrThrow({
            where: { id: found.parentId },
            select: {
              id: true,
              content: true,
              senderId: true,
              groupId: true,
              peerPhone: true,
              status: true,
              childMessages: {
                orderBy: { createdAt: 'asc' },
                select: {
                  id: true,
                  media: {
                    orderBy: { attachmentIndex: 'asc' },
                    select: {
                      id: true,
                      fileName: true,
                      mimeType: true,
                      sizeBytes: true,
                      storagePath: true,
                      attachmentIndex: true,
                    },
                  },
                },
              },
              media: {
                orderBy: { attachmentIndex: 'asc' },
                select: {
                  id: true,
                  fileName: true,
                  mimeType: true,
                  sizeBytes: true,
                  storagePath: true,
                  attachmentIndex: true,
                },
              },
            },
          })
        : found;

    const mediaRows = [
      ...root.media,
      ...root.childMessages.flatMap((c) => c.media),
    ].sort((a, b) => a.attachmentIndex - b.attachmentIndex);

    const hasAttachments = mediaRows.length > 0;
    const textPart = extractTextFromStoredContent(root.content, hasAttachments);

    if (!textPart && !hasAttachments) {
      throw new BadRequestException(
        'Không có nội dung để gửi lại (text rỗng và không có file đính kèm đã lưu).',
      );
    }

    if (
      !hasAttachments &&
      (root.content.includes('(Đính kèm:') ||
        root.content.startsWith('Đính kèm:'))
    ) {
      throw new BadRequestException(
        'Tin nhắn có đính kèm nhưng chưa có file trong Media (chỉ áp dụng tin gửi sau khi cập nhật hệ thống).',
      );
    }

    const savedForSend: SavedMediaFile[] = [];
    for (let i = 0; i < mediaRows.length; i++) {
      const m = mediaRows[i]!;
      try {
        const copied = await copyStorageFileForResend(
          m.storagePath,
          m.fileName,
        );
        savedForSend.push({ ...copied, attachmentIndex: i });
      } catch {
        throw new BadRequestException(
          `Không đọc được file đính kèm "${m.fileName}" trên storage.`,
        );
      }
    }

    const fileList: Express.Multer.File[] = [];
    for (const s of savedForSend) {
      fileList.push(await readStorageFileAsMulter(s));
    }

    const dto: SendMessageDto = {
      zaloAccountId: root.senderId,
      ...(root.groupId ? { groupId: root.groupId } : {}),
      ...(root.peerPhone ? { peerPhone: root.peerPhone } : {}),
      ...(textPart ? { text: textPart } : {}),
    };

    return this.send(appUserId, dto, fileList.length ? fileList : undefined);
  }

  private async resolveGroupTarget(
    zaloAccountId: string,
    groupId: string,
    failureBase: Omit<LogFailedMessageInput, 'failureReason'>,
    savedMedia: SavedMediaFile[] = [],
  ): Promise<SendTarget> {
    const mapping = await this.prismaService.zaloAccountGroup.findFirst({
      where: {
        zaloAccountId,
        groupId,
      },
      select: { id: true, groupZaloId: true },
    });

    if (!mapping) {
      throw await this.recordFailureAndThrow(
        failureBase,
        'This Zalo account is not linked to the given group.',
        new NotFoundException(
          'This Zalo account is not linked to the given group.',
        ),
        savedMedia,
      );
    }

    const groupZaloId = mapping.groupZaloId?.trim() ?? '';
    if (!groupZaloId) {
      throw await this.recordFailureAndThrow(
        failureBase,
        'ZaloAccountGroup has no group_zalo_id; run child group scan or re-link the account to this group.',
        new BadRequestException(
          'ZaloAccountGroup has no group_zalo_id; run child group scan or re-link the account to this group.',
        ),
        savedMedia,
      );
    }

    return { kind: 'group', groupId, threadId: groupZaloId };
  }

  private async resolveDmTarget(
    sessionId: string,
    normalizedPhone: string,
    failureBase: Omit<LogFailedMessageInput, 'failureReason'>,
    savedMedia: SavedMediaFile[] = [],
  ): Promise<SendTarget> {
    try {
      const { user } = await this.zaloActionsService.findUser({
        sessionId,
        phoneNumber: normalizedPhone,
      });
      const u = user as { uid?: string } | undefined;
      const raw = u?.uid;
      const threadId = raw != null ? String(raw).trim() : '';
      if (!threadId) {
        throw await this.recordFailureAndThrow(
          failureBase,
          'Không thấy tài khoản Zalo tương ứng với số điện thoại.',
          new BadRequestException(
            'Không thấy tài khoản Zalo tương ứng với số điện thoại.',
          ),
          savedMedia,
        );
      }
      return { kind: 'dm', peerPhone: normalizedPhone, threadId };
    } catch (e) {
      if (e instanceof BadRequestException || e instanceof NotFoundException) {
        throw e;
      }
      throw await this.recordFailureAndThrow(
        failureBase,
        e instanceof Error
          ? e.message
          : 'Gọi findUser theo số thất bại (kiểm tra số, session).',
        new BadRequestException(
          e instanceof Error
            ? e.message
            : 'Gọi findUser theo số thất bại (kiểm tra số, session).',
        ),
        savedMedia,
      );
    }
  }

  private async enforceMessageIntervalForGroup(args: {
    zaloAccountId: string;
    groupId: string;
    accountName: string | null;
    failureBase: Omit<LogFailedMessageInput, 'failureReason'>;
    savedMedia: SavedMediaFile[];
  }): Promise<void> {
    const intervalMinutes = await this.configsService.getMessageIntervalMinutes();
    if (intervalMinutes <= 0) {
      return;
    }

    const [zaloGroup, lastMessage] = await Promise.all([
      this.prismaService.zaloGroup.findUnique({
        where: { id: args.groupId },
        select: { groupName: true },
      }),
      this.prismaService.message.findFirst({
        where: {
          senderId: args.zaloAccountId,
          groupId: args.groupId,
          status: 'SENT',
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: { sentAt: true, createdAt: true },
      }),
    ]);

    if (!lastMessage) {
      return;
    }

    const lastAt = lastMessage.sentAt ?? lastMessage.createdAt;
    const intervalMs = intervalMinutes * 60_000;
    const elapsed = Date.now() - lastAt.getTime();
    if (elapsed >= intervalMs) {
      return;
    }

    const childName = args.accountName?.trim() || 'Tài khoản này';
    const groupLabel = zaloGroup?.groupName?.trim() || 'nhóm này';
    const remainingMs = intervalMs - elapsed;
    const waitMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
    const agoMinutes = Math.floor(elapsed / 60_000);
    const agoLabel =
      agoMinutes >= 1 ? `${agoMinutes} phút` : 'chưa đầy 1 phút';
    const intervalMessage =
      `${childName} vừa gửi tin nhắn vào group ${groupLabel} cách đây ${agoLabel}, bạn cần chờ thêm ${waitMinutes} phút nữa để gửi tin nhắn tiếp theo vào nhóm này`;
    await this.recordFailureAndThrow(
      args.failureBase,
      intervalMessage,
      new BadRequestException(intervalMessage),
      args.savedMedia,
    );
  }

  private async enforceMessageIntervalForDm(args: {
    zaloAccountId: string;
    peerPhone: string;
    accountName: string | null;
    failureBase: Omit<LogFailedMessageInput, 'failureReason'>;
    savedMedia: SavedMediaFile[];
  }): Promise<void> {
    const intervalMinutes = await this.configsService.getMessageIntervalMinutes();
    if (intervalMinutes <= 0) {
      return;
    }

    const lastMessage = await this.prismaService.message.findFirst({
      where: {
        senderId: args.zaloAccountId,
        groupId: null,
        peerPhone: args.peerPhone,
        status: 'SENT',
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { sentAt: true, createdAt: true },
    });

    if (!lastMessage) {
      return;
    }

    const lastAt = lastMessage.sentAt ?? lastMessage.createdAt;
    const intervalMs = intervalMinutes * 60_000;
    const elapsed = Date.now() - lastAt.getTime();
    if (elapsed >= intervalMs) {
      return;
    }

    const childName = args.accountName?.trim() || 'Tài khoản này';
    const remainingMs = intervalMs - elapsed;
    const waitMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
    const agoMinutes = Math.floor(elapsed / 60_000);
    const agoLabel =
      agoMinutes >= 1 ? `${agoMinutes} phút` : 'chưa đầy 1 phút';
    const intervalMessage =
      `${childName} vừa gửi tin nhắn tới số ${args.peerPhone} cách đây ${agoLabel}, bạn cần chờ thêm ${waitMinutes} phút nữa để gửi tin nhắn tiếp theo tới số này`;
    await this.recordFailureAndThrow(
      args.failureBase,
      intervalMessage,
      new BadRequestException(intervalMessage),
      args.savedMedia,
    );
  }

  private async executeSend(args: {
    sessionId: string;
    target: SendTarget;
    textPart: string;
    fileList: Express.Multer.File[];
    contentForDb: string;
    failureBase: Omit<LogFailedMessageInput, 'failureReason'>;
    senderId: string;
    zaloUid: string;
    savedMedia: SavedMediaFile[];
  }) {
    const savedMedia = args.savedMedia;
    const tempPaths = savedMediaToAttachmentPaths(savedMedia);

    try {

      const { result } = await this.zaloActionsService.sendMessage({
        sessionId: args.sessionId,
        text: args.textPart,
        threadId: args.target.threadId,
        threadType:
          args.target.kind === 'dm' ? ThreadType.User : ThreadType.Group,
        ...(tempPaths.length ? { attachmentLocalPaths: tempPaths } : {}),
      });

      const rows = await persistSentMessagesWithMedia(
        this.prismaService,
        result,
        {
          senderId: args.senderId,
          groupId:
            args.target.kind === 'group' ? args.target.groupId : null,
          peerPhone:
            args.target.kind === 'dm' ? args.target.peerPhone : null,
          zaloUid: args.zaloUid,
        },
        args.textPart,
        args.fileList,
        savedMedia,
      );

      return { result, message: rows[0], messages: rows };
    } catch (e) {
      const failureReason =
        e instanceof Error
          ? e.message
          : 'Gửi tin qua giao thức Zalo thất bại.';
      const failedId = await logFailedMessage(this.prismaService, {
        ...args.failureBase,
        failureReason,
      });
      if (failedId && savedMedia.length) {
        await linkMediaToFailedMessage(
          this.prismaService,
          failedId,
          new Date(),
          savedMedia,
        );
      }
      throw e;
    }
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
