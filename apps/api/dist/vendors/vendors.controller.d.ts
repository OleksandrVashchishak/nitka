import type { Request, Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { UpsertVendorProfileDto } from './dto/upsert-vendor-profile.dto';
import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    findAll(category?: string, city?: string, price?: string, rating?: string, q?: string, style?: string, sort?: string, featured?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
            vendorId: string;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        name: string;
        city: string;
        status: import(".prisma/client").$Enums.VendorStatus;
        slug: string | null;
        tagline: string;
        description: string;
        categoryId: string;
        priceFrom: number;
        priceTo: number | null;
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
    })[]>;
    getFilters(): Promise<{
        cities: string[];
        styles: string[];
        maxPrice: number;
        ratings: number[];
        sorts: {
            value: string;
            label: string;
        }[];
    }>;
    getMine(user: AuthUser, res: Response): Promise<({
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
        packages: {
            id: string;
            vendorId: string;
            includes: string;
            description: string;
            order: number;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
        }[];
        faqs: {
            id: string;
            vendorId: string;
            order: number;
            question: string;
            answer: string;
        }[];
        team: {
            id: string;
            vendorId: string;
            name: string;
            role: string;
            order: number;
            bio: string;
            photoUrl: string | null;
        }[];
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        name: string;
        city: string;
        status: import(".prisma/client").$Enums.VendorStatus;
        slug: string | null;
        tagline: string;
        description: string;
        categoryId: string;
        priceFrom: number;
        priceTo: number | null;
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
    }) | undefined>;
    upsertMine(user: AuthUser, dto: UpsertVendorProfileDto): Promise<{
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
        packages: {
            id: string;
            vendorId: string;
            includes: string;
            description: string;
            order: number;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
        }[];
        faqs: {
            id: string;
            vendorId: string;
            order: number;
            question: string;
            answer: string;
        }[];
        team: {
            id: string;
            vendorId: string;
            name: string;
            role: string;
            order: number;
            bio: string;
            photoUrl: string | null;
        }[];
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        name: string;
        city: string;
        status: import(".prisma/client").$Enums.VendorStatus;
        slug: string | null;
        tagline: string;
        description: string;
        categoryId: string;
        priceFrom: number;
        priceTo: number | null;
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
    }>;
    findOne(slugOrId: string, req: Request): Promise<{
        similar: ({
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
                vendorId: string;
                url: string;
                order: number;
            }[];
        } & {
            id: string;
            userId: string;
            rating: number;
            createdAt: Date;
            name: string;
            city: string;
            status: import(".prisma/client").$Enums.VendorStatus;
            slug: string | null;
            tagline: string;
            description: string;
            categoryId: string;
            priceFrom: number;
            priceTo: number | null;
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
        })[];
        reviews: ({
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            vendorId: string;
            userId: string;
            rating: number;
            text: string;
            createdAt: Date;
        })[];
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
            vendorId: string;
            url: string;
            order: number;
        }[];
        packages: {
            id: string;
            vendorId: string;
            includes: string;
            description: string;
            order: number;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
        }[];
        faqs: {
            id: string;
            vendorId: string;
            order: number;
            question: string;
            answer: string;
        }[];
        team: {
            id: string;
            vendorId: string;
            name: string;
            role: string;
            order: number;
            bio: string;
            photoUrl: string | null;
        }[];
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        name: string;
        city: string;
        status: import(".prisma/client").$Enums.VendorStatus;
        slug: string | null;
        tagline: string;
        description: string;
        categoryId: string;
        priceFrom: number;
        priceTo: number | null;
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
    }>;
}
