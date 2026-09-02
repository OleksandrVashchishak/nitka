import { OnModuleInit } from '@nestjs/common';
import { ContentKind, ContentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertContentPostDto, UpsertContentTopicDto } from './dto/content.dto';
export declare class ContentService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    listTopics(): Prisma.PrismaPromise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    })[]>;
    getTopicBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    }>;
    listPublished(params: {
        topic?: string;
        kind?: ContentKind;
        featured?: boolean;
        q?: string;
        city?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            topic: {
                id: string;
                name: string;
                slug: string;
                description: string;
                icon: string;
                coverUrl: string | null;
                sortOrder: number;
            };
            author: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            slug: string;
            coverUrl: string | null;
            status: import(".prisma/client").$Enums.ContentStatus;
            title: string;
            excerpt: string;
            kind: import(".prisma/client").$Enums.ContentKind;
            body: Prisma.JsonValue;
            seoTitle: string;
            seoDescription: string;
            ogImageUrl: string | null;
            city: string | null;
            vendorCategorySlug: string | null;
            featured: boolean;
            topicId: string;
            authorId: string | null;
            publishedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    listPublishedCities(): Promise<string[]>;
    getPublishedBySlug(slug: string): Promise<{
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            icon: string;
            coverUrl: string | null;
            sortOrder: number;
        };
        author: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        slug: string;
        coverUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        title: string;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        vendorCategorySlug: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminListPosts(params: {
        status?: ContentStatus;
        topic?: string;
        q?: string;
    }): Prisma.PrismaPromise<({
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            icon: string;
            coverUrl: string | null;
            sortOrder: number;
        };
        author: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        slug: string;
        coverUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        title: string;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        vendorCategorySlug: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    adminGetPost(id: string): Promise<{
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            icon: string;
            coverUrl: string | null;
            sortOrder: number;
        };
        author: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        slug: string;
        coverUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        title: string;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        vendorCategorySlug: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTopic(dto: UpsertContentTopicDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    }>;
    updateTopic(id: string, dto: UpsertContentTopicDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    }>;
    deleteTopic(id: string): Promise<{
        ok: boolean;
    }>;
    createPost(authorId: string, dto: UpsertContentPostDto): Promise<{
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            icon: string;
            coverUrl: string | null;
            sortOrder: number;
        };
        author: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        slug: string;
        coverUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        title: string;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        vendorCategorySlug: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePost(id: string, dto: UpsertContentPostDto): Promise<{
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            icon: string;
            coverUrl: string | null;
            sortOrder: number;
        };
        author: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        slug: string;
        coverUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        title: string;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        vendorCategorySlug: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: ContentStatus): Promise<{
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            icon: string;
            coverUrl: string | null;
            sortOrder: number;
        };
        author: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        slug: string;
        coverUrl: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        title: string;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        vendorCategorySlug: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePost(id: string): Promise<{
        ok: boolean;
    }>;
    private resolveSeo;
    private assertTopic;
    private ensureUniqueTopicSlug;
    private ensureUniquePostSlug;
    private seedTopicsAndPosts;
}
