import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export const MESSAGE_STATUSES = ['SENT', 'FAILED', 'RECALL'] as const;

export class FindMessagesDto {
  @IsOptional()
  @IsIn(MESSAGE_STATUSES)
  status?: (typeof MESSAGE_STATUSES)[number];

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
