import { DayPlanShareAccess } from '@prisma/client';
import { IsEmail, IsEnum, MaxLength } from 'class-validator';

export class ShareInviteDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsEnum(DayPlanShareAccess)
  access!: DayPlanShareAccess;
}

export class UpdateShareGrantDto {
  @IsEnum(DayPlanShareAccess)
  access!: DayPlanShareAccess;
}
