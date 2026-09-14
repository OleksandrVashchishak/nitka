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
    listCities(): Promise<string[]>;
    list(topic?: string, kind?: ContentKind, featured?: string, q?: string, city?: string, page?: string, limit?: string): Promise<{
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
}
