import { AuthUser } from '../auth/current-user.decorator';
import { DayPlanService } from './day-plan.service';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';
export declare class DayPlanController {
    private readonly dayPlanService;
    constructor(dayPlanService: DayPlanService);
    getMine(user: AuthUser): Promise<{
        weddingId: string;
        events: import("./day-plan.defaults").DayPlanEventPayload[] | null;
    }>;
    upsert(user: AuthUser, dto: UpsertDayPlanDto): Promise<{
        weddingId: string;
        events: import("./day-plan.defaults").DayPlanEventPayload[];
    }>;
}
