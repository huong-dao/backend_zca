import { IsObject } from 'class-validator';

export class UpdateGroupDataDto {
  @IsObject()
  groupData!: Record<string, string>;
}
