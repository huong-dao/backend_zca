import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class FindMediaDto {
  /** Case-insensitive substring match on `fileName`. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fileName?: string;

  /** Inclusive lower bound for `sentAt`. ISO 8601. */
  @IsOptional()
  @IsDateString()
  sentFrom?: string;

  /** Inclusive upper bound for `sentAt`. ISO 8601. */
  @IsOptional()
  @IsDateString()
  sentTo?: string;

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
