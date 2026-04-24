import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ConfigurationEntryDto {
  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  key!: string;

  @Transform(trim)
  @IsString()
  @MaxLength(255)
  value!: string;
}

/**
 * Form body: nhiều cặp `key` / `value` — trùng `key` trong DB thì cập nhật, chưa có thì tạo.
 * Nếu cùng `key` lặp lại trong mảng, bản ghi sau ghi đè bản trước.
 */
export class UpsertConfigurationsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConfigurationEntryDto)
  entries!: ConfigurationEntryDto[];
}
