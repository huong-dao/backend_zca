import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type EncryptedPayload = {
  iv: string;
  authTag: string;
  content: string;
};

@Injectable()
export class ZaloSessionCryptoService {
  constructor(private readonly configService: ConfigService) {}

  encrypt(payload: unknown): string {
    const serializedPayload = JSON.stringify(payload);
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.getKey(), iv);

    const encryptedContent = Buffer.concat([
      cipher.update(serializedPayload, 'utf8'),
      cipher.final(),
    ]);

    const result: EncryptedPayload = {
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      content: encryptedContent.toString('base64'),
    };

    return Buffer.from(JSON.stringify(result), 'utf8').toString('base64');
  }

  decrypt<T>(encryptedPayload: string): T {
    try {
      const decodedPayload = Buffer.from(encryptedPayload, 'base64').toString(
        'utf8',
      );
      const parsedPayload = JSON.parse(decodedPayload) as EncryptedPayload;
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.getKey(),
        Buffer.from(parsedPayload.iv, 'base64'),
      );

      decipher.setAuthTag(Buffer.from(parsedPayload.authTag, 'base64'));

      const decryptedBuffer = Buffer.concat([
        decipher.update(Buffer.from(parsedPayload.content, 'base64')),
        decipher.final(),
      ]);

      return JSON.parse(decryptedBuffer.toString('utf8')) as T;
    } catch {
      throw new InternalServerErrorException(
        'Unable to decrypt persisted Zalo session.',
      );
    }
  }

  private getKey() {
    const encryptionKey = this.configService.get<string>(
      'security.sessionEncryptionKey',
    );

    if (!encryptionKey) {
      throw new InternalServerErrorException(
        'SESSION_ENCRYPTION_KEY is required for persisted Zalo sessions.',
      );
    }

    return createHash('sha256').update(encryptionKey, 'utf8').digest();
  }
}
