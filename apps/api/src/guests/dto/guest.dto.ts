import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { GuestSide, RsvpStatus } from '@prisma/client';

export class CreateGuestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(GuestSide)
  side?: GuestSide;

  @IsOptional()
  @IsEnum(RsvpStatus)
  rsvpStatus?: RsvpStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  plusOne?: boolean;

  @IsOptional()
  @IsString()
  plusOneName?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  plusOneAttending?: boolean;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  tableLabel?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ImportGuestRowDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(GuestSide)
  side?: GuestSide;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  plusOne?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ImportGuestsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportGuestRowDto)
  guests!: ImportGuestRowDto[];
}

export class UpdateGuestDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== '')
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsEnum(GuestSide)
  side?: GuestSide;

  @IsOptional()
  @IsEnum(RsvpStatus)
  rsvpStatus?: RsvpStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  plusOne?: boolean;

  @IsOptional()
  @IsString()
  plusOneName?: string | null;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  plusOneAttending?: boolean | null;

  @IsOptional()
  @IsString()
  allergies?: string | null;

  @IsOptional()
  @IsString()
  tableLabel?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}

export class PublicRsvpDto {
  @IsEnum(RsvpStatus)
  rsvpStatus!: RsvpStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  plusOneAttending?: boolean;

  @IsOptional()
  @IsString()
  plusOneName?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
