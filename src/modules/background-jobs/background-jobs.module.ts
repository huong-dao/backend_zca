import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ZaloLoginSessionsModule } from '../zalo-login-sessions/zalo-login-sessions.module';
import { BackgroundJobStateService } from './background-job-state.service';
import { BackgroundJobsStatusController } from './background-jobs-status.controller';
import { CHILD_GROUP_SCAN_QUEUE, GROUP_METADATA_SYNC_QUEUE } from './constants';
import { ChildGroupScanStaleScheduler } from './child-group-scan-stale.scheduler';
import { ChildGroupSyncProcessor } from './child-group-sync.processor';
import { ChildGroupSyncDisabledService } from './child-group-sync-disabled.service';
import { ChildGroupSyncService } from './child-group-sync.service';
import { GroupMetadataSyncService } from './group-metadata-sync.service';
import { GroupMetadataSyncProcessor } from './group-sync.processor';
import { GroupMetadataSyncScheduler } from './group-sync.scheduler';

function groupSyncEnabledFromEnv(): boolean {
  return process.env.GROUP_SYNC_ENABLED === 'true';
}

@Module({})
export class BackgroundJobsModule {
  static register(): DynamicModule {
    if (!groupSyncEnabledFromEnv()) {
      return {
        module: BackgroundJobsModule,
        global: true,
        controllers: [BackgroundJobsStatusController],
        providers: [
          BackgroundJobStateService,
          {
            provide: ChildGroupSyncService,
            useClass: ChildGroupSyncDisabledService,
          },
        ],
        exports: [ChildGroupSyncService, BackgroundJobStateService],
      };
    }

    return {
      module: BackgroundJobsModule,
      global: true,
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
      controllers: [BackgroundJobsStatusController],
      providers: [
        BackgroundJobStateService,
        GroupMetadataSyncService,
        GroupMetadataSyncProcessor,
        GroupMetadataSyncScheduler,
        ChildGroupScanStaleScheduler,
        ChildGroupSyncService,
        ChildGroupSyncProcessor,
      ],
      exports: [ChildGroupSyncService, BackgroundJobStateService],
    };
  }
}
