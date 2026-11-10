import { ContactStatus } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly prisma;
    private readonly email;
    constructor(prisma: PrismaService, email: EmailService);
    create(dto: CreateContactDto): Promise<{
        id: string;
    }>;
    private notifyAdmin;
    list(params?: {
        page?: number;
        limit?: number;
    }): Promise<{
        page: number;
        limit: number;
        total: number;
        unread: number;
        items: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            message: string;
            readAt: Date | null;
            status: import(".prisma/client").$Enums.ContactStatus;
            replyBody: string | null;
            repliedAt: Date | null;
        }[];
    }>;
    markRead(id: string): Promise<{
        id: string;
        readAt: Date | null;
    }>;
    setStatus(id: string, status: ContactStatus): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        message: string;
        readAt: Date | null;
        status: import(".prisma/client").$Enums.ContactStatus;
        replyBody: string | null;
        repliedAt: Date | null;
    }>;
    reply(id: string, body: string): Promise<{
        message: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            message: string;
            readAt: Date | null;
            status: import(".prisma/client").$Enums.ContactStatus;
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
