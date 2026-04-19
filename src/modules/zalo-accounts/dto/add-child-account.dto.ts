import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class AddChildAccountDto {
  @IsUUID()
  masterId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  childIds: string[] = [];
}
