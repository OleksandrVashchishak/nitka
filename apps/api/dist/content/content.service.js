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
var ContentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const slug_1 = require("../common/slug");
const content_seed_data_1 = require("./content.seed-data");
const postInclude = {
    topic: true,
    author: { select: { id: true, name: true } },
};
const EMPTY_BODY = {
    time: Date.now(),
    blocks: [],
    version: '2.30.0',
};
function richBody(blocks) {
    return {
        time: Date.now(),
        blocks: blocks.map((b, i) => {
            if (b.type === 'header') {
                return {
                    id: `h${i}`,
                    type: 'header',
                    data: { text: b.text, level: b.level ?? 2 },
                };
            }
            if (b.type === 'list') {
                return {
                    id: `l${i}`,
                    type: 'list',
                    data: {
                        style: b.style ?? 'unordered',
                        items: b.items,
                    },
                };
            }
            if (b.type === 'quote') {
                return {
                    id: `q${i}`,
                    type: 'quote',
                    data: { text: b.text, caption: b.caption ?? '' },
                };
            }
            return {
                id: `p${i}`,
                type: 'paragraph',
                data: { text: b.text },
            };
        }),
        version: '2.30.0',
    };
}
function bodyBlockCount(body) {
    if (!body || typeof body !== 'object')
        return 0;
    const blocks = body.blocks;
    return Array.isArray(blocks) ? blocks.length : 0;
}
let ContentService = ContentService_1 = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ContentService_1.name);
    }
    onModuleInit() {
        void this.seedTopicsAndPosts().catch((err) => {
            this.logger.error('Content seed failed', err instanceof Error ? err.stack : err);
        });
    }
    listTopics() {
        return this.prisma.contentTopic.findMany({
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            include: {
                _count: {
                    select: {
                        posts: { where: { status: client_1.ContentStatus.PUBLISHED } },
                    },
                },
            },
        });
    }
    async getTopicBySlug(slug) {
        const topic = await this.prisma.contentTopic.findUnique({
            where: { slug },
        });
        if (!topic)
            throw new common_1.NotFoundException('РўРѕРїС–Рє РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
        return topic;
    }
    async listPublished(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(50, Math.max(1, params.limit ?? 12));
        const where = {
            status: client_1.ContentStatus.PUBLISHED,
            ...(params.kind ? { kind: params.kind } : {}),
            ...(params.featured ? { featured: true } : {}),
            ...(params.topic
                ? { topic: { slug: params.topic } }
                : {}),
        };
        const [items, total] = await Promise.all([
            this.prisma.contentPost.findMany({
                where,
                include: postInclude,
                orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.contentPost.count({ where }),
        ]);
        return { items, total, page, limit };
    }
    async getPublishedBySlug(slug) {
        const post = await this.prisma.contentPost.findFirst({
            where: { slug, status: client_1.ContentStatus.PUBLISHED },
            include: postInclude,
        });
        if (!post)
            throw new common_1.NotFoundException('РњР°С‚РµСЂС–Р°Р» РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
        return post;
    }
    adminListPosts(params) {
        return this.prisma.contentPost.findMany({
            where: {
                ...(params.status ? { status: params.status } : {}),
                ...(params.topic ? { topic: { slug: params.topic } } : {}),
                ...(params.q
                    ? {
                        OR: [
                            { title: { contains: params.q, mode: 'insensitive' } },
                            { slug: { contains: params.q, mode: 'insensitive' } },
                            { excerpt: { contains: params.q, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: postInclude,
            orderBy: [{ updatedAt: 'desc' }],
        });
    }
    async adminGetPost(id) {
        const post = await this.prisma.contentPost.findUnique({
            where: { id },
            include: postInclude,
        });
        if (!post)
            throw new common_1.NotFoundException('РњР°С‚РµСЂС–Р°Р» РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
        return post;
    }
    async createTopic(dto) {
        const slug = await this.ensureUniqueTopicSlug(dto.slug?.trim() || (0, slug_1.slugify)(dto.name));
        try {
            return await this.prisma.contentTopic.create({
                data: {
                    name: dto.name.trim(),
                    slug,
                    description: dto.description?.trim() || '',
                    sortOrder: dto.sortOrder ?? 0,
                },
            });
        }
        catch {
            throw new common_1.ConflictException('РўРѕРїС–Рє Р· С‚Р°РєРёРј slug РІР¶Рµ С”');
        }
    }
    async updateTopic(id, dto) {
        const existing = await this.prisma.contentTopic.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('РўРѕРїС–Рє РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
        const slug = await this.ensureUniqueTopicSlug(dto.slug?.trim() || (0, slug_1.slugify)(dto.name), id);
        try {
            return await this.prisma.contentTopic.update({
                where: { id },
                data: {
                    name: dto.name.trim(),
                    slug,
                    description: dto.description?.trim() || '',
                    ...(dto.sortOrder !== undefined
                        ? { sortOrder: dto.sortOrder }
                        : {}),
                },
            });
        }
        catch {
            throw new common_1.ConflictException('РўРѕРїС–Рє Р· С‚Р°РєРёРј slug РІР¶Рµ С”');
        }
    }
    async deleteTopic(id) {
        const count = await this.prisma.contentPost.count({
            where: { topicId: id },
        });
        if (count > 0) {
            throw new common_1.ConflictException('РќРµ РјРѕР¶РЅР° РІРёРґР°Р»РёС‚Рё С‚РѕРїС–Рє Р· РјР°С‚РµСЂС–Р°Р»Р°РјРё');
        }
        await this.prisma.contentTopic.delete({ where: { id } });
        return { ok: true };
    }
    async createPost(authorId, dto) {
        await this.assertTopic(dto.topicId);
        const slug = await this.ensureUniquePostSlug(dto.slug?.trim() || (0, slug_1.slugify)(dto.title));
        const status = dto.status ?? client_1.ContentStatus.DRAFT;
        const seo = this.resolveSeo(dto, status);
        return this.prisma.contentPost.create({
            data: {
                title: dto.title.trim(),
                slug,
                excerpt: dto.excerpt?.trim() || '',
                coverUrl: dto.coverUrl?.trim() || null,
                kind: dto.kind ?? client_1.ContentKind.ARTICLE,
                status,
                body: dto.body ?? EMPTY_BODY,
                seoTitle: seo.seoTitle,
                seoDescription: seo.seoDescription,
                ogImageUrl: dto.ogImageUrl?.trim() || null,
                city: dto.city?.trim() || null,
                vendorCategorySlug: dto.vendorCategorySlug?.trim() || null,
                featured: dto.featured ?? false,
                topicId: dto.topicId,
                authorId,
                publishedAt: status === client_1.ContentStatus.PUBLISHED ? new Date() : null,
            },
            include: postInclude,
        });
    }
    async updatePost(id, dto) {
        const existing = await this.adminGetPost(id);
        await this.assertTopic(dto.topicId);
        const slug = await this.ensureUniquePostSlug(dto.slug?.trim() || (0, slug_1.slugify)(dto.title), id);
        const status = dto.status ?? existing.status;
        const seo = this.resolveSeo(dto, status, existing);
        return this.prisma.contentPost.update({
            where: { id },
            data: {
                title: dto.title.trim(),
                slug,
                excerpt: dto.excerpt?.trim() || '',
                coverUrl: dto.coverUrl?.trim() || null,
                kind: dto.kind ?? existing.kind,
                status,
                ...(dto.body !== undefined
                    ? { body: dto.body }
                    : {}),
                seoTitle: seo.seoTitle,
                seoDescription: seo.seoDescription,
                ogImageUrl: dto.ogImageUrl?.trim() || null,
                city: dto.city?.trim() || null,
                vendorCategorySlug: dto.vendorCategorySlug?.trim() || null,
                featured: dto.featured ?? existing.featured,
                topicId: dto.topicId,
                publishedAt: status === client_1.ContentStatus.PUBLISHED
                    ? existing.publishedAt ?? new Date()
                    : existing.publishedAt,
            },
            include: postInclude,
        });
    }
    async updateStatus(id, status) {
        const existing = await this.adminGetPost(id);
        const seoTitle = existing.seoTitle.trim() ||
            existing.title.trim();
        const seoDescription = existing.seoDescription.trim() ||
            existing.excerpt.trim() ||
            existing.title.trim();
        return this.prisma.contentPost.update({
            where: { id },
            data: {
                status,
                seoTitle,
                seoDescription,
                publishedAt: status === client_1.ContentStatus.PUBLISHED
                    ? existing.publishedAt ?? new Date()
                    : existing.publishedAt,
            },
            include: postInclude,
        });
    }
    async deletePost(id) {
        await this.adminGetPost(id);
        await this.prisma.contentPost.delete({ where: { id } });
        return { ok: true };
    }
    resolveSeo(dto, status, existing) {
        const title = dto.title.trim();
        const excerpt = dto.excerpt?.trim() || '';
        let seoTitle = dto.seoTitle?.trim() || existing?.seoTitle?.trim() || '';
        let seoDescription = dto.seoDescription?.trim() ||
            existing?.seoDescription?.trim() ||
            '';
        if (status === client_1.ContentStatus.PUBLISHED) {
            if (!seoTitle)
                seoTitle = title;
            if (!seoDescription)
                seoDescription = excerpt || title;
        }
        return { seoTitle, seoDescription };
    }
    async assertTopic(topicId) {
        const topic = await this.prisma.contentTopic.findUnique({
            where: { id: topicId },
        });
        if (!topic)
            throw new common_1.NotFoundException('РўРѕРїС–Рє РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
    }
    async ensureUniqueTopicSlug(base, excludeId) {
        const root = (0, slug_1.slugify)(base);
        let candidate = root;
        let n = 2;
        while (true) {
            const clash = await this.prisma.contentTopic.findFirst({
                where: {
                    slug: candidate,
                    ...(excludeId ? { id: { not: excludeId } } : {}),
                },
                select: { id: true },
            });
            if (!clash)
                return candidate;
            candidate = `${root}-${n}`;
            n += 1;
        }
    }
    async ensureUniquePostSlug(base, excludeId) {
        const root = (0, slug_1.slugify)(base);
        let candidate = root;
        let n = 2;
        while (true) {
            const clash = await this.prisma.contentPost.findFirst({
                where: {
                    slug: candidate,
                    ...(excludeId ? { id: { not: excludeId } } : {}),
                },
                select: { id: true },
            });
            if (!clash)
                return candidate;
            candidate = `${root}-${n}`;
            n += 1;
        }
    }
    async seedTopicsAndPosts() {
        for (const t of content_seed_data_1.CONTENT_TOPICS_SEED) {
            await this.prisma.contentTopic.upsert({
                where: { slug: t.slug },
                create: {
                    name: t.name,
                    slug: t.slug,
                    description: t.description,
                    icon: t.icon,
                    coverUrl: t.coverUrl,
                    sortOrder: t.sortOrder,
                },
                update: {
                    icon: t.icon,
                    coverUrl: t.coverUrl,
                    sortOrder: t.sortOrder,
                    description: t.description,
                },
            });
        }
        const topics = await this.prisma.contentTopic.findMany();
        const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));
        const admin = await this.prisma.user.findFirst({
            where: { role: 'ADMIN' },
            select: { id: true },
        });
        for (const seed of content_seed_data_1.CONTENT_POSTS_SEED) {
            const topic = bySlug[seed.topicSlug];
            if (!topic)
                continue;
            const existing = await this.prisma.contentPost.findUnique({
                where: { slug: seed.slug },
            });
            const body = richBody(seed.blocks);
            if (!existing) {
                await this.prisma.contentPost.create({
                    data: {
                        title: seed.title,
                        slug: seed.slug,
                        excerpt: seed.excerpt,
                        coverUrl: seed.coverUrl,
                        ogImageUrl: seed.coverUrl,
                        kind: seed.kind,
                        status: client_1.ContentStatus.PUBLISHED,
                        featured: seed.featured ?? false,
                        city: seed.city ?? null,
                        vendorCategorySlug: seed.vendorCategorySlug ?? null,
                        topicId: topic.id,
                        authorId: admin?.id ?? null,
                        publishedAt: new Date(),
                        seoTitle: seed.title,
                        seoDescription: seed.excerpt,
                        body,
                    },
                });
                continue;
            }
            const needsRefresh = !existing.coverUrl ||
                existing.coverUrl !== seed.coverUrl ||
                bodyBlockCount(existing.body) < seed.blocks.length;
            if (needsRefresh) {
                await this.prisma.contentPost.update({
                    where: { id: existing.id },
                    data: {
                        title: seed.title,
                        excerpt: seed.excerpt,
                        coverUrl: seed.coverUrl,
                        ogImageUrl: existing.ogImageUrl || seed.coverUrl,
                        seoTitle: seed.title,
                        seoDescription: seed.excerpt,
                        featured: seed.featured ?? existing.featured,
                        city: seed.city ?? existing.city,
                        vendorCategorySlug: seed.vendorCategorySlug ?? existing.vendorCategorySlug,
                        kind: seed.kind,
                        body,
                        status: client_1.ContentStatus.PUBLISHED,
                        publishedAt: existing.publishedAt ?? new Date(),
                    },
                });
            }
        }
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = ContentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map