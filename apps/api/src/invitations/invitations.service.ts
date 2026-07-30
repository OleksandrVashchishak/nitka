import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { requireWeddingForUser } from '../weddings/wedding-access';
import { UpsertWeddingInvitationDto } from './dto/invitation.dto';

export type InvitationContent = {
  headline: string;
  opener: string;
  body: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  dressCode: string;
  rsvpNote: string;
  coverImageUrl: string;
  showWebsiteLink: boolean;
};

const TEMPLATE_IDS = new Set(['sage-linen', 'midnight-frame', 'meadow']);

export const INVITATION_TEMPLATES = [
  {
    id: 'sage-linen',
    name: 'Sage Linen',
    description: 'Мʼякий шавлія + чиста типографіка',
  },
  {
    id: 'midnight-frame',
    name: 'Midnight Frame',
    description: 'Темна рамка й акцентний шрифт',
  },
  {
    id: 'meadow',
    name: 'Meadow',
    description: 'Світлий ботанічний вайб',
  },
];

function defaultContent(input?: {
  coupleName?: string;
  dateLabel?: string;
  city?: string;
}): InvitationContent {
  return {
    headline: input?.coupleName || 'Імена пари',
    opener: 'Запрошуємо розділити наш день',
    body: 'Будемо раді бачити вас на нашому весіллі.',
    dateLabel: input?.dateLabel || '',
    timeLabel: '16:00',
    venue: '',
    address: input?.city || '',
    dressCode: '',
    rsvpNote: 'Будь ласка, підтвердіть участь.',
    coverImageUrl: '',
    showWebsiteLink: true,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function normalizeInvitationContent(
  raw: unknown,
  fallback?: Partial<InvitationContent>,
): InvitationContent {
  const base = { ...defaultContent(), ...fallback };
  const data = asRecord(raw);
  return {
    headline: String(data.headline ?? base.headline),
    opener: String(data.opener ?? base.opener),
    body: String(data.body ?? base.body),
    dateLabel: String(data.dateLabel ?? base.dateLabel),
    timeLabel: String(data.timeLabel ?? base.timeLabel),
    venue: String(data.venue ?? base.venue),
    address: String(data.address ?? base.address),
    dressCode: String(data.dressCode ?? base.dressCode),
    rsvpNote: String(data.rsvpNote ?? base.rsvpNote),
    coverImageUrl: String(data.coverImageUrl ?? base.coverImageUrl),
    showWebsiteLink: Boolean(
      data.showWebsiteLink ?? base.showWebsiteLink ?? true,
    ),
  };
}

function coupleName(wedding: {
  partnerOneName: string;
  partnerTwoName: string;
  user?: { name: string } | null;
}) {
  const partners = [wedding.partnerOneName, wedding.partnerTwoName]
    .map((name) => name.trim())
    .filter(Boolean);
  if (partners.length > 0) return partners.join(' і ');
  return wedding.user?.name?.trim() || 'Пара';
}

function dateLabelUk(date: Date) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const access = await requireWeddingForUser(this.prisma, userId);
    const full = await this.prisma.wedding.findUniqueOrThrow({
      where: { id: access.wedding.id },
      include: {
        invitation: true,
        website: { select: { slug: true, published: true } },
        user: { select: { name: true } },
        guestList: {
          select: { id: true, name: true, inviteToken: true, rsvpStatus: true },
          orderBy: { name: 'asc' },
          take: 8,
        },
        _count: { select: { guestList: true } },
      },
    });

    const names = coupleName(full);
    const content = normalizeInvitationContent(full.invitation?.content, {
      headline: names,
      dateLabel: dateLabelUk(full.date),
      address: full.city,
    });

    return {
      invitation: {
        templateId: full.invitation?.templateId ?? 'sage-linen',
        content,
        updatedAt: full.invitation?.updatedAt ?? null,
      },
      wedding: {
        id: full.id,
        date: full.date,
        city: full.city,
        coupleName: names,
      },
      website:
        full.website?.published && full.website.slug
          ? { slug: full.website.slug, url: `/w/${full.website.slug}` }
          : null,
      guestsPreview: full.guestList,
      guestsTotal: full._count.guestList,
      templates: INVITATION_TEMPLATES,
    };
  }

  async upsertMine(userId: string, dto: UpsertWeddingInvitationDto) {
    const access = await requireWeddingForUser(this.prisma, userId);
    const full = await this.prisma.wedding.findUniqueOrThrow({
      where: { id: access.wedding.id },
      include: {
        invitation: true,
        user: { select: { name: true } },
      },
    });

    if (dto.templateId && !TEMPLATE_IDS.has(dto.templateId)) {
      throw new BadRequestException('Невідомий темплейт запрошення');
    }

    const names = coupleName(full);
    const nextContent = normalizeInvitationContent(
      dto.content ?? full.invitation?.content,
      {
        headline: names,
        dateLabel: dateLabelUk(full.date),
        address: full.city,
      },
    );
    const templateId = dto.templateId ?? full.invitation?.templateId ?? 'sage-linen';

    const invitation = full.invitation
      ? await this.prisma.weddingInvitation.update({
          where: { weddingId: full.id },
          data: {
            templateId,
            content: nextContent as unknown as Prisma.InputJsonValue,
          },
        })
      : await this.prisma.weddingInvitation.create({
          data: {
            weddingId: full.id,
            templateId,
            content: nextContent as unknown as Prisma.InputJsonValue,
          },
        });

    return {
      invitation: {
        templateId: invitation.templateId,
        content: normalizeInvitationContent(invitation.content),
        updatedAt: invitation.updatedAt,
      },
      templates: INVITATION_TEMPLATES,
    };
  }

  async getDesignForWedding(weddingId: string) {
    const row = await this.prisma.weddingInvitation.findUnique({
      where: { weddingId },
    });
    return {
      templateId: row?.templateId ?? 'sage-linen',
      content: normalizeInvitationContent(row?.content),
    };
  }
}
