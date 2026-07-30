import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpdatePipelineDto } from './dto/pipeline.dto';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
                order: number;
                url: string;
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
        };
    } & {
        id: string;
        userId: string;
        vendorId: string;
        updatedAt: Date;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    })[]>;
    add(userId: string, vendorId: string): Promise<{
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
                order: number;
                url: string;
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
        };
    } & {
        id: string;
        userId: string;
        vendorId: string;
        updatedAt: Date;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    remove(userId: string, vendorId: string): Promise<{
        ok: boolean;
    }>;
    getPipeline(userId: string): Promise<{
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
                    order: number;
                    url: string;
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
            };
        } & {
            id: string;
            userId: string;
            vendorId: string;
            updatedAt: Date;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
        })[];
        manual: {
            id: string;
            userId: string;
            name: string;
            city: string;
            phone: string | null;
            website: string | null;
            createdAt: Date;
            category: string;
            updatedAt: Date;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            quotedPrice: number | null;
        }[];
    }>;
    updatePipeline(userId: string, vendorId: string, dto: UpdatePipelineDto): Promise<{
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
                order: number;
                url: string;
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
        };
    } & {
        id: string;
        userId: string;
        vendorId: string;
        updatedAt: Date;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    createExternal(userId: string, dto: CreateExternalVendorDto): Promise<{
        id: string;
        userId: string;
        name: string;
        city: string;
        phone: string | null;
        website: string | null;
        createdAt: Date;
        category: string;
        updatedAt: Date;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
        id: string;
        userId: string;
        name: string;
        city: string;
        phone: string | null;
        website: string | null;
        createdAt: Date;
        category: string;
        updatedAt: Date;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        quotedPrice: number | null;
    }>;
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
