import { IsUUID } from 'class-validator';

export class CreateZaloAccountFriendDto {
  @IsUUID()
  masterId!: string;

  @IsUUID()
  friendId!: string;
}
