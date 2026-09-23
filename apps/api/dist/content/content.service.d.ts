import { OnModuleInit } from '@nestjs/common';
import { ContentKind, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class ContentService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    listTopics(): Prisma.PrismaPromise<({
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
    getTopicBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        coverUrl: string | null;
        sortOrder: number;
    }>;
    listPublished(params: {
        topic?: string;
        kind?: ContentKind;
        featured?: boolean;
        q?: string;
        city?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
            body: Prisma.JsonValue;
            seoTitle: string;
            seoDescription: string;
            ogImageUrl: string | null;
            city: string | null;
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
    listPublishedCities(): Promise<string[]>;
    getPublishedBySlug(slug: string): Promise<{
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
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        city: string | null;
        featured: boolean;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private seedTopicsAndPosts;
}
