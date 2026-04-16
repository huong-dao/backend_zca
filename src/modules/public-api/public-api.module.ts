import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { MessagesModule } from '../messages/messages.module';
import { PublicApiController } from './public-api.controller';
import { PublicApiService } from './public-api.service';

@Module({
  imports: [PrismaModule, ApiKeysModule, MessagesModule],
  controllers: [PublicApiController],
  providers: [PublicApiService],
})
export class PublicApiModule {}
