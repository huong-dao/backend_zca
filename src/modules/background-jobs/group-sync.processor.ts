import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { BackgroundJobStateService } from './background-job-state.service';
import { GROUP_METADATA_SYNC_QUEUE } from './constants';
import { GroupMetadataSyncService } from './group-metadata-sync.service';

@Processor(GROUP_METADATA_SYNC_QUEUE, {
  concurrency: 1,
  limiter: { max: 30, duration: 60_000 },
})
export class GroupMetadataSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(GroupMetadataSyncProcessor.name);

  constructor(
    private readonly groupMetadataSync: GroupMetadataSyncService,
    private readonly jobState: BackgroundJobStateService,
  ) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    if (job.name && job.name !== 'tick') {
      this.logger.warn(
        `Unexpected job name "${job.name}", still running batch.`,
      );
    }
    await this.jobState.markGroupMetadataSyncRunning();
    try {
      return await this.groupMetadataSync.runSyncBatch();
    } finally {
      await this.jobState.markGroupMetadataSyncIdle();
    }
  }
}
