import { IsEmail, IsOptional } from 'class-validator';

export class PartnerInviteDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
