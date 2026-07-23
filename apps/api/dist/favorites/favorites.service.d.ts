import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpdatePipelineDto } from './dto/pipeline.dto';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    add(userId: string, vendorId: string): Promise<{
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
    remove(userId: string, vendorId: string): Promise<{
        ok: boolean;
    }>;
    getPipeline(userId: string): Promise<{
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
    updatePipeline(userId: string, vendorId: string, dto: UpdatePipelineDto): Promise<{
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
    createExternal(userId: string, dto: CreateExternalVendorDto): Promise<{
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
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
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
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
