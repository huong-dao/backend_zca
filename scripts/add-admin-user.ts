/**
 * Create or reset the default Admin user in `users`.
 *
 * Prerequisites: `DATABASE_URL` in `.env` (same as Nest).
 *
 * Usage:
 *   npm run script:add-admin-user
 *
 * Node:
 *   node --env-file=.env ./node_modules/ts-node/dist/bin.js --transpile-only -P tsconfig.scripts.json scripts/add-admin-user.ts
 */

/* eslint-disable @typescript-eslint/no-require-imports */

async function main(): Promise<void> {
  const { join } = require('node:path');
  const { createRequire } = require('node:module');
  const bcrypt = require('bcrypt');
  const { PrismaPg } = require('@prisma/adapter-pg');

  const nodeRequire = createRequire(__filename);
  const { PrismaClient, UserRole } = nodeRequire(
    join(process.cwd(), 'generated/prisma'),
  );

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is required.');
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  const email = 'admin@zca.local';
  const plainPassword = 'Admin@123';
  const SALT_ROUNDS = 10;

  try {
    const password = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password,
        role: UserRole.ADMIN,
        isActive: true,
      },
      create: {
        email,
        password,
        role: UserRole.ADMIN,
        isActive: true,
      },
      select: { id: true, email: true, role: true, isActive: true },
    });

    console.log('Admin user upserted.');
    console.log({ id: user.id, email: user.email, role: user.role, isActive: user.isActive });
    console.log(`Login: ${email} / ${plainPassword}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  console.error('add-admin-user failed.');
  console.error(err);
  process.exitCode = 1;
});
