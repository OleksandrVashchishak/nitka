"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWeddingForUser = resolveWeddingForUser;
exports.requireWeddingForUser = requireWeddingForUser;
exports.requireWeddingOwner = requireWeddingOwner;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
async function resolveWeddingForUser(prisma, userId) {
    const member = await prisma.weddingMember.findUnique({
        where: { userId },
        include: { wedding: true },
    });
    if (member) {
        return { wedding: member.wedding, role: member.role };
    }
    const owned = await prisma.wedding.findUnique({ where: { userId } });
    if (!owned)
        return null;
    await prisma.weddingMember.upsert({
        where: { userId },
        create: {
            weddingId: owned.id,
            userId,
            role: client_1.WeddingMemberRole.OWNER,
        },
        update: {},
    });
    return { wedding: owned, role: client_1.WeddingMemberRole.OWNER };
}
async function requireWeddingForUser(prisma, userId, message = 'Спочатку створи весілля в кабінеті (дата / місто)') {
    const access = await resolveWeddingForUser(prisma, userId);
    if (!access)
        throw new common_1.BadRequestException(message);
    return access;
}
async function requireWeddingOwner(prisma, userId) {
    const access = await requireWeddingForUser(prisma, userId);
    if (access.role !== client_1.WeddingMemberRole.OWNER) {
        throw new common_1.ForbiddenException('Лише власник весілля може це зробити');
    }
    return access;
}
//# sourceMappingURL=wedding-access.js.map