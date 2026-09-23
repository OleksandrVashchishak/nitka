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
        sortOrder: number;
        icon: string;
        slug: string;
        description: string;
        coverUrl: string | null;
    })[]>;
    getTopic(slug: string): Promise<{
        name: string;
        id: string;
        sortOrder: number;
        icon: string;
        slug: string;
        description: string;
        coverUrl: string | null;
    }>;
    listCities(): Promise<string[]>;
    list(topic?: string, kind?: ContentKind, featured?: string, q?: string, city?: string, page?: string, limit?: string): Promise<{
        items: ({
            topic: {
                name: string;
                id: string;
                sortOrder: number;
                icon: string;
                slug: string;
                description: string;
                coverUrl: string | null;
            };
            author: {
                name: string;
                id: string;
            } | null;
        } & {
            id: string;
            city: string | null;
            createdAt: Date;
            title: string;
            status: import(".prisma/client").$Enums.ContentStatus;
            updatedAt: Date;
            slug: string;
            coverUrl: string | null;
            kind: import(".prisma/client").$Enums.ContentKind;
            featured: boolean;
            excerpt: string;
            body: import("@prisma/client/runtime/library").JsonValue;
            seoTitle: string;
            seoDescription: string;
            ogImageUrl: string | null;
            topicId: string;
            authorId: string | null;
            publishedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getBySlug(slug: string): Promise<{
        topic: {
            name: string;
            id: string;
            sortOrder: number;
            icon: string;
            slug: string;
            description: string;
            coverUrl: string | null;
        };
        author: {
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        city: string | null;
        createdAt: Date;
        title: string;
        status: import(".prisma/client").$Enums.ContentStatus;
        updatedAt: Date;
        slug: string;
        coverUrl: string | null;
        kind: import(".prisma/client").$Enums.ContentKind;
        featured: boolean;
        excerpt: string;
        body: import("@prisma/client/runtime/library").JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
}
