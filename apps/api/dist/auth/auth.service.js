"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';
const RESET_TTL = '1h';
const VERIFY_TTL = '24h';
let AuthService = class AuthService {
    constructor(prisma, jwt, email) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.email = email;
    }
    async checkEmail(emailRaw) {
        const email = emailRaw.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        return { available: !existing, email };
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Користувач з таким email вже існує');
        }
        const role = this.resolveRegisterRole(dto.role);
        const password = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                name: dto.name.trim(),
                password,
                role,
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
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Невірний email або пароль');
        }
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) {
            throw new common_1.UnauthorizedException('Невірний email або пароль');
        }
        if (user.blocked) {
            throw new common_1.UnauthorizedException('Акаунт заблоковано');
        }
        if (this.verificationRequired && !user.emailVerifiedAt) {
            throw new common_1.ForbiddenException({
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
    async verifyEmail(token) {
        const invalid = new common_1.BadRequestException('Посилання недійсне або застаріло. Запроси нове');
        let payload;
        try {
            payload = await this.jwt.verifyAsync(token, {
                secret: this.verifySecret,
            });
        }
        catch {
            throw invalid;
        }
        if (!payload.sub || payload.purpose !== 'verify')
            throw invalid;
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user)
            throw invalid;
        if (!user.emailVerifiedAt) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { emailVerifiedAt: new Date() },
            });
        }
        return { ok: true };
    }
    async resendVerification(emailRaw) {
        const email = emailRaw.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && !user.blocked && !user.emailVerifiedAt) {
            await this.sendVerificationEmail(user);
        }
        return { ok: true };
    }
    get verifySecret() {
        return `${process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me'}:verify-email`;
    }
    async sendVerificationEmail(user) {
        const token = await this.jwt.signAsync({ sub: user.id, purpose: 'verify' }, { secret: this.verifySecret, expiresIn: VERIFY_TTL });
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
    async forgotPassword(emailRaw) {
        const email = emailRaw.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && !user.blocked) {
            const token = await this.jwt.signAsync({ sub: user.id, purpose: 'reset' }, { secret: this.resetSecret(user.password), expiresIn: RESET_TTL });
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
    async resetPassword(token, password) {
        const invalid = new common_1.BadRequestException('Посилання недійсне або застаріло. Запросіть нове');
        const decoded = this.jwt.decode(token);
        if (!decoded?.sub || decoded.purpose !== 'reset')
            throw invalid;
        const user = await this.prisma.user.findUnique({
            where: { id: decoded.sub },
        });
        if (!user)
            throw invalid;
        try {
            await this.jwt.verifyAsync(token, {
                secret: this.resetSecret(user.password),
            });
        }
        catch {
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
    resetSecret(passwordHash) {
        return `${process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me'}:reset:${passwordHash}`;
    }
    async sendWelcomeEmail(to, name) {
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
    async touchActivityDay(userId) {
        try {
            await this.prisma.$executeRaw `
        INSERT INTO user_activity_days (user_id, day)
        VALUES (${userId}, CURRENT_DATE)
        ON CONFLICT DO NOTHING
      `;
        }
        catch {
        }
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, {
                secret: this.refreshSecret,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token недійсний');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user?.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Сесію завершено');
        }
        const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!match) {
            throw new common_1.UnauthorizedException('Refresh token недійсний');
        }
        await this.touchActivityDay(user.id);
        return this.issueTokens(user);
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash: null },
        });
        return { ok: true };
    }
    async deleteAccount(userId, password) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            throw new common_1.BadRequestException('Невірний пароль');
        }
        await this.prisma.user.delete({ where: { id: userId } });
        return { ok: true };
    }
    async me(userId) {
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
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) {
            throw new common_1.BadRequestException('Невірний поточний пароль');
        }
        if (currentPassword === newPassword) {
            throw new common_1.BadRequestException('Новий пароль має відрізнятися від поточного');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: await bcrypt.hash(newPassword, 10),
            },
        });
        return this.issueTokens(user);
    }
    resolveRegisterRole(role) {
        if (!role || role === client_1.Role.GUEST || role === client_1.Role.COUPLE) {
            return client_1.Role.COUPLE;
        }
        throw new common_1.BadRequestException('Невірна роль');
    }
    get refreshSecret() {
        return (process.env.JWT_REFRESH_SECRET ??
            process.env.JWT_SECRET ??
            'dev-jwt-refresh-secret');
    }
    async issueTokens(user) {
        const payload = {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map