import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ChangeZaloGroupNameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  group_name!: string;

  /** Master `zalo_login_sessions.id` — session of the master that admins the group on Zalo. */
  @IsUUID('4')
  sessionId!: string;

  /** Master `zalo_accounts.id` (`isMaster === true`) — used to resolve `group_zalo_id`. */
  @IsUUID('4')
  masterZaloAccountId!: string;
}
