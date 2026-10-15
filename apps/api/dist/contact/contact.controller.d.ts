import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contact;
    constructor(contact: ContactService);
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        id: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
