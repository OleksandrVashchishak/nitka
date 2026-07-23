"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const vendors_service_1 = require("../vendors/vendors.service");
const weddings_service_1 = require("../weddings/weddings.service");
let AdminService = class AdminService {
    constructor(prisma, vendorsService, weddingsService) {
        this.prisma = prisma;
        this.vendorsService = vendorsService;
        this.weddingsService = weddingsService;
    }
    async onModuleInit() {
        const email = 'admin@nitka.local';
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (!existing) {
            await this.prisma.user.create({
                data: {
                    email,
                    name: 'Admin',
                    role: 'ADMIN',
                    password: await bcrypt.hash('admin1234', 10),
                },
            });
            return;
        }
        if (existing.role !== 'ADMIN') {
            await this.prisma.user.update({
                where: { email },
                data: { role: 'ADMIN' },
            });
        }
    }
    async stats() {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const [pendingVendors, approvedVendors, rejectedVendors, blockedVendors, categories, requests, couples, vendors, views7d, requests7d, reviews, featuredVendors,] = await Promise.all([
            this.prisma.vendor.count({ where: { status: 'PENDING' } }),
            this.prisma.vendor.count({ where: { status: 'APPROVED' } }),
            this.prisma.vendor.count({ where: { status: 'REJECTED' } }),
            this.prisma.vendor.count({ where: { status: 'BLOCKED' } }),
            this.prisma.category.count(),
            this.prisma.request.count(),
            this.prisma.user.count({ where: { role: 'COUPLE' } }),
            this.prisma.user.count({ where: { role: 'VENDOR' } }),
            this.prisma.vendorView.count({ where: { createdAt: { gte: weekAgo } } }),
            this.prisma.request.count({ where: { createdAt: { gte: weekAgo } } }),
            this.prisma.review.count(),
            this.prisma.vendor.count({ where: { featured: true } }),
        ]);
        return {
            pendingVendors,
            approvedVendors,
            rejectedVendors,
            blockedVendors,
            categories,
            requests,
            couples,
            vendors,
            views7d,
            requests7d,
            reviews,
            featuredVendors,
        };
    }
    listVendors(params) {
        const q = params?.q?.trim();
        return this.prisma.vendor.findMany({
            where: {
                ...(params?.status ? { status: params.status } : {}),
                ...(q
                    ? {
                        OR: [
                            { name: { contains: q, mode: 'insensitive' } },
                            { city: { contains: q, mode: 'insensitive' } },
                            { user: { email: { contains: q, mode: 'insensitive' } } },
                        ],
                    }
                    : {}),
            },
            include: {
                category: true,
                user: { select: { id: true, email: true, name: true, blocked: true } },
                photos: { orderBy: { order: 'asc' }, take: 1 },
                _count: {
                    select: { requests: true, favorites: true, reviews: true, views: true },
                },
            },
            orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async getVendor(id) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
            include: {
                category: true,
                user: {
                    select: { id: true, email: true, name: true, blocked: true },
                },
                photos: { orderBy: { order: 'asc' } },
                packages: { orderBy: { order: 'asc' } },
                faqs: { orderBy: { order: 'asc' } },
                team: { orderBy: { order: 'asc' } },
                _count: {
                    select: { requests: true, favorites: true, reviews: true, views: true },
                },
            },
        });
        if (!vendor)
            throw new common_1.NotFoundException('Підрядника не знайдено');
        return vendor;
    }
    async updateVendorStatus(id, status, moderationNote) {
        const vendor = await this.prisma.vendor.findUnique({ where: { id } });
        if (!vendor) {
            throw new common_1.NotFoundException('Підрядника не знайдено');
        }
        return this.prisma.vendor.update({
            where: { id },
            data: {
                status,
                moderationNote: moderationNote?.trim() ||
                    (status === 'APPROVED' ? null : vendor.moderationNote),
                featured: status === 'APPROVED' ? vendor.featured : false,
            },
            include: {
                category: true,
                user: { select: { id: true, email: true, name: true, blocked: true } },
                photos: { orderBy: { order: 'asc' }, take: 1 },
                _count: {
                    select: { requests: true, favorites: true, reviews: true, views: true },
                },
            },
        });
    }
    async setFeatured(id, featured) {
        const vendor = await this.prisma.vendor.findUnique({ where: { id } });
        if (!vendor)
            throw new common_1.NotFoundException('Підрядника не знайдено');
        return this.prisma.vendor.update({
            where: { id },
            data: { featured },
            include: {
                category: true,
                user: { select: { id: true, email: true, name: true, blocked: true } },
                photos: { orderBy: { order: 'asc' }, take: 1 },
                _count: {
                    select: { requests: true, favorites: true, reviews: true, views: true },
                },
            },
        });
    }
    listCategories() {
        return this.prisma.category.findMany({
            include: { _count: { select: { vendors: true } } },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        });
    }
    async createCategory(dto) {
        try {
            return await this.prisma.category.create({
                data: {
                    name: dto.name.trim(),
                    slug: dto.slug.trim().toLowerCase(),
                    description: dto.description?.trim() || '',
                    sortOrder: dto.sortOrder ?? 0,
                },
                include: { _count: { select: { vendors: true } } },
            });
        }
        catch {
            throw new common_1.ConflictException('Категорія з таким slug вже є');
        }
    }
    async updateCategory(id, dto) {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Категорію не знайдено');
        }
        try {
            return await this.prisma.category.update({
                where: { id },
                data: {
                    name: dto.name.trim(),
                    slug: dto.slug.trim().toLowerCase(),
                    description: dto.description?.trim() || '',
                    sortOrder: dto.sortOrder ?? existing.sortOrder,
                },
                include: { _count: { select: { vendors: true } } },
            });
        }
        catch {
            throw new common_1.ConflictException('Категорія з таким slug вже є');
        }
    }
    async deleteCategory(id) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { vendors: true } } },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Категорію не знайдено');
        }
        if (existing._count.vendors > 0) {
            throw new common_1.ConflictException('Не можна видалити категорію з підрядниками');
        }
        await this.prisma.category.delete({ where: { id } });
        return { ok: true };
    }
    listRequests(params) {
        const q = params?.q?.trim();
        return this.prisma.request.findMany({
            where: {
                ...(params?.status ? { status: params.status } : {}),
                ...(q
                    ? {
                        OR: [
                            { user: { name: { contains: q, mode: 'insensitive' } } },
                            { user: { email: { contains: q, mode: 'insensitive' } } },
                            { vendor: { name: { contains: q, mode: 'insensitive' } } },
                            { city: { contains: q, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        category: true,
                    },
                },
                messages: {
                    include: { author: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    listUsers(params) {
        const q = params?.q?.trim();
        return this.prisma.user.findMany({
            where: {
                ...(params?.role ? { role: params.role } : {}),
                ...(q
                    ? {
                        OR: [
                            { name: { contains: q, mode: 'insensitive' } },
                            { email: { contains: q, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                blocked: true,
                createdAt: true,
                vendor: { select: { id: true, name: true, status: true } },
                _count: { select: { requests: true, reviews: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    async getUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                blocked: true,
                createdAt: true,
                wedding: {
                    include: {
                        _count: {
                            select: { tasks: true, guestList: true, budgetItems: true },
                        },
                    },
                },
                vendor: { select: { id: true, name: true, status: true } },
                _count: { select: { requests: true, reviews: true, favorites: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        return user;
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        if (user.email === 'admin@nitka.local' && data.role && data.role !== 'ADMIN') {
            throw new common_1.ConflictException('Не можна змінити роль головного адміна');
        }
        try {
            return await this.prisma.user.update({
                where: { id },
                data: {
                    ...(typeof data.blocked === 'boolean'
                        ? { blocked: data.blocked }
                        : {}),
                    ...(data.role ? { role: data.role } : {}),
                    ...(data.name !== undefined ? { name: data.name.trim() } : {}),
                    ...(data.email !== undefined
                        ? { email: data.email.trim().toLowerCase() }
                        : {}),
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    blocked: true,
                    createdAt: true,
                    vendor: { select: { id: true, name: true, status: true } },
                    _count: { select: { requests: true, reviews: true } },
                },
            });
        }
        catch {
            throw new common_1.ConflictException('Цей email вже використовується');
        }
    }
    async upsertUserWedding(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        return this.weddingsService.upsert(userId, dto);
    }
    async updateVendorProfile(id, dto) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
            select: { userId: true },
        });
        if (!vendor)
            throw new common_1.NotFoundException('Підрядника не знайдено');
        return this.vendorsService.upsertMine(vendor.userId, dto);
    }
    listReviews() {
        return this.prisma.review.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                vendor: {
                    select: { id: true, name: true, city: true, category: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async deleteReview(id) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Відгук не знайдено');
        await this.prisma.review.delete({ where: { id } });
        const agg = await this.prisma.review.aggregate({
            where: { vendorId: review.vendorId },
            _avg: { rating: true },
        });
        await this.prisma.vendor.update({
            where: { id: review.vendorId },
            data: { rating: agg._avg.rating ?? 0 },
        });
        return { ok: true };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vendors_service_1.VendorsService,
        weddings_service_1.WeddingsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map