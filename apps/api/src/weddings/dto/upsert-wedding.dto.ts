import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpsertWeddingDto {
  @IsDateString()
  date!: string;

  @IsString()
  city!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  budget!: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  partnerOneName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  partnerTwoName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  couplePhotoUrl?: string | null;

  @IsOptional()
  @IsIn([
    'NOT_ENGAGED',
    'EXPLORING',
    'PLANNING_NO_VENUE',
    'PLANNING_WITH_VENUE',
    'FINAL_DETAILS',
  ])
  planningStage?: string;

  @IsOptional()
  @IsBoolean()
  cityUndecided?: boolean;

  @IsOptional()
  @IsBoolean()
  guestsUndecided?: boolean;
}
