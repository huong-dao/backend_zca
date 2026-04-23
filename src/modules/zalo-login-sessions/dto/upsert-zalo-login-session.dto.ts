import { Type } from 'class-transformer';
import { IsISO8601, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { ZaloSessionCredentialsDto } from './zalo-session-credentials.dto';
import { ZaloSessionUserDto } from './zalo-session-user.dto';

export class UpsertZaloLoginSessionDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ValidateNested()
  @Type(() => ZaloSessionUserDto)
  user!: ZaloSessionUserDto;

  @ValidateNested()
  @Type(() => ZaloSessionCredentialsDto)
  credentials!: ZaloSessionCredentialsDto;

  @IsOptional()
  @IsISO8601()
  createdAt?: string;

  @IsOptional()
  @IsISO8601()
  updatedAt?: string;
}
