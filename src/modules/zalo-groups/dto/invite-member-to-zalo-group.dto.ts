import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class InviteMemberToZaloGroupDto {
  /** Master `zalo_login_sessions.id` — must be logged in as the master Zalo account that admins the group. */
  @IsUUID('4')
  sessionId!: string;

  /** Master row in `zalo_accounts` (`isMaster === true`). Used to resolve `groupZaloId` and optional child relation. */
  @IsUUID('4')
  masterZaloAccountId!: string;

  /** Child phone for `findUser` on the master session. Omit if `childZaloAccountId` has a phone on file. */
  @IsOptional()
  @IsString()
  @MinLength(5)
  phoneNumber?: string;

  /** Optional: load phone from this child `zalo_accounts` row; must be linked to `masterZaloAccountId` as a child. */
  @IsOptional()
  @IsUUID('4')
  childZaloAccountId?: string;
}
