import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export const MESSAGE_STATUSES = ['SENT', 'FAILED', 'RECALL'] as const;

export class FindMessagesDto {
  @IsOptional()
  @IsIn(MESSAGE_STATUSES)
  status?: (typeof MESSAGE_STATUSES)[number];

  /** Case-insensitive substring match on message `content`. */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  /**
   * Group or DM recipient: matches `group.groupName`, `group.originName`, or `peerPhone`.
   */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  target?: string;

  /**
   * Sender filter: exact UUID (`senderId`) or case-insensitive match on sender
   * `name`, `phone`, `zaloId`.
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sender?: string;

  /** Case-insensitive match on `peerPhone` or sender `phone`. */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  /** Inclusive lower bound for send time (`sentAt`, or `createdAt` when `sentAt` is null). ISO 8601. */
  @IsOptional()
  @IsDateString()
  sentFrom?: string;

  /** Inclusive upper bound for send time (`sentAt`, or `createdAt` when `sentAt` is null). ISO 8601. */
  @IsOptional()
  @IsDateString()
  sentTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;
}
