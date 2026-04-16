import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ZaloSessionCryptoService } from './zalo-session-crypto.service';
import { ZaloService } from './zalo.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [ZaloSessionCryptoService, ZaloService],
  exports: [ZaloService],
})
export class ZaloModule {}
