/** BullMQ queue: sync `ZaloGroup.groupName` + `globalId` from Zalo. */
export const GROUP_METADATA_SYNC_QUEUE = 'group-metadata-sync';

/** Child: getAllGroups + batch getGroupInfo to map ZaloGroup / ZaloAccountGroup. */
export const CHILD_GROUP_SCAN_QUEUE = 'child-group-scan';

/** Primary key in `BackgroundJobState` for the master metadata sync job. */
export const GROUP_METADATA_SYNC_JOB_KEY = 'group-metadata-sync';

/** `BackgroundJobState.jobKey` for a child group scan (one row per child account). */
export function childGroupScanJobKey(zaloAccountId: string): string {
  return `child-group-scan:${zaloAccountId}`;
}
