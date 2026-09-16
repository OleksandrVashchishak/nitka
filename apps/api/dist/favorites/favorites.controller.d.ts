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
                vendorId: string;
                url: string;
                order: number;
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
        };
    } & {
        id: string;
        userId: string;
        notes: string | null;
        vendorId: string;
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
                    vendorId: string;
                    url: string;
                    order: number;
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
            };
        } & {
            id: string;
            userId: string;
            notes: string | null;
            vendorId: string;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
            updatedAt: Date;
        })[];
        manual: {
            name: string;
            id: string;
            userId: string;
            city: string;
            category: string;
            notes: string | null;
            createdAt: Date;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
            updatedAt: Date;
            phone: string | null;
            website: string | null;
        }[];
    }>;
    createExternal(user: AuthUser, dto: CreateExternalVendorDto): Promise<{
        name: string;
        id: string;
        userId: string;
        city: string;
        category: string;
        notes: string | null;
        createdAt: Date;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
        phone: string | null;
        website: string | null;
    }>;
    updateExternal(user: AuthUser, id: string, dto: UpdateExternalVendorDto): Promise<{
        name: string;
        id: string;
        userId: string;
        city: string;
        category: string;
        notes: string | null;
        createdAt: Date;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
        phone: string | null;
        website: string | null;
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
                vendorId: string;
                url: string;
                order: number;
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
        };
    } & {
        id: string;
        userId: string;
        notes: string | null;
        vendorId: string;
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
                vendorId: string;
                url: string;
                order: number;
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
        };
    } & {
        id: string;
        userId: string;
        notes: string | null;
        vendorId: string;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
        updatedAt: Date;
    }>;
    remove(user: AuthUser, vendorId: string): Promise<{
        ok: boolean;
    }>;
}
