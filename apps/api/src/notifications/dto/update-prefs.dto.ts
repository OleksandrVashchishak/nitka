import { IsBoolean, IsIn, IsOptional } from 'class-validator';

/** Налаштування › Сповіщення (notifications-spec.md, розділ 8). */
export class UpdateNotificationPrefsDto {
  @IsOptional()
  @IsBoolean()
  tasks?: boolean;

  @IsOptional()
  @IsIn(['normal', 'less'])
  taskFrequency?: 'normal' | 'less';

  @IsOptional()
  @IsBoolean()
  guests?: boolean;

  @IsOptional()
  @IsBoolean()
  partnerActivity?: boolean;

  @IsOptional()
  @IsBoolean()
  invitationAndDayPlan?: boolean;

  @IsOptional()
  @IsBoolean()
  milestones?: boolean;

  @IsOptional()
  @IsBoolean()
  tips?: boolean;

  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;
}
