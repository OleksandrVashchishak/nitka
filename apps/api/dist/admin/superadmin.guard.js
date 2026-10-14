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
exports.SuperadminGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_constants_1 = require("./admin.constants");
let SuperadminGuard = class SuperadminGuard {
    constructor(jwt) {
        this.jwt = jwt;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException();
        }
        const token = header.slice('Bearer '.length).trim();
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        let payload;
        try {
            payload = await this.jwt.verifyAsync(token, {
                secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
            });
        }
        catch {
            throw new common_1.UnauthorizedException();
        }
        if (payload.sub !== admin_constants_1.SUPERADMIN_SUB ||
            payload.role !== admin_constants_1.SUPERADMIN_ROLE ||
            !payload.email) {
            throw new common_1.UnauthorizedException();
        }
        req.superadmin = payload;
        return true;
    }
};
exports.SuperadminGuard = SuperadminGuard;
exports.SuperadminGuard = SuperadminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], SuperadminGuard);
//# sourceMappingURL=superadmin.guard.js.map