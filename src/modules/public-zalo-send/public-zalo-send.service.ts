import { Injectable, Logger } from '@nestjs/common';
import type { Express } from 'express';
import { ThreadType } from 'zca-js';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  buildAttachmentContentForDb,
} from '../../common/utils/attachment-files.util';
import {
  saveMulterFilesToStorage,
  savedMediaToAttachmentPaths,
  type SavedMediaFile,
} from '../../common/utils/media-storage.util';
import {
  isValidVietnamPhoneForPublicTarget,
  normalizeVietnamPhone,
} from '../../zalo/vietnam-phone';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { ChildGroupGridResolveService } from '../child-group-grid-resolve/child-group-grid-resolve.service';
import { ConfigsService } from '../configs/configs.service';
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloAccountsService } from '../zalo-accounts/zalo-accounts.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import { PublicZaloSendCode, type PublicZaloSendCodeValue } from './public-zalo-send-codes';
import type { PublicZaloSendBodyDto } from './dto/public-zalo-send-body.dto';
import { formatPublicZaloUserMessage } from './public-zalo-user-messages.vi';
import {
  logFailedMessage,
  type LogFailedMessageInput,
} from '../messages/log-failed-message.util';
import {
  linkMediaToFailedMessage,
  persistSentMessagesWithMedia,
} from '../messages/persist-sent-messages.util';

@Injectable()
export class PublicZaloSendService {
  private readonly logger = new Logger(PublicZaloSendService.name);

  constructor(
    private readonly apiKeys: ApiKeysService,
    private readonly prisma: PrismaService,
    private readonly configs: ConfigsService,
    private readonly zaloAccounts: ZaloAccountsService,
    private readonly zaloLoginSessions: ZaloLoginSessionsService,
    private readonly zaloActions: ZaloActionsService,
    private readonly childGroupGridResolve: ChildGroupGridResolveService,
  ) {}

  private msg(
    code: PublicZaloSendCodeValue,
    detail?: string,
    data?: Record<string, unknown>,
  ): {
    code: PublicZaloSendCodeValue;
    message: string;
    data?: Record<string, unknown>;
  } {
    return {
      code,
      message: formatPublicZaloUserMessage(code, detail),
      ...(data !== undefined ? { data } : {}),
    };
  }

  private async failWithLog(
    base: Omit<LogFailedMessageInput, 'failureReason'>,
    code: PublicZaloSendCodeValue,
    detail?: string,
    savedMedia: SavedMediaFile[] = [],
  ): Promise<{
    code: PublicZaloSendCodeValue;
    message: string;
    data?: Record<string, unknown>;
  }> {
    const response = this.msg(code, detail);
    const failedId = await logFailedMessage(this.prisma, {
      ...base,
      failureReason: response.message,
    });
    if (failedId && savedMedia.length) {
      await linkMediaToFailedMessage(
        this.prisma,
        failedId,
        new Date(),
        savedMedia,
      );
    }
    return response;
  }

  async send(
    apiKeyHeader: string | undefined,
    body: PublicZaloSendBodyDto,
    files?: Express.Multer.File[],
  ): Promise<{
    code: PublicZaloSendCodeValue;
    message: string;
    data?: Record<string, unknown>;
  }> {
    try {
      if (!apiKeyHeader?.trim()) {
        return this.msg(1, 'Thiếu header x-api-key.');
      }
      const key = await this.apiKeys.validateSecretKey(apiKeyHeader);
      if (!key) {
        return this.msg(1, 'API key không hợp lệ hoặc đã tắt (inactive).');
      }

      if (body.target != null && typeof body.target !== 'string') {
        return this.msg(2, 'Trường target phải là chuỗi.');
      }
      if (body.content != null && typeof body.content !== 'string') {
        return this.msg(2, 'Trường content phải là chuỗi.');
      }
      const target = (body.target ?? '').trim();
      if (!target) {
        return this.msg(3, 'Cần cung cấp target (số VN hoặc tên nhóm).');
      }
      if (target.length > 500) {
        return this.msg(2, 'target dài tối đa 500 ký tự.');
      }

      const textPart = (body.content ?? '').trim();
      if (textPart.length > 20_000) {
        return this.msg(2, 'content dài tối đa 20.000 ký tự.');
      }
      const fileList = files?.length ? files : [];
      if (!textPart && !fileList.length) {
        return this.msg(4, 'Cần ít nhất nội dung chữ (content) hoặc tệp đính kèm (files).');
      }

      const isPhone = isValidVietnamPhoneForPublicTarget(target);
      if (isPhone) {
        return await this.sendDm(
          normalizeVietnamPhone(target),
          textPart,
          fileList,
        );
      }
      return await this.sendGroup(target, textPart, fileList);
    } catch (e) {
      this.logger.error(
        e instanceof Error ? e.stack : String(e),
        'public zalo send',
      );
      return this.msg(
        99,
        e instanceof Error ? e.message : 'Lỗi ngoại lệ không xác định.',
      );
    }
  }

  private async pickChildWithSession<
    T extends {
      id: string;
      zaloId: string | null;
      phone: string | null;
      name: string | null;
      status: string;
    },
  >(
    candidates: T[],
  ): Promise<{ child: T; sessionId: string } | null> {
    for (const child of candidates) {
      if (child.status !== 'ACTIVE' || !child.zaloId?.trim()) {
        continue;
      }
      const session = await this.zaloLoginSessions.tryFindLatestByZaloUid(
        child.zaloId.trim(),
      );
      if (session) {
        return { child, sessionId: session.id };
      }
    }
    return null;
  }

  private async sendDm(
    normalizedPhone: string,
    textPart: string,
    fileList: Express.Multer.File[],
  ) {
    const contentForDb = buildAttachmentContentForDb(textPart, fileList);
    const savedMedia = fileList.length
      ? await saveMulterFilesToStorage(fileList)
      : [];
    const pair = await this.zaloAccounts.findChildAndMasterForPublicDm();
    if (!pair) {
      return this.msg(7, 'Chưa có cặp tài khoản master/child sẵn sàng cho kênh DM công khai.');
    }
    const { master } = pair;
    const dmCandidates = await this.zaloAccounts.listChildZaloWithMinGroupForMaster(
      master.id,
    );
    const picked = await this.pickChildWithSession(dmCandidates);
    if (!picked) {
      if (dmCandidates.length === 0) {
        return this.msg(7, 'Chưa có cặp tài khoản master/child sẵn sàng cho kênh DM công khai.');
      }
      const failureBaseNoSession: Omit<LogFailedMessageInput, 'failureReason'> = {
        senderId: dmCandidates[0]!.id,
        groupId: null,
        peerPhone: normalizedPhone,
        content: contentForDb,
        uidFrom: dmCandidates[0]!.zaloId?.trim() || null,
      };
      return this.failWithLog(
        failureBaseNoSession,
        9,
        'Không có tài khoản child nào đang đăng nhập Zalo (QR) để gửi DM.',
        savedMedia,
      );
    }
    const { child, sessionId } = picked;
    const failureBase: Omit<LogFailedMessageInput, 'failureReason'> = {
      senderId: child.id,
      groupId: null,
      peerPhone: normalizedPhone,
      content: contentForDb,
      uidFrom: child.zaloId?.trim() || null,
    };
    if (child.status !== 'ACTIVE' || !child.zaloId) {
      return this.failWithLog(
        failureBase,
        8,
        'Tài khoản child tự chọn chưa active hoặc thiếu zalo_id.',
        savedMedia,
      );
    }

    // Giới hạn tần suất: theo cùng child + cùng peerPhone lưu trong bản ghi Message (có thể gọi sớm, không cần session)
    const intervalDm = await this.checkMessageIntervalForDm({
      childId: child.id,
      childName: child.name,
      peerPhone: normalizedPhone,
    });
    if (intervalDm) {
      return this.failWithLog(
        failureBase,
        intervalDm.code,
        intervalDm.detail,
        savedMedia,
      );
    }

    try {
      await this.zaloAccounts.ensureMasterChildFriendshipForAutomation(
        master.id,
        child.id,
      );
    } catch (e) {
      return this.failWithLog(
        failureBase,
        10,
        e instanceof Error
          ? e.message
          : 'Không đảm bảo được tình bạn master–child trên Zalo.',
        savedMedia,
      );
    }

    let peerUid: string;
    try {
      const { user } = await this.zaloActions.findUser({
        sessionId,
        phoneNumber: normalizedPhone,
      });
      const u = user as { uid?: string } | undefined;
      const raw = u?.uid;
      peerUid = raw != null ? String(raw).trim() : '';
      if (!peerUid) {
        return this.failWithLog(
          failureBase,
          12,
          'Không thấy tài khoản Zalo tương ứng với số điện thoại.',
          savedMedia,
        );
      }
    } catch (e) {
      return this.failWithLog(
        failureBase,
        12,
        e instanceof Error
          ? e.message
          : 'Gọi findUser theo số thất bại (kiểm tra số, session).',
        savedMedia,
      );
    }

    return this.runSendAndPersist({
      sessionId,
      threadId: peerUid,
      threadType: ThreadType.User,
      textPart,
      fileList,
      senderId: child.id,
      groupId: null,
      peerPhone: normalizedPhone,
      zaloUid: child.zaloId.trim(),
      contentForDb,
      savedMedia,
    });
  }

  private async sendGroup(groupName: string, textPart: string, fileList: Express.Multer.File[]) {
    const contentForDb = buildAttachmentContentForDb(textPart, fileList);
    const savedMedia = fileList.length
      ? await saveMulterFilesToStorage(fileList)
      : [];
    const needle = groupName.trim();
    const group = await this.prisma.zaloGroup.findFirst({
      where: {
        OR: [
          { groupName: { equals: needle, mode: 'insensitive' } },
          { originName: { equals: needle, mode: 'insensitive' } },
        ],
      },
      select: { id: true, groupName: true },
      orderBy: { updatedAt: 'desc' },
    });
    if (!group) {
      return this.msg(5, `Không có nhóm với tên (groupName/originName): "${needle}".`);
    }

    const master = await this.zaloAccounts.findMasterZaloAccountForGroup(
      group.id,
    );
    if (!master?.zaloId) {
      return this.msg(6, 'Không có tài khoản master active liên kết với nhóm này.');
    }

    const inGroupCandidates =
      await this.zaloAccounts.listChildZaloInGroupForMaster(master.id, group.id);
    let pickedFromFallback: { child: (typeof inGroupCandidates)[number]; sessionId: string } | null =
      null;
    let childFromGroup = false;

    if (inGroupCandidates.length > 0) {
      pickedFromFallback = await this.pickChildWithSession(inGroupCandidates);
      childFromGroup = pickedFromFallback != null;
      if (!pickedFromFallback) {
        const allMasterChildren =
          await this.zaloAccounts.listChildZaloWithMinGroupForMaster(master.id);
        const inGroupIds = new Set(inGroupCandidates.map((c) => c.id));
        const outsideGroupCandidates = allMasterChildren.filter(
          (c) => !inGroupIds.has(c.id),
        );
        pickedFromFallback =
          await this.pickChildWithSession(outsideGroupCandidates);
        childFromGroup = false;
        if (!pickedFromFallback) {
          const fallbackSender = inGroupCandidates[0]!;
          return this.failWithLog(
            {
              senderId: fallbackSender.id,
              groupId: group.id,
              peerPhone: null,
              content: contentForDb,
              uidFrom: fallbackSender.zaloId?.trim() || null,
            },
            9,
            'Không có child nào đang đăng nhập Zalo (QR) để gửi; child trong nhóm đều offline và không còn child online khác để mời vào nhóm.',
            savedMedia,
          );
        }
      }
    } else {
      const fallbackCandidates =
        await this.zaloAccounts.listChildZaloWithMinGroupForMaster(master.id);
      pickedFromFallback = await this.pickChildWithSession(fallbackCandidates);
      if (!pickedFromFallback) {
        if (fallbackCandidates.length === 0) {
          return this.msg(7, 'Master này chưa có tài khoản child dùng để gửi.');
        }
        const fallbackSender = fallbackCandidates[0]!;
        return this.failWithLog(
          {
            senderId: fallbackSender.id,
            groupId: group.id,
            peerPhone: null,
            content: contentForDb,
            uidFrom: fallbackSender.zaloId?.trim() || null,
          },
          9,
          'Cần đăng nhập Zalo bằng mã QR cho tài khoản child trước khi gửi.',
          savedMedia,
        );
      }
    }
    const { child, sessionId } = pickedFromFallback;
    const failureBase: Omit<LogFailedMessageInput, 'failureReason'> = {
      senderId: child.id,
      groupId: group.id,
      peerPhone: null,
      content: contentForDb,
      uidFrom: child.zaloId?.trim() || null,
    };
    if (child.status !== 'ACTIVE' || !child.zaloId) {
      return this.failWithLog(
        failureBase,
        8,
        'Tài khoản child chưa active hoặc thiếu zalo_id.',
        savedMedia,
      );
    }
    const childPhone = child.phone?.trim();
    if (!childPhone && !childFromGroup) {
      return this.failWithLog(
        failureBase,
        8,
        'Tài khoản child cần có số điện thoại (mời nhóm / tìm user).',
        savedMedia,
      );
    }

    const intervalGroup = await this.checkMessageIntervalForGroup({
      childId: child.id,
      childName: child.name,
      groupId: group.id,
      groupName: group.groupName,
    });
    if (intervalGroup) {
      return this.failWithLog(
        failureBase,
        intervalGroup.code,
        intervalGroup.detail,
        savedMedia,
      );
    }

    const [childMapRow, masterMapRow] = await Promise.all([
      this.prisma.zaloAccountGroup.findFirst({
        where: { zaloAccountId: child.id, groupId: group.id },
        select: { groupZaloId: true },
      }),
      this.prisma.zaloAccountGroup.findFirst({
        where: { zaloAccountId: master.id, groupId: group.id },
        select: { groupZaloId: true },
      }),
    ]);

    try {
      await this.zaloAccounts.ensureMasterChildFriendshipForAutomation(
        master.id,
        child.id,
      );
    } catch (e) {
      return this.failWithLog(
        failureBase,
        10,
        e instanceof Error
          ? e.message
          : 'Không đảm bảo được tình bạn master–child trên Zalo.',
        savedMedia,
      );
    }

    const childGridExisting = childMapRow?.groupZaloId?.trim() ?? '';
    let groupZaloIdForSend: string;
    if (childGridExisting) {
      groupZaloIdForSend = childGridExisting;
    } else {
      const masterGroupZaloId = masterMapRow?.groupZaloId?.trim() ?? '';
      if (!masterGroupZaloId) {
        return this.failWithLog(
          failureBase,
          6,
          'Thiếu group_zalo_id ở master trong zalo_account_groups — cần để mời child vào nhóm trên Zalo.',
          savedMedia,
        );
      }

      groupZaloIdForSend =
        (await this.childGroupGridResolve.tryResolveChildGroupZaloIdAfterMasterInvite(
          {
            zaloAccountId: child.id,
            groupId: group.id,
            sessionId,
          },
        )) ?? '';

      if (!groupZaloIdForSend) {
        try {
          await this.zaloAccounts.addChildZaloToGroupByMasterZaloId({
            masterZaloAccountId: master.id,
            childZaloAccountId: child.id,
            childPhoneForFindUser: childPhone ?? '',
            groupZaloId: masterGroupZaloId,
            groupInternalId: group.id,
          });
        } catch (e) {
          return this.failWithLog(
            failureBase,
            11,
            e instanceof Error
              ? e.message
              : 'Không thể thêm child vào nhóm trên Zalo (master mời).',
            savedMedia,
          );
        }

        try {
          groupZaloIdForSend =
            await this.childGroupGridResolve.resolveChildGroupZaloIdAfterMasterInvite(
              {
                zaloAccountId: child.id,
                groupId: group.id,
                sessionId,
              },
            );
        } catch (e) {
          return this.failWithLog(
            failureBase,
            11,
            e instanceof Error
              ? e.message
              : 'Không map được group_zalo_id phía child sau khi mời vào nhóm.',
            savedMedia,
          );
        }
      }
    }

    return this.runSendAndPersist({
      sessionId,
      threadId: groupZaloIdForSend,
      threadType: ThreadType.Group,
      textPart,
      fileList,
      senderId: child.id,
      groupId: group.id,
      peerPhone: null,
      zaloUid: child.zaloId.trim(),
      contentForDb,
      savedMedia,
    });
  }

  private async runSendAndPersist(ctx: {
    sessionId: string;
    threadId: string;
    threadType: ThreadType;
    textPart: string;
    fileList: Express.Multer.File[];
    senderId: string;
    groupId: string | null;
    peerPhone: string | null;
    zaloUid: string;
    contentForDb: string;
    savedMedia: SavedMediaFile[];
  }): Promise<{
    code: PublicZaloSendCodeValue;
    message: string;
    data?: Record<string, unknown>;
  }> {
    let savedMedia = ctx.savedMedia;
    const tempPaths = savedMediaToAttachmentPaths(savedMedia);
    try {
      const { result } = await this.zaloActions.sendMessage({
        sessionId: ctx.sessionId,
        text: ctx.textPart,
        threadId: ctx.threadId,
        threadType: ctx.threadType,
        ...(tempPaths.length ? { attachmentLocalPaths: tempPaths } : {}),
      });

      const rows = await persistSentMessagesWithMedia(
        this.prisma,
        result,
        {
          senderId: ctx.senderId,
          groupId: ctx.groupId,
          peerPhone: ctx.peerPhone,
          zaloUid: ctx.zaloUid,
        },
        ctx.textPart,
        ctx.fileList,
        savedMedia,
      );

      return this.msg(0, undefined, {
        result,
        messages: rows,
        message: rows[0] ?? null,
      });
    } catch (e) {
      let detail =
        e instanceof Error
          ? e.message
          : 'Zalo sendMessage thất bại (không có thông tin chi tiết).';
      if (
        typeof detail === 'string' &&
        (/\b161\b/.test(detail) ||
          detail.includes('Nhóm này không tồn tại'))
      ) {
        detail = `${detail} Kiểm tra tài khoản child vẫn trong nhóm trên Zalo; nếu cần, đồng bộ lại nhóm (child group scan) hoặc cập nhật \`group_zalo_id\` trong \`zalo_account_groups\`.`;
      }
      return this.failWithLog(
        {
          senderId: ctx.senderId,
          groupId: ctx.groupId,
          peerPhone: ctx.peerPhone,
          content: ctx.contentForDb,
          uidFrom: ctx.zaloUid,
        },
        13,
        detail,
        savedMedia,
      );
    }
  }

  /**
   * Giống `MessagesService.send`: đọc `configurations.message_interval` (phút). Nếu &gt; 0
   * và đã có tin gần đây cùng child + nhóm thì chặn (thứ tự `created_at` desc, `id` desc).
   */
  private async checkMessageIntervalForGroup(args: {
    childId: string;
    childName: string | null;
    groupId: string;
    groupName: string | null;
  }): Promise<
    | { code: typeof PublicZaloSendCode.VALIDATION; detail: string }
    | { code: typeof PublicZaloSendCode.MESSAGE_INTERVAL_NOT_ELAPSED; detail: string }
    | null
  > {
    let intervalMinutes: number;
    try {
      intervalMinutes = await this.configs.getMessageIntervalMinutes();
    } catch (e) {
      return {
        code: PublicZaloSendCode.VALIDATION,
        detail:
          e instanceof Error
            ? e.message
            : 'Cấu hình message_interval thiếu hoặc không hợp lệ.',
      };
    }
    if (intervalMinutes <= 0) {
      return null;
    }
    const lastMessage = await this.prisma.message.findFirst({
      where: {
        senderId: args.childId,
        groupId: args.groupId,
        status: 'SENT',
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { sentAt: true, createdAt: true },
    });
    if (!lastMessage) {
      return null;
    }
    const lastAt = lastMessage.sentAt ?? lastMessage.createdAt;
    const intervalMs = intervalMinutes * 60_000;
    const elapsed = Date.now() - lastAt.getTime();
    if (elapsed >= intervalMs) {
      return null;
    }
    const childName = args.childName?.trim() || 'Tài khoản này';
    const groupLabel = args.groupName?.trim() || 'nhóm này';
    const remainingMs = intervalMs - elapsed;
    const waitMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
    const agoMinutes = Math.floor(elapsed / 60_000);
    const agoLabel =
      agoMinutes >= 1 ? `${agoMinutes} phút` : 'chưa đầy 1 phút';
    return {
      code: PublicZaloSendCode.MESSAGE_INTERVAL_NOT_ELAPSED,
      detail: `${childName} vừa gửi tin nhắn vào group ${groupLabel} cách đây ${agoLabel}, bạn cần chờ thêm ${waitMinutes} phút nữa để gửi tin nhắn tiếp theo vào nhóm này`,
    };
  }

  /** Cùng `message_interval`, áp dụng cho DM: cùng child + `peer_phone` (tin mới nhất). */
  private async checkMessageIntervalForDm(args: {
    childId: string;
    childName: string | null;
    peerPhone: string;
  }): Promise<
    | { code: typeof PublicZaloSendCode.VALIDATION; detail: string }
    | { code: typeof PublicZaloSendCode.MESSAGE_INTERVAL_NOT_ELAPSED; detail: string }
    | null
  > {
    let intervalMinutes: number;
    try {
      intervalMinutes = await this.configs.getMessageIntervalMinutes();
    } catch (e) {
      return {
        code: PublicZaloSendCode.VALIDATION,
        detail:
          e instanceof Error
            ? e.message
            : 'Cấu hình message_interval thiếu hoặc không hợp lệ.',
      };
    }
    if (intervalMinutes <= 0) {
      return null;
    }
    const lastMessage = await this.prisma.message.findFirst({
      where: {
        senderId: args.childId,
        groupId: null,
        peerPhone: args.peerPhone,
        status: 'SENT',
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { sentAt: true, createdAt: true },
    });
    if (!lastMessage) {
      return null;
    }
    const lastAt = lastMessage.sentAt ?? lastMessage.createdAt;
    const intervalMs = intervalMinutes * 60_000;
    const elapsed = Date.now() - lastAt.getTime();
    if (elapsed >= intervalMs) {
      return null;
    }
    const childName = args.childName?.trim() || 'Tài khoản này';
    const remainingMs = intervalMs - elapsed;
    const waitMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
    const agoMinutes = Math.floor(elapsed / 60_000);
    const agoLabel =
      agoMinutes >= 1 ? `${agoMinutes} phút` : 'chưa đầy 1 phút';
    return {
      code: PublicZaloSendCode.MESSAGE_INTERVAL_NOT_ELAPSED,
      detail: `${childName} vừa gửi tin nhắn tới số ${args.peerPhone} cách đây ${agoLabel}, bạn cần chờ thêm ${waitMinutes} phút nữa để gửi tin nhắn tiếp theo tới số này`,
    };
  }
}
