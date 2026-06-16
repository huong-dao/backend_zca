import { IsUUID } from 'class-validator';

export class VerifyZaloLoginSessionDto {
  @IsUUID('4')
  sessionId!: string;
}
