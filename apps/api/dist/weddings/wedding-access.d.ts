import { Wedding, WeddingMemberRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export type WeddingAccess = {
    wedding: Wedding;
    role: WeddingMemberRole;
};
export declare function resolveWeddingForUser(prisma: PrismaService, userId: string): Promise<WeddingAccess | null>;
export declare function requireWeddingForUser(prisma: PrismaService, userId: string, message?: string): Promise<WeddingAccess>;
export declare function requireWeddingOwner(prisma: PrismaService, userId: string): Promise<WeddingAccess>;
