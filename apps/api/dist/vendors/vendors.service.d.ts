import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
export declare class VendorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPipeline(userId: string): Promise<{
        manual: {
            name: string;
            id: string;
            createdAt: Date;
            userId: string;
            city: string;
            website: string | null;
            updatedAt: Date;
            phone: string | null;
            notes: string | null;
            category: string;
            quotedPrice: number | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
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
        createdAt: Date;
        userId: string;
        city: string;
        website: string | null;
        updatedAt: Date;
        phone: string | null;
        notes: string | null;
        category: string;
        quotedPrice: number | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
    }>;
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        city: string;
        website: string | null;
        updatedAt: Date;
        phone: string | null;
        notes: string | null;
        category: string;
        quotedPrice: number | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
    }>;
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
