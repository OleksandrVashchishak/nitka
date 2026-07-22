import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class VendorPackageDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  includes?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}

export class VendorFaqDto {
  @IsString()
  @MinLength(1)
  question!: string;

  @IsString()
  @MinLength(1)
  answer!: string;
}

export class VendorTeamMemberDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  role!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string | null;
}

export class UpsertVendorProfileDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsString()
  description!: string;

  @IsString()
  categoryId!: string;

  @IsString()
  @MinLength(2)
  city!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceFrom!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceTo?: number | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  website?: string | null;

  @IsOptional()
  @IsString()
  instagram?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yearsInBusiness?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamSize?: number | null;

  @IsOptional()
  @IsString()
  responseTime?: string | null;

  @IsOptional()
  @IsString()
  bookingLeadTime?: string | null;

  @IsOptional()
  @IsString()
  availabilityNote?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string | null;

  @IsOptional()
  @IsString()
  dealTitle?: string | null;

  @IsOptional()
  @IsString()
  dealDescription?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  styles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceAreas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString({ each: true })
  photoUrls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorPackageDto)
  packages?: VendorPackageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorFaqDto)
  faqs?: VendorFaqDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorTeamMemberDto)
  team?: VendorTeamMemberDto[];
}
