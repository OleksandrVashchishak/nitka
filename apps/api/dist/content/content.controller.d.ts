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
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    })[]>;
    getTopic(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    }>;
    listCities(): Promise<string[]>;
    list(topic?: string, kind?: ContentKind, featured?: string, q?: string, city?: string, page?: string, limit?: string): Promise<{
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getBySlug(slug: string): Promise<{
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
}
