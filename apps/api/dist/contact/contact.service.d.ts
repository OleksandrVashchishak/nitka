import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        id: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    list(params?: {
        page?: number;
        limit?: number;
    }): Promise<{
        page: number;
        limit: number;
        total: number;
        unread: number;
        items: {
            email: string;
            name: string;
            id: string;
            createdAt: Date;
            message: string;
            readAt: Date | null;
        }[];
    }>;
    markRead(id: string): Promise<{
        id: string;
        readAt: Date | null;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
