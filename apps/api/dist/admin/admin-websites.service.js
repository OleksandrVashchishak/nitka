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
exports.AdminWebsitesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminWebsitesService = class AdminWebsitesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const page = Math.max(1, query.page ?? 1);
        const limit = Math.min(100, Math.max(1, query.limit ?? 25));
        const q = query.q?.trim();
        const and = [];
        if (q) {
            and.push({
                OR: [
                    { slug: { contains: q, mode: 'insensitive' } },
                    {
                        wedding: {
                            user: {
                                OR: [
                                    { email: { contains: q, mode: 'insensitive' } },
                                    { name: { contains: q, mode: 'insensitive' } },
                                ],
                            },
                        },
                    },
                ],
            });
        }
        if (query.status === 'published') {
            and.push({ published: true, adminHidden: false });
        }
        else if (query.status === 'draft') {
            and.push({ published: false });
        }
        else if (query.status === 'hidden') {
            and.push({ adminHidden: true });
        }
        const where = and.length
            ? { AND: and }
            : {};
        const [total, items] = await Promise.all([
            this.prisma.weddingWebsite.count({ where }),
            this.prisma.weddingWebsite.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    slug: true,
                    templateId: true,
                    published: true,
                    publishedAt: true,
                    adminHidden: true,
                    createdAt: true,
                    updatedAt: true,
                    wedding: {
                        select: {
                            partnerOneName: true,
                            partnerTwoName: true,
                            user: { select: { id: true, email: true, name: true } },
                        },
                    },
                },
            }),
        ]);
        return {
            page,
            limit,
            total,
            items: items.map((s) => ({
                id: s.id,
                slug: s.slug,
                templateId: s.templateId,
                published: s.published,
                publishedAt: s.publishedAt,
                hidden: s.adminHidden,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                couple: `${s.wedding.partnerOneName} & ${s.wedding.partnerTwoName}`,
                owner: s.wedding.user,
            })),
        };
    }
    async setHidden(id, hidden) {
        await this.requireSite(id);
        await this.prisma.weddingWebsite.update({
            where: { id },
            data: { adminHidden: hidden },
        });
        return { id, hidden };
    }
    async remove(id) {
        await this.requireSite(id);
        await this.prisma.weddingWebsite.delete({ where: { id } });
        return { ok: true };
    }
    async requireSite(id) {
        const site = await this.prisma.weddingWebsite.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!site)
            throw new common_1.NotFoundException('Сайт не знайдено');
    }
};
exports.AdminWebsitesService = AdminWebsitesService;
exports.AdminWebsitesService = AdminWebsitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminWebsitesService);
//# sourceMappingURL=admin-websites.service.js.map