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
            email: string;
            name: string;
            id: string;
            blocked: boolean;
        };
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
    })[]>;
    getVendor(id: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
            blocked: boolean;
        };
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
        };
        packages: {
            id: string;
            includes: string;
            description: string;
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
            name: string;
            role: string;
            id: string;
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
    }>;
    updateVendorStatus(id: string, status: VendorStatus, moderationNote?: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
            blocked: boolean;
        };
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
    }>;
    setFeatured(id: string, featured: boolean): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
            blocked: boolean;
        };
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
            email: string;
            name: string;
            id: string;
        };
        vendor: {
            category: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
            name: string;
            id: string;
            city: string;
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
    listUsers(params?: {
        role?: Role;
        q?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        vendor: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        blocked: boolean;
        createdAt: Date;
        _count: {
            reviews: number;
            requests: number;
        };
    }[]>;
    getUser(id: string): Promise<{
        vendor: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        wedding: ({
            _count: {
                tasks: number;
                guestList: number;
                budgetItems: number;
            };
        } & {
            id: string;
            city: string;
            userId: string;
            date: Date;
            guests: number;
            budget: number;
            partnerOneName: string;
            partnerTwoName: string;
            couplePhotoUrl: string | null;
            planningStage: string;
            cityUndecided: boolean;
            guestsUndecided: boolean;
        }) | null;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        blocked: boolean;
        createdAt: Date;
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
        };
    }>;
    updateUser(id: string, data: {
        blocked?: boolean;
        role?: Role;
        name?: string;
        email?: string;
    }): Promise<{
        vendor: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        blocked: boolean;
        createdAt: Date;
        _count: {
            reviews: number;
            requests: number;
        };
    }>;
    upsertUserWedding(userId: string, dto: UpsertWeddingDto): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            id: string;
            createdAt: Date;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            categorySlug: string | null;
            dueDate: Date | null;
            weddingId: string;
            isCustom: boolean;
        }[];
        id: string;
        city: string;
        userId: string;
        date: Date;
        guests: number;
        budget: number;
        partnerOneName: string;
        partnerTwoName: string;
        couplePhotoUrl: string | null;
        planningStage: string;
        cityUndecided: boolean;
        guestsUndecided: boolean;
    } | null>;
    updateVendorProfile(id: string, dto: UpsertVendorProfileDto): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
            description: string;
            sortOrder: number;
        };
        packages: {
            id: string;
            includes: string;
            description: string;
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
            name: string;
            role: string;
            id: string;
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
    }>;
    listReviews(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
            name: string;
            id: string;
        };
        vendor: {
            category: {
                name: string;
                id: string;
                slug: string;
                description: string;
                sortOrder: number;
            };
            name: string;
            id: string;
            city: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        vendorId: string;
        text: string;
    })[]>;
    deleteReview(id: string): Promise<{
        ok: boolean;
    }>;
}
