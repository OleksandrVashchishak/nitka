import { AuthUser } from '../auth/current-user.decorator';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { RegisterPushDto } from './dto/register-push.dto';
import { UpdateNotificationPrefsDto } from './dto/update-prefs.dto';
import { NotificationRemindersService } from './notification-reminders.service';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    private readonly reminders;
    constructor(notifications: NotificationsService, reminders: NotificationRemindersService);
    registerPush(user: AuthUser, dto: RegisterPushDto): Promise<{
        ok: boolean;
    }>;
    unregisterPush(user: AuthUser, dto: RegisterPushDto): Promise<{
        ok: boolean;
    }>;
    runReminders(secret?: string, force?: string): Promise<{
        skipped: "running";
        day?: undefined;
        weddings?: undefined;
        created?: undefined;
    } | {
        skipped: "already-ran";
        day: string;
        weddings?: undefined;
        created?: undefined;
    } | {
        day: string;
        weddings: number;
        created: number;
        skipped?: undefined;
    }>;
    list(user: AuthUser, query: ListNotificationsDto): Promise<import("./notifications.service").NotificationsPage>;
    unreadCount(user: AuthUser): Promise<{
        unreadCount: number;
    }>;
    readAll(user: AuthUser): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    read(user: AuthUser, id: string): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    getPrefs(user: AuthUser): Promise<import("./notifications.service").NotificationPrefsView>;
    updatePrefs(user: AuthUser, dto: UpdateNotificationPrefsDto): Promise<import("./notifications.service").NotificationPrefsView>;
}
