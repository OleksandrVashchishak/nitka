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
exports.SeatingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
let SeatingService = class SeatingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMine(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const row = await this.prisma.wedding.findUnique({
            where: { id: wedding.id },
            select: { seatingDraft: true, seatingPlan: true },
        });
        return {
            weddingId: wedding.id,
            draft: this.asObject(row?.seatingDraft) ?? null,
            plan: this.asObject(row?.seatingPlan) ?? null,
        };
    }
    async upsertDraft(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const draft = {
            tables: dto.tables,
            guests: dto.guests,
        };
        await this.prisma.wedding.update({
            where: { id: wedding.id },
            data: {
                seatingDraft: draft,
            },
        });
        return { weddingId: wedding.id, draft };
    }
    async upsertPlan(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const plan = {
            tables: dto.tables,
            savedAt: dto.savedAt ?? Date.now(),
        };
        await this.prisma.wedding.update({
            where: { id: wedding.id },
            data: {
                seatingPlan: plan,
            },
        });
        return { weddingId: wedding.id, plan };
    }
    async clearPlan(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        await this.prisma.wedding.update({
            where: { id: wedding.id },
            data: { seatingPlan: client_1.Prisma.DbNull },
        });
        return { weddingId: wedding.id, plan: null };
    }
    asObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.SeatingService = SeatingService;
exports.SeatingService = SeatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeatingService);
//# sourceMappingURL=seating.service.js.map