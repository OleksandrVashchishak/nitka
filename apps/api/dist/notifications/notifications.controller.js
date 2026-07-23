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
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsController = class NotificationsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary(user) {
        if (user.role === 'VENDOR') {
            const vendor = await this.prisma.vendor.findUnique({
                where: { userId: user.id },
            });
            if (!vendor) {
                return {
                    role: 'VENDOR',
                    newRequests: 0,
                    total: 0,
                    items: [],
                };
            }
            const newRequests = await this.prisma.request.count({
                where: { vendorId: vendor.id, status: 'NEW' },
            });
            const items = [
                {
                    key: 'newRequests',
                    label: 'Нові заявки',
                    count: newRequests,
                    href: '/vendor/requests',
                },
            ].filter((i) => i.count > 0);
            return {
                role: 'VENDOR',
                newRequests,
                total: newRequests,
                items,
            };
        }
        const wedding = await this.prisma.wedding.findUnique({
            where: { userId: user.id },
        });
        const [pendingRsvp, newRsvp, waitingRequests, vendorReplied] = await Promise.all([
            wedding
                ? this.prisma.guest.count({
                    where: { weddingId: wedding.id, rsvpStatus: 'PENDING' },
                })
                : Promise.resolve(0),
            wedding
                ? this.prisma.guest.count({
                    where: {
                        weddingId: wedding.id,
                        rsvpStatus: { in: ['YES', 'NO', 'MAYBE'] },
                        respondedAt: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                })
                : Promise.resolve(0),
            this.prisma.request.count({
                where: { userId: user.id, status: 'NEW' },
            }),
            this.prisma.request.count({
                where: {
                    userId: user.id,
                    messages: {
                        some: {
                            authorRole: 'VENDOR',
                            createdAt: {
                                gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                            },
                        },
                    },
                },
            }),
        ]);
        const items = [
            {
                key: 'newRsvp',
                label: 'Нові RSVP',
                count: newRsvp,
                href: '/guests',
            },
            {
                key: 'pendingRsvp',
                label: 'Чекають відповіді',
                count: pendingRsvp,
                href: '/guests',
            },
            {
                key: 'waitingRequests',
                label: 'Заявки в очікуванні',
                count: waitingRequests,
                href: '/requests',
            },
            {
                key: 'vendorReplied',
                label: 'Вендор відповів',
                count: vendorReplied,
                href: '/requests',
            },
        ].filter((i) => i.count > 0);
        return {
            role: user.role,
            pendingRsvp,
            newRsvp,
            waitingRequests,
            vendorReplied,
            total: items.reduce((sum, i) => sum + i.count, 0),
            items,
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_guard_1.Roles)(client_1.Role.COUPLE, client_1.Role.VENDOR, client_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "summary", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map