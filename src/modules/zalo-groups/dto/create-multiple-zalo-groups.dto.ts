import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

/** When set on bulk create, existing `group_zalo_id` rows update `ZaloGroup.originName` instead of being skipped. */
export const CREATE_MULTIPLE_ZALO_GROUPS_MODE_UPDATE_ORIGIN_NAME =
  'update origin name' as const;

export const CREATE_MULTIPLE_ZALO_GROUPS_MODES = [
  CREATE_MULTIPLE_ZALO_GROUPS_MODE_UPDATE_ORIGIN_NAME,
] as const;

export class CreateZaloGroupItemDto {
  @IsString()
  @MinLength(1)
  group_name!: string;

  @IsString()
  @MinLength(1)
  group_zalo_id!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  global_id?: string;
}

export class CreateMultipleZaloGroupsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateZaloGroupItemDto)
  groups!: CreateZaloGroupItemDto[];

  @IsOptional()
  @IsIn(CREATE_MULTIPLE_ZALO_GROUPS_MODES)
  mode?: (typeof CREATE_MULTIPLE_ZALO_GROUPS_MODES)[number];
}
