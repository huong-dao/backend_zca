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
}

/** Built in the controller for `GET /zalo-groups/account/:id` (not validated as a single `@Query()` object). */
export type FindZaloGroupsByAccountQuery = {
  page: number;
  limit: number;
  group_name?: string;
};
