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
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
let GuestsService = class GuestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWeddingForUser(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId);
        return wedding;
    }
    buildStats(guests) {
        const yes = guests.filter((g) => g.rsvpStatus === 'YES').length;
        const no = guests.filter((g) => g.rsvpStatus === 'NO').length;
        const maybe = guests.filter((g) => g.rsvpStatus === 'MAYBE').length;
        const pending = guests.filter((g) => g.rsvpStatus === 'PENDING').length;
        const headcount = guests.reduce((sum, g) => {
            if (g.rsvpStatus !== 'YES')
                return sum;
            const plus = g.plusOne && g.plusOneAttending === true ? 1 : 0;
            return sum + 1 + plus;
        }, 0);
        return {
            total: guests.length,
            yes,
            no,
            maybe,
            pending,
            headcount,
        };
    }
    async listMine(userId) {
        const wedding = await this.getWeddingForUser(userId);
        const guests = await this.prisma.guest.findMany({
            where: { weddingId: wedding.id },
            orderBy: [{ rsvpStatus: 'asc' }, { name: 'asc' }],
        });
        return {
            wedding: {
                id: wedding.id,
                date: wedding.date,
                city: wedding.city,
                plannedGuests: wedding.guests,
            },
            stats: this.buildStats(guests),
            guests,
        };
    }
    async create(userId, dto) {
        const wedding = await this.getWeddingForUser(userId);
        return this.prisma.guest.create({
            data: {
                weddingId: wedding.id,
                name: dto.name.trim(),
                email: dto.email?.trim() || null,
                phone: dto.phone?.trim() || null,
                side: dto.side ?? 'BOTH',
                rsvpStatus: dto.rsvpStatus ?? 'PENDING',
                plusOne: dto.plusOne ?? false,
                plusOneName: dto.plusOneName?.trim() || null,
                plusOneAttending: dto.plusOneAttending ?? null,
                allergies: dto.allergies?.trim() || null,
                tableLabel: dto.tableLabel?.trim() || null,
                notes: dto.notes?.trim() || null,
                respondedAt: dto.rsvpStatus && dto.rsvpStatus !== 'PENDING' ? new Date() : null,
            },
        });
    }
    async importMany(userId, dto) {
        if (!dto.guests?.length) {
            throw new common_1.BadRequestException('Список гостей порожній');
        }
        if (dto.guests.length > 500) {
            throw new common_1.BadRequestException('Максимум 500 гостей за раз');
        }
        const wedding = await this.getWeddingForUser(userId);
        const created = await this.prisma.$transaction(dto.guests.map((row) => this.prisma.guest.create({
            data: {
                weddingId: wedding.id,
                name: row.name.trim(),
                email: row.email?.trim() || null,
                phone: row.phone?.trim() || null,
                side: row.side ?? 'BOTH',
                plusOne: row.plusOne ?? false,
                notes: row.notes?.trim() || null,
                rsvpStatus: 'PENDING',
            },
        })));
        return {
            imported: created.length,
            guests: created,
        };
    }
    async update(userId, guestId, dto) {
        const wedding = await this.getWeddingForUser(userId);
        const guest = await this.prisma.guest.findFirst({
            where: { id: guestId, weddingId: wedding.id },
        });
        if (!guest) {
            throw new common_1.NotFoundException('Гостя не знайдено');
        }
        const nextStatus = dto.rsvpStatus ?? guest.rsvpStatus;
        return this.prisma.guest.update({
            where: { id: guestId },
            data: {
                ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
                ...(dto.email !== undefined
                    ? { email: dto.email?.trim() || null }
                    : {}),
                ...(dto.phone !== undefined
                    ? { phone: dto.phone?.trim() || null }
                    : {}),
                ...(dto.side !== undefined ? { side: dto.side } : {}),
                ...(dto.rsvpStatus !== undefined
                    ? { rsvpStatus: dto.rsvpStatus }
                    : {}),
                ...(dto.plusOne !== undefined ? { plusOne: dto.plusOne } : {}),
                ...(dto.plusOneName !== undefined
                    ? { plusOneName: dto.plusOneName?.trim() || null }
                    : {}),
                ...(dto.plusOneAttending !== undefined
                    ? { plusOneAttending: dto.plusOneAttending }
                    : {}),
                ...(dto.allergies !== undefined
                    ? { allergies: dto.allergies?.trim() || null }
                    : {}),
                ...(dto.tableLabel !== undefined
                    ? { tableLabel: dto.tableLabel?.trim() || null }
                    : {}),
                ...(dto.notes !== undefined
                    ? { notes: dto.notes?.trim() || null }
                    : {}),
                respondedAt: nextStatus === 'PENDING' ? null : (guest.respondedAt ?? new Date()),
            },
        });
    }
    async remove(userId, guestId) {
        const wedding = await this.getWeddingForUser(userId);
        const guest = await this.prisma.guest.findFirst({
            where: { id: guestId, weddingId: wedding.id },
        });
        if (!guest) {
            throw new common_1.NotFoundException('Гостя не знайдено');
        }
        await this.prisma.guest.delete({ where: { id: guestId } });
        return { ok: true };
    }
    async getPublicInvite(token) {
        const guest = await this.prisma.guest.findUnique({
            where: { inviteToken: token },
            include: {
                wedding: {
                    select: {
                        date: true,
                        city: true,
                        partnerOneName: true,
                        partnerTwoName: true,
                        user: { select: { name: true } },
                    },
                },
            },
        });
        if (!guest) {
            throw new common_1.NotFoundException('Запрошення не знайдено');
        }
        const partners = [guest.wedding.partnerOneName, guest.wedding.partnerTwoName]
            .map((name) => name.trim())
            .filter(Boolean);
        const coupleName = partners.length > 0 ? partners.join(' & ') : guest.wedding.user.name;
        return {
            token: guest.inviteToken,
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            rsvpStatus: guest.rsvpStatus,
            plusOne: guest.plusOne,
            plusOneName: guest.plusOneName,
            plusOneAttending: guest.plusOneAttending,
            allergies: guest.allergies,
            notes: guest.notes,
            wedding: {
                date: guest.wedding.date,
                city: guest.wedding.city,
                coupleName,
            },
        };
    }
    async submitPublicRsvp(token, dto) {
        if (dto.rsvpStatus === 'PENDING') {
            throw new common_1.BadRequestException('Обери відповідь: так / ні / можливо');
        }
        const guest = await this.prisma.guest.findUnique({
            where: { inviteToken: token },
        });
        if (!guest) {
            throw new common_1.NotFoundException('Запрошення не знайдено');
        }
        if (!guest.plusOne && dto.plusOneAttending) {
            throw new common_1.BadRequestException('Plus one не передбачено');
        }
        return this.prisma.guest.update({
            where: { inviteToken: token },
            data: {
                rsvpStatus: dto.rsvpStatus,
                plusOneAttending: guest.plusOne
                    ? (dto.plusOneAttending ?? false)
                    : null,
                plusOneName: guest.plusOne
                    ? dto.plusOneName?.trim() || guest.plusOneName
                    : null,
                allergies: dto.allergies?.trim() || null,
                email: dto.email?.trim() || guest.email,
                phone: dto.phone?.trim() || guest.phone,
                notes: dto.notes?.trim() || guest.notes,
                respondedAt: new Date(),
            },
            select: {
                name: true,
                rsvpStatus: true,
                plusOne: true,
                plusOneName: true,
                plusOneAttending: true,
                allergies: true,
            },
        });
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GuestsService);
//# sourceMappingURL=guests.service.js.map