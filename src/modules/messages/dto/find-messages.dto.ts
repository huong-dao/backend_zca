import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export const MESSAGE_STATUSES = ['SENT', 'FAILED', 'RECALL'] as const;

export class FindMessagesDto {
  @IsOptional()
  @IsIn(MESSAGE_STATUSES)
  status?: (typeof MESSAGE_STATUSES)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20;
}
