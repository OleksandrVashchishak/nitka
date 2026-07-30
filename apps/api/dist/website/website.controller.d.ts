import { AuthUser } from '../auth/current-user.decorator';
import { UpsertWeddingWebsiteDto } from './dto/website.dto';
import { WebsiteService } from './website.service';
export declare class WebsiteController {
    private readonly websiteService;
    constructor(websiteService: WebsiteService);
    getMine(user: AuthUser): Promise<{
        site: null;
        suggestedSlug: string;
        defaults: import("./website.service").WebsiteContent;
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
            content: import("./website.service").WebsiteContent;
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
        defaults: import("./website.service").WebsiteContent;
        templates: {
            id: string;
            name: string;
            description: string;
        }[];
    }>;
    upsertMine(user: AuthUser, dto: UpsertWeddingWebsiteDto): Promise<{
        id: string;
        slug: string;
        templateId: string;
        published: boolean;
        content: import("./website.service").WebsiteContent;
        updatedAt: Date;
        publicPath: string;
        wedding: {
            partnerOneName: string;
            partnerTwoName: string;
            date: Date;
            city: string;
        };
    }>;
    getPublic(slug: string): Promise<{
        id: string;
        slug: string;
        templateId: string;
        published: boolean;
        content: import("./website.service").WebsiteContent;
        updatedAt: Date;
        publicPath: string;
        wedding: {
            partnerOneName: string;
            partnerTwoName: string;
            date: Date;
            city: string;
        };
    }>;
}
