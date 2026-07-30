import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @IsEmail({}, { message: 'Некоректний email' })
  email!: string;
}
