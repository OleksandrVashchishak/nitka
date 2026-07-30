import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { slugify } from '../common/slug';
import { PrismaService } from '../prisma/prisma.service';
import { requireWeddingForUser } from '../weddings/wedding-access';
import { UpsertWeddingWebsiteDto } from './dto/website.dto';

export type WebsiteScheduleItem = {
  time: string;
  title: string;
  detail: string;
};

export type WebsiteQaItem = {
  question: string;
  answer: string;
};

export type WebsiteTravelItem = {
  title: string;
  detail: string;
};

export type WebsiteRegistryItem = {
  title: string;
  url: string;
  detail: string;
};

export type WebsiteSections = {
  story: boolean;
  schedule: boolean;
  dressCode: boolean;
  gallery: boolean;
  qa: boolean;
  travel: boolean;
  registry: boolean;
  rsvp: boolean;
};

export type WebsiteContent = {
  headline: string;
  subheadline: string;
  dateLabel: string;
  cityLabel: string;
  dateFormat: 'uk' | 'en';
  accentColor: string;
  heroImageUrl: string;
  coupleImageUrl: string;
  storyTitle: string;
  storyBody: string;
  storyImageUrl: string;
  scheduleTitle: string;
  scheduleItems: WebsiteScheduleItem[];
  dressCodeTitle: string;
  dressCodeBody: string;
  galleryTitle: string;
  galleryImages: string[];
  qaTitle: string;
  qaItems: WebsiteQaItem[];
  travelTitle: string;
  travelBody: string;
  travelItems: WebsiteTravelItem[];
  registryTitle: string;
  registryBody: string;
  registryItems: WebsiteRegistryItem[];
  rsvpTitle: string;
  rsvpBody: string;
  rsvpUrl: string;
  footerNote: string;
  sections: WebsiteSections;
  introEnabled: boolean;
  introTitle: string;
  musicUrl: string;
};

const TEMPLATE_IDS = new Set([
  'classic',
  'classic-white',
  'navy-gold',
  'dark-botanical',
]);

const TEMPLATES_LIST = [
  {
    id: 'classic-white',
    name: 'Classic White',
    description: 'Типографіка + білий мінімалізм',
  },
  {
    id: 'navy-gold',
    name: 'Navy & Gold',
    description: 'Photo hero, navy і золото',
  },
  {
    id: 'dark-botanical',
    name: 'Dark Botanical',
    description: 'Чорний frame з флоральним декором',
  },
];

const DEFAULT_SECTIONS: WebsiteSections = {
  story: true,
  schedule: true,
  dressCode: true,
  gallery: false,
  qa: false,
  travel: false,
  registry: false,
  rsvp: true,
};

function formatDate(date: Date, format: 'uk' | 'en') {
  if (format === 'en') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
      .format(date)
      .toUpperCase();
  }
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function defaultContent(wedding: {
  partnerOneName: string;
  partnerTwoName: string;
  date: Date;
  city: string;
}): WebsiteContent {
  const one = wedding.partnerOneName.trim() || 'Наречена';
  const two = wedding.partnerTwoName.trim() || 'Наречений';
  return {
    headline: `${one} і ${two}`,
    subheadline: 'Запрошуємо розділити наш день',
    dateFormat: 'uk',
    dateLabel: formatDate(wedding.date, 'uk'),
    cityLabel: wedding.city.trim() || 'Місто уточнюється',
    accentColor: '',
    heroImageUrl: '',
    coupleImageUrl: '',
    storyTitle: 'Наша історія',
    storyBody:
      'Коротко розкажіть, як усе почалось — кілька теплих речень буде достатньо.',
    storyImageUrl: '',
    scheduleTitle: 'Програма дня',
    scheduleItems: [
      { time: '15:00', title: 'Церемонія', detail: 'Місце церемонії' },
      { time: '17:00', title: 'Банкет', detail: 'Локація святкування' },
    ],
    dressCodeTitle: 'Дрес-код',
    dressCodeBody: 'Елегантний / cocktail. Відтінки зелені та крему вітаються.',
    galleryTitle: 'Фото',
    galleryImages: [],
    qaTitle: 'Q + A',
    qaItems: [
      {
        question: 'Чи можна з дітьми?',
        answer: 'Так, будемо раді бачити всю родину.',
      },
    ],
    travelTitle: 'Як дістатися',
    travelBody: 'Короткі підказки для гостей про дорогу та житло.',
    travelItems: [
      { title: 'Готель', detail: 'Назва готелю / адреса' },
      { title: 'Парковка', detail: 'Де зручно залишити авто' },
    ],
    registryTitle: 'Registry',
    registryBody: 'Якщо хочете зробити подарунок — ось кілька ідей.',
    registryItems: [{ title: 'Наша банка мрій', url: '', detail: '' }],
    rsvpTitle: 'Будеш з нами?',
    rsvpBody:
      'Підтверди участь персональним посиланням на запрошення, яке ми надішлемо.',
    rsvpUrl: '',
    footerNote: 'З любовʼю, ми',
    sections: { ...DEFAULT_SECTIONS },
    introEnabled: false,
    introTitle: 'Відкрити запрошення',
    musicUrl: '',
  };
}

function asStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item ?? '')).filter(Boolean);
}

function asSections(value: unknown, fallback: WebsiteSections): WebsiteSections {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...fallback };
  }
  const raw = value as Record<string, unknown>;
  return {
    story: Boolean(raw.story ?? fallback.story),
    schedule: Boolean(raw.schedule ?? fallback.schedule),
    dressCode: Boolean(raw.dressCode ?? fallback.dressCode),
    gallery: Boolean(raw.gallery ?? fallback.gallery),
    qa: Boolean(raw.qa ?? fallback.qa),
    travel: Boolean(raw.travel ?? fallback.travel),
    registry: Boolean(raw.registry ?? fallback.registry),
    rsvp: Boolean(raw.rsvp ?? fallback.rsvp),
  };
}

function asContent(value: unknown, fallback: WebsiteContent): WebsiteContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback;
  }
  const raw = value as Record<string, unknown>;
  const scheduleItems = Array.isArray(raw.scheduleItems)
    ? raw.scheduleItems
        .filter((item): item is Record<string, unknown> =>
          Boolean(item && typeof item === 'object'),
        )
        .map((item) => ({
          time: String(item.time ?? ''),
          title: String(item.title ?? ''),
          detail: String(item.detail ?? ''),
        }))
    : fallback.scheduleItems;

  const qaItems = Array.isArray(raw.qaItems)
    ? raw.qaItems
        .filter((item): item is Record<string, unknown> =>
          Boolean(item && typeof item === 'object'),
        )
        .map((item) => ({
          question: String(item.question ?? ''),
          answer: String(item.answer ?? ''),
        }))
    : fallback.qaItems;

  const travelItems = Array.isArray(raw.travelItems)
    ? raw.travelItems
        .filter((item): item is Record<string, unknown> =>
          Boolean(item && typeof item === 'object'),
        )
        .map((item) => ({
          title: String(item.title ?? ''),
          detail: String(item.detail ?? ''),
        }))
    : fallback.travelItems;

  const registryItems = Array.isArray(raw.registryItems)
    ? raw.registryItems
        .filter((item): item is Record<string, unknown> =>
          Boolean(item && typeof item === 'object'),
        )
        .map((item) => ({
          title: String(item.title ?? ''),
          url: String(item.url ?? ''),
          detail: String(item.detail ?? ''),
        }))
    : fallback.registryItems;

  const dateFormat = raw.dateFormat === 'en' ? 'en' : 'uk';

  return {
    headline: String(raw.headline ?? fallback.headline),
    subheadline: String(raw.subheadline ?? fallback.subheadline),
    dateFormat,
    dateLabel: String(raw.dateLabel ?? fallback.dateLabel),
    cityLabel: String(raw.cityLabel ?? fallback.cityLabel),
    accentColor: String(raw.accentColor ?? fallback.accentColor ?? ''),
    heroImageUrl: String(raw.heroImageUrl ?? fallback.heroImageUrl ?? ''),
    coupleImageUrl: String(raw.coupleImageUrl ?? fallback.coupleImageUrl ?? ''),
    storyTitle: String(raw.storyTitle ?? fallback.storyTitle),
    storyBody: String(raw.storyBody ?? fallback.storyBody),
    storyImageUrl: String(raw.storyImageUrl ?? fallback.storyImageUrl ?? ''),
    scheduleTitle: String(raw.scheduleTitle ?? fallback.scheduleTitle),
    scheduleItems: scheduleItems.length ? scheduleItems : fallback.scheduleItems,
    dressCodeTitle: String(raw.dressCodeTitle ?? fallback.dressCodeTitle),
    dressCodeBody: String(raw.dressCodeBody ?? fallback.dressCodeBody),
    galleryTitle: String(raw.galleryTitle ?? fallback.galleryTitle),
    galleryImages: asStringArray(raw.galleryImages, fallback.galleryImages),
    qaTitle: String(raw.qaTitle ?? fallback.qaTitle),
    qaItems: qaItems.length ? qaItems : fallback.qaItems,
    travelTitle: String(raw.travelTitle ?? fallback.travelTitle),
    travelBody: String(raw.travelBody ?? fallback.travelBody),
    travelItems: travelItems.length ? travelItems : fallback.travelItems,
    registryTitle: String(raw.registryTitle ?? fallback.registryTitle),
    registryBody: String(raw.registryBody ?? fallback.registryBody),
    registryItems: registryItems.length
      ? registryItems
      : fallback.registryItems,
    rsvpTitle: String(raw.rsvpTitle ?? fallback.rsvpTitle),
    rsvpBody: String(raw.rsvpBody ?? fallback.rsvpBody),
    rsvpUrl: String(raw.rsvpUrl ?? fallback.rsvpUrl ?? ''),
    footerNote: String(raw.footerNote ?? fallback.footerNote),
    sections: asSections(raw.sections, fallback.sections),
    introEnabled: Boolean(raw.introEnabled ?? fallback.introEnabled),
    introTitle: String(raw.introTitle ?? fallback.introTitle),
    musicUrl: String(raw.musicUrl ?? fallback.musicUrl ?? ''),
  };
}

function serialize(
  site: {
    id: string;
    slug: string;
    templateId: string;
    published: boolean;
    content: Prisma.JsonValue;
    updatedAt: Date;
  },
  wedding: {
    partnerOneName: string;
    partnerTwoName: string;
    date: Date;
    city: string;
  },
) {
  const fallback = defaultContent(wedding);
  return {
    id: site.id,
    slug: site.slug,
    templateId: site.templateId,
    published: site.published,
    content: asContent(site.content, fallback),
    updatedAt: site.updatedAt,
    publicPath: `/w/${site.slug}`,
    wedding: {
      partnerOneName: wedding.partnerOneName,
      partnerTwoName: wedding.partnerTwoName,
      date: wedding.date,
      city: wedding.city,
    },
  };
}

@Injectable()
export class WebsiteService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const { wedding } = await requireWeddingForUser(this.prisma, userId);
    const site = await this.prisma.weddingWebsite.findUnique({
      where: { weddingId: wedding.id },
    });
    if (!site) {
      return {
        site: null,
        suggestedSlug: this.suggestSlug(wedding),
        defaults: defaultContent(wedding),
        templates: TEMPLATES_LIST,
      };
    }
    return {
      site: serialize(site, wedding),
      suggestedSlug: site.slug,
      defaults: defaultContent(wedding),
      templates: TEMPLATES_LIST,
    };
  }

  async upsertMine(userId: string, dto: UpsertWeddingWebsiteDto) {
    const { wedding } = await requireWeddingForUser(this.prisma, userId);
    const existing = await this.prisma.weddingWebsite.findUnique({
      where: { weddingId: wedding.id },
    });

    const templateId = dto.templateId ?? existing?.templateId ?? 'classic-white';
    if (!TEMPLATE_IDS.has(templateId)) {
      throw new BadRequestException('Невідомий темплейт');
    }

    const fallback = defaultContent(wedding);
    const content = asContent(
      dto.content ?? existing?.content ?? fallback,
      fallback,
    );

    let slug = (dto.slug ?? existing?.slug ?? this.suggestSlug(wedding))
      .trim()
      .toLowerCase();
    slug = slugify(slug);
    if (slug.length < 2) {
      throw new BadRequestException('Slug занадто короткий');
    }

    const clash = await this.prisma.weddingWebsite.findFirst({
      where: {
        slug,
        ...(existing ? { NOT: { id: existing.id } } : {}),
      },
    });
    if (clash) {
      throw new ConflictException('Цей адрес уже зайнятий');
    }

    const published = dto.published ?? existing?.published ?? false;

    const site = existing
      ? await this.prisma.weddingWebsite.update({
          where: { id: existing.id },
          data: {
            slug,
            templateId,
            published,
            content: content as unknown as Prisma.InputJsonValue,
          },
        })
      : await this.prisma.weddingWebsite.create({
          data: {
            weddingId: wedding.id,
            slug,
            templateId,
            published,
            content: content as unknown as Prisma.InputJsonValue,
          },
        });

    return serialize(site, wedding);
  }

  async getPublicBySlug(slugRaw: string) {
    const slug = slugRaw.trim().toLowerCase();
    const site = await this.prisma.weddingWebsite.findUnique({
      where: { slug },
      include: { wedding: true },
    });
    if (!site || !site.published) {
      throw new NotFoundException('Сайт не знайдено');
    }
    return serialize(site, site.wedding);
  }

  private suggestSlug(wedding: {
    partnerOneName: string;
    partnerTwoName: string;
  }) {
    const base = slugify(
      `${wedding.partnerOneName}-${wedding.partnerTwoName}`,
    );
    return base.length >= 2 ? base : `wedding-${Date.now().toString(36)}`;
  }
}
