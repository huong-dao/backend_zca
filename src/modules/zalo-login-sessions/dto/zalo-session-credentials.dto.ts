import { Type } from 'class-transformer';
import { IsArray, IsString, MinLength } from 'class-validator';

export class ZaloSessionCredentialsDto {
  @IsString()
  @MinLength(1)
  imei!: string;

  @IsString()
  @MinLength(1)
  userAgent!: string;

  /**
   * SerializedCookie-like objects from tough-cookie / zca-js.
   * `@Type(() => Object)` is required: with `enableImplicitConversion`, plain objects in
   * arrays are otherwise coerced to empty arrays `[]` during `plainToInstance`.
   */
  @IsArray()
  @Type(() => Object)
  cookies!: Record<string, unknown>[];
}
