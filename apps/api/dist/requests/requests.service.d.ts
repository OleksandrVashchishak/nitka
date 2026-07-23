import { RequestStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestMessageDto } from './dto/create-request-message.dto';
export declare class RequestsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateRequestDto): Promise<{
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
                url: string;
                order: number;
                vendorId: string;
            }[];
        } & {
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
            body: string;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        city: string;
        userId: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        vendorId: string;
        guests: number;
        budget: number;
        updatedAt: Date;
        eventDate: Date;
        message: string;
    }>;
    listMine(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
                url: string;
                order: number;
                vendorId: string;
            }[];
        } & {
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
            body: string;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        city: string;
        userId: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        vendorId: string;
        guests: number;
        budget: number;
        updatedAt: Date;
        eventDate: Date;
        message: string;
    })[]>;
    listForVendor(userId: string): Promise<({
        user: {
            email: string;
            name: string;
            id: string;
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
            body: string;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        city: string;
        userId: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        vendorId: string;
        guests: number;
        budget: number;
        updatedAt: Date;
        eventDate: Date;
        message: string;
    })[]>;
    updateStatus(userId: string, requestId: string, status: RequestStatus): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
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
            body: string;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        city: string;
        userId: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        vendorId: string;
        guests: number;
        budget: number;
        updatedAt: Date;
        eventDate: Date;
        message: string;
    }>;
    addMessage(userId: string, userRole: Role, requestId: string, dto: CreateRequestMessageDto): Promise<({
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
                url: string;
                order: number;
                vendorId: string;
            }[];
        } & {
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
            body: string;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        city: string;
        userId: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        vendorId: string;
        guests: number;
        budget: number;
        updatedAt: Date;
        eventDate: Date;
        message: string;
    }) | ({
        user: {
            email: string;
            name: string;
            id: string;
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
            body: string;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        city: string;
        userId: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        vendorId: string;
        guests: number;
        budget: number;
        updatedAt: Date;
        eventDate: Date;
        message: string;
    })>;
    vendorDashboard(userId: string): Promise<{
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
