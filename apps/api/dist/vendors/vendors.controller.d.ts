import { AuthUser } from '../auth/current-user.decorator';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
import { VendorsService } from './vendors.service';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    pipeline(user: AuthUser): Promise<{
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
    upsertVendorPlan(user: AuthUser, dto: UpsertVendorPlanDto): Promise<{
        plan: string[];
    }>;
    createExternal(user: AuthUser, dto: CreateExternalVendorDto): Promise<{
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
    updateExternal(user: AuthUser, id: string, dto: UpdateExternalVendorDto): Promise<{
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
    removeExternal(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
