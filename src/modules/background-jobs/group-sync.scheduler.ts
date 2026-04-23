import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { CronJob } from 'cron';
import { GROUP_METADATA_SYNC_QUEUE } from './constants';

/**
 * Cron only enqueues; {@link GroupMetadataSyncProcessor} runs real work.
 */
@Injectable()
export class GroupMetadataSyncScheduler
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(GroupMetadataSyncScheduler.name);
  private job: CronJob | null = null;

  constructor(
    @InjectQueue(GROUP_METADATA_SYNC_QUEUE) private readonly queue: Queue,
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    if (this.config.get('groupSync.enabled') !== true) {
      this.logger.log(
        'Group metadata sync cron disabled (groupSync.enabled is not true).',
      );
      return;
    }
    const pattern =
      this.config.get<string>('groupSync.cron') ?? '0 */3 * * * *';
    const timeZone = this.config.get<string>('groupSync.timezone') || undefined;
    this.job = new CronJob(
      pattern,
      () => {
        void this.enqueueTick();
      },
      null,
      false,
      timeZone,
    );
    this.schedulerRegistry.addCronJob('groupMetadataSync', this.job);
    this.job.start();
    this.logger.log(
      `Group metadata sync cron started (pattern="${pattern}"${timeZone ? `, tz=${timeZone}` : ''}) — enqueue only.`,
    );
  }

  onModuleDestroy(): void {
    this.job?.stop();
  }

  private async enqueueTick(): Promise<void> {
    try {
      await this.queue.add(
        'tick',
        {},
        { removeOnComplete: 200, removeOnFail: 100 },
      );
    } catch (e) {
      this.logger.error(
        `Failed to enqueue group-metadata-sync tick: ${e instanceof Error ? e.message : String(e)}`,
        e instanceof Error ? e.stack : undefined,
      );
    }
  }
}
