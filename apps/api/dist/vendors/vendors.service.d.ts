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
    private recordView;
    getMine(userId: string): Prisma.Prisma__VendorClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    upsertMine(userId: string, data: UpsertVendorProfileDto): Promise<{
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
}
export {};
