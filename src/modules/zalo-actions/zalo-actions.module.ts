import { Module } from '@nestjs/common';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { ZaloActionsController } from './zalo-actions.controller';
import { ZaloActionsService } from './zalo-actions.service';

@Module({
  imports: [ZaloLoginSessionsModule],
  controllers: [ZaloActionsController],
  providers: [ZaloActionsService],
  exports: [ZaloActionsService],
})
export class ZaloActionsModule {}
