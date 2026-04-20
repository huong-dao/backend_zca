import { randomUUID } from 'node:crypto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import type { UpsertZaloLoginSessionDto } from './dto/upsert-zalo-login-session.dto';
import { ZaloSessionCryptoService } from './zalo-session-crypto.service';

export type ZaloSessionUserProfile = {
  uid: string;
  displayName: string;
  zaloName: string;
  username: string;
  phoneNumber: string;
  avatar: string;
  cover: string;
};

export type ZaloSessionCredentialsPayload = {
  imei: string;
  userAgent: string;
  cookies: Record<string, unknown>[];
};

export type ZaloLoginSessionPublic = {
  id: string;
  user: ZaloSessionUserProfile;
  createdAt: string;
  updatedAt: string;
};

export type ZaloLoginSessionFull = ZaloLoginSessionPublic & {
  credentials: ZaloSessionCredentialsPayload;
};

@Injectable()
export class ZaloLoginSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: ZaloSessionCryptoService,
  ) {}

  /**
   * Sessions are a shared pool: any authenticated app user may upsert by id.
   * `appUserId` is still stored on create for audit / FK; access is not scoped by it.
   */
  async upsert(
    appUserId: string,
    dto: UpsertZaloLoginSessionDto,
  ): Promise<ZaloLoginSessionPublic> {
    const sessionId = dto.id ?? randomUUID();

    const userProfile = this.normalizeUserProfile(dto);
    const encrypted = Uint8Array.from(this.crypto.encryptJson(dto.credentials));

    const createData: Prisma.ZaloLoginSessionCreateInput = {
      id: sessionId,
      user: { connect: { id: appUserId } },
      zaloUid: dto.user.uid,
      userProfile: userProfile as unknown as Prisma.InputJsonValue,
      credentialsEncrypted: encrypted,
      ...(dto.createdAt ? { createdAt: new Date(dto.createdAt) } : {}),
    };

    const updateData: Prisma.ZaloLoginSessionUpdateInput = {
      zaloUid: dto.user.uid,
      userProfile: userProfile as unknown as Prisma.InputJsonValue,
      credentialsEncrypted: encrypted,
      ...(dto.updatedAt ? { updatedAt: new Date(dto.updatedAt) } : {}),
    };

    const row = await this.prisma.zaloLoginSession.upsert({
      where: { id: sessionId },
      create: createData,
      update: updateData,
    });

    return this.toPublic(row);
  }

  /** All sessions (shared resource); caller must enforce JWT. */
  async listAll(): Promise<{ sessions: ZaloLoginSessionPublic[] }> {
    const rows = await this.prisma.zaloLoginSession.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    console.log(rows);
    return { sessions: rows.map((r) => this.toPublic(r)) };
  }

  /**
   * Resolve session only from DB by id. No per-user ownership check.
   */
  async findOneFullBySessionId(sessionId: string): Promise<ZaloLoginSessionFull> {
    const row = await this.prisma.zaloLoginSession.findUnique({
      where: { id: sessionId },
    });
    if (!row) {
      throw new NotFoundException('Zalo session not found.');
    }
    return this.rowToFull(row);
  }

  async findLatestByZaloUid(zaloUid: string): Promise<ZaloLoginSessionFull> {
    const row = await this.prisma.zaloLoginSession.findFirst({
      where: { zaloUid },
      orderBy: { updatedAt: 'desc' },
    });
    if (!row) {
      throw new NotFoundException('No session for this Zalo uid.');
    }
    return this.rowToFull(row);
  }

  async deleteOneBySessionId(sessionId: string): Promise<void> {
    const result = await this.prisma.zaloLoginSession.deleteMany({
      where: { id: sessionId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Zalo session not found.');
    }
  }

  async deleteAllSessions(): Promise<{ deleted: number }> {
    const result = await this.prisma.zaloLoginSession.deleteMany({});
    return { deleted: result.count };
  }

  async updateCredentialsForSessionById(
    sessionId: string,
    credentials: ZaloSessionCredentialsPayload,
  ): Promise<void> {
    const encrypted = Uint8Array.from(this.crypto.encryptJson(credentials));
    const result = await this.prisma.zaloLoginSession.updateMany({
      where: { id: sessionId },
      data: { credentialsEncrypted: encrypted },
    });
    if (result.count === 0) {
      throw new NotFoundException('Zalo session not found.');
    }
  }

  async touchBySessionId(sessionId: string): Promise<ZaloLoginSessionPublic> {
    const row = await this.prisma.zaloLoginSession.findUnique({
      where: { id: sessionId },
    });
    if (!row) {
      throw new NotFoundException('Zalo session not found.');
    }
    const updated = await this.prisma.zaloLoginSession.update({
      where: { id: sessionId },
      data: {},
    });
    return this.toPublic(updated);
  }

  private rowToFull(row: {
    id: string;
    userProfile: Prisma.JsonValue;
    credentialsEncrypted: Uint8Array;
    createdAt: Date;
    updatedAt: Date;
  }): ZaloLoginSessionFull {
    let credentials: ZaloSessionCredentialsPayload;
    try {
      credentials = this.crypto.decryptJson<ZaloSessionCredentialsPayload>(
        Buffer.from(row.credentialsEncrypted as Uint8Array),
      );
    } catch {
      throw new InternalServerErrorException('Failed to decrypt session credentials.');
    }
    return { ...this.toPublic(row), credentials };
  }

  private normalizeUserProfile(dto: UpsertZaloLoginSessionDto): ZaloSessionUserProfile {
    const u = dto.user;
    return {
      uid: u.uid,
      displayName: u.displayName ?? '',
      zaloName: u.zaloName ?? '',
      username: u.username ?? '',
      phoneNumber: u.phoneNumber ?? '',
      avatar: u.avatar ?? '',
      cover: u.cover ?? '',
    };
  }

  private parseUserProfile(json: Prisma.JsonValue): ZaloSessionUserProfile {
    const o = json as Record<string, unknown>;
    return {
      uid: String(o.uid ?? ''),
      displayName: String(o.displayName ?? ''),
      zaloName: String(o.zaloName ?? ''),
      username: String(o.username ?? ''),
      phoneNumber: String(o.phoneNumber ?? ''),
      avatar: String(o.avatar ?? ''),
      cover: String(o.cover ?? ''),
    };
  }

  private toPublic(row: {
    id: string;
    userProfile: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }): ZaloLoginSessionPublic {
    return {
      id: row.id,
      user: this.parseUserProfile(row.userProfile),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
