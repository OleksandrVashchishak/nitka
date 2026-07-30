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
    upsert(userId: string, dto: UpsertWeddingDto): Promise<{
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
    createTask(userId: string, dto: CreateTaskDto): Promise<{
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
    updateTask(userId: string, taskId: string, dto: UpdateTaskDto): Promise<{
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
