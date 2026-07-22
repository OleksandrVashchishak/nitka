import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateBudgetPlanDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  budget!: number;
}

export class CreateBudgetItemDto {
  @IsString()
  @MinLength(2)
  category!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimated!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  actual?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBudgetItemDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  category?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estimated?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  actual?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
