export declare function countYesCompanions(notes: string | null | undefined, fallback?: {
    plusOne?: boolean;
    plusOneAttending?: boolean | null;
}): number;
export declare function listCompanionNames(notes: string | null | undefined, fallbackName?: string | null): Array<{
    name: string;
    isChild: boolean;
    rsvpStatus: string;
}>;
