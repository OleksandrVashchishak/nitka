import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'crypto';
import {
  SUPERADMIN_ACCESS_TTL,
  SUPERADMIN_ROLE,
  SUPERADMIN_SUB,
  getSuperadminCredentials,
} from './admin.constants';
import { AdminLoginDto } from './dto/admin-login.dto';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run compare to reduce timing leak on length
    timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

@Injectable()
export class AdminAuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(dto: AdminLoginDto) {
    const { email: expectedEmail, password: expectedPassword } =
      getSuperadminCredentials();

    if (!expectedEmail || !expectedPassword) {
      throw new UnauthorizedException('Суперадмін не налаштований');
    }

    const email = dto.email.trim().toLowerCase();
    const emailOk = safeEqual(email, expectedEmail);
    const passwordOk = safeEqual(dto.password, expectedPassword);

    if (!emailOk || !passwordOk) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const accessToken = await this.jwt.signAsync(
      {
        sub: SUPERADMIN_SUB,
        email: expectedEmail,
        role: SUPERADMIN_ROLE,
      },
      {
        secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
        expiresIn: SUPERADMIN_ACCESS_TTL,
      },
    );

    return {
      accessToken,
      user: {
        email: expectedEmail,
        role: SUPERADMIN_ROLE,
      },
    };
  }
}
