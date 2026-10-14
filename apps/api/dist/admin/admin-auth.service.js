"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const admin_constants_1 = require("./admin.constants");
function safeEqual(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        (0, crypto_1.timingSafeEqual)(bufA, Buffer.alloc(bufA.length));
        return false;
    }
    return (0, crypto_1.timingSafeEqual)(bufA, bufB);
}
let AdminAuthService = class AdminAuthService {
    constructor(jwt) {
        this.jwt = jwt;
    }
    async login(dto) {
        const { email: expectedEmail, password: expectedPassword } = (0, admin_constants_1.getSuperadminCredentials)();
        if (!expectedEmail || !expectedPassword) {
            throw new common_1.UnauthorizedException('Суперадмін не налаштований');
        }
        const email = dto.email.trim().toLowerCase();
        const emailOk = safeEqual(email, expectedEmail);
        const passwordOk = safeEqual(dto.password, expectedPassword);
        if (!emailOk || !passwordOk) {
            throw new common_1.UnauthorizedException('Невірний email або пароль');
        }
        const accessToken = await this.jwt.signAsync({
            sub: admin_constants_1.SUPERADMIN_SUB,
            email: expectedEmail,
            role: admin_constants_1.SUPERADMIN_ROLE,
        }, {
            secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
            expiresIn: admin_constants_1.SUPERADMIN_ACCESS_TTL,
        });
        return {
            accessToken,
            user: {
                email: expectedEmail,
                role: admin_constants_1.SUPERADMIN_ROLE,
            },
        };
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map