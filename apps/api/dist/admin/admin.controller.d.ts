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
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
        };
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
    getVendor(id: string): Promise<{
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
        };
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
    updateVendorStatus(id: string, dto: UpdateVendorStatusDto): Promise<{
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
        };
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
    setFeatured(id: string, dto: UpdateVendorFeaturedDto): Promise<{
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
            views: number;
        };
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
    updateVendorProfile(id: string, dto: UpsertVendorProfileDto): Promise<{
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
        user: {
            id: string;
            name: string;
            email: string;
        };
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
        messages: ({
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            body: string;
            authorId: string;
            createdAt: Date;
            phone: string | null;
            authorRole: import(".prisma/client").$Enums.Role;
            requestId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        city: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        userId: string;
        vendorId: string;
        guests: number;
        budget: number;
        eventDate: Date;
    })[]>;
    listUsers(role?: Role, q?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        _count: {
            reviews: number;
            requests: number;
        };
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
        vendor: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
    }[]>;
    getUser(id: string): Promise<{
        id: string;
        name: string;
        _count: {
            favorites: number;
            reviews: number;
            requests: number;
        };
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
        vendor: {
            id: string;
            name: string;
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
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        _count: {
            reviews: number;
            requests: number;
        };
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        blocked: boolean;
        vendor: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.VendorStatus;
        } | null;
    }>;
    updateUserWedding(id: string, dto: UpsertWeddingDto): Promise<{
        myRole: import(".prisma/client").$Enums.WeddingMemberRole;
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.WeddingMemberRole;
            userId: string;
            weddingId: string;
        })[];
        tasks: {
            id: string;
            sortOrder: number;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
            weddingId: string;
            categorySlug: string | null;
            dueDate: Date | null;
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
    listReviews(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
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
    } & {
        id: string;
        createdAt: Date;
        text: string;
        userId: string;
        rating: number;
        vendorId: string;
    })[]>;
    deleteReview(id: string): Promise<{
        ok: boolean;
    }>;
}
