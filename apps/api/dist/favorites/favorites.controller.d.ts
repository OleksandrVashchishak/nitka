import { AuthUser } from '../auth/current-user.decorator';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpdatePipelineDto } from './dto/pipeline.dto';
import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    list(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        vendor: {
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
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    })[]>;
    pipeline(user: AuthUser): Promise<{
        catalog: ({
            vendor: {
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
            };
        } & {
            id: string;
            updatedAt: Date;
            userId: string;
            vendorId: string;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
        })[];
        manual: {
            id: string;
            name: string;
            city: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            phone: string | null;
            website: string | null;
            userId: string;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
        }[];
    }>;
    createExternal(user: AuthUser, dto: CreateExternalVendorDto): Promise<{
        id: string;
        name: string;
        city: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        phone: string | null;
        website: string | null;
        userId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    updateExternal(user: AuthUser, id: string, dto: UpdateExternalVendorDto): Promise<{
        id: string;
        name: string;
        city: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        phone: string | null;
        website: string | null;
        userId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    removeExternal(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    updatePipeline(user: AuthUser, vendorId: string, dto: UpdatePipelineDto): Promise<{
        vendor: {
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
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    add(user: AuthUser, vendorId: string): Promise<{
        vendor: {
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
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    remove(user: AuthUser, vendorId: string): Promise<{
        ok: boolean;
    }>;
}
