/**
 * Test `addUserToGroup` using **only the master** `zalo_login_sessions` row.
 *
 * Flow: master session → `findUser(phone)` → use returned `uid` → `addUserToGroup` / `inviteUserToGroups`.
 * The uid must be the one from **this** session’s `findUser`, not child `getOwnId()` / DB `zalo_id` unless they match.
 *
 * Prerequisites: DATABASE_URL, ZALO_SESSION_ENCRYPTION_KEY (Nest `.env`).
 *
 * Usage:
 *   npm run script:test-add-to-group -- --session-id <master-session-uuid> --list-groups
 *   npm run script:test-add-to-group -- --session-id <master> --group-id <grid> --phone 0914405474
 *   npm run script:test-add-to-group -- --session-id <master> --group-id <grid> --child-zalo-account-id <zalo_accounts.uuid>
 *
 * Optional:
 *   --phone …           overrides phone when `--child-zalo-account-id` is set.
 *   --preflight          log getOwnId, group membership, getGroupInfo.
 *   --method multi       use `inviteUserToGroups` instead of `addUserToGroup` (v2).
 *   --skip-find-user     use `--member-id` as graph uid directly (advanced; no phone needed).
 */

/* eslint-disable @typescript-eslint/no-require-imports */
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

function decryptSessionCredentials(blob: Buffer, keyHex: string): CredentialsPayload {
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== KEY_LENGTH) {
    throw new Error('ZALO_SESSION_ENCRYPTION_KEY must be exactly 64 hex characters.');
  }
  if (blob.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error('Invalid encrypted credentials length.');
  }
  const iv = blob.subarray(0, IV_LENGTH);
  const authTag = blob.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const data = blob.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
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

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

type ZaloFriendRow = {
  userId: string;
  displayName: string;
  phoneNumber: string;
};

function normalizeDigits(phone: string | null | undefined): string {
  if (!phone) {
    return '';
  }
  return phone.replace(/\D/g, '');
}

function asFriendList(raw: unknown): ZaloFriendRow[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: ZaloFriendRow[] = [];
  for (const u of raw) {
    if (!u || typeof u !== 'object') {
      continue;
    }
    const o = u as Record<string, unknown>;
    const userIdRaw = o.userId ?? o.uid;
    if (typeof userIdRaw !== 'string' || !userIdRaw) {
      continue;
    }
    const displayName =
      typeof o.displayName === 'string'
        ? o.displayName
        : typeof o.display_name === 'string'
          ? o.display_name
          : '';
    const phoneNumber =
      typeof o.phoneNumber === 'string'
        ? o.phoneNumber
        : typeof o.phone === 'string'
          ? o.phone
          : '';
    out.push({ userId: userIdRaw, displayName, phoneNumber });
  }
  return out;
}

async function main(): Promise<void> {
  const sessionId = getOpt('session-id');
  const groupId = getOpt('group-id');
  const phoneOpt = getOpt('phone');
  const childZaloAccountId = getOpt('child-zalo-account-id');
  const memberIdRaw = getOpt('member-id');
  const listGroups = hasFlag('list-groups');
  const skipFindUser = hasFlag('skip-find-user');

  if (!sessionId) {
    console.error(
      'Missing --session-id (UUID of zalo_login_sessions row for the master).',
    );
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

    if (listGroups) {
      const groups = await zca.getAllGroups();
      const ids = Object.keys(groups.gridVerMap ?? {});
      console.log(`Logged in as Zalo session user (zalo_uid column): ${row.zaloUid}`);
      console.log(`getOwnId(): ${zca.getOwnId()}`);
      console.log(`getAllGroups version: ${groups.version}`);
      console.log(`Group ids (${ids.length}):`);
      for (const id of ids) {
        console.log(`  ${id}`);
      }
      return;
    }

    if (!groupId) {
      console.error('Missing --group-id (or use --list-groups).');
      process.exit(1);
    }

    let phoneForFind = phoneOpt?.trim() ?? '';
    let childLabel: string | undefined;
    let childRow:
      | { id: string; zaloId: string | null; phone: string | null; name: string | null }
      | undefined;

    if (childZaloAccountId) {
      const child = await prisma.zaloAccount.findUnique({
        where: { id: childZaloAccountId },
        select: { id: true, zaloId: true, phone: true, name: true },
      });
      if (!child) {
        console.error(
          `No zalo_accounts row for --child-zalo-account-id=${childZaloAccountId}`,
        );
        process.exit(1);
      }
      childRow = child;
      childLabel = `${child.name ?? '(no name)'} (${child.id})`;
      console.log('\n--- Child row (DB) ---');
      console.log('zalo_accounts.id:', child.id);
      console.log('zalo_id:', child.zaloId ?? '(null)');
      console.log('phone:', child.phone ?? '(null)');
      console.log('name:', child.name ?? '(null)');
      if (!phoneForFind && child.phone?.trim()) {
        phoneForFind = child.phone.trim();
        console.log('Using phone from DB for findUser:', phoneForFind);
      } else if (phoneForFind) {
        console.log('Using --phone override for findUser:', phoneForFind);
      }
    }

    const method = getOpt('method') ?? 'v2';

    let inviteUids: string[];

    if (skipFindUser) {
      if (!memberIdRaw?.trim()) {
        console.error(
          '--skip-find-user requires --member-id <uid>[,<uid>...] (graph uids for this master session).',
        );
        process.exit(1);
      }
      inviteUids = memberIdRaw
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (inviteUids.length === 0) {
        console.error('No uids after parsing --member-id.');
        process.exit(1);
      }
      console.log('\n--skip-find-user: using member id(s) without findUser:', inviteUids);
    } else {
      if (!phoneForFind) {
        console.error(
          'Provide --phone, or --child-zalo-account-id with a phone on that row (or --phone with child id).',
        );
        process.exit(1);
      }

      console.log('\n--- findUser (master session) ---');
      console.log('Phone:', phoneForFind);
      if (childLabel) {
        console.log('Child:', childLabel);
      }

      const profile = await zca.findUser(phoneForFind);
      inviteUids = [profile.uid];

      console.log('findUser → uid (used for invite):', profile.uid);
      console.log('display_name:', profile.display_name ?? profile.zalo_name);
      console.log('globalId:', profile.globalId);

      if (childRow?.zaloId && childRow.zaloId.trim() !== profile.uid.trim()) {
        console.log(
          '\n(Note: DB zalo_id differs from findUser.uid — expected for many accounts; invite uses findUser.uid.)\n',
        );
      }

      try {
        const friends = asFriendList(await zca.getAllFriends(20000, 1));
        const found = friends.find((f) => f.userId === profile.uid);
        if (!found) {
          console.warn(
            '[warn] findUser uid not found in master getAllFriends — addUserToGroup may still work if policies allow, but usually you must be Zalo friends.',
          );
        } else {
          console.log('Master friend list: contains uid →', {
            userId: found.userId,
            displayName: found.displayName,
          });
        }
      } catch (e) {
        console.log('getAllFriends (optional check):', e);
      }

      try {
        const info = await zca.getUserInfo(profile.uid);
        const c = Object.keys(info.changed_profiles ?? {}).length;
        const u = Object.keys(info.unchanged_profiles ?? {}).length;
        console.log('getUserInfo(uid): OK', { changedProfiles: c, unchangedProfiles: u });
      } catch (e) {
        console.warn('[warn] getUserInfo(uid) failed:', e);
      }
    }

    const memberArg = inviteUids.length === 1 ? inviteUids[0] : inviteUids;

    if (hasFlag('preflight')) {
      console.log('\n--- preflight ---');
      console.log('getOwnId:', zca.getOwnId());
      const all = await zca.getAllGroups();
      const ver = all.gridVerMap?.[groupId];
      console.log(
        'group in getAllGroups:',
        ver !== undefined,
        'gridVer:',
        ver ?? '(missing — wrong group-id or not in this account)',
      );
      try {
        await zca.getGroupInfo(groupId);
        console.log('getGroupInfo ok');
      } catch (e) {
        console.log('getGroupInfo error:', e);
      }
      console.log('--- end preflight ---\n');
    }

    if (method === 'multi') {
      if (inviteUids.length !== 1) {
        console.error('--method multi allows only one invitee.');
        process.exit(1);
      }
      console.log('\nCalling inviteUserToGroups(userId, groupId):', {
        userId: inviteUids[0],
        groupId,
      });
      const result = await zca.inviteUserToGroups(inviteUids[0], groupId);
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      console.log('\nCalling addUserToGroup(memberId, groupId):', {
        memberId: memberArg,
        groupId,
        method: 'v2',
      });
      const result = await zca.addUserToGroup(memberArg, groupId);
      console.log('Result:', JSON.stringify(result, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
