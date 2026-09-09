import { RequestStatus, Role } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestMessageDto } from './dto/create-request-message.dto';
export declare class RequestsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    create(userId: string, dto: CreateRequestDto): Promise<{
        vendor: {
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
        } & {
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
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
            body: string;
        })[];
    } & {
        id: string;
        userId: string;
        vendorId: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listMine(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        vendor: {
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
        } & {
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
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
            body: string;
        })[];
    } & {
        id: string;
        userId: string;
        vendorId: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    listForVendor(userId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
            body: string;
        })[];
    } & {
        id: string;
        userId: string;
        vendorId: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStatus(userId: string, requestId: string, status: RequestStatus): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
            body: string;
        })[];
    } & {
        id: string;
        userId: string;
        vendorId: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMessage(userId: string, userRole: Role, requestId: string, dto: CreateRequestMessageDto): Promise<({
        vendor: {
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
        } & {
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
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
            body: string;
        })[];
    } & {
        id: string;
        userId: string;
        vendorId: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    }) | ({
        user: {
            id: string;
            name: string;
            email: string;
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
            body: string;
        })[];
    } & {
        id: string;
        userId: string;
        vendorId: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
    })>;
    vendorDashboard(userId: string): Promise<{
        vendor: {
            category: {
                id: string;
                slug: string;
                name: string;
                description: string;
                sortOrder: number;
            };
        } & {
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
        };
        stats: {
            views: number;
            views7d: number;
            views30d: number;
            viewsSeries: {
                date: string;
                count: number;
            }[];
            requests: number;
            favorites: number;
            newRequests: number;
        };
    } | null>;
}
