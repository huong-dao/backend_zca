import { IsString, MinLength } from 'class-validator';

export class AddChildAccountDto {
  @IsString()
  @MinLength(1)
  masterId!: string;

  // unique zalo id
  @IsString()
  @MinLength(1)
  zaloId!: string;
}
