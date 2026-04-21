import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindZaloGroupsDto {
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

  /**
   * Only used by `GET /zalo-groups/account/:id`. When set (non-empty after trim), filters linked groups
   * whose `group_name` contains this substring (case-insensitive). Omitted or blank: no name filter.
   */
  @IsOptional()
  @IsString()
  group_name?: string;
}
