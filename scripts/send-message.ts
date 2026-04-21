/**
 * Debug send flow: resolve session by Zalo account phone in DB, call findUser, then sendMessage to a group grid id.
 *
 * Prerequisites: DATABASE_URL, ZALO_SESSION_ENCRYPTION_KEY in `.env`.
 *
 * Usage:
 *   npm run script:send-message -- --phone 0912345678 --group-id 4722820980206948279
 *   npm run script:send-message -- --phone 0912345678 --group-id <grid> --text "Hello"
 *   npm run script:send-message -- --phone 0912345678 --group-id <grid> --find-user-phone 0987654321
 *
 * - `--phone`: must match `zalo_accounts.phone` (tries 0… and 84… variants). Used to pick the login session (`zalo_login_sessions.zalo_uid` = that row’s `zalo_id`).
 * - `--group-id`: Zalo **group grid id** (same value you pass as threadId for `ThreadType.Group`).
 * - `--text`: optional, default short test string.
 * - `--find-user-phone`: optional; phone passed to `findUser` (defaults to `--phone`).
 */

/* eslint-disable @typescript-eslint/no-require-imports */

function safeJson(obj: unknown): string {
  return JSON.stringify(
    obj,
    (_k, v) => (typeof v === 'bigint' ? v.toString() : v),
    2,
  );
}

async function runSendMessage(): Promise<void> {
  const { createDecipheriv } = require('node:crypto');
  const { createRequire } = require('node:module');
  const { join } = require('node:path');
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { createZcaApiFromCredentials } = require('../src/zalo/create-zca-api');
  const { ThreadType, ZcaApiHelper } = require('../src/zalo/zca-api.helper');

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

  function phoneCandidates(raw: string): string[] {
    const t = raw.trim();
    const set = new Set<string>([t]);
    if (t.startsWith('0')) {
      set.add(`84${t.slice(1)}`);
    }
    if (t.startsWith('84')) {
      set.add(`0${t.slice(2)}`);
    }
    return [...set];
  }

  const phoneOpt = getOpt('phone');
  const groupId = getOpt('group-id')?.trim();
  const text =
    getOpt('text')?.trim() ??
    '[send-message script] Kiểm tra group id / findUser / sendMessage.';
  const findUserPhone = getOpt('find-user-phone')?.trim() ?? phoneOpt?.trim();

  if (!phoneOpt?.trim()) {
    console.error('Missing --phone (must match zalo_accounts.phone in DB).');
    process.exit(1);
  }
  if (!groupId) {
    console.error('Missing --group-id (Zalo group grid id / threadId).');
    process.exit(1);
  }
  if (!findUserPhone) {
    console.error('Missing find-user phone (set --phone or --find-user-phone).');
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
    const candidates = phoneCandidates(phoneOpt);
    console.log('--- DB: resolve zalo_accounts by phone ---');
    console.log('Tried phone variants:', candidates);

    const account = await prisma.zaloAccount.findFirst({
      where: { phone: { in: candidates } },
      select: {
        id: true,
        phone: true,
        zaloId: true,
        name: true,
        isMaster: true,
      },
    });

    if (!account) {
      console.error('No zalo_accounts row for any of:', candidates);
      process.exit(1);
    }

    console.log('Matched account:', safeJson(account));

    const zaloUid = account.zaloId?.trim();
    if (!zaloUid) {
      console.error('Account has no zalo_id; cannot match zalo_login_sessions.zalo_uid.');
      process.exit(1);
    }

    console.log('\n--- DB: latest zalo_login_sessions for zalo_uid ---');
    const sessionRow = await prisma.zaloLoginSession.findFirst({
      where: { zaloUid },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        zaloUid: true,
        userId: true,
        updatedAt: true,
      },
    });

    if (!sessionRow) {
      console.error(`No zalo_login_sessions for zalo_uid=${zaloUid}`);
      process.exit(1);
    }

    console.log('Session:', safeJson(sessionRow));

    const fullRow = await prisma.zaloLoginSession.findUnique({
      where: { id: sessionRow.id },
    });
    if (!fullRow) {
      process.exit(1);
    }

    const creds = decryptSessionCredentials(
      Buffer.from(fullRow.credentialsEncrypted),
      keyHex,
    );

    console.log('\n--- ZCA: login from stored credentials ---');
    const api = await createZcaApiFromCredentials(creds);
    const zca = new ZcaApiHelper(api);

    console.log('getOwnId():', zca.getOwnId());
    console.log('ThreadType.Group:', ThreadType.Group);

    console.log('\n--- ZCA: findUser ---');
    console.log('Input phone:', findUserPhone);
    const findUserResult = await zca.findUser(findUserPhone);
    console.log('Full findUser response:\n', safeJson(findUserResult));

    console.log('\n--- ZCA: sendMessage ---');
    console.log('threadId (group grid):', groupId);
    console.log('type: ThreadType.Group');
    console.log('text length:', text.length);
    const sendResult = await zca.sendMessage(text, groupId, ThreadType.Group);
    console.log('Full sendMessage response:\n', safeJson(sendResult));

    console.log('\n--- Done ---');
  } finally {
    await prisma.$disconnect();
  }
}

void runSendMessage().catch((err: unknown) => {
  console.error('\n--- Error ---');
  console.error(err);
  process.exit(1);
});
