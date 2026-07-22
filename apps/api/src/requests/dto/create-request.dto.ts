import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestDto {
  @IsString()
  vendorId!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  @MinLength(2)
  city!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  budget!: number;

  @IsString()
  @MinLength(3)
  message!: string;
}
