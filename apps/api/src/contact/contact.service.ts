import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactStatus } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  create(dto: CreateContactDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        message: dto.message.trim(),
      },
      select: { id: true },
    });
  }

  async list(params?: { page?: number; limit?: number }) {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.min(100, Math.max(1, params?.limit ?? 50));
    const skip = (page - 1) * limit;

    const [total, unread, items] = await Promise.all([
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { readAt: null } }),
      this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { page, limit, total, unread, items };
  }

  async markRead(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true, readAt: true },
    });
    if (!existing) throw new NotFoundException('Повідомлення не знайдено');
    if (existing.readAt) return existing;

    return this.prisma.contactMessage.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async setStatus(id: string, status: ContactStatus) {
    await this.requireMessage(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  }

  async reply(id: string, body: string) {
    const msg = await this.requireMessage(id);
    const text = body.trim();
    const { html } = this.email.renderSimple({
      title: 'Відповідь від fata.studio',
      body: text,
    });
    const result = await this.email.send({
      to: msg.email,
      subject: 'Відповідь від fata.studio',
      text: `${text}\n\n— fata.studio`,
      html,
    });
    if (!result.sent && !result.dryRun) {
      throw new BadGatewayException('Не вдалося надіслати лист');
    }

    const updated = await this.prisma.contactMessage.update({
      where: { id },
      data: {
        replyBody: text,
        repliedAt: new Date(),
        readAt: msg.readAt ?? new Date(),
        status: 'CLOSED',
      },
    });
    return { message: updated, dryRun: result.dryRun };
  }

  private async requireMessage(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Повідомлення не знайдено');
    return existing;
  }

  async remove(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Повідомлення не знайдено');
    await this.prisma.contactMessage.delete({ where: { id } });
    return { ok: true };
  }
}
