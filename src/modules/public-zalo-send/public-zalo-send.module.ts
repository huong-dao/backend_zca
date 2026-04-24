import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { ConfigsModule } from '../configs/configs.module';
import { ZaloAccountsModule } from '../zalo-accounts/zalo-accounts.module';
import { ZaloActionsModule } from '../zalo-actions/zalo-actions.module';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { PublicZaloSendController } from './public-zalo-send.controller';
import { PublicZaloSendService } from './public-zalo-send.service';

@Module({
  imports: [
    ApiKeysModule,
    ConfigsModule,
    ZaloActionsModule,
    ZaloLoginSessionsModule,
    ZaloAccountsModule,
  ],
  controllers: [PublicZaloSendController],
  providers: [PublicZaloSendService],
})
export class PublicZaloSendModule {}
