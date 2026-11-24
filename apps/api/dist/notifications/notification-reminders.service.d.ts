import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
export declare class NotificationRemindersService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly notifications;
    private readonly logger;
    private timer;
    private running;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private tick;
    runDaily(opts?: {
        now?: Date;
        force?: boolean;
    }): Promise<{
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
    private runWedding;
    private record;
    private seatedGuestIds;
    private resolveStale;
}
