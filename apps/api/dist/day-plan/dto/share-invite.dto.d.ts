import { DayPlanShareAccess } from '@prisma/client';
export declare class ShareInviteDto {
    email: string;
    access: DayPlanShareAccess;
}
export declare class UpdateShareGrantDto {
    access: DayPlanShareAccess;
}
