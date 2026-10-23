import { TaskStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export const TASK_ASSIGNEES = [
  'owner',
  'partner',
  'both',
  'none',
  'other',
] as const;

export type TaskAssignee = (typeof TASK_ASSIGNEES)[number];

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsDateString()
  dueDate?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsIn(TASK_ASSIGNEES)
  assignee?: TaskAssignee | null;

  /** Custom label when assignee === "other". */
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(80)
  assigneeName?: string | null;
}
