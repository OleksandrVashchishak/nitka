import { Type } from 'class-transformer';
import { VendorPipelineStage } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdatePipelineDto {
  @IsOptional()
  @IsEnum(VendorPipelineStage)
  stage?: VendorPipelineStage;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quotedPrice?: number | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}

export class CreateExternalVendorDto extends UpdatePipelineDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  category!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;
}

export class UpdateExternalVendorDto extends UpdatePipelineDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  website?: string | null;
}
