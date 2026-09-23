import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPipeline(userId: string): Promise<{
        manual: {
            name: string;
            id: string;
            userId: string;
            city: string;
            website: string | null;
            createdAt: Date;
            phone: string | null;
            notes: string | null;
            category: string;
            quotedPrice: number | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            updatedAt: Date;
        }[];
        plan: string[];
    }>;
    upsertVendorPlan(userId: string, dto: UpsertVendorPlanDto): Promise<{
        plan: string[];
    }>;
    private normalizeVendorPlan;
    createExternal(userId: string, dto: CreateExternalVendorDto): Promise<{
        name: string;
        id: string;
        userId: string;
        city: string;
        website: string | null;
        createdAt: Date;
        phone: string | null;
        notes: string | null;
        category: string;
        quotedPrice: number | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        updatedAt: Date;
    }>;
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
        name: string;
        id: string;
        userId: string;
        city: string;
        website: string | null;
        createdAt: Date;
        phone: string | null;
        notes: string | null;
        category: string;
        quotedPrice: number | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        updatedAt: Date;
    }>;
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
