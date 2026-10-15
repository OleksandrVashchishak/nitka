import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message!: string;
}
