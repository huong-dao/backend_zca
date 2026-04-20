import { IsOptional, IsString, MinLength } from 'class-validator';

export class ZaloSessionUserDto {
  @IsString()
  @MinLength(1)
  uid!: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  zaloName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  cover?: string;
}
