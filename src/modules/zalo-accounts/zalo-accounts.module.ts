import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ZaloModule } from '../zalo/zalo.module';
import { ZaloAccountsController } from './zalo-accounts.controller';
import { ZaloAccountsService } from './zalo-accounts.service';

@Module({
  imports: [PrismaModule, ZaloModule],
  controllers: [ZaloAccountsController],
  providers: [ZaloAccountsService],
  exports: [ZaloAccountsService],
})
export class ZaloAccountsModule {}
