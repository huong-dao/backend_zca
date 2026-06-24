import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Form fields for `POST /messages/send` (multipart).
 * Target: exactly one of `groupId` (group) or `peerPhone` (DM).
 * Either non-empty `text` or at least one file is required (enforced in service).
 */
export class SendMessageDto {
  @IsUUID('4')
  zaloAccountId!: string;

  @IsOptional()
  @IsUUID('4')
  groupId?: string;

  /** Normalized VN mobile for DM; mutually exclusive with `groupId`. */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  peerPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  text?: string;
}
