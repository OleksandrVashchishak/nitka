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
exports.NotificationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const list_notifications_dto_1 = require("./dto/list-notifications.dto");
const register_push_dto_1 = require("./dto/register-push.dto");
const update_prefs_dto_1 = require("./dto/update-prefs.dto");
const notification_reminders_service_1 = require("./notification-reminders.service");
const notifications_service_1 = require("./notifications.service");
let NotificationsController = class NotificationsController {
    constructor(notifications, reminders) {
        this.notifications = notifications;
        this.reminders = reminders;
    }
    registerPush(user, dto) {
        return this.notifications.registerDevice(user.id, dto.token, dto.platform);
    }
    unregisterPush(user, dto) {
        return this.notifications.unregisterDevice(user.id, dto.token);
    }
    runReminders(secret, force) {
        const expected = process.env.CRON_SECRET;
        if (expected && secret !== expected) {
            throw new common_1.UnauthorizedException('Invalid cron secret');
        }
        return this.reminders.runDaily({ force: force === '1' });
    }
    list(user, query) {
        return this.notifications.list(user.id, query.offset ?? 0, query.limit ?? 5);
    }
    async unreadCount(user) {
        return { unreadCount: await this.notifications.unreadCount(user.id) };
    }
    readAll(user) {
        return this.notifications.markAllRead(user.id);
    }
    read(user, id) {
        return this.notifications.markRead(user.id, id);
    }
    getPrefs(user) {
        return this.notifications.getPrefs(user.id);
    }
    updatePrefs(user, dto) {
        return this.notifications.updatePrefs(user.id, dto);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('push-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_push_dto_1.RegisterPushDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "registerPush", null);
__decorate([
    (0, common_1.Delete)('push-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_push_dto_1.RegisterPushDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "unregisterPush", null);
__decorate([
    openapi.ApiOperation({ summary: "\u0417\u043E\u0432\u043D\u0456\u0448\u043D\u0456\u0439 cron / \u0440\u0443\u0447\u043D\u0438\u0439 \u0442\u0440\u0438\u0433\u0435\u0440 \u0449\u043E\u0434\u0435\u043D\u043D\u0438\u0445 \u043D\u0430\u0433\u0430\u0434\u0443\u0432\u0430\u043D\u044C (\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A x-cron-secret).\n`?force=1` \u2014 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456\u0448\u043D\u0456\u0439 \u043F\u0440\u043E\u0433\u0456\u043D." }),
    (0, common_1.Post)('reminders/run'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Headers)('x-cron-secret')),
    __param(1, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "runReminders", null);
__decorate([
    openapi.ApiOperation({ summary: "\u0421\u043F\u0438\u0441\u043E\u043A \u0434\u043B\u044F \u0434\u0437\u0432\u0456\u043D\u043E\u0447\u043A\u0430: ?offset=0&limit=5 (\u0434\u0430\u043B\u0456 \u043F\u043E 10)." }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_notifications_dto_1.ListNotificationsDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unreadCount", null);
__decorate([
    (0, common_1.Post)('read-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "readAll", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "read", null);
__decorate([
    (0, common_1.Get)('prefs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getPrefs", null);
__decorate([
    (0, common_1.Patch)('prefs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_prefs_dto_1.UpdateNotificationPrefsDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "updatePrefs", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        notification_reminders_service_1.NotificationRemindersService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map