import { IsString, MinLength } from 'class-validator';

export class SendPublicMessageDto {
  @IsString()
  @MinLength(1)
  groupId!: string;

  @IsString()
  @MinLength(1)
  content!: string;
}
