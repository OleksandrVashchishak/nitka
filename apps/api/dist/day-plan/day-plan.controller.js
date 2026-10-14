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
exports.DayPlanController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const day_plan_service_1 = require("./day-plan.service");
const share_invite_dto_1 = require("./dto/share-invite.dto");
const upsert_day_plan_dto_1 = require("./dto/upsert-day-plan.dto");
let DayPlanController = class DayPlanController {
    constructor(dayPlanService) {
        this.dayPlanService = dayPlanService;
    }
    getPublic(token) {
        return this.dayPlanService.getPublicByToken(token);
    }
    getSharedAccessAuthed(user, token) {
        return this.dayPlanService.getSharedAccess(user.id, token);
    }
    getInvitePreview(inviteToken) {
        return this.dayPlanService.getInvitePreview(inviteToken);
    }
    acceptInvite(user, inviteToken) {
        return this.dayPlanService.acceptInvite(user.id, inviteToken);
    }
    getShare(user) {
        return this.dayPlanService.getShare(user.id);
    }
    invite(user, dto) {
        return this.dayPlanService.invite(user.id, dto);
    }
    updateGrant(user, grantId, dto) {
        return this.dayPlanService.updateGrant(user.id, grantId, dto);
    }
    revokeGrant(user, grantId) {
        return this.dayPlanService.revokeGrant(user.id, grantId);
    }
    upsertShared(user, token, dto) {
        return this.dayPlanService.upsertByShareToken(user.id, token, dto);
    }
    getMine(user) {
        return this.dayPlanService.getMine(user.id);
    }
    upsert(user, dto) {
        return this.dayPlanService.upsert(user.id, dto);
    }
};
exports.DayPlanController = DayPlanController;
__decorate([
    (0, common_1.Get)('public/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "getPublic", null);
__decorate([
    (0, common_1.Get)('shared/:token/access'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "getSharedAccessAuthed", null);
__decorate([
    (0, common_1.Get)('invite/:inviteToken'),
    __param(0, (0, common_1.Param)('inviteToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "getInvitePreview", null);
__decorate([
    (0, common_1.Post)('invite/:inviteToken/accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('inviteToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "acceptInvite", null);
__decorate([
    (0, common_1.Get)('share'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "getShare", null);
__decorate([
    (0, common_1.Post)('share/invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, share_invite_dto_1.ShareInviteDto]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)('share/grants/:grantId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('grantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, share_invite_dto_1.UpdateShareGrantDto]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "updateGrant", null);
__decorate([
    (0, common_1.Delete)('share/grants/:grantId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('grantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "revokeGrant", null);
__decorate([
    (0, common_1.Put)('shared/:token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, upsert_day_plan_dto_1.UpsertDayPlanDto]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "upsertShared", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "getMine", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_day_plan_dto_1.UpsertDayPlanDto]),
    __metadata("design:returntype", void 0)
], DayPlanController.prototype, "upsert", null);
exports.DayPlanController = DayPlanController = __decorate([
    (0, common_1.Controller)('day-plan'),
    __metadata("design:paramtypes", [day_plan_service_1.DayPlanService])
], DayPlanController);
//# sourceMappingURL=day-plan.controller.js.map