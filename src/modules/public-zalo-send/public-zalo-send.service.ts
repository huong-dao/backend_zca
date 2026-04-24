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
import { ZaloActionsService } from '../zalo-actions/zalo-actions.service';
import { ZaloAccountsService } from '../zalo-accounts/zalo-accounts.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import { PublicZaloSendCode, type PublicZaloSendCodeValue } from './public-zalo-send-codes';
import type { PublicZaloSendBodyDto } from './dto/public-zalo-send-body.dto';

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
    private readonly zaloAccounts: ZaloAccountsService,
    private readonly zaloLoginSessions: ZaloLoginSessionsService,
    private readonly zaloActions: ZaloActionsService,
  ) {}

  async send(
    apiKeyHeader: string | undefined,
    body: PublicZaloSendBodyDto,
    files?: Express.Multer.File[],
  ): Promise<{
    code: PublicZaloSendCodeValue;
    message?: string;
    data?: Record<string, unknown>;
  }> {
    try {
      if (!apiKeyHeader?.trim()) {
        return {
          code: PublicZaloSendCode.INVALID_API_KEY,
          message: 'x-api-key header is required.',
        };
      }
      const key = await this.apiKeys.validateSecretKey(apiKeyHeader);
      if (!key) {
        return {
          code: PublicZaloSendCode.INVALID_API_KEY,
          message: 'Invalid or inactive API key.',
        };
      }

      if (body.target != null && typeof body.target !== 'string') {
        return {
          code: PublicZaloSendCode.VALIDATION,
          message: 'target must be a string.',
        };
      }
      if (body.content != null && typeof body.content !== 'string') {
        return {
          code: PublicZaloSendCode.VALIDATION,
          message: 'content must be a string.',
        };
      }
      const target = (body.target ?? '').trim();
      if (!target) {
        return {
          code: PublicZaloSendCode.TARGET_EMPTY,
          message: 'target is required.',
        };
      }
      if (target.length > 500) {
        return {
          code: PublicZaloSendCode.VALIDATION,
          message: 'target must be at most 500 characters.',
        };
      }

      const textPart = (body.content ?? '').trim();
      if (textPart.length > 20_000) {
        return {
          code: PublicZaloSendCode.VALIDATION,
          message: 'content must be at most 20000 characters.',
        };
      }
      const fileList = files?.length ? files : [];
      if (!textPart && !fileList.length) {
        return {
          code: PublicZaloSendCode.CONTENT_OR_FILES_REQUIRED,
          message: 'Provide content and/or file attachments.',
        };
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
      return {
        code: PublicZaloSendCode.INTERNAL,
        message: e instanceof Error ? e.message : 'Unexpected error.',
      };
    }
  }

  private async sendDm(
    normalizedPhone: string,
    textPart: string,
    fileList: Express.Multer.File[],
  ) {
    const pair = await this.zaloAccounts.findChildAndMasterForPublicDm();
    if (!pair) {
      return {
        code: PublicZaloSendCode.NO_CHILD_ACCOUNT,
        message: 'No master/child Zalo account pair available for DM.',
      };
    }
    const { child, master } = pair;
    if (child.status !== 'ACTIVE' || !child.zaloId) {
      return {
        code: PublicZaloSendCode.CHILD_INACTIVE_OR_NO_ZALO,
        message: 'Selected child account is not active or has no zalo_id.',
      };
    }

    let sessionId: string;
    try {
      const full = await this.zaloLoginSessions.findLatestByZaloUid(
        child.zaloId.trim(),
      );
      sessionId = full.id;
    } catch {
      return {
        code: PublicZaloSendCode.NO_ZALO_SESSION,
        message: 'No stored Zalo session for the child account; scan QR first.',
      };
    }

    try {
      await this.zaloAccounts.ensureMasterChildFriendshipForAutomation(
        master.id,
        child.id,
      );
    } catch (e) {
      return {
        code: PublicZaloSendCode.FRIEND_SETUP_FAILED,
        message:
          e instanceof Error
            ? e.message
            : 'Failed to ensure friendship with master.',
      };
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
        return {
          code: PublicZaloSendCode.FIND_USER_FAILED,
          message: 'Could not resolve Zalo user id for the phone number.',
        };
      }
    } catch (e) {
      return {
        code: PublicZaloSendCode.FIND_USER_FAILED,
        message:
          e instanceof Error ? e.message : 'findUser failed for target phone.',
      };
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
      return {
        code: PublicZaloSendCode.GROUP_NOT_FOUND,
        message: `No group with name "${groupName.trim()}".`,
      };
    }

    const master = await this.zaloAccounts.findMasterZaloAccountForGroup(
      group.id,
    );
    if (!master?.zaloId) {
      return {
        code: PublicZaloSendCode.MASTER_NOT_FOUND,
        message: 'No active master account mapped to this group.',
      };
    }

    const child = await this.zaloAccounts.findChildZaloWithMinGroupForMaster(
      master.id,
    );
    if (!child) {
      return {
        code: PublicZaloSendCode.NO_CHILD_ACCOUNT,
        message: 'No child account for this master.',
      };
    }
    if (child.status !== 'ACTIVE' || !child.zaloId) {
      return {
        code: PublicZaloSendCode.CHILD_INACTIVE_OR_NO_ZALO,
        message: 'Child account is not active or has no zalo_id.',
      };
    }
    const childPhone = child.phone?.trim();
    if (!childPhone) {
      return {
        code: PublicZaloSendCode.CHILD_INACTIVE_OR_NO_ZALO,
        message: 'Child account has no phone for group invite / findUser.',
      };
    }

    let sessionId: string;
    try {
      const full = await this.zaloLoginSessions.findLatestByZaloUid(
        child.zaloId.trim(),
      );
      sessionId = full.id;
    } catch {
      return {
        code: PublicZaloSendCode.NO_ZALO_SESSION,
        message: 'No stored Zalo session for the child account; scan QR first.',
      };
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
      return {
        code: PublicZaloSendCode.MASTER_NOT_FOUND,
        message:
          'No Zalo group_zalo_id for this group (neither child nor master mapping in zalo_account_groups).',
      };
    }

    try {
      await this.zaloAccounts.ensureMasterChildFriendshipForAutomation(
        master.id,
        child.id,
      );
    } catch (e) {
      return {
        code: PublicZaloSendCode.FRIEND_SETUP_FAILED,
        message:
          e instanceof Error
            ? e.message
            : 'Failed to ensure friendship with master.',
      };
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
      return {
        code: PublicZaloSendCode.ADD_TO_GROUP_FAILED,
        message:
          e instanceof Error
            ? e.message
            : 'Could not add child to Zalo group.',
      };
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
    message?: string;
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

      return {
        code: PublicZaloSendCode.OK,
        data: {
          result,
          messages: rows,
          message: rows[0] ?? null,
        },
      };
    } catch (e) {
      return {
        code: PublicZaloSendCode.SEND_FAILED,
        message: e instanceof Error ? e.message : 'Zalo sendMessage failed.',
      };
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
