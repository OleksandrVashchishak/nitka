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
        _count: {
            reviews: number;
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
            _count: {
                reviews: number;
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
        })[];
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
        packages: {
            id: string;
            title: string;
            includes: string;
            vendorId: string;
            description: string;
            order: number;
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
            name: string;
            id: string;
            vendorId: string;
            order: number;
            role: string;
            bio: string;
            photoUrl: string | null;
        }[];
        reviews: ({
            user: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            vendorId: string;
            rating: number;
            text: string;
        })[];
        _count: {
            reviews: number;
        };
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
    }>;
    private recordView;
    getMine(userId: string): Prisma.Prisma__VendorClient<({
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
        packages: {
            id: string;
            title: string;
            includes: string;
            vendorId: string;
            description: string;
            order: number;
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
            name: string;
            id: string;
            vendorId: string;
            order: number;
            role: string;
            bio: string;
            photoUrl: string | null;
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    upsertMine(userId: string, data: UpsertVendorProfileDto): Promise<{
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
        packages: {
            id: string;
            title: string;
            includes: string;
            vendorId: string;
            description: string;
            order: number;
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
            name: string;
            id: string;
            vendorId: string;
            order: number;
            role: string;
            bio: string;
            photoUrl: string | null;
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
    }>;
}
export {};
