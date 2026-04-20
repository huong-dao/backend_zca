import { IsString, MinLength } from 'class-validator';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloGroupInfoDto extends ZaloActionSessionIdDto {
  @IsString()
  @MinLength(1)
  groupId!: string;
}
