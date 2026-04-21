import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpsertZaloGroupDto {
  @IsString()
  @MinLength(1)
  group_name!: string;

  @IsString()
  @MinLength(1)
  group_zalo_id!: string;

  /** Zalo group global id; unique when set. Not returned in list/detail APIs. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  global_id?: string;
}
