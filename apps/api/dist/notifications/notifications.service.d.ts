import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { type Gender, type NotificationPayload, type NotificationSettings, type NotificationType, type RenderedNotification } from './notification-catalog';
export type NotificationFeedItem = RenderedNotification & {
    id: string;
    type: NotificationType;
    createdAt: string;
    updatedAt: string;
    isRead: boolean;
    taskId?: string;
};
export type NotificationsPage = {
    items: NotificationFeedItem[];
    unreadCount: number;
    hasMore: boolean;
};
export type NotificationPrefsView = NotificationSettings & {
    partnerName: string | null;
    hasPartner: boolean;
};
export type NotificationPrefsPatch = Partial<Omit<NotificationSettings, 'channels'> & {
    push: boolean;
    email: boolean;
}>;
export type CreateNotificationInput = {
    weddingId: string;
    recipientId: string;
    type: NotificationType;
    dedupKey: string;
    count?: number;
    payload?: NotificationPayload;
    reminderNo?: number | null;
    suppressed?: boolean;
};
export type PartnerEventInput = {
    n?: number;
    entityIds?: string[];
    amount?: number;
    vendorId?: string;
    vendorLabel?: string;
    siteUrl?: string;
};
export declare function utcTs(d?: Date): string;
export declare class NotificationsService {
    private readonly prisma;
    private readonly email;
    private readonly logger;
    constructor(prisma: PrismaService, email: EmailService);
    registerDevice(userId: string, token: string, platform?: string): Promise<{
        ok: boolean;
    }>;
    unregisterDevice(userId: string, token: string): Promise<{
        ok: boolean;
    }>;
    getMembers(weddingId: string): Promise<{
        ownerId: string;
        partnerId: string | null;
        partnerOneName: string;
        partnerTwoName: string;
    } | null>;
    getActors(weddingId: string, userIds: string[]): Promise<Map<string, {
        name: string;
        gender: Gender;
    }>>;
    getSettings(userId: string): Promise<NotificationSettings>;
    getPrefs(userId: string): Promise<NotificationPrefsView>;
    updatePrefs(userId: string, patch: NotificationPrefsPatch): Promise<NotificationPrefsView>;
    create(input: CreateNotificationInput): Promise<`${string}-${string}-${string}-${string}-${string}`>;
    partnerEvent(weddingId: string, actorId: string, type: Extract<NotificationType, `partner_${string}`>, event?: PartnerEventInput): Promise<void>;
    direct(weddingId: string, recipientId: string, type: NotificationType, dedupKey: string, payload: NotificationPayload): Promise<void>;
    smartPlanningDateTip(weddingId: string): Promise<void>;
    resolveTypes(weddingId: string, types: NotificationType[], recipientId?: string): Promise<void>;
    resolveTask(weddingId: string, taskId: string): Promise<void>;
    list(userId: string, offset?: number, limit?: number): Promise<NotificationsPage>;
    unreadCount(userId: string): Promise<number>;
    markRead(userId: string, id: string): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    markAllRead(userId: string): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    private renderRows;
    private deliver;
    private sendPush;
    private sendEmail;
    private sendExpo;
}
