import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { APP_ROLES } from '../../../common/utils/app-role';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsIn(APP_ROLES)
  role!: (typeof APP_ROLES)[number];
}
