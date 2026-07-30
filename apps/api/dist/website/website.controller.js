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
exports.WebsiteController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const website_dto_1 = require("./dto/website.dto");
const website_service_1 = require("./website.service");
let WebsiteController = class WebsiteController {
    constructor(websiteService) {
        this.websiteService = websiteService;
    }
    getMine(user) {
        return this.websiteService.getMine(user.id);
    }
    upsertMine(user, dto) {
        return this.websiteService.upsertMine(user.id, dto);
    }
    getPublic(slug) {
        return this.websiteService.getPublicBySlug(slug);
    }
};
exports.WebsiteController = WebsiteController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE, client_1.Role.ADMIN),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "getMine", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE, client_1.Role.ADMIN),
    (0, common_1.Put)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, website_dto_1.UpsertWeddingWebsiteDto]),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "upsertMine", null);
__decorate([
    (0, common_1.Get)('public/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "getPublic", null);
exports.WebsiteController = WebsiteController = __decorate([
    (0, common_1.Controller)('website'),
    __metadata("design:paramtypes", [website_service_1.WebsiteService])
], WebsiteController);
//# sourceMappingURL=website.controller.js.map