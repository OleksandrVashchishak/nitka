import { GuestSide, RsvpStatus } from '@prisma/client';
export declare class CreateGuestDto {
    name: string;
    email?: string;
    phone?: string;
    side?: GuestSide;
    rsvpStatus?: RsvpStatus;
    plusOne?: boolean;
    plusOneName?: string;
    plusOneAttending?: boolean;
    allergies?: string;
    tableLabel?: string;
    notes?: string;
}
export declare class ImportGuestRowDto {
    name: string;
    email?: string;
    phone?: string;
    side?: GuestSide;
    plusOne?: boolean;
    notes?: string;
}
export declare class ImportGuestsDto {
    guests: ImportGuestRowDto[];
}
export declare class UpdateGuestDto {
    name?: string;
    email?: string | null;
    phone?: string | null;
    side?: GuestSide;
    rsvpStatus?: RsvpStatus;
    plusOne?: boolean;
    plusOneName?: string | null;
    plusOneAttending?: boolean | null;
    allergies?: string | null;
    tableLabel?: string | null;
    notes?: string | null;
}
export declare class PublicRsvpDto {
    rsvpStatus: RsvpStatus;
    plusOneAttending?: boolean;
    plusOneName?: string;
    allergies?: string;
    email?: string;
    phone?: string;
    notes?: string;
}
