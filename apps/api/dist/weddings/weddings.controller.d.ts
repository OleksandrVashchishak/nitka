import type { Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { PartnerInviteDto } from './dto/partner-invite.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateSmartPlanTasksDto } from './dto/create-smart-plan-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';
import { WeddingsService } from './weddings.service';
export declare class WeddingsController {
    private readonly weddingsService;
    constructor(weddingsService: WeddingsService);
    getPartnerInvitePreview(token: string): Promise<{
        token: string;
        expiresAt: Date;
        city: string;
        date: Date;
        coupleName: string;
        inviterName: string;
        inviteeName: string;
    }>;
    getMine(user: AuthUser, res: Response): Promise<{
        dateUndecided: boolean;
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: null;
            assigneeName: null;
        })[] | ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: "owner" | "partner" | "both" | "none" | "other" | null;
            assigneeName: string | null;
            templateId: string | null;
            source: string | null;
            isUrgent: boolean;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            createdAt: Date;
        })[];
        id: string;
        userId: string;
        date: Date;
        city: string;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
        dayPlan: import("@prisma/client/runtime/library").JsonValue | null;
        vendorPlan: import("@prisma/client/runtime/library").JsonValue | null;
        seatingDraft: import("@prisma/client/runtime/library").JsonValue | null;
        seatingPlan: import("@prisma/client/runtime/library").JsonValue | null;
    } | undefined>;
    upsert(user: AuthUser, dto: UpsertWeddingDto): Promise<{
        dateUndecided: boolean;
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: null;
            assigneeName: null;
        })[] | ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: "owner" | "partner" | "both" | "none" | "other" | null;
            assigneeName: string | null;
            templateId: string | null;
            source: string | null;
            isUrgent: boolean;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            createdAt: Date;
        })[];
        id: string;
        userId: string;
        date: Date;
        city: string;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
        dayPlan: import("@prisma/client/runtime/library").JsonValue | null;
        vendorPlan: import("@prisma/client/runtime/library").JsonValue | null;
        seatingDraft: import("@prisma/client/runtime/library").JsonValue | null;
        seatingPlan: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    getInsights(user: AuthUser): Promise<{
        city: string;
        plan: {
            done: number;
            total: number;
            progress: number;
            inProgress: number;
        };
        rsvp: {
            total: number;
            yes: number;
            no: number;
            maybe: number;
            pending: number;
        };
        budget: {
            total: number;
            perGuest: number;
            estimated: number;
            actual: number;
            paid: number;
            remaining: number;
        };
        pipeline: {
            total: number;
            counts: Record<string, number>;
        };
    } | null>;
    createPartnerInvite(user: AuthUser, dto: PartnerInviteDto): Promise<{
        token: string;
        expiresAt: Date;
        path: string;
        emailed: boolean;
    }>;
    removePartner(user: AuthUser): Promise<{
        dateUndecided: boolean;
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: null;
            assigneeName: null;
        })[] | ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: "owner" | "partner" | "both" | "none" | "other" | null;
            assigneeName: string | null;
            templateId: string | null;
            source: string | null;
            isUrgent: boolean;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            createdAt: Date;
        })[];
        id: string;
        userId: string;
        date: Date;
        city: string;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
        dayPlan: import("@prisma/client/runtime/library").JsonValue | null;
        vendorPlan: import("@prisma/client/runtime/library").JsonValue | null;
        seatingDraft: import("@prisma/client/runtime/library").JsonValue | null;
        seatingPlan: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    acceptPartnerInvite(user: AuthUser, token: string): Promise<{
        dateUndecided: boolean;
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: null;
            assigneeName: null;
        })[] | ({
            id: string;
            weddingId: string;
            title: string;
            sortOrder: number;
            categorySlug: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: "owner" | "partner" | "both" | "none" | "other" | null;
            assigneeName: string | null;
            templateId: string | null;
            source: string | null;
            isUrgent: boolean;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            createdAt: Date;
        })[];
        id: string;
        userId: string;
        date: Date;
        city: string;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
        dayPlan: import("@prisma/client/runtime/library").JsonValue | null;
        vendorPlan: import("@prisma/client/runtime/library").JsonValue | null;
        seatingDraft: import("@prisma/client/runtime/library").JsonValue | null;
        seatingPlan: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    createTask(user: AuthUser, dto: CreateTaskDto): Promise<({
        id: string;
        weddingId: string;
    } & {
        assignee: null;
        assigneeName: null;
    }) | ({
        id: string;
        weddingId: string;
    } & {
        assignee: "owner" | "partner" | "both" | "none" | "other" | null;
        assigneeName: string | null;
        templateId: string | null;
        source: string | null;
        isUrgent: boolean;
    })>;
    createSmartPlanTasks(user: AuthUser, dto: CreateSmartPlanTasksDto): Promise<({
        id: string;
        weddingId: string;
        title: string;
        sortOrder: number;
        categorySlug: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        dueRemindedAt: Date | null;
        isCustom: boolean;
        assignee: string | null;
    } & {
        assignee: null;
        assigneeName: null;
    })[] | ({
        id: string;
        weddingId: string;
        title: string;
        sortOrder: number;
        categorySlug: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        dueRemindedAt: Date | null;
        isCustom: boolean;
        assignee: string | null;
    } & {
        assignee: "owner" | "partner" | "both" | "none" | "other" | null;
        assigneeName: string | null;
        templateId: string | null;
        source: string | null;
        isUrgent: boolean;
    })[]>;
    updateTask(user: AuthUser, taskId: string, dto: UpdateTaskDto): Promise<({
        id: string;
        weddingId: string;
    } & {
        assignee: null;
        assigneeName: null;
    }) | ({
        id: string;
        weddingId: string;
    } & {
        assignee: "owner" | "partner" | "both" | "none" | "other" | null;
        assigneeName: string | null;
        templateId: string | null;
        source: string | null;
        isUrgent: boolean;
    })>;
    deleteTask(user: AuthUser, taskId: string): Promise<{
        ok: boolean;
    }>;
}
