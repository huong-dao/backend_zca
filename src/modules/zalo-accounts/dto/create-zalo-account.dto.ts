import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateZaloAccountDto {
  @IsString()
  @MinLength(1)
  zaloId!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{9,15}$/, {
    message:
      'phone must contain only digits and be between 9 and 15 characters.',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
