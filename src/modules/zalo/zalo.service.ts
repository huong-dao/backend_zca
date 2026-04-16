import {
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  type ZaloDeleteMessageDestination,
  ZaloLoginQrEventType,
  ZaloThreadType,
  type ZaloApi,
  type ZaloClient,
  type ZaloGetAllGroupsResponse,
  type ZaloGroupInfo,
  type ZaloGroupInfoResponse,
  type ZaloLoginQrCallbackEvent,
  type ZaloMessageContent,
  type ZaloUserInfoResponse,
  type ZcaJsModule,
  type ZaloCredentials,
  type ZaloSendMessageWithMetaResponse,
  type ZaloUndoPayload,
} from './zalo.types';
import { ZaloSessionCryptoService } from './zalo-session-crypto.service';

type LoginSessionStatus =
  | 'STARTING'
  | 'QR_GENERATED'
  | 'QR_SCANNED'
  | 'READY'
  | 'CONFIRMED'
  | 'EXPIRED'
  | 'DECLINED'
  | 'ERROR';

type PendingLoginSession = {
  sessionId: string;
  masterAccountId: string;
  phone: string;
  status: LoginSessionStatus;
  qrCode?: string;
  errorMessage?: string;
  api?: ZaloApi;
  zaloId?: string;
  displayName?: string;
  credentials?: ZaloCredentials;
  loginPromise?: Promise<void>;
  persistedAccountId?: string;
};

type ActiveSession = {
  accountId: string;
  zaloId: string;
  api: ZaloApi;
};

@Injectable()
export class ZaloService implements OnModuleInit {
  private readonly logger = new Logger(ZaloService.name);
  private readonly pendingLoginSessions = new Map<
    string,
    PendingLoginSession
  >();
  private readonly activeSessionsByAccountId = new Map<string, ActiveSession>();
  private readonly activeSessionsByZaloId = new Map<string, ActiveSession>();
  private restoreSessionsPromise?: Promise<void>;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly zaloSessionCryptoService: ZaloSessionCryptoService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.restorePersistedSessions();
  }

  private async loadZcaJsModule(): Promise<ZcaJsModule> {
    return (await import('zca-js')) as unknown as ZcaJsModule;
  }

  private async createZaloClient(): Promise<ZaloClient> {
    const { Zalo } = await this.loadZcaJsModule();

    return new Zalo({
      selfListen: false,
      checkUpdate: true,
      logging: false,
    });
  }

  private async loginWithCredentials(
    credentials: ZaloCredentials,
  ): Promise<ZaloApi> {
    const zalo = await this.createZaloClient();
    return zalo.login(credentials);
  }

  async loginQR(masterAccountId: string, phone: string) {
    const sessionId = randomUUID();
    const session: PendingLoginSession = {
      sessionId,
      masterAccountId,
      phone,
      status: 'STARTING',
    };

    this.pendingLoginSessions.set(sessionId, session);

    const qrCode = await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new GatewayTimeoutException(
            'Unable to generate Zalo QR code in time.',
          ),
        );
      }, 15000);

      void this.createZaloClient()
        .then((zalo) => {
          session.loginPromise = zalo
            .loginQR({}, (event: ZaloLoginQrCallbackEvent) => {
              switch (event.type) {
                case ZaloLoginQrEventType.QRCodeGenerated: {
                  session.status = 'QR_GENERATED';
                  session.qrCode = event.data.image;
                  clearTimeout(timeout);
                  resolve(event.data.image);
                  break;
                }
                case ZaloLoginQrEventType.QRCodeScanned: {
                  session.status = 'QR_SCANNED';
                  break;
                }
                case ZaloLoginQrEventType.QRCodeExpired: {
                  session.status = 'EXPIRED';
                  session.errorMessage = 'QR code expired.';
                  break;
                }
                case ZaloLoginQrEventType.QRCodeDeclined: {
                  session.status = 'DECLINED';
                  session.errorMessage = 'QR code was declined by the user.';
                  break;
                }
                case ZaloLoginQrEventType.GotLoginInfo: {
                  session.credentials = {
                    cookie: event.data.cookie,
                    imei: event.data.imei,
                    userAgent: event.data.userAgent,
                  };
                  break;
                }
              }
            })
            .then(async (api: ZaloApi) => {
              const zaloId = api.getOwnId();
              const userInfo = await api.getUserInfo(zaloId);
              const profile = this.extractProfile(userInfo, zaloId);

              session.api = api;
              session.zaloId = zaloId;
              session.displayName =
                profile.displayName || profile.zaloName || zaloId;
              session.status = 'READY';
            })
            .catch((error: unknown) => {
              if (
                session.status !== 'EXPIRED' &&
                session.status !== 'DECLINED'
              ) {
                session.status = 'ERROR';
              }

              session.errorMessage = this.normalizeError(error);
              clearTimeout(timeout);
            });
        })
        .catch((error: unknown) => {
          session.status = 'ERROR';
          session.errorMessage = this.normalizeError(error);
          clearTimeout(timeout);
          reject(new Error(this.normalizeError(error)));
        });
    });

    return {
      sessionId,
      qrCode,
    };
  }

  async confirmLogin(sessionId: string) {
    const session = this.pendingLoginSessions.get(sessionId);

    if (!session) {
      throw new NotFoundException('Zalo login session not found.');
    }

    if (
      session.status === 'STARTING' ||
      session.status === 'QR_GENERATED' ||
      session.status === 'QR_SCANNED'
    ) {
      return {
        sessionId: session.sessionId,
        status: session.status,
        qrCode: session.qrCode ?? null,
      };
    }

    if (session.status === 'EXPIRED' || session.status === 'DECLINED') {
      throw new BadRequestException(
        session.errorMessage ?? 'Zalo login failed.',
      );
    }

    if (session.status === 'ERROR' || !session.api || !session.zaloId) {
      throw new InternalServerErrorException(
        session.errorMessage ?? 'Unable to complete Zalo login.',
      );
    }

    if (!session.credentials) {
      throw new InternalServerErrorException(
        'Missing Zalo credentials for persisted session.',
      );
    }

    if (session.persistedAccountId) {
      if (!this.activeSessionsByAccountId.has(session.persistedAccountId)) {
        this.registerActiveSession(
          session.persistedAccountId,
          session.zaloId,
          session.api,
        );
      }

      const account = await this.prismaService.zaloAccount.findUnique({
        where: { id: session.persistedAccountId },
        select: {
          id: true,
          zaloId: true,
          phone: true,
          name: true,
          isMaster: true,
          masterId: true,
          groupCount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        sessionId: session.sessionId,
        status: session.status,
        account,
      };
    }

    const account = await this.prismaService.zaloAccount.upsert({
      where: {
        zaloId: session.zaloId,
      },
      update: {
        phone: session.phone,
        name: session.displayName ?? session.zaloId,
        masterId: session.masterAccountId,
        isMaster: false,
      },
      create: {
        zaloId: session.zaloId,
        phone: session.phone,
        name: session.displayName ?? session.zaloId,
        masterId: session.masterAccountId,
        isMaster: false,
      },
      select: {
        id: true,
        zaloId: true,
        phone: true,
        name: true,
        isMaster: true,
        masterId: true,
        groupCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.persistSession(account.id, session.credentials);
    this.registerActiveSession(account.id, session.zaloId, session.api);

    const friendFlow = await this.runFriendFlow(
      session.masterAccountId,
      account.id,
      session.zaloId,
    );

    session.persistedAccountId = account.id;
    session.status = 'CONFIRMED';

    return {
      sessionId: session.sessionId,
      status: session.status,
      account,
      friendFlow,
    };
  }

  async syncAccountsFromGroups() {
    const api = await this.getAnyAvailableApi();
    const groups: ZaloGetAllGroupsResponse = await api.getAllGroups();
    const groupIds = Object.keys(groups.gridVerMap);

    if (groupIds.length === 0) {
      return [];
    }

    const groupInfoResponse: ZaloGroupInfoResponse =
      await api.getGroupInfo(groupIds);
    const accounts = new Map<
      string,
      {
        zaloId: string;
        name: string;
        groupCount: number;
        groups: Array<{ groupId: string; groupName: string }>;
      }
    >();

    for (const [groupId, groupInfo] of Object.entries(
      groupInfoResponse.gridInfoMap,
    )) {
      for (const member of groupInfo.currentMems) {
        const existing = accounts.get(member.id);

        if (existing) {
          existing.groupCount += 1;
          existing.groups.push({
            groupId,
            groupName: groupInfo.name,
          });
          continue;
        }

        accounts.set(member.id, {
          zaloId: member.id,
          name: member.dName || member.zaloName || member.id,
          groupCount: 1,
          groups: [
            {
              groupId,
              groupName: groupInfo.name,
            },
          ],
        });
      }
    }

    return Array.from(accounts.values()).sort(
      (left, right) => left.groupCount - right.groupCount,
    );
  }

  async findGroupByName(groupName: string) {
    const trimmedGroupName = groupName.trim();
    const api = await this.getAnyAvailableApi();
    const groups: ZaloGetAllGroupsResponse = await api.getAllGroups();
    const groupIds = Object.keys(groups.gridVerMap);

    if (groupIds.length === 0) {
      throw new NotFoundException(
        'No Zalo groups found in the active session.',
      );
    }

    const groupInfoResponse: ZaloGroupInfoResponse =
      await api.getGroupInfo(groupIds);

    const matchedEntry = Object.entries(groupInfoResponse.gridInfoMap).find(
      ([, groupInfo]: [string, ZaloGroupInfo]) =>
        groupInfo.name.trim().toLowerCase() === trimmedGroupName.toLowerCase(),
    );

    if (!matchedEntry) {
      throw new NotFoundException(
        `Zalo group "${trimmedGroupName}" was not found in the active session.`,
      );
    }

    const [groupId, groupInfo] = matchedEntry;

    return {
      groupId,
      groupInfo,
    };
  }

  async getAllGroups() {
    const api = await this.getAnyAvailableApi();
    return api.getAllGroups();
  }

  async getGroupInfo(groupId: string | string[]) {
    const api = await this.getAnyAvailableApi();
    return api.getGroupInfo(groupId);
  }

  async addUserToGroup(
    inviterAccountId: string,
    memberZaloId: string,
    groupZaloId: string,
  ) {
    const result = await this.withAccountSession(inviterAccountId, (api) =>
      api.addUserToGroup(memberZaloId, groupZaloId),
    );

    if (result.errorMembers.length > 0) {
      throw new BadRequestException(
        `Failed to add member(s) to group: ${result.errorMembers.join(', ')}`,
      );
    }

    return result;
  }

  async sendMessage(
    senderAccountId: string,
    message: string | ZaloMessageContent,
    threadId: string,
    type: ZaloThreadType = ZaloThreadType.Group,
  ) {
    const cliMsgId = Date.now().toString();

    return this.withAccountSession<ZaloSendMessageWithMetaResponse>(
      senderAccountId,
      async (api) => {
        const response = await this.runWithFixedNow(Number(cliMsgId), () =>
          api.sendMessage(message, threadId, type),
        );

        return {
          ...response,
          cliMsgId,
        };
      },
    );
  }

  async deleteMessage(
    accountId: string,
    destination: ZaloDeleteMessageDestination,
    onlyMe = true,
  ) {
    return this.withAccountSession(accountId, (api) =>
      api.deleteMessage(destination, onlyMe),
    );
  }

  async undoMessage(
    accountId: string,
    payload: ZaloUndoPayload,
    threadId: string,
    type: ZaloThreadType = ZaloThreadType.Group,
  ) {
    return this.withAccountSession(accountId, (api) =>
      api.undo(payload, threadId, type),
    );
  }

  async sendFriendRequest(accountId: string, message: string, userId: string) {
    return this.withAccountSession(accountId, (api) =>
      api.sendFriendRequest(message, userId),
    );
  }

  async acceptFriendRequest(accountId: string, userId: string) {
    return this.withAccountSession(accountId, (api) =>
      api.acceptFriendRequest(userId),
    );
  }

  hasActiveSession(accountId: string) {
    return this.activeSessionsByAccountId.has(accountId);
  }

  async assertAnyActiveSession(accountIds: string[]) {
    if (accountIds.some((accountId) => this.hasActiveSession(accountId))) {
      return;
    }

    await this.ensureRuntimeSessionsLoaded();

    if (accountIds.some((accountId) => this.hasActiveSession(accountId))) {
      return;
    }

    const persistedSession = await this.prismaService.zaloSession.findFirst({
      where: {
        zaloAccountId: {
          in: accountIds,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        status: true,
      },
    });

    if (!persistedSession) {
      throw new BadRequestException(
        'No Zalo session found for the available child accounts. Authenticate again.',
      );
    }

    throw this.buildExceptionForStatus(persistedSession.status);
  }

  private async getApiForAccount(accountId: string): Promise<ZaloApi> {
    await this.ensureRuntimeSessionsLoaded();

    const session = this.activeSessionsByAccountId.get(accountId);

    if (!session) {
      throw await this.buildSessionUnavailableException(accountId);
    }

    return session.api;
  }

  private async getAnyAvailableApi(): Promise<ZaloApi> {
    await this.ensureRuntimeSessionsLoaded();

    const session = this.activeSessionsByAccountId.values().next().value as
      | ActiveSession
      | undefined;

    if (!session) {
      throw await this.buildSessionUnavailableException();
    }

    return session.api;
  }

  private registerActiveSession(
    accountId: string,
    zaloId: string,
    api: ZaloApi,
  ) {
    const session: ActiveSession = {
      accountId,
      zaloId,
      api,
    };

    this.activeSessionsByAccountId.set(accountId, session);
    this.activeSessionsByZaloId.set(zaloId, session);
  }

  private unregisterActiveSession(accountId: string, zaloId?: string) {
    const activeSession = this.activeSessionsByAccountId.get(accountId);

    this.activeSessionsByAccountId.delete(accountId);

    if (zaloId) {
      this.activeSessionsByZaloId.delete(zaloId);
      return;
    }

    if (activeSession) {
      this.activeSessionsByZaloId.delete(activeSession.zaloId);
    }
  }

  private async withAccountSession<T>(
    accountId: string,
    operation: (api: ZaloApi) => Promise<T>,
  ): Promise<T> {
    const api = await this.getApiForAccount(accountId);

    try {
      return await operation(api);
    } catch (error) {
      const classification = await this.handleSessionFailure(accountId, error);

      if (classification === 'TRANSIENT') {
        throw new BadRequestException(this.normalizeError(error));
      }

      throw await this.buildSessionUnavailableException(accountId);
    }
  }

  private async ensureRuntimeSessionsLoaded() {
    if (this.activeSessionsByAccountId.size > 0) {
      return;
    }

    await this.restorePersistedSessions();
  }

  private async restorePersistedSessions() {
    if (!this.restoreSessionsPromise) {
      this.restoreSessionsPromise =
        this.restorePersistedSessionsInternal().finally(() => {
          this.restoreSessionsPromise = undefined;
        });
    }

    await this.restoreSessionsPromise;
  }

  private async restorePersistedSessionsInternal() {
    const persistedSessions = await this.prismaService.zaloSession.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        zaloAccountId: true,
        encryptedCredentials: true,
        status: true,
        expiresAt: true,
        zaloAccount: {
          select: {
            id: true,
            zaloId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    for (const persistedSession of persistedSessions) {
      if (this.activeSessionsByAccountId.has(persistedSession.zaloAccountId)) {
        continue;
      }

      if (
        persistedSession.expiresAt &&
        persistedSession.expiresAt.getTime() <= Date.now()
      ) {
        await this.updatePersistedSessionStatus(
          persistedSession.zaloAccountId,
          'EXPIRED',
          'Persisted Zalo session expired.',
        );
        continue;
      }

      let credentials: ZaloCredentials;

      try {
        credentials = this.zaloSessionCryptoService.decrypt<ZaloCredentials>(
          persistedSession.encryptedCredentials,
        );
      } catch (error) {
        await this.updatePersistedSessionStatus(
          persistedSession.zaloAccountId,
          'INVALID',
          this.normalizeError(error),
        );
        this.logger.warn(
          `Invalid persisted Zalo session for account ${persistedSession.zaloAccountId}.`,
        );
        continue;
      }

      try {
        const api = await this.loginWithCredentials(credentials);
        const zaloId = api.getOwnId();

        if (
          persistedSession.zaloAccount.zaloId &&
          persistedSession.zaloAccount.zaloId !== zaloId
        ) {
          throw new Error(
            'Persisted Zalo session does not match the mapped account.',
          );
        }

        this.registerActiveSession(persistedSession.zaloAccountId, zaloId, api);
        await this.persistSession(persistedSession.zaloAccountId, credentials);

        if (persistedSession.zaloAccount.zaloId !== zaloId) {
          await this.prismaService.zaloAccount.update({
            where: {
              id: persistedSession.zaloAccountId,
            },
            data: {
              zaloId,
            },
          });
        }
      } catch (error) {
        const classification = await this.handleSessionFailure(
          persistedSession.zaloAccountId,
          error,
        );

        if (classification === 'TRANSIENT') {
          this.logger.warn(
            `Unable to restore Zalo session for account ${persistedSession.zaloAccountId}: ${this.normalizeError(
              error,
            )}`,
          );
        }
      }
    }
  }

  private async persistSession(
    zaloAccountId: string,
    credentials: ZaloCredentials,
  ) {
    const encryptedCredentials =
      this.zaloSessionCryptoService.encrypt(credentials);

    return this.prismaService.zaloSession.upsert({
      where: {
        zaloAccountId,
      },
      update: {
        encryptedCredentials,
        status: 'ACTIVE',
        lastValidatedAt: new Date(),
        expiresAt: this.calculateSessionExpiresAt(credentials),
        invalidReason: null,
      },
      create: {
        zaloAccountId,
        encryptedCredentials,
        status: 'ACTIVE',
        lastValidatedAt: new Date(),
        expiresAt: this.calculateSessionExpiresAt(credentials),
        invalidReason: null,
      },
    });
  }

  private calculateSessionExpiresAt(credentials: ZaloCredentials) {
    const expirationDates: number[] = [];

    for (const cookie of credentials.cookie) {
      if (!cookie || typeof cookie !== 'object') {
        continue;
      }

      const candidate = cookie as Record<string, unknown>;
      const expirationDate = candidate.expirationDate;
      const expires = candidate.expires;

      if (
        typeof expirationDate === 'number' &&
        Number.isFinite(expirationDate)
      ) {
        expirationDates.push(
          expirationDate > 1_000_000_000_000
            ? expirationDate
            : expirationDate * 1000,
        );
        continue;
      }

      if (typeof expires === 'string') {
        const timestamp = Date.parse(expires);

        if (Number.isFinite(timestamp)) {
          expirationDates.push(timestamp);
        }
      }
    }

    if (expirationDates.length === 0) {
      return null;
    }

    const maxExpiration = Math.max(...expirationDates);

    if (!Number.isFinite(maxExpiration)) {
      return null;
    }

    return new Date(maxExpiration);
  }

  private async updatePersistedSessionStatus(
    zaloAccountId: string,
    status: 'ACTIVE' | 'EXPIRED' | 'INVALID' | 'PENDING_RELOGIN',
    invalidReason: string | null,
  ) {
    await this.prismaService.zaloSession.updateMany({
      where: {
        zaloAccountId,
      },
      data: {
        status,
        invalidReason,
        lastValidatedAt: status === 'ACTIVE' ? new Date() : undefined,
      },
    });
  }

  private async handleSessionFailure(
    accountId: string,
    error: unknown,
  ): Promise<'EXPIRED' | 'INVALID' | 'PENDING_RELOGIN' | 'TRANSIENT'> {
    const classification = this.classifySessionFailure(error);

    if (classification === 'TRANSIENT') {
      return classification;
    }

    await this.updatePersistedSessionStatus(
      accountId,
      classification,
      this.normalizeError(error),
    );
    this.unregisterActiveSession(accountId);

    return classification;
  }

  private classifySessionFailure(
    error: unknown,
  ): 'EXPIRED' | 'INVALID' | 'PENDING_RELOGIN' | 'TRANSIENT' {
    const normalizedError = this.normalizeError(error).toLowerCase();

    if (
      normalizedError.includes('decrypt') ||
      normalizedError.includes('cipher') ||
      normalizedError.includes('auth tag') ||
      normalizedError.includes('session_encryption_key')
    ) {
      return 'INVALID';
    }

    if (normalizedError.includes('expired')) {
      return 'EXPIRED';
    }

    if (
      normalizedError.includes('unauthorized') ||
      normalizedError.includes('forbidden') ||
      normalizedError.includes('login') ||
      normalizedError.includes('credential') ||
      normalizedError.includes('cookie') ||
      normalizedError.includes('auth') ||
      normalizedError.includes('session')
    ) {
      return 'PENDING_RELOGIN';
    }

    if (
      normalizedError.includes('timeout') ||
      normalizedError.includes('socket') ||
      normalizedError.includes('network') ||
      normalizedError.includes('econn') ||
      normalizedError.includes('connect') ||
      normalizedError.includes('fetch')
    ) {
      return 'TRANSIENT';
    }

    return 'PENDING_RELOGIN';
  }

  private async buildSessionUnavailableException(accountId?: string) {
    if (!accountId) {
      const persistedSession = await this.prismaService.zaloSession.findFirst({
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          status: true,
        },
      });

      if (!persistedSession) {
        return new BadRequestException(
          'No Zalo session found. Authenticate at least one Zalo account first.',
        );
      }

      return this.buildExceptionForStatus(persistedSession.status);
    }

    const persistedSession = await this.prismaService.zaloSession.findUnique({
      where: {
        zaloAccountId: accountId,
      },
      select: {
        status: true,
      },
    });

    if (!persistedSession) {
      return new BadRequestException(
        'No Zalo session found for the selected account. Authenticate again.',
      );
    }

    return this.buildExceptionForStatus(persistedSession.status);
  }

  private buildExceptionForStatus(
    status: 'ACTIVE' | 'EXPIRED' | 'INVALID' | 'PENDING_RELOGIN',
  ) {
    switch (status) {
      case 'ACTIVE':
        return new BadRequestException(
          'Persisted Zalo session is temporarily unavailable. Please retry.',
        );
      case 'INVALID':
        return new BadRequestException(
          'Persisted Zalo session is invalid. Re-login required.',
        );
      case 'EXPIRED':
      case 'PENDING_RELOGIN':
        return new BadRequestException(
          'Zalo session expired, re-login required.',
        );
    }
  }

  private async runFriendFlow(
    masterAccountId: string,
    childAccountId: string,
    childZaloId: string,
  ) {
    const masterAccount = await this.prismaService.zaloAccount.findUnique({
      where: { id: masterAccountId },
      select: {
        id: true,
        zaloId: true,
      },
    });

    if (!masterAccount?.zaloId) {
      return {
        status: 'SKIPPED',
        reason: 'Master account is missing zaloId.',
      };
    }

    if (!this.hasActiveSession(masterAccountId)) {
      return {
        status: 'SKIPPED',
        reason: 'Master account does not have an active Zalo session.',
      };
    }

    try {
      await this.sendFriendRequest(
        masterAccountId,
        'Auto friend request from ZCA.',
        childZaloId,
      );
      await this.acceptFriendRequest(childAccountId, masterAccount.zaloId);

      return {
        status: 'COMPLETED',
      };
    } catch (error: unknown) {
      return {
        status: 'FAILED',
        reason: this.normalizeError(error),
      };
    }
  }

  private extractProfile(userInfo: ZaloUserInfoResponse, userId: string) {
    const profile = userInfo.changed_profiles[userId];

    if (!profile) {
      throw new InternalServerErrorException(
        `Unable to resolve profile information for Zalo user ${userId}.`,
      );
    }

    return profile;
  }

  private normalizeError(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown Zalo error.';
  }

  private async runWithFixedNow<T>(
    fixedTimestamp: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const originalNow = Date.now;

    Date.now = () => fixedTimestamp;

    try {
      return await callback();
    } finally {
      Date.now = originalNow;
    }
  }
}
