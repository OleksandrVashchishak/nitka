import { AuthUser } from '../auth/current-user.decorator';
import { DayPlanService } from './day-plan.service';
import { ShareInviteDto, UpdateShareGrantDto } from './dto/share-invite.dto';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';
export declare class DayPlanController {
    private readonly dayPlanService;
    constructor(dayPlanService: DayPlanService);
    getPublic(token: string): Promise<{
        token: string;
        weddingId: string;
        date: Date;
        partnerOneName: string;
        partnerTwoName: string;
        events: import("./day-plan.defaults").DayPlanEventPayload[];
    }>;
    getSharedAccessAuthed(user: AuthUser, token: string): Promise<{
        access: "EDIT" | "VIEW" | null;
        canEdit: boolean;
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
    acceptInvite(user: AuthUser, inviteToken: string): Promise<{
        shareToken: string;
        access: import(".prisma/client").$Enums.DayPlanShareAccess;
        path: string;
    }>;
    getShare(user: AuthUser): Promise<{
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
    invite(user: AuthUser, dto: ShareInviteDto): Promise<{
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
    updateGrant(user: AuthUser, grantId: string, dto: UpdateShareGrantDto): Promise<{
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
    revokeGrant(user: AuthUser, grantId: string): Promise<{
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
    upsertShared(user: AuthUser, token: string, dto: UpsertDayPlanDto): Promise<{
        weddingId: string;
        events: import("./day-plan.defaults").DayPlanEventPayload[];
    }>;
    getMine(user: AuthUser): Promise<{
        weddingId: string;
        access: import("./day-plan-access").DayPlanAccessLevel;
        events: import("./day-plan.defaults").DayPlanEventPayload[] | null;
    }>;
    upsert(user: AuthUser, dto: UpsertDayPlanDto): Promise<{
        weddingId: string;
        events: import("./day-plan.defaults").DayPlanEventPayload[];
    }>;
}
