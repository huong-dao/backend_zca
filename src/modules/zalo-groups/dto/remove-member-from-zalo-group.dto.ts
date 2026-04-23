import {
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RemoveMemberFromZaloGroupDto {
  @IsOptional()
  @IsUUID('4')
  groupId?: string;

  @ValidateIf((o) => !o.groupId)
  @IsString()
  @MinLength(1)
  groupName?: string;

  @IsUUID('4')
  sessionId!: string;

  @IsUUID('4')
  masterZaloAccountId!: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  phoneNumber?: string;

  @IsOptional()
  @IsUUID('4')
  childZaloAccountId?: string;
}
