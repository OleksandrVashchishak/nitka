import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class DayPlanEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  id!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(12 * 60)
  durationMin!: number;

  @ValidateIf((_, v) => v !== null)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  startMin!: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  icon?: string;
}

export class UpsertDayPlanDto {
  @IsIn([1])
  version!: 1;

  @IsArray()
  @ArrayMaxSize(80)
  @ValidateNested({ each: true })
  @Type(() => DayPlanEventDto)
  events!: DayPlanEventDto[];

  @IsOptional()
  @IsBoolean()
  use24h?: boolean;
}
