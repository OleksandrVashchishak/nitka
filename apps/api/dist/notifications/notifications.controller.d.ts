import { AuthUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(user: AuthUser): Promise<{
        role: string;
        newRequests: number;
        total: number;
        items: Array<{
            key: string;
            label: string;
            count: number;
            href: string;
        }>;
        pendingRsvp?: undefined;
        newRsvp?: undefined;
        waitingRequests?: undefined;
        vendorReplied?: undefined;
    } | {
        role: string;
        pendingRsvp: number;
        newRsvp: number;
        waitingRequests: number;
        vendorReplied: number;
        total: number;
        items: {
            key: string;
            label: string;
            count: number;
            href: string;
        }[];
        newRequests?: undefined;
    }>;
}
