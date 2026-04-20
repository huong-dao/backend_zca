import { IsUUID } from 'class-validator';

export class ZaloActionSessionIdDto {
  @IsUUID('4')
  sessionId!: string;
}
