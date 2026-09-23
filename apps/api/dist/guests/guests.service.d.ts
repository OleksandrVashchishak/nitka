import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto, ImportGuestsDto, UpdateGuestDto } from './dto/guest.dto';
export declare class GuestsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    private getWeddingForUser;
    private buildStats;
    listMine(userId: string): Promise<{
        wedding: {
            id: string;
            date: Date;
            city: string;
            plannedGuests: number;
        };
        stats: {
            total: number;
            yes: number;
            no: number;
            maybe: number;
            pending: number;
            headcount: number;
        };
        guests: {
            name: string;
            id: string;
            weddingId: string;
            email: string | null;
            phone: string | null;
            side: import(".prisma/client").$Enums.GuestSide;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            notes: string | null;
            inviteToken: string;
            respondedAt: Date | null;
            createdAt: Date;
        }[];
    }>;
    create(userId: string, dto: CreateGuestDto): Promise<{
        name: string;
        id: string;
        weddingId: string;
        email: string | null;
        phone: string | null;
        side: import(".prisma/client").$Enums.GuestSide;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        notes: string | null;
        inviteToken: string;
        respondedAt: Date | null;
        createdAt: Date;
    }>;
    importMany(userId: string, dto: ImportGuestsDto): Promise<{
        imported: number;
        guests: {
            name: string;
            id: string;
            weddingId: string;
            email: string | null;
            phone: string | null;
            side: import(".prisma/client").$Enums.GuestSide;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            notes: string | null;
            inviteToken: string;
            respondedAt: Date | null;
            createdAt: Date;
        }[];
    }>;
    update(userId: string, guestId: string, dto: UpdateGuestDto): Promise<{
        name: string;
        id: string;
        weddingId: string;
        email: string | null;
        phone: string | null;
        side: import(".prisma/client").$Enums.GuestSide;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        notes: string | null;
        inviteToken: string;
        respondedAt: Date | null;
        createdAt: Date;
    }>;
    remove(userId: string, guestId: string): Promise<{
        ok: boolean;
    }>;
}
