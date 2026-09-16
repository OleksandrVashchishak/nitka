import type { Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpsertDayPlanDto } from './dto/day-plan.dto';
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
    }>;
    getMine(user: AuthUser, res: Response): Promise<{
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            sortOrder: number;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: string | null;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
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
    } | undefined>;
    upsert(user: AuthUser, dto: UpsertWeddingDto): Promise<{
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            sortOrder: number;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: string | null;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
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
        market: {
            average: number;
            vendorsCount: number;
            categories: {
                category: string;
                label: string;
                average: number;
                vendorsCount: number;
            }[];
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
        recommendations: {
            reason: string;
            category: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
            photos: {
                id: string;
                vendorId: string;
                url: string;
                order: number;
            }[];
            _count: {
                reviews: number;
            };
            name: string;
            id: string;
            userId: string;
            city: string;
            createdAt: Date;
            slug: string | null;
            tagline: string;
            description: string;
            categoryId: string;
            priceFrom: number;
            priceTo: number | null;
            rating: number;
            status: import(".prisma/client").$Enums.VendorStatus;
            featured: boolean;
            phone: string | null;
            website: string | null;
            instagram: string | null;
            address: string | null;
            yearsInBusiness: number | null;
            teamSize: number | null;
            responseTime: string | null;
            bookingLeadTime: string | null;
            availabilityNote: string;
            videoUrl: string | null;
            dealTitle: string | null;
            dealDescription: string | null;
            styles: string[];
            services: string[];
            serviceAreas: string[];
            languages: string[];
            moderationNote: string | null;
        }[];
    } | null>;
    getDayPlan(user: AuthUser): Promise<{
        dayPlan: {
            use24h?: boolean | undefined;
            version: 1;
            events: {
                icon?: string | undefined;
                id: string;
                title: string;
                durationMin: number;
                startMin: number | null;
            }[];
        } | null;
    }>;
    upsertDayPlan(user: AuthUser, dto: UpsertDayPlanDto): Promise<{
        dayPlan: {
            use24h?: boolean | undefined;
            version: 1;
            events: {
                icon?: string | undefined;
                id: string;
                title: string;
                durationMin: number;
                startMin: number | null;
            }[];
        };
    }>;
    createPartnerInvite(user: AuthUser): Promise<{
        token: string;
        expiresAt: Date;
        path: string;
    }>;
    acceptPartnerInvite(user: AuthUser, token: string): Promise<{
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            sortOrder: number;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: string | null;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
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
    } | null>;
    createTask(user: AuthUser, dto: CreateTaskDto): Promise<{
        id: string;
        weddingId: string;
    } & {
        assignee: string | null;
    }>;
    updateTask(user: AuthUser, taskId: string, dto: UpdateTaskDto): Promise<{
        id: string;
        weddingId: string;
    } & {
        assignee: string | null;
    }>;
    deleteTask(user: AuthUser, taskId: string): Promise<{
        ok: boolean;
    }>;
}
