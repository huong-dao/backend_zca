import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { once } from 'node:events';
import { isDeepStrictEqual } from 'node:util';
import type { API, MessageContent, SendMessageResponse } from 'zca-js';
import { ThreadType } from 'zca-js';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
  throwHttpForZaloOperationFailure,
  ZcaApiHelper,
} from '../../zalo';
import {
  extractIdsFromZaloSendResult,
  mergeCliMsgIdIntoZaloSendResult,
} from '../../zalo/parse-zalo-send-message-result';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import type { ZaloFindUserDto } from './dto/zalo-find-user.dto';
import type { ZaloFriendActionDto } from './dto/zalo-friend-action.dto';
import type { ZaloGetQrDto } from './dto/zalo-get-qr.dto';
import type { ZaloGroupInfoDto } from './dto/zalo-group-info.dto';
import type { ZaloSendFriendRequestDto } from './dto/zalo-send-friend-request.dto';
import type { ZaloSendMessageDto } from './dto/zalo-send-message.dto';
import type { ZaloUndoDto } from './dto/zalo-undo.dto';

const ZALO_LISTENER_CIPHER_TIMEOUT_MS = 30_000;
/** Wait for one group self message echo (TMessage) to obtain `cliMsgId` after `sendMessage`. */
const ZALO_SELF_ECHO_TIMEOUT_MS = 12_000;

@Injectable()
export class ZaloActionsService {
  private readonly logger = new Logger(ZaloActionsService.name);

  constructor(
    private readonly loginSessions: ZaloLoginSessionsService,
    private readonly prisma: PrismaService,
  ) {}

  async findUser(dto: ZaloFindUserDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const user = await zca.findUser(dto.phoneNumber.trim());
      return { user };
    });
  }

  async getQr(dto: ZaloGetQrDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const qrCodes = await zca.getQR(dto.userId);
      return { qrCodes };
    });
  }

  async sendFriendRequest(dto: ZaloSendFriendRequestDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const msg = dto.message ?? '';
      await zca.sendFriendRequest(msg, dto.userId);
      return { success: true as const };
    });
  }

  async friendRequestStatus(dto: ZaloFriendActionDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      return zca.getFriendRequestStatus(dto.friendId);
    });
  }

  async removeFriend(dto: ZaloFriendActionDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const result = await zca.removeFriend(dto.friendId);
      return { result };
    });
  }

  async getAllGroups(sessionId: string) {
    return this.withSession(sessionId, async (zca) => {
      const groups = await zca.getAllGroups();
      return { groups };
    });
  }

  async getGroupInfo(dto: ZaloGroupInfoDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const groupInfo = await zca.getGroupInfo(dto.groupId);
      return { groupInfo };
    });
  }

  /** zca-js `api.undo(payload, threadId, type)` — see `docs/Zalo_Integration.mdc`. */
  async undo(dto: ZaloUndoDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const threadType = dto.threadType ?? ThreadType.Group;
      const result = await zca.undo(
        {
          msgId: dto.msgId.trim(),
          cliMsgId: dto.cliMsgId.trim(),
        },
        dto.threadId.trim(),
        threadType,
      );
      return { result };
    });
  }

  async sendMessage(dto: ZaloSendMessageDto) {
    const row = await this.prisma.zaloLoginSession.findUnique({
      where: { id: dto.sessionId },
      select: { zaloUid: true },
    });
    const zaloUid = row?.zaloUid?.trim();
    if (zaloUid) {
      const acc = await this.prisma.zaloAccount.findFirst({
        where: { zaloId: zaloUid, isDeleted: false },
        select: { status: true },
      });
      if (acc && acc.status !== 'ACTIVE') {
        throw new BadRequestException(
          'Cannot send messages: this Zalo account is not active (status must be ACTIVE).',
        );
      }
    }
    return this.withSession(
      dto.sessionId,
      async (zca, api) => {
        const threadType = dto.threadType ?? ThreadType.Group;
        const paths = dto.attachmentLocalPaths;
        const message: string | MessageContent =
          paths?.length
            ? {
                msg: (dto.text ?? '').trim(),
                attachments: paths,
              }
            : (dto.text ?? '').trim();
        let result: SendMessageResponse = await zca.sendMessage(
          message,
          dto.threadId.trim(),
          threadType,
        );
        result = (await this.mergeCliMsgFromGroupSelfEchoIfNeeded(
          api,
          dto.threadId.trim(),
          threadType,
          result,
        )) as SendMessageResponse;
        return { result };
      },
      {
        /**
         * zca: WebSocket is required for file upload completion and for `file_done`
         * (see `uploadAttachment`). `selfListen: true` is also required for the
         * listener to emit **your own** group messages (TMessage) — otherwise
         * `cliMsgId` is only in that echo, not the HTTP `sendMessage` body.
         */
        useZaloListener: true,
      },
    );
  }

  private async withSession<T>(
    sessionId: string,
    run: (zca: ZcaApiHelper, api: API) => Promise<T>,
    options?: { useZaloListener?: boolean },
  ): Promise<T> {
    const full = await this.loginSessions.findOneFullBySessionId(sessionId);
    const prevCreds: ZaloSessionCredentialsPayload = full.credentials;

    let api: API;
    try {
      api = await createZcaApiFromCredentials(
        prevCreds,
        options?.useZaloListener ? { selfListen: true } : undefined,
      );
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Zalo login from stored session failed (sessionId=${sessionId}): ${detail}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw badRequestForZaloSessionRestoreFailure(detail);
    }

    const zca = new ZcaApiHelper(api);
    let zaloListenerStarted = false;
    try {
      if (options?.useZaloListener) {
        api.listener.start({ retryOnClose: true });
        try {
          await this.waitForZaloListenerCipherKey(api, ZALO_LISTENER_CIPHER_TIMEOUT_MS);
        } catch (err) {
          try {
            api.listener.stop();
          } catch {
            /* ignore */
          }
          throw err;
        }
        zaloListenerStarted = true;
      }
      const out = await run(zca, api);
      await this.persistRefreshedCredentials(sessionId, api, prevCreds);
      await this.loginSessions.touchBySessionId(sessionId);
      return out;
    } catch (err) {
      return throwHttpForZaloOperationFailure(err);
    } finally {
      if (zaloListenerStarted) {
        try {
          api.listener.stop();
        } catch {
          /* ignore */
        }
      }
    }
  }

  /**
   * HTTP `sendMessage` may not return a `TMessage` shape. zca’s WebSocket
   * drops self group messages when `selfListen` is false; with `selfListen: true`
   * the echo includes `data.cliMsgId` (see `TMessage` in zca types).
   */
  private async mergeCliMsgFromGroupSelfEchoIfNeeded(
    api: API,
    threadId: string,
    threadType: ThreadType,
    result: SendMessageResponse,
  ): Promise<SendMessageResponse> {
    if (threadType !== ThreadType.Group) {
      return result;
    }
    const parsed = extractIdsFromZaloSendResult(result);
    if (parsed.cliMsgId) {
      return result;
    }
    if (!parsed.messageZaloId) {
      return result;
    }
    const msgId = parsed.messageZaloId;

    return new Promise<SendMessageResponse>((resolve) => {
      const timer = setTimeout(() => {
        off();
        this.logger.debug(
          `Zalo: no self group echo for msgId=${msgId} within ${ZALO_SELF_ECHO_TIMEOUT_MS}ms; cliMsgId not merged.`,
        );
        resolve(result);
      }, ZALO_SELF_ECHO_TIMEOUT_MS);

      const handler = (message: {
        type: unknown;
        threadId?: string;
        isSelf?: boolean;
        data?: { msgId?: string | number; cliMsgId?: string | number };
      }) => {
        if (message.type !== ThreadType.Group) {
          return;
        }
        if (String(message.threadId ?? '') !== String(threadId)) {
          return;
        }
        if (!message.isSelf) {
          return;
        }
        if (String(message.data?.msgId ?? '') !== String(msgId)) {
          return;
        }
        const c = message.data?.cliMsgId;
        if (c == null || c === '') {
          return;
        }
        clearTimeout(timer);
        off();
        resolve(
          mergeCliMsgIdIntoZaloSendResult(
            result,
            String(c),
            msgId,
          ) as SendMessageResponse,
        );
      };
      const off = () => {
        try {
          api.listener.removeListener('message', handler);
        } catch {
          /* ignore */
        }
      };
      api.listener.on('message', handler);
    });
  }

  /**
   * zca-js needs the chat WebSocket so `file_done` can resolve pending file uploads
   * (see `uploadAttachment.js` + `apis/listen.js` in `zca-js`). Same as
   * `api.listener.start()` in the library README.
   */
  private async waitForZaloListenerCipherKey(
    api: API,
    timeoutMs: number,
  ): Promise<void> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new BadRequestException(
            `Kết nối WebSocket Zalo (nhận khóa mã hóa) vượt quá ${Math.round(
              timeoutMs / 1000,
            )} giây; không thể gửi file đính kèm. Hãy kiểm tra mạng, firewall, hoặc thử lại sau.`,
          ),
        );
      }, timeoutMs);
    });
    await Promise.race([once(api.listener, 'cipher_key'), timeout]);
  }

  private async persistRefreshedCredentials(
    sessionId: string,
    api: API,
    prev: ZaloSessionCredentialsPayload,
  ): Promise<void> {
    let nextCookies: Record<string, unknown>[];
    try {
      nextCookies = await snapshotSerializedCookiesFromApi(api, prev.cookies);
    } catch {
      return;
    }

    const next: ZaloSessionCredentialsPayload = {
      imei: prev.imei,
      userAgent: prev.userAgent,
      cookies: nextCookies,
    };

    if (!isDeepStrictEqual(next, prev)) {
      await this.loginSessions.updateCredentialsForSessionById(sessionId, next);
    }
  }
}
