import { IsInt, Min } from 'class-validator';

export class UpdateMessageIntervalDto {
  @IsInt()
  @Min(0)
  minutes!: number;
}
