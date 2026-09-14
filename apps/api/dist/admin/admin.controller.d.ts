import { RequestStatus, Role, VendorStatus } from '@prisma/client';
import { UpsertVendorProfileDto } from '../vendors/dto/upsert-vendor-profile.dto';
import { UpsertWeddingDto } from '../weddings/dto/upsert-wedding.dto';
import { AdminService } from './admin.service';
import { UpdateUserDto, UpdateVendorFeaturedDto, UpdateVendorStatusDto, UpsertCategoryDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    listVendors(status?: VendorStatus, q?: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            name: string;
            blocked: boolean;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
    getVendor(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            blocked: boolean;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
    updateVendorStatus(id: string, dto: UpdateVendorStatusDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            blocked: boolean;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
    }>;
    setFeatured(id: string, dto: UpdateVendorFeaturedDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            blocked: boolean;
        };
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
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
    }>;
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
    listRequests(status?: RequestStatus, q?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
            email: string;
            name: string;
        };
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            phone: string | null;
            requestId: string;
            authorId: string;
            authorRole: import(".prisma/client").$Enums.Role;
            body: string;
        })[];
    } & {
        id: string;
        vendorId: string;
        userId: string;
        createdAt: Date;
        eventDate: Date;
        city: string;
        guests: number;
        budget: number;
        message: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        updatedAt: Date;
    })[]>;
    listUsers(role?: Role, q?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        vendor: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
        _count: {
            reviews: number;
            requests: number;
        };
    }[]>;
    getUser(id: string): Promise<{
        id: string;
        createdAt: Date;
        vendor: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
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
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
        };
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        createdAt: Date;
        vendor: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
        _count: {
            reviews: number;
            requests: number;
        };
    }>;
    updateUserWedding(id: string, dto: UpsertWeddingDto): Promise<{
        tasks: ({
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            sortOrder: number;
            weddingId: string;
            title: string;
            categorySlug: string | null;
            dueDate: Date | null;
            isCustom: boolean;
        } & {
            assignee: string | null;
        })[];
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
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
            email: string;
            name: string;
        };
    } & {
        id: string;
        vendorId: string;
        userId: string;
        rating: number;
        text: string;
        createdAt: Date;
    })[]>;
    deleteReview(id: string): Promise<{
        ok: boolean;
    }>;
}
