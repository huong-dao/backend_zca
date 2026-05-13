import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ChildGroupSyncService } from './child-group-sync.service';

/**
 * Releases stale child `INACTIVE` locks when Bull/job-state indicates no healthy scan (dead worker, lost jobs).
 */
@Injectable()
export class ChildGroupScanStaleScheduler
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ChildGroupScanStaleScheduler.name);
  private job: CronJob | null = null;

  constructor(
    private readonly childGroupSync: ChildGroupSyncService,
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    if (this.config.get('groupSync.enabled') !== true) {
      return;
    }
    const pattern =
      this.config.get<string>('childGroupSync.staleWatchdogCron') ??
      '0 */5 * * * *';
    const timeZone = this.config.get<string>('groupSync.timezone') || undefined;
    this.job = new CronJob(
      pattern,
      () => {
        void this.tick();
      },
      null,
      false,
      timeZone,
    );
    this.schedulerRegistry.addCronJob('childGroupScanStale', this.job);
    this.job.start();
    this.logger.log(
      `Child group scan stale-lock watchdog started (pattern="${pattern}"${timeZone ? `, tz=${timeZone}` : ''}).`,
    );
  }

  onModuleDestroy(): void {
    this.job?.stop();
  }

  private async tick(): Promise<void> {
    try {
      const { released } = await this.childGroupSync.reconcileStaleInactiveChildScans();
      if (released > 0) {
        this.logger.warn(
          `Child scan stale watchdog released ${released} stuck INACTIVE account(s).`,
        );
      }
    } catch (e) {
      this.logger.error(
        `Child scan stale watchdog failed: ${e instanceof Error ? e.message : String(e)}`,
        e instanceof Error ? e.stack : undefined,
      );
    }
  }
}
