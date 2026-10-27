import { ContactStatus } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateContactStatusDto {
  @IsEnum(ContactStatus)
  status!: ContactStatus;
}

export class ReplyContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  body!: string;
}
