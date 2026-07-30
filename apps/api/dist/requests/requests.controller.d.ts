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
                id: string;
                name: string;
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
            id: string;
            city: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            createdAt: Date;
            userId: string;
            name: string;
            slug: string | null;
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
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
    }>;
    listMine(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        vendor: {
            category: {
                id: string;
                name: string;
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
            id: string;
            city: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            createdAt: Date;
            userId: string;
            name: string;
            slug: string | null;
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
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
    })[]>;
    addMessage(user: AuthUser, id: string, dto: CreateRequestMessageDto): Promise<({
        vendor: {
            category: {
                id: string;
                name: string;
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
            id: string;
            city: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            createdAt: Date;
            userId: string;
            name: string;
            slug: string | null;
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
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
    }) | ({
        user: {
            id: string;
            email: string;
            name: string;
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
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
    })>;
    listForVendor(user: AuthUser): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
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
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
    })[]>;
    updateStatus(user: AuthUser, id: string, dto: UpdateRequestStatusDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
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
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
    }>;
    dashboard(user: AuthUser, res: Response): Promise<{
        vendor: {
            category: {
                id: string;
                name: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
        } & {
            id: string;
            city: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            createdAt: Date;
            userId: string;
            name: string;
            slug: string | null;
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
    } | undefined>;
}
