import { PrismaService } from '../prisma/prisma.service';
import { type DayPlanEventPayload } from './day-plan.defaults';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';
export declare class DayPlanService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMine(userId: string): Promise<{
        weddingId: string;
        events: DayPlanEventPayload[] | null;
    }>;
    upsert(userId: string, dto: UpsertDayPlanDto): Promise<{
        weddingId: string;
        events: DayPlanEventPayload[];
    }>;
    private parseEvents;
    private sortEvents;
}
