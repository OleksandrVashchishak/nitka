import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpsertDayPlanDto } from './dto/day-plan.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';
export declare class WeddingsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    private loadWeddingWithMeta;
    getMine(userId: string): Promise<{
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
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            weddingId: string;
            sortOrder: number;
            title: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        }[];
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
    getInsights(userId: string): Promise<{
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
                slug: string;
                name: string;
                description: string;
                sortOrder: number;
            };
            photos: {
                id: string;
                vendorId: string;
                url: string;
                order: number;
            }[];
            id: string;
            userId: string;
            city: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            createdAt: Date;
            slug: string | null;
            name: string;
            tagline: string;
            description: string;
            categoryId: string;
            priceFrom: number;
            priceTo: number | null;
            rating: number;
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
    upsert(userId: string, dto: UpsertWeddingDto): Promise<{
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
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            weddingId: string;
            sortOrder: number;
            title: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        }[];
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
    createPartnerInvite(userId: string): Promise<{
        token: string;
        expiresAt: Date;
        path: string;
    }>;
    getPartnerInvitePreview(token: string): Promise<{
        token: string;
        expiresAt: Date;
        city: string;
        date: Date;
        coupleName: string;
    }>;
    acceptPartnerInvite(userId: string, token: string): Promise<{
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
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            weddingId: string;
            sortOrder: number;
            title: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        }[];
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
    createTask(userId: string, dto: CreateTaskDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        weddingId: string;
        sortOrder: number;
        title: string;
        categorySlug: string | null;
        dueDate: Date | null;
        isCustom: boolean;
    }>;
    updateTask(userId: string, taskId: string, dto: UpdateTaskDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        weddingId: string;
        sortOrder: number;
        title: string;
        categorySlug: string | null;
        dueDate: Date | null;
        isCustom: boolean;
    }>;
    deleteTask(userId: string, taskId: string): Promise<{
        ok: boolean;
    }>;
    getDayPlan(userId: string): Promise<{
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
    upsertDayPlan(userId: string, dto: UpsertDayPlanDto): Promise<{
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
    private normalizeDayPlan;
    private requireMemberTask;
    private syncDefaultTasks;
}
