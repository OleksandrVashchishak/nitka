import { IsArray, IsNumber, IsObject, IsOptional } from 'class-validator';

export class UpsertSeatingDraftDto {
  @IsObject()
  tables!: Record<string, unknown>;

  @IsObject()
  guests!: Record<string, unknown>;
}

export class UpsertSeatingPlanDto {
  @IsArray()
  tables!: unknown[];

  @IsOptional()
  @IsNumber()
  savedAt?: number;
}
