import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { type DayPlanEventPayload } from './day-plan.defaults';
import { ShareInviteDto, UpdateShareGrantDto } from './dto/share-invite.dto';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';
export declare class DayPlanService {
    private readonly prisma;
    private readonly email;
    constructor(prisma: PrismaService, email: EmailService);
    getMine(userId: string): Promise<{
        weddingId: string;
        access: import("./day-plan-access").DayPlanAccessLevel;
        events: DayPlanEventPayload[] | null;
    }>;
    upsert(userId: string, dto: UpsertDayPlanDto): Promise<{
        weddingId: string;
        events: DayPlanEventPayload[];
    }>;
    upsertByShareToken(userId: string, token: string, dto: UpsertDayPlanDto): Promise<{
        weddingId: string;
        events: DayPlanEventPayload[];
    }>;
    getPublicByToken(token: string): Promise<{
        token: string;
        weddingId: string;
        date: Date;
        partnerOneName: string;
        partnerTwoName: string;
        events: DayPlanEventPayload[];
    }>;
    getSharedAccess(userId: string | null, token: string): Promise<{
        access: "EDIT" | "VIEW" | null;
        canEdit: boolean;
    }>;
    getShare(userId: string): Promise<{
        token: string;
        path: string;
        people: ({
            id: string;
            kind: "member";
            name: string;
            email: string;
            access: "EDIT";
            locked: boolean;
        } | {
            id: string;
            kind: "grant";
            name: string;
            email: string;
            access: import(".prisma/client").$Enums.DayPlanShareAccess;
            locked: boolean;
            accepted: boolean;
        })[];
    }>;
    invite(userId: string, dto: ShareInviteDto): Promise<{
        token: string;
        path: string;
        people: ({
            id: string;
            kind: "member";
            name: string;
            email: string;
            access: "EDIT";
            locked: boolean;
        } | {
            id: string;
            kind: "grant";
            name: string;
            email: string;
            access: import(".prisma/client").$Enums.DayPlanShareAccess;
            locked: boolean;
            accepted: boolean;
        })[];
        invitePath: string;
    }>;
    updateGrant(userId: string, grantId: string, dto: UpdateShareGrantDto): Promise<{
        token: string;
        path: string;
        people: ({
            id: string;
            kind: "member";
            name: string;
            email: string;
            access: "EDIT";
            locked: boolean;
        } | {
            id: string;
            kind: "grant";
            name: string;
            email: string;
            access: import(".prisma/client").$Enums.DayPlanShareAccess;
            locked: boolean;
            accepted: boolean;
        })[];
    }>;
    revokeGrant(userId: string, grantId: string): Promise<{
        token: string;
        path: string;
        people: ({
            id: string;
            kind: "member";
            name: string;
            email: string;
            access: "EDIT";
            locked: boolean;
        } | {
            id: string;
            kind: "grant";
            name: string;
            email: string;
            access: import(".prisma/client").$Enums.DayPlanShareAccess;
            locked: boolean;
            accepted: boolean;
        })[];
    }>;
    getInvitePreview(inviteToken: string): Promise<{
        inviteToken: string;
        email: string;
        name: string;
        access: import(".prisma/client").$Enums.DayPlanShareAccess;
        accepted: boolean;
        shareToken: string;
        date: Date;
        coupleName: string;
    }>;
    acceptInvite(userId: string, inviteToken: string): Promise<{
        shareToken: string;
        access: import(".prisma/client").$Enums.DayPlanShareAccess;
        path: string;
    }>;
    private writeEvents;
    private ensureShare;
    private buildSharePeople;
    private displayNameFromEmail;
    private parseEvents;
    private sortEvents;
}
