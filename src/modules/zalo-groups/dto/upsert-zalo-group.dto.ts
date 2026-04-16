import { IsString, MinLength } from 'class-validator';

export class UpsertZaloGroupDto {
  @IsString()
  @MinLength(1)
  group_name!: string;
}
