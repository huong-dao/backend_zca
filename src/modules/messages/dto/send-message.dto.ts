import { IsString, IsUUID, MinLength } from 'class-validator';

export class SendMessageDto {
  /** Child `zalo_accounts.id` — must have `zalo_id` set and a matching `zalo_login_sessions` row for the JWT user. */
  @IsUUID('4')
  zaloAccountId!: string;

  /** Internal `zalo_groups.id`. */
  @IsUUID('4')
  groupId!: string;

  @IsString()
  @MinLength(1)
  text!: string;
}
