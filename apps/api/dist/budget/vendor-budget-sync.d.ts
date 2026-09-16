import type { ExternalVendor, PrismaClient } from '@prisma/client';
export declare function syncBudgetItemForExternalVendor(prisma: PrismaClient, userId: string, vendor: ExternalVendor): Promise<void>;
export declare function removeBudgetItemForExternalVendor(prisma: PrismaClient, vendorId: string): Promise<void>;
export declare function syncAllExternalVendorBudgetItems(prisma: PrismaClient, userId: string): Promise<void>;
