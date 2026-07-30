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
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    })[]>;
    getTopic(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    }>;
    list(topic?: string, kind?: ContentKind, featured?: string, page?: string, limit?: string): Promise<{
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
            body: import("@prisma/client/runtime/library").JsonValue;
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
    getBySlug(slug: string): Promise<{
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
        body: import("@prisma/client/runtime/library").JsonValue;
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
}
