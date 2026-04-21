import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isDeepStrictEqual } from 'node:util';
import type { API } from 'zca-js';
import { ThreadType } from 'zca-js';
import {
  badRequestForZaloSessionRestoreFailure,
  createZcaApiFromCredentials,
  ZcaApiHelper,
} from '../../zalo';
import { snapshotSerializedCookiesFromApi } from '../../zalo/zca-cookie-snapshot';
import type { ZaloSessionCredentialsPayload } from '../zalo-login-sessions/zalo-login-sessions.service';
import { ZaloLoginSessionsService } from '../zalo-login-sessions/zalo-login-sessions.service';
import type { ZaloFindUserDto } from './dto/zalo-find-user.dto';
import type { ZaloFriendActionDto } from './dto/zalo-friend-action.dto';
import type { ZaloGetQrDto } from './dto/zalo-get-qr.dto';
import type { ZaloGroupInfoDto } from './dto/zalo-group-info.dto';
import type { ZaloSendFriendRequestDto } from './dto/zalo-send-friend-request.dto';
import type { ZaloSendMessageDto } from './dto/zalo-send-message.dto';

@Injectable()
export class ZaloActionsService {
  private readonly logger = new Logger(ZaloActionsService.name);

  constructor(private readonly loginSessions: ZaloLoginSessionsService) {}

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

  async sendMessage(dto: ZaloSendMessageDto) {
    return this.withSession(dto.sessionId, async (zca) => {
      const threadType = dto.threadType ?? ThreadType.Group;
      const result = await zca.sendMessage(
        dto.text.trim(),
        dto.threadId.trim(),
        threadType,
      );
      return { result };
    });
  }

  private async withSession<T>(
    sessionId: string,
    run: (zca: ZcaApiHelper, api: API) => Promise<T>,
  ): Promise<T> {
    const full = await this.loginSessions.findOneFullBySessionId(sessionId);
    const prevCreds: ZaloSessionCredentialsPayload = full.credentials;

    let api: API;
    try {
      api = await createZcaApiFromCredentials(prevCreds);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Zalo login from stored session failed (sessionId=${sessionId}): ${detail}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw badRequestForZaloSessionRestoreFailure(detail);
    }

    const zca = new ZcaApiHelper(api);
    try {
      const out = await run(zca, api);
      await this.persistRefreshedCredentials(sessionId, api, prevCreds);
      await this.loginSessions.touchBySessionId(sessionId);
      return out;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      const message = err instanceof Error ? err.message : 'Zalo API error.';
      throw new InternalServerErrorException(message);
    }
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
