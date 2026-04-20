import { IsArray, IsString, MinLength } from 'class-validator';

export class ZaloSessionCredentialsDto {
  @IsString()
  @MinLength(1)
  imei!: string;

  @IsString()
  @MinLength(1)
  userAgent!: string;

  /** SerializedCookie-like objects from tough-cookie / zca-js */
  @IsArray()
  cookies!: Record<string, unknown>[];
}
