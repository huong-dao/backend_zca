import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateZaloGroupItemDto {
  @IsString()
  @MinLength(1)
  group_name!: string;

  @IsString()
  @MinLength(1)
  group_zalo_id!: string;
}

export class CreateMultipleZaloGroupsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateZaloGroupItemDto)
  groups!: CreateZaloGroupItemDto[];
}
