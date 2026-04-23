import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * Injected in place of {@link import('./child-group-sync.service').ChildGroupSyncService}
 * when `GROUP_SYNC_ENABLED` is not `true`, so Bull/Redis are not required (local dev).
 */
@Injectable()
export class ChildGroupSyncDisabledService {
  async startChildGroupScan(
    _appUserId: string,
    _zaloAccountId: string,
    _sessionId: string,
  ): Promise<{
    enqueued: boolean;
    zaloAccountId: string;
    status: string;
  }> {
    void _appUserId;
    void _zaloAccountId;
    void _sessionId;
    throw new BadRequestException(
      'Group sync and child scan are disabled. Set GROUP_SYNC_ENABLED=true and run Redis, or use this only in environments that need it.',
    );
  }

  async enqueueAfterInvite(
    _appUserId: string,
    _childZaloAccountId: string,
  ): Promise<void> {
    return;
  }
}
