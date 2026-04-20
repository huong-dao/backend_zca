import { IsString, MinLength } from 'class-validator';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloFindUserDto extends ZaloActionSessionIdDto {
  @IsString()
  @MinLength(5)
  phoneNumber!: string;
}
