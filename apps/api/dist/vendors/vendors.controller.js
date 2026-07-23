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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const upsert_vendor_profile_dto_1 = require("./dto/upsert-vendor-profile.dto");
const vendors_service_1 = require("./vendors.service");
let VendorsController = class VendorsController {
    constructor(vendorsService) {
        this.vendorsService = vendorsService;
    }
    findAll(category, city, price, rating, q, style, sort, featured) {
        return this.vendorsService.findAll({
            category,
            city,
            price: price ? Number(price) : undefined,
            rating: rating ? Number(rating) : undefined,
            q: q?.trim() || undefined,
            style: style?.trim() || undefined,
            sort: sort?.trim() || undefined,
            featured: featured === '1' || featured === 'true',
        });
    }
    getFilters() {
        return this.vendorsService.getFilterOptions();
    }
    async getMine(user, res) {
        const profile = await this.vendorsService.getMine(user.id);
        if (profile === null) {
            res.status(200).type('json').send('null');
            return;
        }
        return profile;
    }
    upsertMine(user, dto) {
        return this.vendorsService.upsertMine(user.id, dto);
    }
    findOne(slugOrId, req) {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = (typeof forwarded === 'string'
            ? forwarded.split(',')[0]?.trim()
            : null) ||
            req.ip ||
            req.socket.remoteAddress;
        return this.vendorsService.findOne(slugOrId, {
            ip,
            userAgent: req.headers['user-agent'],
        });
    }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('price')),
    __param(3, (0, common_1.Query)('rating')),
    __param(4, (0, common_1.Query)('q')),
    __param(5, (0, common_1.Query)('style')),
    __param(6, (0, common_1.Query)('sort')),
    __param(7, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filters'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getFilters", null);
__decorate([
    (0, common_1.Get)('me/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "getMine", null);
__decorate([
    (0, common_1.Put)('me/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_vendor_profile_dto_1.UpsertVendorProfileDto]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "upsertMine", null);
__decorate([
    (0, common_1.Get)(':slugOrId'),
    __param(0, (0, common_1.Param)('slugOrId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findOne", null);
exports.VendorsController = VendorsController = __decorate([
    (0, common_1.Controller)('vendors'),
    __metadata("design:paramtypes", [vendors_service_1.VendorsService])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map