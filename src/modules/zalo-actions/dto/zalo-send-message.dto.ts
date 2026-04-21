import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ThreadType } from 'zca-js';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloSendMessageDto extends ZaloActionSessionIdDto {
  /** Plain text body (for rich `MessageContent`, call `ZcaApiHelper.sendMessage` from code). */
  @IsString()
  @MinLength(1)
  text!: string;

  /** Zalo thread id (user or group id / grid id depending on `threadType`). */
  @IsString()
  @MinLength(1)
  threadId!: string;

  /** Omit = group thread (`ThreadType.Group`) for `POST /zalo/actions/send-message`. */
  @IsOptional()
  @IsEnum(ThreadType)
  threadType?: ThreadType;
}
