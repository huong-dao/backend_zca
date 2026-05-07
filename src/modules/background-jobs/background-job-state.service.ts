import { Injectable } from '@nestjs/common';
import {
  BackgroundJobStatus,
  BackgroundJobType,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { childGroupScanJobKey, GROUP_METADATA_SYNC_JOB_KEY } from './constants';

export type GroupMetadataSyncJobStatusDto = {
  jobKey: string;
  jobType: 'GROUP_METADATA_SYNC';
  status: 'IDLE' | 'RUNNING';
  groupSyncEnabled: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  updatedAt: string | null;
};

export type ChildGroupScanJobStatusDto = {
  jobKey: string;
  jobType: 'CHILD_GROUP_SCAN';
  zaloAccountId: string;
  status: 'IDLE' | 'RUNNING';
  startedAt: string | null;
  finishedAt: string | null;
  updatedAt: string | null;
};

@Injectable()
export class BackgroundJobStateService {
  constructor(private readonly prisma: PrismaService) {}

  async markGroupMetadataSyncRunning(): Promise<void> {
    const now = new Date();
    const row = await this.prisma.backgroundJobState.findUnique({
      where: { jobKey: GROUP_METADATA_SYNC_JOB_KEY },
    });
    if (!row) {
      await this.prisma.backgroundJobState.create({
        data: {
          jobKey: GROUP_METADATA_SYNC_JOB_KEY,
          jobType: BackgroundJobType.GROUP_METADATA_SYNC,
          status: BackgroundJobStatus.RUNNING,
          startedAt: now,
        },
      });
      return;
    }
    if (row.status === BackgroundJobStatus.IDLE) {
      await this.prisma.backgroundJobState.update({
        where: { jobKey: GROUP_METADATA_SYNC_JOB_KEY },
        data: {
          status: BackgroundJobStatus.RUNNING,
          startedAt: now,
          finishedAt: null,
        },
      });
      return;
    }
    await this.prisma.backgroundJobState.update({
      where: { jobKey: GROUP_METADATA_SYNC_JOB_KEY },
      data: { status: BackgroundJobStatus.RUNNING },
    });
  }

  async markGroupMetadataSyncIdle(): Promise<void> {
    const now = new Date();
    await this.prisma.backgroundJobState.upsert({
      where: { jobKey: GROUP_METADATA_SYNC_JOB_KEY },
      create: {
        jobKey: GROUP_METADATA_SYNC_JOB_KEY,
        jobType: BackgroundJobType.GROUP_METADATA_SYNC,
        status: BackgroundJobStatus.IDLE,
        finishedAt: now,
      },
      update: {
        status: BackgroundJobStatus.IDLE,
        finishedAt: now,
      },
    });
  }

  async markChildGroupScanRunning(zaloAccountId: string): Promise<void> {
    const jobKey = childGroupScanJobKey(zaloAccountId);
    const now = new Date();
    const row = await this.prisma.backgroundJobState.findUnique({
      where: { jobKey },
    });
    if (!row) {
      await this.prisma.backgroundJobState.create({
        data: {
          jobKey,
          jobType: BackgroundJobType.CHILD_GROUP_SCAN,
          zaloAccountId,
          status: BackgroundJobStatus.RUNNING,
          startedAt: now,
        },
      });
      return;
    }
    if (row.status === BackgroundJobStatus.IDLE) {
      await this.prisma.backgroundJobState.update({
        where: { jobKey },
        data: {
          status: BackgroundJobStatus.RUNNING,
          startedAt: now,
          finishedAt: null,
        },
      });
      return;
    }
    await this.prisma.backgroundJobState.update({
      where: { jobKey },
      data: { status: BackgroundJobStatus.RUNNING },
    });
  }

  async markChildGroupScanIdle(zaloAccountId: string): Promise<void> {
    const jobKey = childGroupScanJobKey(zaloAccountId);
    const now = new Date();
    await this.prisma.backgroundJobState.upsert({
      where: { jobKey },
      create: {
        jobKey,
        jobType: BackgroundJobType.CHILD_GROUP_SCAN,
        zaloAccountId,
        status: BackgroundJobStatus.IDLE,
        finishedAt: now,
      },
      update: {
        status: BackgroundJobStatus.IDLE,
        finishedAt: now,
      },
    });
  }

  async getGroupMetadataSyncStatus(
    groupSyncEnabled: boolean,
  ): Promise<GroupMetadataSyncJobStatusDto> {
    const row = await this.prisma.backgroundJobState.findUnique({
      where: { jobKey: GROUP_METADATA_SYNC_JOB_KEY },
    });
    const status =
      !groupSyncEnabled || !row || row.status === BackgroundJobStatus.IDLE
        ? 'IDLE'
        : 'RUNNING';
    return {
      jobKey: GROUP_METADATA_SYNC_JOB_KEY,
      jobType: 'GROUP_METADATA_SYNC',
      status,
      groupSyncEnabled,
      startedAt: row?.startedAt?.toISOString() ?? null,
      finishedAt: row?.finishedAt?.toISOString() ?? null,
      updatedAt: row?.updatedAt?.toISOString() ?? null,
    };
  }

  /**
   * Running child scans only (concurrency allows multiple children at once).
   */
  async listRunningChildGroupScans(): Promise<ChildGroupScanJobStatusDto[]> {
    const rows = await this.prisma.backgroundJobState.findMany({
      where: {
        jobType: BackgroundJobType.CHILD_GROUP_SCAN,
        status: BackgroundJobStatus.RUNNING,
        zaloAccountId: { not: null },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((r) => ({
      jobKey: r.jobKey,
      jobType: 'CHILD_GROUP_SCAN' as const,
      zaloAccountId: r.zaloAccountId as string,
      status: 'RUNNING' as const,
      startedAt: r.startedAt?.toISOString() ?? null,
      finishedAt: r.finishedAt?.toISOString() ?? null,
      updatedAt: r.updatedAt.toISOString(),
    }));
  }
}
