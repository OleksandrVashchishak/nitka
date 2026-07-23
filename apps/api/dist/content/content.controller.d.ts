import { ContentKind } from '@prisma/client';
import { ContentService } from './content.service';
export declare class ContentController {
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
    getTopic(slug: string): Promise<{
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        coverUrl: string | null;
        icon: string;
    }>;
    list(topic?: string, kind?: ContentKind, featured?: string, page?: string, limit?: string): Promise<{
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getBySlug(slug: string): Promise<{
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
}
