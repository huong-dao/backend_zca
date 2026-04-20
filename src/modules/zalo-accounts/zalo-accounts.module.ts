import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { ZaloAccountsController } from './zalo-accounts.controller';
import { ZaloAccountsService } from './zalo-accounts.service';

@Module({
  imports: [PrismaModule, ZaloLoginSessionsModule],
  controllers: [ZaloAccountsController],
  providers: [ZaloAccountsService],
  exports: [ZaloAccountsService],
})
export class ZaloAccountsModule {}
