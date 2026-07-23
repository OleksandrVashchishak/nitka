import { Role, VendorStatus } from '@prisma/client';
export declare class UpdateVendorStatusDto {
    status: VendorStatus;
    moderationNote?: string;
}
export declare class UpdateVendorFeaturedDto {
    featured: boolean;
}
export declare class UpsertCategoryDto {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
}
export declare class UpdateUserDto {
    blocked?: boolean;
    role?: Role;
    name?: string;
    email?: string;
}
