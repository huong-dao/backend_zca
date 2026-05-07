import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../../common/decorators/roles.decorator';
import { BackgroundJobStateService } from './background-job-state.service';

@Roles('ADMIN', 'USER')
@Controller('background-jobs')
export class BackgroundJobsStatusController {
  constructor(
    private readonly jobState: BackgroundJobStateService,
    private readonly config: ConfigService,
  ) {}

  @Get('group-metadata-sync/status')
  getGroupMetadataSyncStatus() {
    const groupSyncEnabled = this.config.get<boolean>('groupSync.enabled') === true;
    return this.jobState.getGroupMetadataSyncStatus(groupSyncEnabled);
  }

  @Get('child-group-scan/status')
  listChildGroupScanStatus() {
    return this.jobState.listRunningChildGroupScans();
  }
}
