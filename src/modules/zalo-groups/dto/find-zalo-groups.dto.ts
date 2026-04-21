import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

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

  /** Exact match on `zalo_groups.global_id` (server-side filter; not echoed in response). */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  global_id?: string;
}

/** Built in the controller for `GET /zalo-groups/account/:id` (not validated as a single `@Query()` object). */
export type FindZaloGroupsByAccountQuery = {
  page: number;
  limit: number;
  group_name?: string;
  /** Exact match on `zalo_groups.global_id`. */
  global_id?: string;
};
