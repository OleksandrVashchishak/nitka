import { AuthUser } from '../auth/current-user.decorator';
import { UpsertSeatingDraftDto, UpsertSeatingPlanDto } from './dto/seating.dto';
import { SeatingService } from './seating.service';
export declare class SeatingController {
    private readonly seatingService;
    constructor(seatingService: SeatingService);
    getMine(user: AuthUser): Promise<{
        weddingId: string;
        draft: Record<string, unknown> | null;
        plan: Record<string, unknown> | null;
    }>;
    upsertDraft(user: AuthUser, dto: UpsertSeatingDraftDto): Promise<{
        weddingId: string;
        draft: {
            tables: Record<string, unknown>;
            guests: Record<string, unknown>;
        };
    }>;
    upsertPlan(user: AuthUser, dto: UpsertSeatingPlanDto): Promise<{
        weddingId: string;
        plan: {
            tables: unknown[];
            savedAt: number;
        };
    }>;
    clearPlan(user: AuthUser): Promise<{
        weddingId: string;
        plan: null;
    }>;
}
