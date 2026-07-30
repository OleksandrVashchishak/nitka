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
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        tasks: {
            status: import(".prisma/client").$Enums.TaskStatus;
            id: string;
            title: string;
            sortOrder: number;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
        }[];
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            userId: string;
            createdAt: Date;
            weddingId: string;
        })[];
        id: string;
        userId: string;
        city: string;
        guests: number;
        budget: number;
        date: Date;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
    } | undefined>;
    upsert(user: AuthUser, dto: UpsertWeddingDto): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        tasks: {
            status: import(".prisma/client").$Enums.TaskStatus;
            id: string;
            title: string;
            sortOrder: number;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
        }[];
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            userId: string;
            createdAt: Date;
            weddingId: string;
        })[];
        id: string;
        userId: string;
        city: string;
        guests: number;
        budget: number;
        date: Date;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
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
                id: string;
                name: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
            photos: {
                id: string;
                order: number;
                url: string;
                vendorId: string;
            }[];
            _count: {
                reviews: number;
            };
            status: import(".prisma/client").$Enums.VendorStatus;
            featured: boolean;
            id: string;
            userId: string;
            name: string;
            slug: string | null;
            tagline: string;
            description: string;
            categoryId: string;
            city: string;
            priceFrom: number;
            priceTo: number | null;
            rating: number;
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
            createdAt: Date;
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
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        tasks: {
            status: import(".prisma/client").$Enums.TaskStatus;
            id: string;
            title: string;
            sortOrder: number;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
        }[];
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            userId: string;
            createdAt: Date;
            weddingId: string;
        })[];
        id: string;
        userId: string;
        city: string;
        guests: number;
        budget: number;
        date: Date;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
    } | null>;
    createTask(user: AuthUser, dto: CreateTaskDto): Promise<{
        status: import(".prisma/client").$Enums.TaskStatus;
        id: string;
        title: string;
        sortOrder: number;
        weddingId: string;
        categorySlug: string | null;
        dueDate: Date | null;
        dueRemindedAt: Date | null;
        isCustom: boolean;
    }>;
    updateTask(user: AuthUser, taskId: string, dto: UpdateTaskDto): Promise<{
        status: import(".prisma/client").$Enums.TaskStatus;
        id: string;
        title: string;
        sortOrder: number;
        weddingId: string;
        categorySlug: string | null;
        dueDate: Date | null;
        dueRemindedAt: Date | null;
        isCustom: boolean;
    }>;
    deleteTask(user: AuthUser, taskId: string): Promise<{
        ok: boolean;
    }>;
}
