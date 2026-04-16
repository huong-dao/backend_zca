import { IsInt, IsOptional, Min } from 'class-validator';

export class FindZaloGroupsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit = 20;
}
