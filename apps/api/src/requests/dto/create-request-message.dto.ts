import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRequestMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;
}
