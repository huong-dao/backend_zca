import { IsString, Matches, MinLength } from 'class-validator';

export class AddChildAccountDto {
  @IsString()
  @MinLength(1)
  masterId!: string;

  @IsString()
  @Matches(/^\d{9,15}$/, {
    message:
      'phone must contain only digits and be between 9 and 15 characters.',
  })
  phone!: string;
}
