import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ZaloSessionCryptoService } from './zalo-session-crypto.service';
import { ZaloLoginSessionsController } from './zalo-login-sessions.controller';
import { ZaloLoginSessionsService } from './zalo-login-sessions.service';

@Module({
  imports: [PrismaModule],
  controllers: [ZaloLoginSessionsController],
  providers: [ZaloSessionCryptoService, ZaloLoginSessionsService],
  exports: [ZaloLoginSessionsService],
})
export class ZaloLoginSessionsModule {}
