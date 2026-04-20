import { IsString, MinLength } from 'class-validator';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloFriendActionDto extends ZaloActionSessionIdDto {
  @IsString()
  @MinLength(1)
  friendId!: string;
}
