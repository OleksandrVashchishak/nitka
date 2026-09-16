import { OnModuleInit } from '@nestjs/common';
import { RequestStatus, Role, VendorStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertVendorProfileDto } from '../vendors/dto/upsert-vendor-profile.dto';
import { VendorsService } from '../vendors/vendors.service';
import { UpsertWeddingDto } from '../weddings/dto/upsert-wedding.dto';
import { WeddingsService } from '../weddings/weddings.service';
import { UpsertCategoryDto } from './dto/admin.dto';
export declare class AdminService implements OnModuleInit {
    private readonly prisma;
    private readonly vendorsService;
    private readonly weddingsService;
    constructor(prisma: PrismaService, vendorsService: VendorsService, weddingsService: WeddingsService);
    onModuleInit(): Promise<void>;
    stats(): Promise<{
        pendingVendors: number;
        approvedVendors: number;
        rejectedVendors: number;
        blockedVendors: number;
        categories: number;
        requests: number;
        couples: number;
        vendors: number;
        views7d: number;
        requests7d: number;
        reviews: number;
        featuredVendors: number;
    }>;
    listVendors(params?: {
        status?: VendorStatus;
        q?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        user: {
            name: string;
            id: string;
            email: string;
            blocked: boolean;
        };
        photos: {
            id: string;
            vendorId: string;
            url: string;
            order: number;
        }[];
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    getVendor(id: string): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        user: {
            name: string;
            id: string;
            email: string;
            blocked: boolean;
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
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    }>;
    updateVendorStatus(id: string, status: VendorStatus, moderationNote?: string): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        user: {
            name: string;
            id: string;
            email: string;
            blocked: boolean;
        };
        photos: {
            id: string;
            vendorId: string;
            url: string;
            order: number;
        }[];
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    }>;
    setFeatured(id: string, featured: boolean): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        user: {
            name: string;
            id: string;
            email: string;
            blocked: boolean;
        };
        photos: {
            id: string;
            vendorId: string;
            url: string;
            order: number;
        }[];
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    }>;
    listCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            vendors: number;
        };
    } & {
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
    })[]>;
    createCategory(dto: UpsertCategoryDto): Promise<{
        _count: {
            vendors: number;
        };
    } & {
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
    }>;
    updateCategory(id: string, dto: UpsertCategoryDto): Promise<{
        _count: {
            vendors: number;
        };
    } & {
        name: string;
        id: string;
        slug: string;
        description: string;
        sortOrder: number;
    }>;
    deleteCategory(id: string): Promise<{
        ok: boolean;
    }>;
    listRequests(params?: {
        status?: RequestStatus;
        q?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        vendor: {
            name: string;
            id: string;
            city: string;
            category: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
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
    listUsers(params?: {
        role?: Role;
        q?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        vendor: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        _count: {
            reviews: number;
            requests: number;
        };
        email: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
    }[]>;
    getUser(id: string): Promise<{
        wedding: ({
            _count: {
                tasks: number;
                guestList: number;
                budgetItems: number;
            };
        } & {
            id: string;
            userId: string;
            date: Date;
            city: string;
            guests: number;
            budget: number;
            partnerOneName: string;
            partnerTwoName: string;
            couplePhotoUrl: string | null;
            planningStage: string;
            cityUndecided: boolean;
            guestsUndecided: boolean;
            dayPlan: import("@prisma/client/runtime/library").JsonValue | null;
        }) | null;
        name: string;
        id: string;
        createdAt: Date;
        vendor: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
        };
        email: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
    }>;
    updateUser(id: string, data: {
        blocked?: boolean;
        role?: Role;
        name?: string;
        email?: string;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        vendor: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        _count: {
            reviews: number;
            requests: number;
        };
        email: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
    }>;
    upsertUserWedding(userId: string, dto: UpsertWeddingDto): Promise<{
        tasks: ({
            id: string;
            weddingId: string;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            sortOrder: number;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
            assignee: string | null;
        } & {
            assignee: string | null;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                name: string;
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            weddingId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
        })[];
        id: string;
        userId: string;
        date: Date;
        city: string;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
        dayPlan: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    updateVendorProfile(id: string, dto: UpsertVendorProfileDto): Promise<{
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
    listReviews(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
        vendor: {
            name: string;
            id: string;
            city: string;
            category: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        vendorId: string;
        rating: number;
        text: string;
    })[]>;
    deleteReview(id: string): Promise<{
        ok: boolean;
    }>;
}
