import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentKind, ContentStatus } from '@prisma/client';

export class UpsertContentTopicDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpsertContentPostDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string | null;

  @IsOptional()
  @IsEnum(ContentKind)
  kind?: ContentKind;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsObject()
  body?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsString()
  ogImageUrl?: string | null;

  @IsOptional()
  @IsString()
  city?: string | null;

  @IsOptional()
  @IsString()
  vendorCategorySlug?: string | null;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsString()
  topicId!: string;
}

export class UpdateContentStatusDto {
  @IsEnum(ContentStatus)
  status!: ContentStatus;
}
