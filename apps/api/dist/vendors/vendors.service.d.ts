import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
export declare class VendorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPipeline(userId: string): Promise<{
        manual: {
            id: string;
            userId: string;
            name: string;
            category: string;
            city: string;
            phone: string | null;
            website: string | null;
            quotedPrice: number | null;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
            createdAt: Date;
            updatedAt: Date;
        }[];
        plan: string[];
    }>;
    upsertVendorPlan(userId: string, dto: UpsertVendorPlanDto): Promise<{
        plan: string[];
    }>;
    private normalizeVendorPlan;
    createExternal(userId: string, dto: CreateExternalVendorDto): Promise<{
        id: string;
        userId: string;
        name: string;
        category: string;
        city: string;
        phone: string | null;
        website: string | null;
        quotedPrice: number | null;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
        id: string;
        userId: string;
        name: string;
        category: string;
        city: string;
        phone: string | null;
        website: string | null;
        quotedPrice: number | null;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
