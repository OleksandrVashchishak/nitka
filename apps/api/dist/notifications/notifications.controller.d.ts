import { AuthUser } from '../auth/current-user.decorator';
import { RegisterPushDto } from './dto/register-push.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
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
        pendingRsvp: number;
        newRsvp: number;
        total: number;
        newCount: number;
        items: import("./notifications.service").NotificationSummaryItem[];
        feed: import("./notifications.service").NotificationFeedItem[];
        moreHref: string;
    }>;
}
