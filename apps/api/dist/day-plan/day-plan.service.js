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
exports.DayPlanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
let DayPlanService = class DayPlanService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMine(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const row = await this.prisma.wedding.findUnique({
            where: { id: wedding.id },
            select: { dayPlan: true },
        });
        const events = this.parseEvents(row?.dayPlan);
        return {
            weddingId: wedding.id,
            events: events === null ? null : this.sortEvents(events),
        };
    }
    async upsert(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const events = this.sortEvents(dto.events.map((e) => ({
            id: e.id,
            title: e.title.trim(),
            time: e.time,
            durationMin: e.durationMin,
        })));
        await this.prisma.wedding.update({
            where: { id: wedding.id },
            data: {
                dayPlan: events,
            },
        });
        return { weddingId: wedding.id, events };
    }
    parseEvents(value) {
        if (value === null || value === undefined)
            return null;
        if (!Array.isArray(value))
            return null;
        const events = [];
        for (const item of value) {
            if (!item || typeof item !== 'object')
                continue;
            const row = item;
            if (typeof row.id !== 'string' ||
                typeof row.title !== 'string' ||
                typeof row.time !== 'string' ||
                typeof row.durationMin !== 'number') {
                continue;
            }
            events.push({
                id: row.id,
                title: row.title,
                time: row.time,
                durationMin: row.durationMin,
            });
        }
        return events;
    }
    sortEvents(events) {
        return [...events].sort((a, b) => a.time.localeCompare(b.time));
    }
};
exports.DayPlanService = DayPlanService;
exports.DayPlanService = DayPlanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DayPlanService);
//# sourceMappingURL=day-plan.service.js.map