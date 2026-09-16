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
        icon: string;
        coverUrl: string | null;
    })[]>;
    getTopic(slug: string): Promise<{
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
        icon: string;
        coverUrl: string | null;
    }>;
    listCities(): Promise<string[]>;
    list(topic?: string, kind?: ContentKind, featured?: string, q?: string, city?: string, page?: string, limit?: string): Promise<{
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
}
