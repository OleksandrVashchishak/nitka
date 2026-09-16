import type { Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestMessageDto } from './dto/create-request-message.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestsService } from './requests.service';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(user: AuthUser, dto: CreateRequestDto): Promise<{
        vendor: {
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
        } & {
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
        };
        messages: ({
            author: {
                name: string;
                id: string;
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
        city: string;
        guests: number;
        budget: number;
        createdAt: Date;
        vendorId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        eventDate: Date;
        message: string;
    }>;
    listMine(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        vendor: {
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
        } & {
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
        };
        messages: ({
            author: {
                name: string;
                id: string;
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
        city: string;
        guests: number;
        budget: number;
        createdAt: Date;
        vendorId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        eventDate: Date;
        message: string;
    })[]>;
    addMessage(user: AuthUser, id: string, dto: CreateRequestMessageDto): Promise<({
        vendor: {
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
        } & {
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
        };
        messages: ({
            author: {
                name: string;
                id: string;
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
        city: string;
        guests: number;
        budget: number;
        createdAt: Date;
        vendorId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        eventDate: Date;
        message: string;
    }) | ({
        user: {
            name: string;
            id: string;
            email: string;
        };
        messages: ({
            author: {
                name: string;
                id: string;
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
        city: string;
        guests: number;
        budget: number;
        createdAt: Date;
        vendorId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        eventDate: Date;
        message: string;
    })>;
    listForVendor(user: AuthUser): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        messages: ({
            author: {
                name: string;
                id: string;
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
        city: string;
        guests: number;
        budget: number;
        createdAt: Date;
        vendorId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        eventDate: Date;
        message: string;
    })[]>;
    updateStatus(user: AuthUser, id: string, dto: UpdateRequestStatusDto): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        };
        messages: ({
            author: {
                name: string;
                id: string;
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
        city: string;
        guests: number;
        budget: number;
        createdAt: Date;
        vendorId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        eventDate: Date;
        message: string;
    }>;
    dashboard(user: AuthUser, res: Response): Promise<{
        vendor: {
            category: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
        } & {
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
    } | undefined>;
}
