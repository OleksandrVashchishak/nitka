import { ContactStatus } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly prisma;
    private readonly email;
    constructor(prisma: PrismaService, email: EmailService);
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
            status: import(".prisma/client").$Enums.ContactStatus;
            message: string;
            readAt: Date | null;
            replyBody: string | null;
            repliedAt: Date | null;
        }[];
    }>;
    markRead(id: string): Promise<{
        id: string;
        readAt: Date | null;
    }>;
    setStatus(id: string, status: ContactStatus): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContactStatus;
        message: string;
        readAt: Date | null;
        replyBody: string | null;
        repliedAt: Date | null;
    }>;
    reply(id: string, body: string): Promise<{
        message: {
            email: string;
            name: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ContactStatus;
            message: string;
            readAt: Date | null;
            replyBody: string | null;
            repliedAt: Date | null;
        };
        dryRun: boolean;
    }>;
    private requireMessage;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
