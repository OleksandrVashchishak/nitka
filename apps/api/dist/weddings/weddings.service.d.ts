import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';
export declare class WeddingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private loadWeddingWithMeta;
    getMine(userId: string): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            createdAt: Date;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            categorySlug: string | null;
            dueDate: Date | null;
            weddingId: string;
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
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
            _count: {
                reviews: number;
            };
            photos: {
                id: string;
                url: string;
                order: number;
                vendorId: string;
            }[];
            name: string;
            id: string;
            createdAt: Date;
            slug: string | null;
            description: string;
            tagline: string;
            categoryId: string;
            city: string;
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
            status: import(".prisma/client").$Enums.VendorStatus;
            featured: boolean;
            moderationNote: string | null;
        }[];
    } | null>;
    upsert(userId: string, dto: UpsertWeddingDto): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            createdAt: Date;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            categorySlug: string | null;
            dueDate: Date | null;
            weddingId: string;
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
                email: string;
                name: string;
                id: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            createdAt: Date;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            categorySlug: string | null;
            dueDate: Date | null;
            weddingId: string;
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
    createTask(userId: string, dto: CreateTaskDto): Promise<{
        id: string;
        sortOrder: number;
        title: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        categorySlug: string | null;
        dueDate: Date | null;
        weddingId: string;
        isCustom: boolean;
    }>;
    updateTask(userId: string, taskId: string, dto: UpdateTaskDto): Promise<{
        id: string;
        sortOrder: number;
        title: string;
        status: import(".prisma/client").$Enums.TaskStatus;
        categorySlug: string | null;
        dueDate: Date | null;
        weddingId: string;
        isCustom: boolean;
    }>;
    deleteTask(userId: string, taskId: string): Promise<{
        ok: boolean;
    }>;
    private requireMemberTask;
    private syncDefaultTasks;
}
