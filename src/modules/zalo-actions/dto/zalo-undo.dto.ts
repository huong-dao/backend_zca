import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ThreadType } from 'zca-js';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

/**
 * Maps to zca-js `api.undo(UndoPayload, threadId, type)` — see `docs/Zalo_Integration.mdc` (API: undo).
 */
export class ZaloUndoDto extends ZaloActionSessionIdDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  /** Zalo `msgId` (global id). */
  msgId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  /** Same as `UndoPayload.cliMsgId`. */
  cliMsgId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  /** Group grid id or DM peer id — same as `sendMessage` `threadId`. */
  threadId!: string;

  @IsOptional()
  @IsEnum(ThreadType)
  /** Omit = `ThreadType.Group` for the HTTP route (typical for app group messages). */
  threadType?: ThreadType;
}
