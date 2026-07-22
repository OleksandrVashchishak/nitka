import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RsvpStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGuestDto,
  PublicRsvpDto,
  UpdateGuestDto,
} from './dto/guest.dto';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getWeddingForUser(userId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
    });
    if (!wedding) {
      throw new BadRequestException(
        'Спочатку створи весілля в кабінеті (дата / місто)',
      );
    }
    return wedding;
  }

  private buildStats(
    guests: Array<{
      rsvpStatus: RsvpStatus;
      plusOne: boolean;
      plusOneAttending: boolean | null;
    }>,
  ) {
    const yes = guests.filter((g) => g.rsvpStatus === 'YES').length;
    const no = guests.filter((g) => g.rsvpStatus === 'NO').length;
    const maybe = guests.filter((g) => g.rsvpStatus === 'MAYBE').length;
    const pending = guests.filter((g) => g.rsvpStatus === 'PENDING').length;
    const headcount = guests.reduce((sum, g) => {
      if (g.rsvpStatus !== 'YES') return sum;
      const plus =
        g.plusOne && g.plusOneAttending === true ? 1 : 0;
      return sum + 1 + plus;
    }, 0);

    return {
      total: guests.length,
      yes,
      no,
      maybe,
      pending,
      headcount,
    };
  }

  async listMine(userId: string) {
    const wedding = await this.getWeddingForUser(userId);
    const guests = await this.prisma.guest.findMany({
      where: { weddingId: wedding.id },
      orderBy: [{ rsvpStatus: 'asc' }, { name: 'asc' }],
    });

    return {
      wedding: {
        id: wedding.id,
        date: wedding.date,
        city: wedding.city,
        plannedGuests: wedding.guests,
      },
      stats: this.buildStats(guests),
      guests,
    };
  }

  async create(userId: string, dto: CreateGuestDto) {
    const wedding = await this.getWeddingForUser(userId);
    return this.prisma.guest.create({
      data: {
        weddingId: wedding.id,
        name: dto.name.trim(),
        email: dto.email?.trim() || null,
        phone: dto.phone?.trim() || null,
        side: dto.side ?? 'BOTH',
        rsvpStatus: dto.rsvpStatus ?? 'PENDING',
        plusOne: dto.plusOne ?? false,
        plusOneName: dto.plusOneName?.trim() || null,
        plusOneAttending: dto.plusOneAttending ?? null,
        allergies: dto.allergies?.trim() || null,
        tableLabel: dto.tableLabel?.trim() || null,
        notes: dto.notes?.trim() || null,
        respondedAt:
          dto.rsvpStatus && dto.rsvpStatus !== 'PENDING'
            ? new Date()
            : null,
      },
    });
  }

  async update(userId: string, guestId: string, dto: UpdateGuestDto) {
    const wedding = await this.getWeddingForUser(userId);
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId: wedding.id },
    });
    if (!guest) {
      throw new NotFoundException('Гостя не знайдено');
    }

    const nextStatus = dto.rsvpStatus ?? guest.rsvpStatus;

    return this.prisma.guest.update({
      where: { id: guestId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.email !== undefined
          ? { email: dto.email?.trim() || null }
          : {}),
        ...(dto.phone !== undefined
          ? { phone: dto.phone?.trim() || null }
          : {}),
        ...(dto.side !== undefined ? { side: dto.side } : {}),
        ...(dto.rsvpStatus !== undefined
          ? { rsvpStatus: dto.rsvpStatus }
          : {}),
        ...(dto.plusOne !== undefined ? { plusOne: dto.plusOne } : {}),
        ...(dto.plusOneName !== undefined
          ? { plusOneName: dto.plusOneName?.trim() || null }
          : {}),
        ...(dto.plusOneAttending !== undefined
          ? { plusOneAttending: dto.plusOneAttending }
          : {}),
        ...(dto.allergies !== undefined
          ? { allergies: dto.allergies?.trim() || null }
          : {}),
        ...(dto.tableLabel !== undefined
          ? { tableLabel: dto.tableLabel?.trim() || null }
          : {}),
        ...(dto.notes !== undefined
          ? { notes: dto.notes?.trim() || null }
          : {}),
        respondedAt:
          nextStatus === 'PENDING'
            ? null
            : guest.respondedAt ?? new Date(),
      },
    });
  }

  async remove(userId: string, guestId: string) {
    const wedding = await this.getWeddingForUser(userId);
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, weddingId: wedding.id },
    });
    if (!guest) {
      throw new NotFoundException('Гостя не знайдено');
    }
    await this.prisma.guest.delete({ where: { id: guestId } });
    return { ok: true };
  }

  async getPublicInvite(token: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { inviteToken: token },
      include: {
        wedding: {
          select: {
            date: true,
            city: true,
            user: { select: { name: true } },
          },
        },
      },
    });
    if (!guest) {
      throw new NotFoundException('Запрошення не знайдено');
    }

    return {
      token: guest.inviteToken,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      rsvpStatus: guest.rsvpStatus,
      plusOne: guest.plusOne,
      plusOneName: guest.plusOneName,
      plusOneAttending: guest.plusOneAttending,
      allergies: guest.allergies,
      notes: guest.notes,
      wedding: {
        date: guest.wedding.date,
        city: guest.wedding.city,
        coupleName: guest.wedding.user.name,
      },
    };
  }

  async submitPublicRsvp(token: string, dto: PublicRsvpDto) {
    if (dto.rsvpStatus === 'PENDING') {
      throw new BadRequestException('Обери відповідь: так / ні / можливо');
    }

    const guest = await this.prisma.guest.findUnique({
      where: { inviteToken: token },
    });
    if (!guest) {
      throw new NotFoundException('Запрошення не знайдено');
    }

    if (!guest.plusOne && dto.plusOneAttending) {
      throw new BadRequestException('Plus one не передбачено');
    }

    return this.prisma.guest.update({
      where: { inviteToken: token },
      data: {
        rsvpStatus: dto.rsvpStatus,
        plusOneAttending: guest.plusOne
          ? (dto.plusOneAttending ?? false)
          : null,
        plusOneName: guest.plusOne
          ? dto.plusOneName?.trim() || guest.plusOneName
          : null,
        allergies: dto.allergies?.trim() || null,
        email: dto.email?.trim() || guest.email,
        phone: dto.phone?.trim() || guest.phone,
        notes: dto.notes?.trim() || guest.notes,
        respondedAt: new Date(),
      },
      select: {
        name: true,
        rsvpStatus: true,
        plusOne: true,
        plusOneName: true,
        plusOneAttending: true,
        allergies: true,
      },
    });
  }
}
