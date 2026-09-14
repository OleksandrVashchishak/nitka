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
}
export {};
