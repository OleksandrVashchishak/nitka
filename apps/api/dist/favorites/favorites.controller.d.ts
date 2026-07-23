import { AuthUser } from '../auth/current-user.decorator';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpdatePipelineDto } from './dto/pipeline.dto';
import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    list(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        vendor: {
            category: {
                name: string;
                id: string;
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
        };
    } & {
        id: string;
        userId: string;
        vendorId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
    })[]>;
    pipeline(user: AuthUser): Promise<{
        catalog: ({
            vendor: {
                category: {
                    name: string;
                    id: string;
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
            };
        } & {
            id: string;
            userId: string;
            vendorId: string;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
            updatedAt: Date;
        })[];
        manual: {
            category: string;
            name: string;
            id: string;
            createdAt: Date;
            city: string;
            phone: string | null;
            website: string | null;
            userId: string;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
            updatedAt: Date;
        }[];
    }>;
    createExternal(user: AuthUser, dto: CreateExternalVendorDto): Promise<{
        category: string;
        name: string;
        id: string;
        createdAt: Date;
        city: string;
        phone: string | null;
        website: string | null;
        userId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
    }>;
    updateExternal(user: AuthUser, id: string, dto: UpdateExternalVendorDto): Promise<{
        category: string;
        name: string;
        id: string;
        createdAt: Date;
        city: string;
        phone: string | null;
        website: string | null;
        userId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
    }>;
    removeExternal(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    updatePipeline(user: AuthUser, vendorId: string, dto: UpdatePipelineDto): Promise<{
        vendor: {
            category: {
                name: string;
                id: string;
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
        };
    } & {
        id: string;
        userId: string;
        vendorId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
    }>;
    add(user: AuthUser, vendorId: string): Promise<{
        vendor: {
            category: {
                name: string;
                id: string;
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
        };
    } & {
        id: string;
        userId: string;
        vendorId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
    }>;
    remove(user: AuthUser, vendorId: string): Promise<{
        ok: boolean;
    }>;
}
