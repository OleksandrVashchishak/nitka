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
exports.AdminInsightsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminInsightsService = class AdminInsightsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTimeseries(granularity, periodsRaw) {
        if (granularity !== 'day' && granularity !== 'week') {
            throw new common_1.BadRequestException('granularity має бути day або week');
        }
        const unit = granularity;
        const max = unit === 'day' ? 365 : 104;
        const fallback = unit === 'day' ? 30 : 12;
        const periods = Math.min(max, Math.max(2, periodsRaw ?? fallback));
        const unitSql = client_1.Prisma.raw(`'${unit}'`);
        const stepSql = client_1.Prisma.raw(`INTERVAL '1 ${unit}'`);
        const backSql = client_1.Prisma.raw(`INTERVAL '${periods - 1} ${unit}'`);
        const rows = await this.prisma.$queryRaw `
      SELECT
        gs::date AS bucket,
        (
          SELECT COUNT(*)::int FROM users u
          WHERE date_trunc(${unitSql}, u.created_at)::date = gs::date
        ) AS registrations,
        (
          SELECT COUNT(DISTINCT a.user_id)::int FROM user_activity_days a
          WHERE date_trunc(${unitSql}, a.day::timestamp)::date = gs::date
        ) AS active
      FROM generate_series(
        date_trunc(${unitSql}, NOW()) - ${backSql},
        date_trunc(${unitSql}, NOW()),
        ${stepSql}
      ) AS gs
      ORDER BY bucket
    `;
        return {
            granularity: unit,
            points: rows.map((r) => ({
                date: r.bucket.toISOString().slice(0, 10),
                registrations: r.registrations,
                active: r.active,
            })),
        };
    }
    async getCohorts(weeksRaw) {
        const weeks = Math.min(26, Math.max(2, weeksRaw ?? 8));
        const backSql = client_1.Prisma.raw(`INTERVAL '${weeks - 1} week'`);
        const [sizes, retention] = await Promise.all([
            this.prisma.$queryRaw `
        SELECT date_trunc('week', created_at)::date AS cohort, COUNT(*)::int AS size
        FROM users
        WHERE created_at >= date_trunc('week', NOW()) - ${backSql}
        GROUP BY 1
        ORDER BY 1
      `,
            this.prisma.$queryRaw `
        SELECT
          c.cohort,
          ((date_trunc('week', a.day::timestamp)::date - c.cohort) / 7)::int AS wk,
          COUNT(DISTINCT a.user_id)::int AS retained
        FROM (
          SELECT id, date_trunc('week', created_at)::date AS cohort
          FROM users
          WHERE created_at >= date_trunc('week', NOW()) - ${backSql}
        ) c
        JOIN user_activity_days a ON a.user_id = c.id AND a.day >= c.cohort
        GROUP BY 1, 2
      `,
        ]);
        const retainedBy = new Map();
        for (const r of retention) {
            retainedBy.set(`${r.cohort.toISOString().slice(0, 10)}:${r.wk}`, r.retained);
        }
        const thisWeek = await this.prisma.$queryRaw `
      SELECT date_trunc('week', NOW())::date AS w
    `;
        const currentWeekMs = thisWeek[0].w.getTime();
        const cohorts = sizes.map((s) => {
            const key = s.cohort.toISOString().slice(0, 10);
            const elapsed = Math.round((currentWeekMs - s.cohort.getTime()) / (7 * 24 * 3600 * 1000));
            const retained = [];
            for (let w = 0; w < weeks; w += 1) {
                retained.push(w > elapsed ? null : (retainedBy.get(`${key}:${w}`) ?? 0));
            }
            return { cohort: key, size: s.size, retained };
        });
        return { weeks, cohorts };
    }
};
exports.AdminInsightsService = AdminInsightsService;
exports.AdminInsightsService = AdminInsightsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminInsightsService);
//# sourceMappingURL=admin-insights.service.js.map