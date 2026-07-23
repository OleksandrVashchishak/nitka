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
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        coverUrl: string | null;
        icon: string;
    })[]>;
    getTopicBySlug(slug: string): Promise<{
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        coverUrl: string | null;
        icon: string;
    }>;
    listPublished(params: {
        topic?: string;
        kind?: ContentKind;
        featured?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            author: {
                name: string;
                id: string;
            } | null;
            topic: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
                coverUrl: string | null;
                icon: string;
            };
        } & {
            id: string;
            createdAt: Date;
            slug: string;
            title: string;
            city: string | null;
            status: import(".prisma/client").$Enums.ContentStatus;
            featured: boolean;
            updatedAt: Date;
            body: Prisma.JsonValue;
            authorId: string | null;
            excerpt: string;
            coverUrl: string | null;
            kind: import(".prisma/client").$Enums.ContentKind;
            seoTitle: string;
            seoDescription: string;
            ogImageUrl: string | null;
            vendorCategorySlug: string | null;
            topicId: string;
            publishedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getPublishedBySlug(slug: string): Promise<{
        author: {
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            coverUrl: string | null;
            icon: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        updatedAt: Date;
        body: Prisma.JsonValue;
        authorId: string | null;
        excerpt: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
    }>;
    adminListPosts(params: {
        status?: ContentStatus;
        topic?: string;
        q?: string;
    }): Prisma.PrismaPromise<({
        author: {
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            coverUrl: string | null;
            icon: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        updatedAt: Date;
        body: Prisma.JsonValue;
        authorId: string | null;
        excerpt: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
    })[]>;
    adminGetPost(id: string): Promise<{
        author: {
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            coverUrl: string | null;
            icon: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        updatedAt: Date;
        body: Prisma.JsonValue;
        authorId: string | null;
        excerpt: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
    }>;
    createTopic(dto: UpsertContentTopicDto): Promise<{
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        coverUrl: string | null;
        icon: string;
    }>;
    updateTopic(id: string, dto: UpsertContentTopicDto): Promise<{
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        coverUrl: string | null;
        icon: string;
    }>;
    deleteTopic(id: string): Promise<{
        ok: boolean;
    }>;
    createPost(authorId: string, dto: UpsertContentPostDto): Promise<{
        author: {
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            coverUrl: string | null;
            icon: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        updatedAt: Date;
        body: Prisma.JsonValue;
        authorId: string | null;
        excerpt: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
    }>;
    updatePost(id: string, dto: UpsertContentPostDto): Promise<{
        author: {
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            coverUrl: string | null;
            icon: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        updatedAt: Date;
        body: Prisma.JsonValue;
        authorId: string | null;
        excerpt: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
    }>;
    updateStatus(id: string, status: ContentStatus): Promise<{
        author: {
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            coverUrl: string | null;
            icon: string;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        title: string;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        updatedAt: Date;
        body: Prisma.JsonValue;
        authorId: string | null;
        excerpt: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
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
