import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { ChildGroupGridResolveService } from './child-group-grid-resolve.service';

@Module({
  imports: [PrismaModule, ConfigModule, ZaloLoginSessionsModule],
  providers: [ChildGroupGridResolveService],
  exports: [ChildGroupGridResolveService],
})
export class ChildGroupGridResolveModule {}
