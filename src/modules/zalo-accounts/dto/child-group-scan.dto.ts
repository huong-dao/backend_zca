import { IsUUID } from 'class-validator';

/** Child `zalo_login_sessions.id` for getAllGroups / getGroupInfo as that child. */
export class ChildGroupScanDto {
  @IsUUID('4')
  sessionId!: string;
}
