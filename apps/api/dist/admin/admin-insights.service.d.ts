import { PrismaService } from '../prisma/prisma.service';
export type TimeseriesGranularity = 'day' | 'week';
export declare class AdminInsightsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTimeseries(granularity: string, periodsRaw?: number): Promise<{
        granularity: TimeseriesGranularity;
        points: {
            date: string;
            registrations: number;
            active: number;
        }[];
    }>;
    getCohorts(weeksRaw?: number): Promise<{
        weeks: number;
        cohorts: {
            cohort: string;
            size: number;
            retained: (number | null)[];
        }[];
    }>;
}
