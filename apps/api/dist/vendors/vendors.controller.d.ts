import { AuthUser } from '../auth/current-user.decorator';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    pipeline(user: AuthUser): Promise<{
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
    upsertVendorPlan(user: AuthUser, dto: UpsertVendorPlanDto): Promise<{
        plan: string[];
    }>;
    createExternal(user: AuthUser, dto: CreateExternalVendorDto): Promise<{
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
    updateExternal(user: AuthUser, id: string, dto: UpdateExternalVendorDto): Promise<{
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
    removeExternal(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
