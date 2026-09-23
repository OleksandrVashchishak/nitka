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
const content_seed_data_1 = require("./content.seed-data");
const postInclude = {
    topic: true,
    author: { select: { id: true, name: true } },
};
function richBody(blocks) {
    return {
        time: Date.now(),
        blocks: blocks.map((b, i) => {
            if (b.type === 'header') {
                return {
                    id: `h${i}`,
                    type: 'header',
                    data: {
                        text: b.text,
                        level: b.level ?? 2,
                        ...(b.id ? { id: b.id } : {}),
                    },
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
            throw new common_1.NotFoundException('Топік не знайдено');
        return topic;
    }
    async listPublished(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(50, Math.max(1, params.limit ?? 12));
        const q = params.q?.trim();
        const city = params.city?.trim();
        const where = {
            status: client_1.ContentStatus.PUBLISHED,
            ...(params.kind ? { kind: params.kind } : {}),
            ...(params.featured ? { featured: true } : {}),
            ...(params.topic ? { topic: { slug: params.topic } } : {}),
            ...(city ? { city } : {}),
            ...(q
                ? {
                    OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        { excerpt: { contains: q, mode: "insensitive" } },
                    ],
                }
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
    async listPublishedCities() {
        const rows = await this.prisma.contentPost.findMany({
            where: { status: client_1.ContentStatus.PUBLISHED, city: { not: null } },
            select: { city: true },
            distinct: ["city"],
            orderBy: { city: "asc" },
        });
        return rows
            .map((row) => row.city)
            .filter((city) => Boolean(city));
    }
    async getPublishedBySlug(slug) {
        const post = await this.prisma.contentPost.findFirst({
            where: { slug, status: client_1.ContentStatus.PUBLISHED },
            include: postInclude,
        });
        if (!post)
            throw new common_1.NotFoundException('������� �� ��������');
        return post;
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
        const keepPostSlugs = new Set(content_seed_data_1.CONTENT_KEEP_POST_SLUGS);
        const keepTopicSlugs = new Set(content_seed_data_1.CONTENT_TOPICS_SEED.map((t) => t.slug));
        for (const [from, to] of Object.entries(content_seed_data_1.CONTENT_POST_SLUG_ALIASES)) {
            const oldPost = await this.prisma.contentPost.findUnique({
                where: { slug: from },
            });
            if (!oldPost)
                continue;
            const taken = await this.prisma.contentPost.findUnique({
                where: { slug: to },
            });
            if (!taken) {
                await this.prisma.contentPost.update({
                    where: { id: oldPost.id },
                    data: { slug: to },
                });
            }
            else if (taken.id !== oldPost.id) {
                await this.prisma.contentPost.delete({ where: { id: oldPost.id } });
            }
        }
        const topics = await this.prisma.contentTopic.findMany();
        const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));
        const author = await this.prisma.user.findFirst({
            where: { email: 'admin@nitka.local' },
            select: { id: true },
        });
        for (const seed of content_seed_data_1.CONTENT_POSTS_SEED) {
            if (!keepPostSlugs.has(seed.slug))
                continue;
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
                        topicId: topic.id,
                        authorId: author?.id ?? null,
                        publishedAt: new Date(),
                        seoTitle: seed.seoTitle || seed.title,
                        seoDescription: seed.seoDescription || seed.excerpt,
                        body,
                    },
                });
                continue;
            }
            await this.prisma.contentPost.update({
                where: { id: existing.id },
                data: {
                    title: seed.title,
                    excerpt: seed.excerpt,
                    coverUrl: seed.coverUrl,
                    ogImageUrl: existing.ogImageUrl || seed.coverUrl,
                    seoTitle: seed.seoTitle || seed.title,
                    seoDescription: seed.seoDescription || seed.excerpt,
                    featured: seed.featured ?? existing.featured,
                    city: null,
                    kind: seed.kind,
                    topicId: topic.id,
                    body,
                    status: client_1.ContentStatus.PUBLISHED,
                    publishedAt: existing.publishedAt ?? new Date(),
                },
            });
        }
        await this.prisma.contentPost.deleteMany({
            where: { slug: { notIn: [...keepPostSlugs] } },
        });
        await this.prisma.contentTopic.deleteMany({
            where: { slug: { notIn: [...keepTopicSlugs] } },
        });
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = ContentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map