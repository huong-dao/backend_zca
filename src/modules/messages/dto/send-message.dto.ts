import { IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  masterId!: string;

  @IsString()
  @MinLength(1)
  groupId!: string;

  @IsString()
  @MinLength(1)
  content!: string;
}
