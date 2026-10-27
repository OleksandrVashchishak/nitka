import { PrismaService } from '../prisma/prisma.service';
export declare class AdminWebsitesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: {
        q?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            slug: string;
            templateId: string;
            published: boolean;
            publishedAt: Date | null;
            hidden: boolean;
            createdAt: Date;
            updatedAt: Date;
            couple: string;
            owner: {
                email: string;
                name: string;
                id: string;
            };
        }[];
    }>;
    setHidden(id: string, hidden: boolean): Promise<{
        id: string;
        hidden: boolean;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    private requireSite;
}
