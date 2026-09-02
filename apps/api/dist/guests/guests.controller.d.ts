import { AuthUser } from '../auth/current-user.decorator';
import { CreateGuestDto, ImportGuestsDto, PublicRsvpDto, UpdateGuestDto } from './dto/guest.dto';
import { GuestsService } from './guests.service';
export declare class GuestsController {
    private readonly guestsService;
    constructor(guestsService: GuestsService);
    listMine(user: AuthUser): Promise<{
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
            createdAt: Date;
            email: string | null;
            phone: string | null;
            weddingId: string;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            side: import(".prisma/client").$Enums.GuestSide;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            notes: string | null;
            inviteToken: string;
            respondedAt: Date | null;
        }[];
    }>;
    create(user: AuthUser, dto: CreateGuestDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string | null;
        phone: string | null;
        weddingId: string;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        side: import(".prisma/client").$Enums.GuestSide;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        notes: string | null;
        inviteToken: string;
        respondedAt: Date | null;
    }>;
    importMany(user: AuthUser, dto: ImportGuestsDto): Promise<{
        imported: number;
        guests: {
            id: string;
            name: string;
            createdAt: Date;
            email: string | null;
            phone: string | null;
            weddingId: string;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            side: import(".prisma/client").$Enums.GuestSide;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            notes: string | null;
            inviteToken: string;
            respondedAt: Date | null;
        }[];
    }>;
    update(user: AuthUser, id: string, dto: UpdateGuestDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string | null;
        phone: string | null;
        weddingId: string;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        side: import(".prisma/client").$Enums.GuestSide;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        notes: string | null;
        inviteToken: string;
        respondedAt: Date | null;
    }>;
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    getPublic(token: string): Promise<{
        token: string;
        name: string;
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
    submitPublic(token: string, dto: PublicRsvpDto): Promise<{
        name: string;
        weddingId: string;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
    }>;
}
