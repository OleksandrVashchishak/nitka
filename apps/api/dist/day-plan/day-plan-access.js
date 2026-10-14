"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDayPlanAccess = resolveDayPlanAccess;
exports.requireDayPlanAccess = requireDayPlanAccess;
exports.requireDayPlanEditByShareToken = requireDayPlanEditByShareToken;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const wedding_access_1 = require("../weddings/wedding-access");
async function resolveDayPlanAccess(prisma, userId) {
    const member = await (0, wedding_access_1.resolveWeddingForUser)(prisma, userId);
    if (member) {
        return { wedding: member.wedding, level: 'edit', via: 'member' };
    }
    const grant = await prisma.dayPlanShareGrant.findFirst({
        where: {
            userId,
            acceptedAt: { not: null },
        },
        include: {
            share: { include: { wedding: true } },
        },
        orderBy: { acceptedAt: 'desc' },
    });
    if (!grant)
        return null;
    return {
        wedding: grant.share.wedding,
        level: grant.access === client_1.DayPlanShareAccess.EDIT ? 'edit' : 'view',
        via: 'grant',
    };
}
async function requireDayPlanAccess(prisma, userId, min = 'view', message = 'Немає доступу до плану дня') {
    const access = await resolveDayPlanAccess(prisma, userId);
    if (!access)
        throw new common_1.BadRequestException(message);
    if (min === 'edit' && access.level !== 'edit') {
        throw new common_1.ForbiddenException('Недостатньо прав для редагування плану дня');
    }
    return access;
}
async function requireDayPlanEditByShareToken(prisma, userId, token) {
    const share = await prisma.dayPlanShare.findUnique({
        where: { token },
        include: { wedding: true },
    });
    if (!share)
        throw new common_1.BadRequestException('Посилання недійсне');
    const member = await (0, wedding_access_1.resolveWeddingForUser)(prisma, userId);
    if (member && member.wedding.id === share.weddingId) {
        return { wedding: share.wedding };
    }
    const grant = await prisma.dayPlanShareGrant.findFirst({
        where: {
            shareId: share.id,
            userId,
            acceptedAt: { not: null },
            access: client_1.DayPlanShareAccess.EDIT,
        },
    });
    if (!grant) {
        throw new common_1.ForbiddenException('Недостатньо прав для редагування плану дня');
    }
    return { wedding: share.wedding };
}
//# sourceMappingURL=day-plan-access.js.map