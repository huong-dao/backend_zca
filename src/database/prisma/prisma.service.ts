import { PrismaPg } from '@prisma/adapter-pg';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { PrismaClient as GeneratedPrismaClient } from '../../../generated/prisma';

const runtimeRequire = createRequire(__filename);

const { PrismaClient } = runtimeRequire(
  join(process.cwd(), 'generated/prisma'),
) as {
  PrismaClient: new (options?: object) => GeneratedPrismaClient;
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ??
      'postgresql://postgres:123456@localhost:5432/zca?schema=public';

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
