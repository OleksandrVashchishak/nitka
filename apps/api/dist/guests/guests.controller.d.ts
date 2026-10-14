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
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            weddingId: string;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            phone: string | null;
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
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        weddingId: string;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        phone: string | null;
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
            email: string | null;
            name: string;
            id: string;
            createdAt: Date;
            weddingId: string;
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
            phone: string | null;
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
        email: string | null;
        name: string;
        id: string;
        createdAt: Date;
        weddingId: string;
        rsvpStatus: import(".prisma/client").$Enums.RsvpStatus;
        phone: string | null;
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
}
