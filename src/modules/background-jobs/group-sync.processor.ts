import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { GROUP_METADATA_SYNC_QUEUE } from './constants';
import { GroupMetadataSyncService } from './group-metadata-sync.service';

@Processor(GROUP_METADATA_SYNC_QUEUE, {
  concurrency: 1,
  limiter: { max: 30, duration: 60_000 },
})
export class GroupMetadataSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(GroupMetadataSyncProcessor.name);

  constructor(private readonly groupMetadataSync: GroupMetadataSyncService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    if (job.name && job.name !== 'tick') {
      this.logger.warn(
        `Unexpected job name "${job.name}", still running batch.`,
      );
    }
    return this.groupMetadataSync.runSyncBatch();
  }
}
