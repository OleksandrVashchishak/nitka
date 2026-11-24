import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSeatingDraftDto, UpsertSeatingPlanDto } from './dto/seating.dto';
export declare class SeatingService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    getMine(userId: string): Promise<{
        weddingId: string;
        draft: Record<string, unknown> | null;
        plan: Record<string, unknown> | null;
    }>;
    upsertDraft(userId: string, dto: UpsertSeatingDraftDto): Promise<{
        weddingId: string;
        draft: {
            tables: Record<string, unknown>;
            guests: Record<string, unknown>;
        };
    }>;
    upsertPlan(userId: string, dto: UpsertSeatingPlanDto): Promise<{
        weddingId: string;
        plan: {
            tables: unknown[];
            knownKeys: string[] | undefined;
            savedAt: number;
        };
    }>;
    clearPlan(userId: string): Promise<{
        weddingId: string;
        plan: null;
    }>;
    private asObject;
}
