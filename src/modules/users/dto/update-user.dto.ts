import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { APP_ROLES } from '../../../common/utils/app-role';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn(APP_ROLES)
  role?: (typeof APP_ROLES)[number];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
