import { randomUUID } from 'node:crypto';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import type { Express } from 'express';
import { ThreadType } from 'zca-js';
import type { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  extractIdsFromZaloSendResult,
  listZaloSendBubbleIds,
  type ZaloSendBubbleIds,
} from '../../zalo/parse-zalo-send-message-result';
import {
  isValidVietnamPhoneForPublicTarget,
  normalizeVietnamPhone,
} from '../../zalo/vietnam-phone';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { ConfigsService } from '../configs/configs.service';
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloAccountsService } from '../zalo-accounts/zalo-accounts.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import { PublicZaloSendCode, type PublicZaloSendCodeValue } from './public-zalo-send-codes';
import type { PublicZaloSendBodyDto } from './dto/public-zalo-send-body.dto';
import { formatPublicZaloUserMessage } from './public-zalo-user-messages.vi';

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

  private async sendDm(
    normalizedPhone: string,
    textPart: string,
    fileList: Express.Multer.File[],
  ) {
    const pair = await this.zaloAccounts.findChildAndMasterForPublicDm();
    if (!pair) {
      return this.msg(7, 'Chưa có cặp tài khoản master/child sẵn sàng cho kênh DM công khai.');
    }
    const { child, master } = pair;
    if (child.status !== 'ACTIVE' || !child.zaloId) {
      return this.msg(8, 'Tài khoản child tự chọn chưa active hoặc thiếu zalo_id.');
    }

    // Giới hạn tần suất: theo cùng child + cùng peerPhone lưu trong bản ghi Message (có thể gọi sớm, không cần session)
    const intervalDm = await this.checkMessageIntervalForDm({
      childId: child.id,
      childName: child.name,
      peerPhone: normalizedPhone,
    });
    if (intervalDm) {
      return this.msg(intervalDm.code, intervalDm.detail);
    }

    let sessionId: string;
    try {
      const full = await this.zaloLoginSessions.findLatestByZaloUid(
        child.zaloId.trim(),
      );
      sessionId = full.id;
    } catch {
      return this.msg(9, 'Cần đăng nhập Zalo bằng mã QR cho tài khoản child trước khi gửi.');
    }

    try {
      await this.zaloAccounts.ensureMasterChildFriendshipForAutomation(
        master.id,
        child.id,
      );
    } catch (e) {
      return this.msg(
        10,
        e instanceof Error
          ? e.message
          : 'Không đảm bảo được tình bạn master–child trên Zalo.',
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
        return this.msg(12, 'Không thấy tài khoản Zalo tương ứng với số điện thoại.');
      }
    } catch (e) {
      return this.msg(
        12,
        e instanceof Error
          ? e.message
          : 'Gọi findUser theo số thất bại (kiểm tra số, session).',
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
    });
  }

  private async sendGroup(groupName: string, textPart: string, fileList: Express.Multer.File[]) {
    const group = await this.prisma.zaloGroup.findFirst({
      where: { groupName: groupName.trim() },
      select: { id: true, groupName: true },
    });
    if (!group) {
      return this.msg(5, `Không có nhóm với tên: "${groupName.trim()}".`);
    }

    const master = await this.zaloAccounts.findMasterZaloAccountForGroup(
      group.id,
    );
    if (!master?.zaloId) {
      return this.msg(6, 'Không có tài khoản master active liên kết với nhóm này.');
    }

    const child = await this.zaloAccounts.findChildZaloWithMinGroupForMaster(
      master.id,
    );
    if (!child) {
      return this.msg(7, 'Master này chưa có tài khoản child dùng để gửi.');
    }
    if (child.status !== 'ACTIVE' || !child.zaloId) {
      return this.msg(8, 'Tài khoản child chưa active hoặc thiếu zalo_id.');
    }
    const childPhone = child.phone?.trim();
    if (!childPhone) {
      return this.msg(8, 'Tài khoản child cần có số điện thoại (mời nhóm / tìm user).');
    }

    const intervalGroup = await this.checkMessageIntervalForGroup({
      childId: child.id,
      childName: child.name,
      groupId: group.id,
      groupName: group.groupName,
    });
    if (intervalGroup) {
      return this.msg(intervalGroup.code, intervalGroup.detail);
    }

    let sessionId: string;
    try {
      const full = await this.zaloLoginSessions.findLatestByZaloUid(
        child.zaloId.trim(),
      );
      sessionId = full.id;
    } catch {
      return this.msg(9, 'Cần đăng nhập Zalo bằng mã QR cho tài khoản child trước khi gửi.');
    }

    /**
     * `POST /messages/send` dùng `group_zalo_id` theo bản ghi **child** + `groupId`.
     * Ở đây ưu tiên cùng nguồn đó; nếu chỉ master có mapping (data cũ) thì fallback master.
     * Dùng grid của master khi child đã có grid đúng ở DB khác sẽ dễ gây Zalo 114 dù gửi từ app thành công.
     */
    const [childMap, masterMap] = await Promise.all([
      this.prisma.zaloAccountGroup.findFirst({
        where: { zaloAccountId: child.id, groupId: group.id },
        select: { groupZaloId: true },
      }),
      this.prisma.zaloAccountGroup.findFirst({
        where: { zaloAccountId: master.id, groupId: group.id },
        select: { groupZaloId: true },
      }),
    ]);
    const groupZaloId = (
      childMap?.groupZaloId?.trim() ||
      masterMap?.groupZaloId?.trim() ||
      ''
    );
    if (!groupZaloId) {
      return this.msg(
        6,
        'Thiếu group_zalo_id ở zalo_account_groups (child hoặc master) cho nhóm này.',
      );
    }

    try {
      await this.zaloAccounts.ensureMasterChildFriendshipForAutomation(
        master.id,
        child.id,
      );
    } catch (e) {
      return this.msg(
        10,
        e instanceof Error
          ? e.message
          : 'Không đảm bảo được tình bạn master–child trên Zalo.',
      );
    }

    try {
      await this.zaloAccounts.addChildZaloToGroupByMasterZaloId({
        masterZaloAccountId: master.id,
        childZaloAccountId: child.id,
        childPhoneForFindUser: childPhone,
        groupZaloId,
        groupInternalId: group.id,
      });
    } catch (e) {
      return this.msg(
        11,
        e instanceof Error
          ? e.message
          : 'Không thể thêm child vào nhóm trên Zalo (master mời).',
      );
    }

    return this.runSendAndPersist({
      sessionId,
      threadId: groupZaloId,
      threadType: ThreadType.Group,
      textPart,
      fileList,
      senderId: child.id,
      groupId: group.id,
      peerPhone: null,
      zaloUid: child.zaloId.trim(),
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
  }): Promise<{
    code: PublicZaloSendCodeValue;
    message: string;
    data?: Record<string, unknown>;
  }> {
    let tempPaths: string[] = [];
    try {
      if (ctx.fileList.length) {
        tempPaths = await PublicZaloSendService.writeFilesToTemp(ctx.fileList);
      }

      const { result } = await this.zaloActions.sendMessage({
        sessionId: ctx.sessionId,
        text: ctx.textPart,
        threadId: ctx.threadId,
        threadType: ctx.threadType,
        ...(tempPaths.length ? { attachmentLocalPaths: tempPaths } : {}),
      });

      const contentForDb = PublicZaloSendService.buildContentForDb(
        ctx.textPart,
        ctx.fileList,
      );
      const rows = await this.persistMessages(
        result,
        ctx,
        contentForDb,
        ctx.textPart,
        ctx.fileList,
      );

      return this.msg(0, undefined, {
        result,
        messages: rows,
        message: rows[0] ?? null,
      });
    } catch (e) {
      return this.msg(
        13,
        e instanceof Error
          ? e.message
          : 'Zalo sendMessage thất bại (không có thông tin chi tiết).',
      );
    } finally {
      await PublicZaloSendService.unlinkTempPaths(tempPaths);
    }
  }

  private async persistMessages(
    result: unknown,
    ctx: {
      senderId: string;
      groupId: string | null;
      peerPhone: string | null;
      zaloUid: string;
    },
    contentForDb: string,
    textPart: string,
    fileList: Express.Multer.File[],
  ) {
    const bubbles = listZaloSendBubbleIds(result);
    const sentAt = new Date();
    if (bubbles.length === 0) {
      const { messageZaloId, cliMsgId } = extractIdsFromZaloSendResult(result);
      return [
        await this.prisma.message.create({
          data: {
            content: contentForDb,
            senderId: ctx.senderId,
            groupId: ctx.groupId,
            peerPhone: ctx.peerPhone,
            messageZaloId,
            cliMsgId,
            uidFrom: ctx.zaloUid,
            sentAt,
            status: 'SENT',
          },
          select: createSelect,
        }),
      ];
    }
    const contents = PublicZaloSendService.buildBubbleContents(
      textPart,
      fileList,
      bubbles,
      contentForDb,
    );
    return this.prisma.$transaction(async (tx) => {
      const out: Prisma.MessageGetPayload<{ select: typeof createSelect }>[] =
        [];
      let parentRowId: string | null = null;
      for (let idx = 0; idx < bubbles.length; idx++) {
        const bubble = bubbles[idx]!;
        const content = contents[idx] ?? contentForDb;
        const row = await tx.message.create({
          data: {
            content,
            senderId: ctx.senderId,
            groupId: ctx.groupId,
            peerPhone: ctx.peerPhone,
            messageZaloId: bubble.messageZaloId,
            cliMsgId: bubble.cliMsgId,
            uidFrom: ctx.zaloUid,
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

  private static buildContentForDb(
    textPart: string,
    files: Express.Multer.File[],
  ): string {
    if (textPart && files.length) {
      const names = files
        .map((f) => f.originalname || 'file')
        .join(', ');
      return `${textPart}\n\n(Đính kèm: ${names})`;
    }
    if (textPart) {
      return textPart;
    }
    return `Đính kèm: ${files.map((f) => f.originalname || 'file').join(', ')}`;
  }

  private static buildBubbleContents(
    textPart: string,
    files: Express.Multer.File[],
    bubbles: ZaloSendBubbleIds[],
    fallback: string,
  ): string[] {
    if (bubbles.length === 0) {
      return [fallback];
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

  private static async writeFilesToTemp(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const paths: string[] = [];
    for (const f of files) {
      const base = (f.originalname || 'file')
        .replace(/[^a-zA-Z0-9._\-\s\u00C0-\u024F]/g, '_')
        .slice(0, 120);
      const p = join(tmpdir(), `zca-pub-${randomUUID()}-${base}`);
      await writeFile(p, f.buffer);
      paths.push(p);
    }
    return paths;
  }

  private static async unlinkTempPaths(paths: string[]): Promise<void> {
    if (!paths.length) {
      return;
    }
    await Promise.all(
      paths.map((p) => unlink(p).catch(() => undefined)),
    );
  }
}
