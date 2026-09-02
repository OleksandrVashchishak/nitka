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
            url: string;
            order: number;
            vendorId: string;
        }[];
    } & {
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
        packages: {
            id: string;
            description: string;
            includes: string;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
            order: number;
            vendorId: string;
        }[];
        faqs: {
            id: string;
            question: string;
            answer: string;
            order: number;
            vendorId: string;
        }[];
        team: {
            id: string;
            name: string;
            role: string;
            bio: string;
            photoUrl: string | null;
            order: number;
            vendorId: string;
        }[];
        photos: {
            id: string;
            url: string;
            order: number;
            vendorId: string;
        }[];
    } & {
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
    }) | undefined>;
    upsertMine(user: AuthUser, dto: UpsertVendorProfileDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        packages: {
            id: string;
            description: string;
            includes: string;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
            order: number;
            vendorId: string;
        }[];
        faqs: {
            id: string;
            question: string;
            answer: string;
            order: number;
            vendorId: string;
        }[];
        team: {
            id: string;
            name: string;
            role: string;
            bio: string;
            photoUrl: string | null;
            order: number;
            vendorId: string;
        }[];
        photos: {
            id: string;
            url: string;
            order: number;
            vendorId: string;
        }[];
    } & {
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
                url: string;
                order: number;
                vendorId: string;
            }[];
        } & {
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
        })[];
        _count: {
            reviews: number;
        };
        reviews: ({
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            text: string;
            userId: string;
            rating: number;
            vendorId: string;
        })[];
        category: {
            id: string;
            name: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        packages: {
            id: string;
            description: string;
            includes: string;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
            order: number;
            vendorId: string;
        }[];
        faqs: {
            id: string;
            question: string;
            answer: string;
            order: number;
            vendorId: string;
        }[];
        team: {
            id: string;
            name: string;
            role: string;
            bio: string;
            photoUrl: string | null;
            order: number;
            vendorId: string;
        }[];
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
    }>;
}
