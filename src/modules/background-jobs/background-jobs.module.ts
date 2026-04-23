import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { CHILD_GROUP_SCAN_QUEUE, GROUP_METADATA_SYNC_QUEUE } from './constants';
import { ChildGroupSyncProcessor } from './child-group-sync.processor';
import { ChildGroupSyncService } from './child-group-sync.service';
import { GroupMetadataSyncService } from './group-metadata-sync.service';
import { GroupMetadataSyncProcessor } from './group-sync.processor';
import { GroupMetadataSyncScheduler } from './group-sync.scheduler';

@Module({
  imports: [
    ConfigModule,
    ZaloLoginSessionsModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('groupSync.redis.url');
        if (url) {
          return {
            connection: { url },
          };
        }
        return {
          connection: {
            host: config.get<string>('groupSync.redis.host') ?? '127.0.0.1',
            port: config.get<number>('groupSync.redis.port') ?? 6379,
            password: config.get<string | undefined>(
              'groupSync.redis.password',
            ),
            username: config.get<string | undefined>(
              'groupSync.redis.username',
            ),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: GROUP_METADATA_SYNC_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }),
    BullModule.registerQueue({
      name: CHILD_GROUP_SCAN_QUEUE,
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'exponential', delay: 10_000 },
        removeOnComplete: 100,
        removeOnFail: 30,
      },
    }),
  ],
  providers: [
    GroupMetadataSyncService,
    GroupMetadataSyncProcessor,
    GroupMetadataSyncScheduler,
    ChildGroupSyncService,
    ChildGroupSyncProcessor,
  ],
  exports: [ChildGroupSyncService],
})
export class BackgroundJobsModule {}
