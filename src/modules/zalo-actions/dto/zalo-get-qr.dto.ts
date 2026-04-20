import { IsString, MinLength } from 'class-validator';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloGetQrDto extends ZaloActionSessionIdDto {
  @IsString()
  @MinLength(1)
  userId!: string;
}
