import {
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class InviteMemberToZaloGroupDto {
  /**
   * Internal `zalo_groups.id`. When set, the group is resolved by this UUID (scoped to `masterZaloAccountId`);
   * `groupName` is ignored for lookup.
   */
  @IsOptional()
  @IsUUID('4')
  groupId?: string;

  /**
   * Required when `groupId` is omitted. `zalo_groups.group_name` — must be linked to `masterZaloAccountId`
   * via `zalo_account_groups`.
   */
  @ValidateIf((o) => !o.groupId)
  @IsString()
  @MinLength(1)
  groupName?: string;

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
