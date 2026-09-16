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
    createExternal(userId: string, dto: CreateExternalVendorDto): Promise<{
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
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
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
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
