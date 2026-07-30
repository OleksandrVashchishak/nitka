import type { Request, Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { UpsertVendorProfileDto } from './dto/upsert-vendor-profile.dto';
import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    findAll(category?: string, city?: string, price?: string, rating?: string, q?: string, style?: string, sort?: string, featured?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    } & {
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
            order: number;
            url: string;
            vendorId: string;
        }[];
        packages: {
            id: string;
            description: string;
            order: number;
            includes: string;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
            vendorId: string;
        }[];
        faqs: {
            id: string;
            order: number;
            question: string;
            answer: string;
            vendorId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            order: number;
            bio: string;
            photoUrl: string | null;
            vendorId: string;
        }[];
    } & {
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
            order: number;
            url: string;
            vendorId: string;
        }[];
        packages: {
            id: string;
            description: string;
            order: number;
            includes: string;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
            vendorId: string;
        }[];
        faqs: {
            id: string;
            order: number;
            question: string;
            answer: string;
            vendorId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            order: number;
            bio: string;
            photoUrl: string | null;
            vendorId: string;
        }[];
    } & {
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
    }>;
    findOne(slugOrId: string, req: Request): Promise<{
        similar: ({
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
        } & {
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
        })[];
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
        packages: {
            id: string;
            description: string;
            order: number;
            includes: string;
            title: string;
            price: number;
            duration: string;
            isPopular: boolean;
            vendorId: string;
        }[];
        faqs: {
            id: string;
            order: number;
            question: string;
            answer: string;
            vendorId: string;
        }[];
        team: {
            role: string;
            id: string;
            name: string;
            order: number;
            bio: string;
            photoUrl: string | null;
            vendorId: string;
        }[];
        reviews: ({
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            userId: string;
            rating: number;
            createdAt: Date;
            vendorId: string;
            text: string;
        })[];
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
    }>;
}
