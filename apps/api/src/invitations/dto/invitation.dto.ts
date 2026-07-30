import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpsertWeddingInvitationDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  templateId?: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;
}
