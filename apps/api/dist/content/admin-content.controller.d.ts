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
        icon: string;
        coverUrl: string | null;
    })[]>;
    createTopic(dto: UpsertContentTopicDto): Promise<{
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    }>;
    updateTopic(id: string, dto: UpsertContentTopicDto): Promise<{
        name: string;
        id: string;
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
            name: string;
            id: string;
        } | null;
        topic: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
            icon: string;
            coverUrl: string | null;
        };
    } & {
        id: string;
        city: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
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
            icon: string;
            coverUrl: string | null;
        };
    } & {
        id: string;
        city: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
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
            icon: string;
            coverUrl: string | null;
        };
    } & {
        id: string;
        city: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
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
            icon: string;
            coverUrl: string | null;
        };
    } & {
        id: string;
        city: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
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
            icon: string;
            coverUrl: string | null;
        };
    } & {
        id: string;
        city: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        featured: boolean;
        authorId: string | null;
        body: import("@prisma/client/runtime/library").JsonValue;
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
