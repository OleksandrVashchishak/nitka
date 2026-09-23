import { AuthUser } from '../auth/current-user.decorator';
import { CreateExternalVendorDto, UpdateExternalVendorDto, UpsertVendorPlanDto } from './dto/pipeline.dto';
import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    pipeline(user: AuthUser): Promise<{
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
    upsertVendorPlan(user: AuthUser, dto: UpsertVendorPlanDto): Promise<{
        plan: string[];
    }>;
    createExternal(user: AuthUser, dto: CreateExternalVendorDto): Promise<{
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
    updateExternal(user: AuthUser, id: string, dto: UpdateExternalVendorDto): Promise<{
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
    removeExternal(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
