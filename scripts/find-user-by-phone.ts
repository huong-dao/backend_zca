/**
 * Call zca-js `findUser(phoneNumber)` using a stored `zalo_login_sessions` row.
 *
 * Prerequisites: DATABASE_URL, ZALO_SESSION_ENCRYPTION_KEY in `.env` (same as Nest).
 *
 * Usage:
 *   npm run script:find-user-by-phone -- --session-id <uuid> --phone 0914405474
 *
 * Node:
 *   node --env-file=.env ./node_modules/ts-node/dist/bin.js --transpile-only -P tsconfig.scripts.json scripts/find-user-by-phone.ts -- --session-id <uuid> --phone 0914405474
 */

/* eslint-disable @typescript-eslint/no-require-imports */

async function runFindUserByPhone(): Promise<void> {
  const { createDecipheriv } = require('node:crypto');
  const { createRequire } = require('node:module');
  const { join } = require('node:path');
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { createZcaApiFromCredentials } = require('../src/zalo/create-zca-api');
  const { ZcaApiHelper } = require('../src/zalo/zca-api.helper');

  const nodeRequire = createRequire(__filename);
  const { PrismaClient } = nodeRequire(join(process.cwd(), 'generated/prisma'));

  const ALGO = 'aes-256-gcm';
  const IV_LENGTH = 12;
  const AUTH_TAG_LENGTH = 16;
  const KEY_LENGTH = 32;

  type CredentialsPayload = {
    imei: string;
    userAgent: string;
    cookies: Record<string, unknown>[];
  };

  function decryptSessionCredentials(
    blob: Buffer,
    keyHex: string,
  ): CredentialsPayload {
    const key = Buffer.from(keyHex, 'hex');
    if (key.length !== KEY_LENGTH) {
      throw new Error(
        'ZALO_SESSION_ENCRYPTION_KEY must be exactly 64 hex characters.',
      );
    }
    if (blob.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
      throw new Error('Invalid encrypted credentials length.');
    }
    const iv = blob.subarray(0, IV_LENGTH);
    const authTag = blob.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const data = blob.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString(
      'utf8',
    );
    return JSON.parse(plain) as CredentialsPayload;
  }

  function getOpt(name: string): string | undefined {
    const flag = `--${name}`;
    const i = process.argv.indexOf(flag);
    if (i === -1) {
      return undefined;
    }
    const v = process.argv[i + 1];
    if (v == null || v.startsWith('--')) {
      return undefined;
    }
    return v;
  }

  const sessionId = getOpt('session-id');
  const phone = getOpt('phone');

  if (!sessionId) {
    console.error('Missing --session-id (UUID of zalo_login_sessions).');
    process.exit(1);
  }
  if (!phone?.trim()) {
    console.error('Missing --phone <number> (e.g. 0914405474 or 84914405474).');
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  const keyHex =
    process.env.ZALO_SESSION_ENCRYPTION_KEY ??
    '0000000000000000000000000000000000000000000000000000000000000000';

  if (!databaseUrl) {
    console.error('Missing DATABASE_URL.');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const row = await prisma.zaloLoginSession.findUnique({
      where: { id: sessionId },
    });

    if (!row) {
      console.error(`No zalo_login_sessions row for id=${sessionId}`);
      process.exit(1);
    }

    const creds = decryptSessionCredentials(
      Buffer.from(row.credentialsEncrypted),
      keyHex,
    );

    const api = await createZcaApiFromCredentials(creds);
    const zca = new ZcaApiHelper(api);

    console.log('Session zalo_uid (DB column):', row.zaloUid);
    console.log('getOwnId():', zca.getOwnId());
    console.log('findUser input phone:', phone.trim());

    const user = await zca.findUser(phone.trim());

    console.log('\n--- Summary (graph / API fields) ---');
    console.log('uid:', user.uid);
    console.log('display_name:', user.display_name);
    console.log('zalo_name:', user.zalo_name);
    console.log('globalId:', user.globalId);
    console.log('\n--- Full response ---');
    console.log(JSON.stringify(user, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

void runFindUserByPhone().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
