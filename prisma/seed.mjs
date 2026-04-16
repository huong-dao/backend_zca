import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '../generated/prisma/index.js';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:123456@localhost:5432/zca?schema=public';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const DEFAULT_MESSAGE_INTERVAL_MINUTES = 5;
const SALT_ROUNDS = 10;

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', SALT_ROUNDS);
  const userPassword = await bcrypt.hash('User@123', SALT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: {
      email: 'admin@zca.local',
    },
    update: {
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      email: 'admin@zca.local',
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const sampleUser = await prisma.user.upsert({
    where: {
      email: 'user@zca.local',
    },
    update: {
      password: userPassword,
      role: UserRole.USER,
      isActive: true,
    },
    create: {
      email: 'user@zca.local',
      password: userPassword,
      role: UserRole.USER,
      isActive: true,
    },
  });

  const messageInterval = await prisma.configuration.upsert({
    where: {
      key: 'message_interval',
    },
    update: {
      value: String(DEFAULT_MESSAGE_INTERVAL_MINUTES),
    },
    create: {
      key: 'message_interval',
      value: String(DEFAULT_MESSAGE_INTERVAL_MINUTES),
    },
  });

  console.log('Seed completed.');
  console.log(`ADMIN: ${adminUser.email} / Admin@123`);
  console.log(`USER: ${sampleUser.email} / User@123`);
  console.log(
    `message_interval: ${messageInterval.value} minute(s)`,
  );
}

main()
  .catch((error) => {
    console.error('Seed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
