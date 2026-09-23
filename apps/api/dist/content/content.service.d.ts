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
        name: string;
        id: string;
        sortOrder: number;
        icon: string;
        slug: string;
        description: string;
        coverUrl: string | null;
    })[]>;
    getTopicBySlug(slug: string): Promise<{
        name: string;
        id: string;
        sortOrder: number;
        icon: string;
        slug: string;
        description: string;
        coverUrl: string | null;
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
            body: Prisma.JsonValue;
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
    listPublishedCities(): Promise<string[]>;
    getPublishedBySlug(slug: string): Promise<{
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
        body: Prisma.JsonValue;
        seoTitle: string;
        seoDescription: string;
        ogImageUrl: string | null;
        topicId: string;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    private seedTopicsAndPosts;
}
