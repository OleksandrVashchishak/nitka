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
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    })[]>;
    getTopicBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
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
                id: string;
                name: string;
            } | null;
            topic: {
                id: string;
                name: string;
                slug: string;
                description: string;
                sortOrder: number;
                icon: string;
                coverUrl: string | null;
            };
        } & {
            status: import(".prisma/client").$Enums.ContentStatus;
            featured: boolean;
            id: string;
            slug: string;
            city: string | null;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            authorId: string | null;
            body: Prisma.JsonValue;
            coverUrl: string | null;
            excerpt: string;
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
            id: string;
            name: string;
        } | null;
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        id: string;
        slug: string;
        city: string | null;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue;
        coverUrl: string | null;
        excerpt: string;
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
            id: string;
            name: string;
        } | null;
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        id: string;
        slug: string;
        city: string | null;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue;
        coverUrl: string | null;
        excerpt: string;
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
            id: string;
            name: string;
        } | null;
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        id: string;
        slug: string;
        city: string | null;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue;
        coverUrl: string | null;
        excerpt: string;
        kind: import(".prisma/client").$Enums.ContentKind;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        vendorCategorySlug: string | null;
        topicId: string;
        publishedAt: Date | null;
    }>;
    createTopic(dto: UpsertContentTopicDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    }>;
    updateTopic(id: string, dto: UpsertContentTopicDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    }>;
    deleteTopic(id: string): Promise<{
        ok: boolean;
    }>;
    createPost(authorId: string, dto: UpsertContentPostDto): Promise<{
        author: {
            id: string;
            name: string;
        } | null;
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        id: string;
        slug: string;
        city: string | null;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue;
        coverUrl: string | null;
        excerpt: string;
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
            id: string;
            name: string;
        } | null;
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        id: string;
        slug: string;
        city: string | null;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue;
        coverUrl: string | null;
        excerpt: string;
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
            id: string;
            name: string;
        } | null;
        topic: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        id: string;
        slug: string;
        city: string | null;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        authorId: string | null;
        body: Prisma.JsonValue;
        coverUrl: string | null;
        excerpt: string;
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
