import { OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertVendorProfileDto } from './dto/upsert-vendor-profile.dto';
type VendorFilters = {
    category?: string;
    city?: string;
    price?: number;
    rating?: number;
    q?: string;
    style?: string;
    sort?: string;
    featured?: boolean;
};
export declare class VendorsService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private bootstrapDemoVendors;
    private ensureUniqueSlug;
    private backfillMissingSlugs;
    findAll(filters: VendorFilters): Prisma.PrismaPromise<({
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
    private resolveSort;
    getFilterOptions(): Promise<{
        cities: string[];
        styles: string[];
        maxPrice: number;
        ratings: number[];
        sorts: {
            value: string;
            label: string;
        }[];
    }>;
    findOne(slugOrId: string, viewer?: {
        ip?: string | null;
        userAgent?: string;
    }): Promise<{
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
    private recordView;
    getMine(userId: string): Prisma.Prisma__VendorClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    upsertMine(userId: string, data: UpsertVendorProfileDto): Promise<{
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
}
export {};
