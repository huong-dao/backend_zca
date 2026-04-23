import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Form fields for `POST /messages/send` (multipart: `zaloAccountId`, `groupId`, optional `text`, optional `files`).
 * Either non-empty `text` or at least one file is required (enforced in {@link MessagesService.send}).
 */
export class SendMessageDto {
  @IsUUID('4')
  zaloAccountId!: string;

  @IsUUID('4')
  groupId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  text?: string;
}
