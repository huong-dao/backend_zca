import { IsString, MinLength } from 'class-validator';

export class ConfirmLoginDto {
  @IsString()
  @MinLength(1)
  sessionId!: string;
}
