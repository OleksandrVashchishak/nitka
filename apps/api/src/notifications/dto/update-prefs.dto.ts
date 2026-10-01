import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPrefsDto {
  @IsOptional()
  @IsBoolean()
  guestRsvp?: boolean;

  @IsOptional()
  @IsBoolean()
  upcomingPayments?: boolean;

  @IsOptional()
  @IsBoolean()
  taskDeadlines?: boolean;

  @IsOptional()
  @IsBoolean()
  partnerChanges?: boolean;

  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;
}
