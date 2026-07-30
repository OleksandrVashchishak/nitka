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
        user: {
            id: string;
            name: string;
            email: string;
            blocked: boolean;
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
            order: number;
            url: string;
            vendorId: string;
        }[];
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    getVendor(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            blocked: boolean;
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
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    }>;
    updateVendorStatus(id: string, status: VendorStatus, moderationNote?: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            blocked: boolean;
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
            order: number;
            url: string;
            vendorId: string;
        }[];
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    }>;
    setFeatured(id: string, featured: boolean): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            blocked: boolean;
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
            order: number;
            url: string;
            vendorId: string;
        }[];
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
            views: number;
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
    }>;
    listCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            vendors: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
    })[]>;
    createCategory(dto: UpsertCategoryDto): Promise<{
        _count: {
            vendors: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string;
        sortOrder: number;
    }>;
    updateCategory(id: string, dto: UpsertCategoryDto): Promise<{
        _count: {
            vendors: number;
        };
    } & {
        id: string;
        name: string;
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
        vendor: {
            id: string;
            name: string;
            city: string;
            category: {
                id: string;
                name: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            phone: string | null;
            createdAt: Date;
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        status: import(".prisma/client").$Enums.RequestStatus;
        id: string;
        userId: string;
        city: string;
        createdAt: Date;
        vendorId: string;
        eventDate: Date;
        guests: number;
        budget: number;
        message: string;
        updatedAt: Date;
    })[]>;
    listUsers(params?: {
        role?: Role;
        q?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        role: import(".prisma/client").$Enums.Role;
        vendor: {
            status: import(".prisma/client").$Enums.VendorStatus;
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        createdAt: Date;
        _count: {
            reviews: number;
            requests: number;
        };
        email: string;
        blocked: boolean;
    }[]>;
    getUser(id: string): Promise<{
        role: import(".prisma/client").$Enums.Role;
        vendor: {
            status: import(".prisma/client").$Enums.VendorStatus;
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        createdAt: Date;
        _count: {
            reviews: number;
            favorites: number;
            requests: number;
        };
        email: string;
        blocked: boolean;
        wedding: ({
            _count: {
                tasks: number;
                guestList: number;
                budgetItems: number;
            };
        } & {
            id: string;
            userId: string;
            city: string;
            guests: number;
            budget: number;
            date: Date;
            partnerOneName: string;
            partnerTwoName: string;
            couplePhotoUrl: string | null;
            planningStage: string;
            cityUndecided: boolean;
            guestsUndecided: boolean;
        }) | null;
    }>;
    updateUser(id: string, data: {
        blocked?: boolean;
        role?: Role;
        name?: string;
        email?: string;
    }): Promise<{
        role: import(".prisma/client").$Enums.Role;
        vendor: {
            status: import(".prisma/client").$Enums.VendorStatus;
            id: string;
            name: string;
        } | null;
        id: string;
        name: string;
        createdAt: Date;
        _count: {
            reviews: number;
            requests: number;
        };
        email: string;
        blocked: boolean;
    }>;
    upsertUserWedding(userId: string, dto: UpsertWeddingDto): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        tasks: {
            status: import(".prisma/client").$Enums.TaskStatus;
            id: string;
            title: string;
            sortOrder: number;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
            dueRemindedAt: Date | null;
            isCustom: boolean;
        }[];
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            userId: string;
            createdAt: Date;
            weddingId: string;
        })[];
        id: string;
        userId: string;
        city: string;
        guests: number;
        budget: number;
        date: Date;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
    } | null>;
    updateVendorProfile(id: string, dto: UpsertVendorProfileDto): Promise<{
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
    listReviews(): import(".prisma/client").Prisma.PrismaPromise<({
        vendor: {
            id: string;
            name: string;
            city: string;
            category: {
                id: string;
                name: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        vendorId: string;
        text: string;
    })[]>;
    deleteReview(id: string): Promise<{
        ok: boolean;
    }>;
}
