import { AuthUser } from '../auth/current-user.decorator';
import { UpsertWeddingInvitationDto } from './dto/invitation.dto';
import { InvitationsService } from './invitations.service';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    getMine(user: AuthUser): Promise<{
        invitation: {
            templateId: string;
            content: import("./invitations.service").InvitationContent;
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
    upsertMine(user: AuthUser, dto: UpsertWeddingInvitationDto): Promise<{
        invitation: {
            templateId: string;
            content: import("./invitations.service").InvitationContent;
            updatedAt: Date;
        };
        templates: {
            id: string;
            name: string;
            description: string;
        }[];
    }>;
}
