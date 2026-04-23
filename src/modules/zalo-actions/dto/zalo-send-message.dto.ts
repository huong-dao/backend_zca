import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ThreadType } from 'zca-js';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloSendMessageDto extends ZaloActionSessionIdDto {
  /**
   * Plain text, or empty when `attachmentLocalPaths` is set (internal server-side use).
   * For JSON `POST /zalo/actions/send-message`, always required (no `attachmentLocalPaths`).
   */
  @ValidateIf((o: ZaloSendMessageDto) => !o.attachmentLocalPaths?.length)
  @IsString()
  @MinLength(1)
  text?: string;

  /** Zalo thread id (user or group id / grid id depending on `threadType`). */
  @IsString()
  @MinLength(1)
  threadId!: string;

  /** Omit = group thread (`ThreadType.Group`) for `POST /zalo/actions/send-message`. */
  @IsOptional()
  @IsEnum(ThreadType)
  threadType?: ThreadType;

  /**
   * Absolute local paths; passed as `MessageContent.attachments` to zca-js. Not used by HTTP clients.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentLocalPaths?: string[];
}
