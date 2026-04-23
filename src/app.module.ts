import { config } from 'dotenv';
config();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { UsersModule } from './modules/users/users.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ZaloAccountsModule } from './modules/zalo-accounts/zalo-accounts.module';
import { ZaloGroupsModule } from './modules/zalo-groups/zalo-groups.module';
import { ZaloLoginSessionsModule } from './modules/zalo-login-sessions/zalo-login-sessions.module';
import { ZaloActionsModule } from './modules/zalo-actions/zalo-actions.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    ApiKeysModule,
    ConfigsModule,
    UsersModule,
    MessagesModule,
    ZaloAccountsModule,
    ZaloGroupsModule,
    ZaloLoginSessionsModule,
    ZaloActionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
