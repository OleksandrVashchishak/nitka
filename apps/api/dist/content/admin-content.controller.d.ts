import { ContentStatus } from '@prisma/client';
import { AuthUser } from '../auth/current-user.decorator';
import { ContentService } from './content.service';
import { UpdateContentStatusDto, UpsertContentPostDto, UpsertContentTopicDto } from './dto/content.dto';
export declare class AdminContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    listTopics(): import(".prisma/client").Prisma.PrismaPromise<({
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
    listPosts(status?: ContentStatus, topic?: string, q?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
    getPost(id: string): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
    createPost(user: AuthUser, dto: UpsertContentPostDto): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
    updateStatus(id: string, dto: UpdateContentStatusDto): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
}
