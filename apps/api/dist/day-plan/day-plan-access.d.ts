import { Wedding } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export type DayPlanAccessLevel = 'edit' | 'view';
export type DayPlanAccess = {
    wedding: Wedding;
    level: DayPlanAccessLevel;
    via: 'member' | 'grant';
};
export declare function resolveDayPlanAccess(prisma: PrismaService, userId: string): Promise<DayPlanAccess | null>;
export declare function requireDayPlanAccess(prisma: PrismaService, userId: string, min?: DayPlanAccessLevel, message?: string): Promise<DayPlanAccess>;
export declare function requireDayPlanEditByShareToken(prisma: PrismaService, userId: string, token: string): Promise<{
    wedding: Wedding;
}>;
