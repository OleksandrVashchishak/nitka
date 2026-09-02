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
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    })[]>;
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
    listPosts(status?: ContentStatus, topic?: string, q?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
    getPost(id: string): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
    createPost(user: AuthUser, dto: UpsertContentPostDto): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
    updateStatus(id: string, dto: UpdateContentStatusDto): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
}
