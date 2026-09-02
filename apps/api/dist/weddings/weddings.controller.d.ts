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
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        }[];
        id: string;
        city: string;
        userId: string;
        date: Date;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
    } | undefined>;
    upsert(user: AuthUser, dto: UpsertWeddingDto): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        }[];
        id: string;
        city: string;
        userId: string;
        date: Date;
        guests: number;
        budget: number;
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
            _count: {
                reviews: number;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
            photos: {
                id: string;
                url: string;
                order: number;
                vendorId: string;
            }[];
            id: string;
            name: string;
            slug: string | null;
            description: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            city: string;
            featured: boolean;
            createdAt: Date;
            tagline: string;
            categoryId: string;
            priceFrom: number;
            priceTo: number | null;
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
            userId: string;
            rating: number;
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
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        }[];
        id: string;
        city: string;
        userId: string;
        date: Date;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
    } | null>;
    createTask(user: AuthUser, dto: CreateTaskDto): Promise<{
        id: string;
        sortOrder: number;
        status: import(".prisma/client").$Enums.TaskStatus;
        title: string;
        weddingId: string;
        categorySlug: string | null;
        dueDate: Date | null;
        isCustom: boolean;
    }>;
    updateTask(user: AuthUser, taskId: string, dto: UpdateTaskDto): Promise<{
        id: string;
        sortOrder: number;
        status: import(".prisma/client").$Enums.TaskStatus;
        title: string;
        weddingId: string;
        categorySlug: string | null;
        dueDate: Date | null;
        isCustom: boolean;
    }>;
    deleteTask(user: AuthUser, taskId: string): Promise<{
        ok: boolean;
    }>;
}
