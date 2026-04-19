import { IsIn } from 'class-validator';

export class FilterZaloAccountsDto {
  @IsIn(['master', 'child'])
  type!: 'master' | 'child';
}
