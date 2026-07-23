import { ContentKind } from '@prisma/client';
export type SeedBlock = {
    type: 'header';
    text: string;
    level?: number;
} | {
    type: 'paragraph';
    text: string;
} | {
    type: 'list';
    style?: 'unordered' | 'ordered';
    items: string[];
} | {
    type: 'quote';
    text: string;
    caption?: string;
};
export type TopicSeed = {
    name: string;
    slug: string;
    description: string;
    icon: string;
    coverUrl: string;
    sortOrder: number;
};
export type PostSeed = {
    slug: string;
    title: string;
    excerpt: string;
    coverUrl: string;
    kind: ContentKind;
    topicSlug: string;
    featured?: boolean;
    city?: string;
    vendorCategorySlug?: string;
    blocks: SeedBlock[];
};
export declare const CONTENT_TOPICS_SEED: TopicSeed[];
export declare const CONTENT_POSTS_SEED: PostSeed[];
