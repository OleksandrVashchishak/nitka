import { ContentKind, ContentStatus } from '@prisma/client';
export declare class UpsertContentTopicDto {
    name: string;
    slug?: string;
    description?: string;
    sortOrder?: number;
}
export declare class UpsertContentPostDto {
    title: string;
    slug?: string;
    excerpt?: string;
    coverUrl?: string | null;
    kind?: ContentKind;
    status?: ContentStatus;
    body?: Record<string, unknown>;
    seoTitle?: string;
    seoDescription?: string;
    ogImageUrl?: string | null;
    city?: string | null;
    vendorCategorySlug?: string | null;
    featured?: boolean;
    topicId: string;
}
export declare class UpdateContentStatusDto {
    status: ContentStatus;
}
