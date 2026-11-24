import { AuthUser } from '../auth/current-user.decorator';
import { CreateGuestDto, ImportGuestsDto, UpdateGuestDto } from './dto/guest.dto';
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
            weddingId: string;
            createdAt: Date;
            name: string;
            email: string | null;
            inviteToken: string;
            phone: string | null;
            notes: string | null;
            side: import(".prisma/client").$Enums.GuestSide;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            respondedAt: Date | null;
        }[];
    }>;
    create(user: AuthUser, dto: CreateGuestDto): Promise<{
        id: string;
        weddingId: string;
        createdAt: Date;
        name: string;
        email: string | null;
        inviteToken: string;
        phone: string | null;
        notes: string | null;
        side: import(".prisma/client").$Enums.GuestSide;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        respondedAt: Date | null;
    }>;
    importMany(user: AuthUser, dto: ImportGuestsDto): Promise<{
        imported: number;
        guests: {
            id: string;
            weddingId: string;
            createdAt: Date;
            name: string;
            email: string | null;
            inviteToken: string;
            phone: string | null;
            notes: string | null;
            side: import(".prisma/client").$Enums.GuestSide;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            plusOne: boolean;
            plusOneName: string | null;
            plusOneAttending: boolean | null;
            allergies: string | null;
            tableLabel: string | null;
            respondedAt: Date | null;
        }[];
    }>;
    update(user: AuthUser, id: string, dto: UpdateGuestDto): Promise<{
        id: string;
        weddingId: string;
        createdAt: Date;
        name: string;
        email: string | null;
        inviteToken: string;
        phone: string | null;
        notes: string | null;
        side: import(".prisma/client").$Enums.GuestSide;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        plusOne: boolean;
        plusOneName: string | null;
        plusOneAttending: boolean | null;
        allergies: string | null;
        tableLabel: string | null;
        respondedAt: Date | null;
    }>;
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
