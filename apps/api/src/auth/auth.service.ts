import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt.strategy';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';
const RESET_TTL = '1h';
const VERIFY_TTL = '24h';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  async checkEmail(emailRaw: string) {
    const email = emailRaw.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    return { available: !existing, email };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const role = this.resolveRegisterRole(dto.role);
    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name.trim(),
        password,
        role,
        // Без SMTP підтвердження неможливе — не блокуємо користувача.
        emailVerifiedAt: this.verificationRequired ? null : new Date(),
      },
    });
    await this.touchActivityDay(user.id);
    if (this.verificationRequired) {
      void this.sendVerificationEmail(user).catch(() => undefined);
    }
    void this.sendWelcomeEmail(user.email, user.name);

    return {
      ...(await this.issueTokens(user)),
      verificationRequired: this.verificationRequired,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    if (user.blocked) {
      throw new UnauthorizedException('Акаунт заблоковано');
    }

    if (this.verificationRequired && !user.emailVerifiedAt) {
      throw new ForbiddenException({
        message: 'Підтвердь email — лист із посиланням уже в пошті',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await this.touchActivityDay(user.id);

    return this.issueTokens(user);
  }

  get verificationRequired() {
    return this.email.canSend && process.env.EMAIL_VERIFICATION !== '0';
  }

  async verifyEmail(token: string) {
    const invalid = new BadRequestException(
      'Посилання недійсне або застаріло. Запроси нове',
    );
    let payload: { sub?: string; purpose?: string };
    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: this.verifySecret,
      });
    } catch {
      throw invalid;
    }
    if (!payload.sub || payload.purpose !== 'verify') throw invalid;

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw invalid;

    if (!user.emailVerifiedAt) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      });
    }
    return { ok: true };
  }

  /** Завжди відповідає ok — не розкриваємо, чи є такий email. */
  async resendVerification(emailRaw: string) {
    const email = emailRaw.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.blocked && !user.emailVerifiedAt) {
      await this.sendVerificationEmail(user);
    }
    return { ok: true };
  }

  private get verifySecret() {
    return `${process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me'}:verify-email`;
  }

  private async sendVerificationEmail(user: {
    id: string;
    email: string;
    name: string;
  }) {
    const token = await this.jwt.signAsync(
      { sub: user.id, purpose: 'verify' },
      { secret: this.verifySecret, expiresIn: VERIFY_TTL },
    );
    const rendered = this.email.renderSimple({
      title: 'Підтвердьте електронну пошту',
      body: 'Натисніть кнопку, щоб підтвердити email і завершити реєстрацію у fata.studio. Посилання діє 24 години.',
      ctaLabel: 'Підтвердити email',
      ctaUrl: `${this.email.webUrl}/verify-email?flow=register&email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(token)}`,
    });
    await this.email.send({
      to: user.email,
      subject: 'Підтвердіть email — fata.studio',
      text: rendered.text,
      html: rendered.html,
    });
  }

  /** Завжди відповідає ok — не розкриваємо, чи є такий email. */
  async forgotPassword(emailRaw: string) {
    const email = emailRaw.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.blocked) {
      // Секрет залежить від поточного хешу пароля — після зміни токен недійсний.
      const token = await this.jwt.signAsync(
        { sub: user.id, purpose: 'reset' },
        { secret: this.resetSecret(user.password), expiresIn: RESET_TTL },
      );
      const rendered = this.email.renderSimple({
        title: 'Відновлення пароля',
        body: 'Ми отримали запит на зміну пароля. Посилання діє 1 годину. Якщо це були не ви — просто проігноруйте цей лист.',
        ctaLabel: 'Створити новий пароль',
        ctaUrl: `${this.email.webUrl}/reset-password?token=${encodeURIComponent(token)}`,
      });
      await this.email.send({
        to: user.email,
        subject: 'Відновлення пароля — fata.studio',
        text: rendered.text,
        html: rendered.html,
      });
    }
    return { ok: true };
  }

  async resetPassword(token: string, password: string) {
    const invalid = new BadRequestException(
      'Посилання недійсне або застаріло. Запросіть нове',
    );
    const decoded = this.jwt.decode(token) as {
      sub?: string;
      purpose?: string;
    } | null;
    if (!decoded?.sub || decoded.purpose !== 'reset') throw invalid;

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user) throw invalid;

    try {
      await this.jwt.verifyAsync(token, {
        secret: this.resetSecret(user.password),
      });
    } catch {
      throw invalid;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, 10),
        refreshTokenHash: null,
      },
    });
    return { ok: true };
  }

  private resetSecret(passwordHash: string) {
    return `${process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me'}:reset:${passwordHash}`;
  }

  private async sendWelcomeEmail(to: string, name: string) {
    const rendered = this.email.renderSimple({
      title: `Вітаємо, ${name}!`,
      body: 'Акаунт у fata.studio створено. Плануйте весілля: чекліст, гості, бюджет, розсадка та сайт — усе в одному кабінеті.',
      ctaLabel: 'Відкрити кабінет',
      ctaUrl: `${this.email.webUrl}/dashboard`,
    });
    await this.email
      .send({
        to,
        subject: 'Вітаємо у fata.studio',
        text: rendered.text,
        html: rendered.html,
      })
      .catch(() => undefined);
  }

  private async touchActivityDay(userId: string) {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO user_activity_days (user_id, day)
        VALUES (${userId}, CURRENT_DATE)
        ON CONFLICT DO NOTHING
      `;
    } catch {
      // Table may be missing until ensure-schema runs; never block auth.
    }
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Refresh token недійсний');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Сесію завершено');
    }

    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) {
      throw new UnauthorizedException('Refresh token недійсний');
    }

    await this.touchActivityDay(user.id);
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { ok: true };
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new BadRequestException('Невірний пароль');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      throw new BadRequestException('Невірний поточний пароль');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'Новий пароль має відрізнятися від поточного',
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });

    // Перевипускаємо токени — інші сесії з старим refresh відваляться
    return this.issueTokens(user);
  }

  private resolveRegisterRole(role?: Role): Role {
    if (!role || role === Role.GUEST || role === Role.COUPLE) {
      return Role.COUPLE;
    }
    throw new BadRequestException('Невірна роль');
  }

  private get refreshSecret() {
    return (
      process.env.JWT_REFRESH_SECRET ??
      process.env.JWT_SECRET ??
      'dev-jwt-refresh-secret'
    );
  }

  private async issueTokens(user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
        expiresIn: ACCESS_TTL,
      }),
      this.jwt.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: REFRESH_TTL,
      }),
    ]);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await bcrypt.hash(refreshToken, 10) },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
