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
    create(user: AuthUser, dto: CreateGuestDto): Promise<{
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
    importMany(user: AuthUser, dto: ImportGuestsDto): Promise<{
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
    update(user: AuthUser, id: string, dto: UpdateGuestDto): Promise<{
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
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
