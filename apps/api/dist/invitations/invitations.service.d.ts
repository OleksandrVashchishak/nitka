import { PrismaService } from '../prisma/prisma.service';
import { UpsertWeddingInvitationDto } from './dto/invitation.dto';
export type InvitationContent = {
    headline: string;
    opener: string;
    body: string;
    dateLabel: string;
    timeLabel: string;
    venue: string;
    address: string;
    dressCode: string;
    rsvpNote: string;
    coverImageUrl: string;
    showWebsiteLink: boolean;
};
export declare const INVITATION_TEMPLATES: {
    id: string;
    name: string;
    description: string;
}[];
export declare function normalizeInvitationContent(raw: unknown, fallback?: Partial<InvitationContent>): InvitationContent;
export declare class InvitationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMine(userId: string): Promise<{
        invitation: {
            templateId: string;
            content: InvitationContent;
            updatedAt: Date | null;
        };
        wedding: {
            id: string;
            date: Date;
            city: string;
            coupleName: string;
        };
        website: {
            slug: string;
            url: string;
        } | null;
        guestsPreview: {
            id: string;
            name: string;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            inviteToken: string;
        }[];
        guestsTotal: number;
        templates: {
            id: string;
            name: string;
            description: string;
        }[];
    }>;
    upsertMine(userId: string, dto: UpsertWeddingInvitationDto): Promise<{
        invitation: {
            templateId: string;
            content: InvitationContent;
            updatedAt: Date;
        };
        templates: {
            id: string;
            name: string;
            description: string;
        }[];
    }>;
    getDesignForWedding(weddingId: string): Promise<{
        templateId: string;
        content: InvitationContent;
    }>;
}
