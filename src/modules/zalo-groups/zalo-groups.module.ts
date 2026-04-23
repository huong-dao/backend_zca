import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { BackgroundJobsModule } from '../background-jobs/background-jobs.module';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { ZaloGroupsController } from './zalo-groups.controller';
import { ZaloGroupsService } from './zalo-groups.service';

@Module({
  imports: [PrismaModule, ZaloLoginSessionsModule, BackgroundJobsModule],
  controllers: [ZaloGroupsController],
  providers: [ZaloGroupsService],
  exports: [ZaloGroupsService],
})
export class ZaloGroupsModule {}
