import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
export type NotifyPayload = {
    title: string;
    body: string;
    data?: Record<string, string>;
    email?: {
        subject?: string;
        body?: string;
        ctaLabel?: string;
        ctaPath?: string;
    };
};
export declare class NotificationsService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly email;
    private readonly logger;
    private dueTimer;
    constructor(prisma: PrismaService, email: EmailService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    registerDevice(userId: string, token: string, platform?: string): Promise<{
        ok: boolean;
    }>;
    unregisterDevice(userId: string, token: string): Promise<{
        ok: boolean;
    }>;
    notifyUser(userId: string, payload: NotifyPayload): Promise<{
        sent: number;
        emailed: number;
    }>;
    notifyWeddingMembers(weddingId: string, payload: NotifyPayload, excludeUserId?: string): Promise<{
        sent: number;
        emailed: number;
    }>;
    sendDueTaskReminders(): Promise<{
        tasks: number;
        sent: number;
    }>;
    private sendPush;
    private sendEmail;
    private sendExpo;
}
