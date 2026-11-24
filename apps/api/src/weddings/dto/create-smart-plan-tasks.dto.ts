import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SmartPlanTaskItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  templateId!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;
}

/** Пакетне створення завдань із «Розумного планування». */
export class CreateSmartPlanTasksDto {
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => SmartPlanTaskItemDto)
  tasks!: SmartPlanTaskItemDto[];
}
