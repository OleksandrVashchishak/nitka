import { PrismaService } from '../prisma/prisma.service';
import { UpsertWeddingWebsiteDto } from './dto/website.dto';
export type WebsiteScheduleItem = {
    time: string;
    title: string;
    detail: string;
};
export type WebsiteQaItem = {
    question: string;
    answer: string;
};
export type WebsiteTravelItem = {
    title: string;
    detail: string;
};
export type WebsiteRegistryItem = {
    title: string;
    url: string;
    detail: string;
};
export type WebsiteSections = {
    story: boolean;
    schedule: boolean;
    dressCode: boolean;
    gallery: boolean;
    qa: boolean;
    travel: boolean;
    registry: boolean;
    rsvp: boolean;
};
export type WebsiteContent = {
    headline: string;
    subheadline: string;
    dateLabel: string;
    cityLabel: string;
    dateFormat: 'uk' | 'en';
    accentColor: string;
    heroImageUrl: string;
    coupleImageUrl: string;
    storyTitle: string;
    storyBody: string;
    storyImageUrl: string;
    scheduleTitle: string;
    scheduleItems: WebsiteScheduleItem[];
    dressCodeTitle: string;
    dressCodeBody: string;
    galleryTitle: string;
    galleryImages: string[];
    qaTitle: string;
    qaItems: WebsiteQaItem[];
    travelTitle: string;
    travelBody: string;
    travelItems: WebsiteTravelItem[];
    registryTitle: string;
    registryBody: string;
    registryItems: WebsiteRegistryItem[];
    rsvpTitle: string;
    rsvpBody: string;
    rsvpUrl: string;
    footerNote: string;
    sections: WebsiteSections;
    introEnabled: boolean;
    introTitle: string;
    musicUrl: string;
};
export declare class WebsiteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMine(userId: string): Promise<{
        site: null;
        suggestedSlug: string;
        defaults: WebsiteContent;
        templates: {
            id: string;
            name: string;
            description: string;
        }[];
    } | {
        site: {
            id: string;
            slug: string;
            templateId: string;
            published: boolean;
            content: WebsiteContent;
            updatedAt: Date;
            publicPath: string;
            wedding: {
                partnerOneName: string;
                partnerTwoName: string;
                date: Date;
                city: string;
            };
        };
        suggestedSlug: string;
        defaults: WebsiteContent;
        templates: {
            id: string;
            name: string;
            description: string;
        }[];
    }>;
    upsertMine(userId: string, dto: UpsertWeddingWebsiteDto): Promise<{
        id: string;
        slug: string;
        templateId: string;
        published: boolean;
        content: WebsiteContent;
        updatedAt: Date;
        publicPath: string;
        wedding: {
            partnerOneName: string;
            partnerTwoName: string;
            date: Date;
            city: string;
        };
    }>;
    getPublicBySlug(slugRaw: string): Promise<{
        id: string;
        slug: string;
        templateId: string;
        published: boolean;
        content: WebsiteContent;
        updatedAt: Date;
        publicPath: string;
        wedding: {
            partnerOneName: string;
            partnerTwoName: string;
            date: Date;
            city: string;
        };
    }>;
    private suggestSlug;
}
