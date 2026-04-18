import { IsOptional, IsString } from 'class-validator';

export class SearchZaloAccountsDto {
  @IsOptional()
  @IsString()
  keyword: string;
}
