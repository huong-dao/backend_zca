import { IsUUID } from 'class-validator';

export class ZaloGroupsQueryDto {
  @IsUUID('4')
  sessionId!: string;
}
