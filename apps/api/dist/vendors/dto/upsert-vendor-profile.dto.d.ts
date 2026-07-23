export declare class VendorPackageDto {
    title: string;
    price: number;
    description?: string;
    includes?: string;
    duration?: string;
    isPopular?: boolean;
}
export declare class VendorFaqDto {
    question: string;
    answer: string;
}
export declare class VendorTeamMemberDto {
    name: string;
    role: string;
    bio?: string;
    photoUrl?: string | null;
}
export declare class UpsertVendorProfileDto {
    name: string;
    tagline?: string;
    description: string;
    categoryId: string;
    city: string;
    priceFrom: number;
    priceTo?: number | null;
    phone?: string | null;
    website?: string | null;
    instagram?: string | null;
    address?: string | null;
    yearsInBusiness?: number | null;
    teamSize?: number | null;
    responseTime?: string | null;
    bookingLeadTime?: string | null;
    availabilityNote?: string;
    videoUrl?: string | null;
    dealTitle?: string | null;
    dealDescription?: string | null;
    styles?: string[];
    services?: string[];
    serviceAreas?: string[];
    languages?: string[];
    photoUrls?: string[];
    packages?: VendorPackageDto[];
    faqs?: VendorFaqDto[];
    team?: VendorTeamMemberDto[];
}
