import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
export declare class VendorsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    getPipeline(userId: string): Promise<{
        manual: {
            id: string;
            userId: string;
            city: string;
            website: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            category: string;
            phone: string | null;
            quotedPrice: number | null;
            notes: string | null;
            stage: import(".prisma/client").$Enums.VendorPipelineStage;
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
        city: string;
        website: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        category: string;
        phone: string | null;
        quotedPrice: number | null;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
    }>;
    private notifyVendor;
    updateExternal(userId: string, id: string, dto: UpdateExternalVendorDto): Promise<{
        id: string;
        userId: string;
        city: string;
        website: string | null;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        category: string;
        phone: string | null;
        quotedPrice: number | null;
        notes: string | null;
        stage: import(".prisma/client").$Enums.VendorPipelineStage;
    }>;
    removeExternal(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private assertExternalOwner;
}
