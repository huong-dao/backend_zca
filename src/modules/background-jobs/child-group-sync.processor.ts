import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { CHILD_GROUP_SCAN_QUEUE } from './constants';
import type { ChildGroupScanJobPayload } from './child-group-sync.service';
import { ChildGroupSyncService } from './child-group-sync.service';

@Processor(CHILD_GROUP_SCAN_QUEUE, { concurrency: 2, limiter: { max: 5, duration: 60_000 } })
export class ChildGroupSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(ChildGroupSyncProcessor.name);

  constructor(private readonly childGroupSync: ChildGroupSyncService) {
    super();
  }

  async process(job: Job<ChildGroupScanJobPayload>): Promise<unknown> {
    return this.childGroupSync.runScanFromJob(job);
  }
}
