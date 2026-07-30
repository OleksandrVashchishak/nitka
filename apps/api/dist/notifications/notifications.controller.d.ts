import { AuthUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterPushDto } from './dto/register-push.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    registerPush(user: AuthUser, dto: RegisterPushDto): Promise<{
        ok: boolean;
    }>;
    unregisterPush(user: AuthUser, dto: RegisterPushDto): Promise<{
        ok: boolean;
    }>;
    runDueReminders(secret?: string): Promise<{
        tasks: number;
        sent: number;
    }>;
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
