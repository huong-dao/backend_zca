import { IsString, IsUUID, MinLength } from 'class-validator';

export class GetZaloGroupInfoDto {
  /** `zalo_login_sessions.id` of the logged-in Zalo account. */
  @IsUUID('4')
  sessionId!: string;

  /** Zalo group grid id (`group_zalo_id`) — same id passed to zca-js `getGroupInfo`. */
  @IsString()
  @MinLength(1)
  groupId!: string;
}
