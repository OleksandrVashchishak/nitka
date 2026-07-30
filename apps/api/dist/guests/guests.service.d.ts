import { InvitationsService } from '../invitations/invitations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto, ImportGuestsDto, PublicRsvpDto, UpdateGuestDto } from './dto/guest.dto';
export declare class GuestsService {
    private readonly prisma;
    private readonly notifications;
    private readonly invitations;
    constructor(prisma: PrismaService, notifications: NotificationsService, invitations: InvitationsService);
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
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            email: string | null;
            weddingId: string;
            notes: string | null;
            side: import(".prisma/client").$Enums.GuestSide;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            inviteToken: string;
            respondedAt: Date | null;
        }[];
    }>;
    create(userId: string, dto: CreateGuestDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        email: string | null;
        weddingId: string;
        notes: string | null;
        side: import(".prisma/client").$Enums.GuestSide;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        inviteToken: string;
        respondedAt: Date | null;
    }>;
    importMany(userId: string, dto: ImportGuestsDto): Promise<{
        imported: number;
        guests: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            email: string | null;
            weddingId: string;
            notes: string | null;
            side: import(".prisma/client").$Enums.GuestSide;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            inviteToken: string;
            respondedAt: Date | null;
        }[];
    }>;
    update(userId: string, guestId: string, dto: UpdateGuestDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        email: string | null;
        weddingId: string;
        notes: string | null;
        side: import(".prisma/client").$Enums.GuestSide;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        inviteToken: string;
        respondedAt: Date | null;
    }>;
    remove(userId: string, guestId: string): Promise<{
        ok: boolean;
    }>;
    getPublicInvite(token: string): Promise<{
        token: string;
        name: string;
        email: string | null;
        phone: string | null;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        notes: string | null;
        wedding: {
            date: Date;
            city: string;
            coupleName: string;
            websiteUrl: string | null;
        };
        invitation: {
            templateId: string;
            content: import("../invitations/invitations.service").InvitationContent;
        };
    }>;
    submitPublicRsvp(token: string, dto: PublicRsvpDto): Promise<{
        name: string;
        weddingId: string;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
    }>;
}
