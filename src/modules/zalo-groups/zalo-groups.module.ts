import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ZaloGroupsController } from './zalo-groups.controller';
import { ZaloGroupsService } from './zalo-groups.service';

@Module({
  imports: [PrismaModule],
  controllers: [ZaloGroupsController],
  providers: [ZaloGroupsService],
  exports: [ZaloGroupsService],
})
export class ZaloGroupsModule {}
