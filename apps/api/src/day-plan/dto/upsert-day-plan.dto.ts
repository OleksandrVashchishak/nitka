import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DayPlanEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  time!: string;

  @IsInt()
  @Min(5)
  @Max(24 * 60)
  durationMin!: number;
}

export class UpsertDayPlanDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => DayPlanEventDto)
  events!: DayPlanEventDto[];
}
