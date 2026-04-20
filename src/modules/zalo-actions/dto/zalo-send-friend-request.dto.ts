import { IsOptional, IsString, MinLength } from 'class-validator';
import { ZaloActionSessionIdDto } from './zalo-action-session-id.dto';

export class ZaloSendFriendRequestDto extends ZaloActionSessionIdDto {
  @IsString()
  @MinLength(1)
  userId!: string;

  @IsOptional()
  @IsString()
  message?: string;
}
