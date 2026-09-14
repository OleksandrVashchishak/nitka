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
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    })[]>;
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
    listPosts(status?: ContentStatus, topic?: string, q?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        id: string;
        createdAt: Date;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        updatedAt: Date;
        slug: string;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
        title: string;
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
        id: string;
        createdAt: Date;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        updatedAt: Date;
        slug: string;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
        title: string;
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
        id: string;
        createdAt: Date;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        updatedAt: Date;
        slug: string;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
        title: string;
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
        id: string;
        createdAt: Date;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        updatedAt: Date;
        slug: string;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
        title: string;
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
        id: string;
        createdAt: Date;
        city: string | null;
        status: import(".prisma/client").$Enums.ContentStatus;
        updatedAt: Date;
        slug: string;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
        title: string;
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
