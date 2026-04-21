/**
 * Call zca-js `getGroupInfo(groupId)` using a stored `zalo_login_sessions` row.
 *
 * Prerequisites: DATABASE_URL, ZALO_SESSION_ENCRYPTION_KEY in `.env`.
 *
 * Usage:
 *   npm run script:get-group-info -- --session-id <uuid> --group-id 4722820980206948279
 *   npm run script:get-group-info -- --phone 0912345678 --group-id 4722820980206948279
 *   npm run script:get-group-info -- --phone 0912345678 --group-id id1,id2,id3
 */

/* eslint-disable @typescript-eslint/no-require-imports */

function safeJson(obj: unknown): string {
  return JSON.stringify(
    obj,
    (_k, v) => (typeof v === 'bigint' ? v.toString() : v),
    2,
  );
}

async function runGetGroupInfo(): Promise<void> {
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

  const sessionIdOpt = getOpt('session-id')?.trim();
  const phoneOpt = getOpt('phone')?.trim();
  const groupIdRaw = getOpt('group-id')?.trim();

  if (!groupIdRaw) {
    console.error('Missing --group-id (Zalo group grid id; comma-separated for multiple).');
    process.exit(1);
  }

  if (!sessionIdOpt && !phoneOpt) {
    console.error('Provide either --session-id <uuid> or --phone (zalo_accounts.phone).');
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
    let sessionRow: { id: string; zaloUid: string; credentialsEncrypted: Uint8Array };

    if (sessionIdOpt) {
      console.log('--- Using session id ---', sessionIdOpt);
      const row = await prisma.zaloLoginSession.findUnique({
        where: { id: sessionIdOpt },
      });
      if (!row) {
        console.error(`No zalo_login_sessions for id=${sessionIdOpt}`);
        process.exit(1);
      }
      sessionRow = row;
    } else {
      const candidates = phoneCandidates(phoneOpt!);
      console.log('--- Resolve session by phone ---', candidates);
      const account = await prisma.zaloAccount.findFirst({
        where: { phone: { in: candidates } },
        select: { id: true, phone: true, zaloId: true, name: true },
      });
      if (!account?.zaloId?.trim()) {
        console.error('No zalo_accounts match or missing zalo_id.');
        process.exit(1);
      }
      console.log('Account:', safeJson(account));
      const zaloUid = account.zaloId.trim();
      const row = await prisma.zaloLoginSession.findFirst({
        where: { zaloUid },
        orderBy: { updatedAt: 'desc' },
      });
      if (!row) {
        console.error(`No zalo_login_sessions for zalo_uid=${zaloUid}`);
        process.exit(1);
      }
      console.log('Picked session id:', row.id);
      sessionRow = row;
    }

    const creds = decryptSessionCredentials(
      Buffer.from(sessionRow.credentialsEncrypted),
      keyHex,
    );

    console.log('\n--- ZCA: login from stored credentials ---');
    const api = await createZcaApiFromCredentials(creds);
    const zca = new ZcaApiHelper(api);
    console.log('getOwnId():', zca.getOwnId());

    const groupIds = groupIdRaw
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (groupIds.length === 0) {
      console.error('No valid group ids after parsing --group-id');
      process.exit(1);
    }

    console.log('\n--- ZCA: getGroupInfo ---');
    console.log('groupId argument(s):', groupIds);

    const arg = groupIds.length === 1 ? groupIds[0] : groupIds;
    const result = await zca.getGroupInfo(arg);

    console.log('\n--- Full getGroupInfo response ---');
    console.log(safeJson(result));
  } finally {
    await prisma.$disconnect();
  }
}

void runGetGroupInfo().catch((err: unknown) => {
  console.error('\n--- Error ---');
  console.error(err);
  process.exit(1);
});
