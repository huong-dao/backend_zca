import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

@Injectable()
export class ZaloSessionCryptoService implements OnModuleInit {
  private key!: Buffer;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const hex =
      this.configService.get<string>('zaloSession.encryptionKeyHex') ?? '';
    const key = Buffer.from(hex, 'hex');
    if (key.length !== KEY_LENGTH) {
      throw new Error(
        'ZALO_SESSION_ENCRYPTION_KEY must be exactly 64 hexadecimal characters (32 bytes).',
      );
    }
    this.key = key;
  }

  encryptJson(payload: unknown): Buffer {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGO, this.key, iv);
    const plain = JSON.stringify(payload);
    const ciphertext = Buffer.concat([
      cipher.update(plain, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, ciphertext]);
  }

  decryptJson<T>(blob: Buffer): T {
    if (blob.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
      throw new Error('Invalid encrypted payload length.');
    }
    const iv = blob.subarray(0, IV_LENGTH);
    const authTag = blob.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const data = blob.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGO, this.key, iv);
    decipher.setAuthTag(authTag);
    const plain = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]).toString('utf8');
    return JSON.parse(plain) as T;
  }
}
