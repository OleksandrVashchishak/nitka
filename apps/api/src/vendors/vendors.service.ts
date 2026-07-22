import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpsertVendorProfileDto } from './dto/upsert-vendor-profile.dto';

type VendorFilters = {
  category?: string;
  city?: string;
  price?: number;
  rating?: number;
  q?: string;
  style?: string;
  sort?: string;
  featured?: boolean;
};

const DEMO_VENDORS = [
  {
    email: 'photo.kyiv@demo.local',
    name: 'Студія Світло',
    description:
      'Репортажна та художня зйомка весіль. Працюємо спокійно, щоб ви просто насолоджувались днем.',
    categorySlug: 'photo',
    city: 'Київ',
    priceFrom: 28000,
    priceTo: 55000,
    rating: 4.9,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380501112233',
    website: 'https://example.com/svitlo',
    instagram: 'svitlo.studio',
    address: 'вул. Хрещатик, 22',
    yearsInBusiness: 8,
    styles: ['репортаж', 'художній', 'мінімалізм'],
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80',
    ],
    packages: [
      {
        title: 'День із нами',
        price: 28000,
        description: '8 годин зйомки',
        includes: 'Фотограф · 400+ фото · онлайн-галерея',
      },
      {
        title: 'Повний день',
        price: 42000,
        description: '12 годин + вторий стрілець',
        includes: '2 фотографи · альбом · teaser-відео',
      },
    ],
    faqs: [
      {
        question: 'Чи працюєте поза Києвом?',
        answer: 'Так, виїзд по Україні. Дорога обговорюється окремо.',
      },
      {
        question: 'Коли готові фото?',
        answer: 'Превʼю за 7 днів, повна галерея до 6 тижнів.',
      },
    ],
  },
  {
    email: 'venue.lviv@demo.local',
    name: 'Садиба Олива',
    description:
      'Заміська локація з терасою, садом і залом на 120 гостей. Ідеально для теплого вечора.',
    categorySlug: 'venue',
    city: 'Львів',
    priceFrom: 65000,
    priceTo: 120000,
    rating: 4.8,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380671234567',
    instagram: 'olyva.estate',
    address: 'с. Підгірці, Львівська обл.',
    yearsInBusiness: 5,
    styles: ['заміська', 'сад', 'романтичний'],
    photos: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80&sat=-20',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Оренда залу',
        price: 65000,
        description: 'До 80 гостей',
        includes: 'Зал · тераса · координатор на день',
      },
      {
        title: 'Велике свято',
        price: 95000,
        description: 'До 120 гостей',
        includes: 'Зал · сад · паркінг · генератор',
      },
    ],
    faqs: [
      {
        question: 'Чи можна свою кейтеринг-команду?',
        answer: 'Так, працюємо з перевіреними партнерами або вашими.',
      },
    ],
  },
  {
    email: 'dj.odesa@demo.local',
    name: 'DJ Horizon',
    description:
      'Живий сет під настрій пари. Від тихої церемонії до танцполу до останнього треку.',
    categorySlug: 'music',
    city: 'Одеса',
    priceFrom: 18000,
    priceTo: 35000,
    rating: 4.7,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380931112244',
    instagram: 'dj.horizon',
    yearsInBusiness: 6,
    styles: ['вечірка', 'live', 'електро'],
    photos: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Вечір',
        price: 18000,
        description: '5 годин',
        includes: 'DJ · світло · мікрофон для тостів',
      },
    ],
    faqs: [
      {
        question: 'Чи є своя апаратура?',
        answer: 'Так, повний комплект під зал до 200 людей.',
      },
    ],
  },
  {
    email: 'decor.kyiv@demo.local',
    name: 'Ательє Пелюстка',
    description:
      'Квіткові композиції та декор залу. Працюємо з натуральними текстурами і мʼякими відтінками.',
    categorySlug: 'decor',
    city: 'Київ',
    priceFrom: 22000,
    priceTo: 80000,
    rating: 4.9,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380501112233',
    website: 'https://example.com/peliustka',
    instagram: 'peliustka.atelier',
    address: 'Київ, Поділ',
    yearsInBusiness: 7,
    styles: ['романтичний', 'натуральний', 'мінімалізм'],
    photos: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Церемонія',
        price: 22000,
        description: 'Арка + букет',
        includes: 'Арка · букет нареченої · бутоньєрка',
      },
      {
        title: 'Повний декор',
        price: 55000,
        description: 'Церемонія + зал',
        includes: 'Арка · столи · президія · інсталяції',
      },
    ],
    faqs: [
      {
        question: 'Які квіти використовуєте?',
        answer: 'Сезонні локальні та імпорт — під ваш палітру.',
      },
    ],
  },
  {
    email: 'beauty.pending@demo.local',
    name: 'Studio Glow',
    description:
      'Весільний макіяж і зачіски. Новий профіль — чекає на модерацію.',
    categorySlug: 'beauty',
    city: 'Київ',
    priceFrom: 12000,
    priceTo: 25000,
    rating: 0,
    status: 'PENDING' as const,
    featured: false,
    phone: '+380661234567',
    styles: ['natural', 'гламур'],
    photos: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Наречена',
        price: 12000,
        description: 'Макіяж + зачіска',
        includes: 'Пробний образ · день весілля',
      },
    ],
    faqs: [],
  },
];

const DEMO_PROFILE_EXTRAS: Record<
  string,
  {
    tagline: string;
    teamSize: number;
    responseTime: string;
    bookingLeadTime: string;
    availabilityNote: string;
    dealTitle?: string;
    dealDescription?: string;
    services: string[];
    serviceAreas: string[];
    languages: string[];
    team: Array<{ name: string; role: string; bio: string; photoUrl?: string }>;
  }
> = {
  'photo.kyiv@demo.local': {
    tagline: 'Живі весільні історії без зайвої постановки',
    teamSize: 4,
    responseTime: 'протягом 2 годин',
    bookingLeadTime: 'за 6–12 місяців',
    availabilityNote:
      'Відкрито бронювання на 2027 рік. На осінь 2026 залишилось кілька вільних пʼятниць і неділь.',
    dealTitle: 'Love story у подарунок',
    dealDescription: 'Для пар, які бронюють повний день до кінця місяця.',
    services: [
      'Повний весільний день',
      'Love story',
      'Другий фотограф',
      'Онлайн-галерея',
      'Весільний альбом',
      'Експрес-превʼю',
    ],
    serviceAreas: ['Київ', 'Київська область', 'вся Україна'],
    languages: ['українська', 'англійська'],
    team: [
      {
        name: 'Марія Світло',
        role: 'Засновниця · фотографка',
        bio: 'Знімає весілля 8 років і полює не за позами, а за справжніми реакціями.',
        photoUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
      },
      {
        name: 'Андрій',
        role: 'Фотограф · відеограф',
        bio: 'Відповідає за репортаж, дрон і кадри, які зазвичай ніхто не помічає.',
        photoUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
      },
    ],
  },
  'venue.lviv@demo.local': {
    tagline: 'Сад, тераса і тепле світло для вашого вечора',
    teamSize: 12,
    responseTime: 'протягом дня',
    bookingLeadTime: 'за 8–14 місяців',
    availabilityNote:
      'Проводимо події з квітня до жовтня. Суботи літа 2027 уже активно бронюють.',
    services: [
      'Оренда залу',
      'Церемонія в саду',
      'Кейтеринг',
      'Координатор події',
      'Паркінг',
      'Резервне живлення',
    ],
    serviceAreas: ['Львів', 'Львівська область'],
    languages: ['українська', 'англійська', 'польська'],
    team: [
      {
        name: 'Олена',
        role: 'Менеджерка подій',
        bio: 'Веде пару від першого перегляду локації до останнього гостя.',
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      },
    ],
  },
  'dj.odesa@demo.local': {
    tagline: 'Музика під вашу історію, а не типовий весільний плейлист',
    teamSize: 2,
    responseTime: 'протягом 3 годин',
    bookingLeadTime: 'за 4–8 місяців',
    availabilityNote:
      'Працюємо цілий рік. Для літніх субот краще писати щонайменше за 6 місяців.',
    services: [
      'DJ-сет',
      'Звук для церемонії',
      'Світло',
      'Мікрофони',
      'Підготовка плейлиста',
    ],
    serviceAreas: ['Одеса', 'південь України', 'виїзд по Україні'],
    languages: ['українська', 'англійська'],
    team: [
      {
        name: 'Макс Horizon',
        role: 'DJ · музичний продюсер',
        bio: 'Будує сет навколо смаку пари й читає танцпол без заготовлених сценаріїв.',
      },
    ],
  },
  'decor.kyiv@demo.local': {
    tagline: 'Флористика й декор, що виглядають природно',
    teamSize: 6,
    responseTime: 'протягом дня',
    bookingLeadTime: 'за 5–10 місяців',
    availabilityNote:
      'Беремо до чотирьох великих проєктів на місяць, щоб не втрачати якість.',
    dealTitle: 'Ескіз концепції безкоштовно',
    dealDescription: 'Після першої зустрічі та підтвердження дати.',
    services: [
      'Букет нареченої',
      'Арка церемонії',
      'Декор столів',
      'Президія',
      'Фотозона',
      'Монтаж і демонтаж',
    ],
    serviceAreas: ['Київ', 'Київська область'],
    languages: ['українська', 'англійська'],
    team: [
      {
        name: 'Софія',
        role: 'Засновниця · флористка',
        bio: 'Поєднує сезонні квіти, фактури та простір так, щоб декор не сперечався з локацією.',
        photoUrl:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
      },
    ],
  },
};

const vendorListInclude = {
  category: true,
  photos: { orderBy: { order: 'asc' as const }, take: 1 },
  _count: { select: { reviews: true } },
};

const vendorDetailInclude = {
  category: true,
  photos: { orderBy: { order: 'asc' as const } },
  packages: { orderBy: { order: 'asc' as const } },
  faqs: { orderBy: { order: 'asc' as const } },
  team: { orderBy: { order: 'asc' as const } },
  reviews: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' as const },
  },
  _count: { select: { reviews: true } },
};

@Injectable()
export class VendorsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const demo of DEMO_VENDORS) {
      const category = await this.prisma.category.findUnique({
        where: { slug: demo.categorySlug },
      });
      if (!category) continue;

      let user = await this.prisma.user.findUnique({
        where: { email: demo.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: demo.email,
            name: demo.name,
            password: await bcrypt.hash('demo1234', 10),
            role: 'VENDOR',
          },
        });
      }

      const existing = await this.prisma.vendor.findUnique({
        where: { userId: user.id },
        include: { _count: { select: { packages: true } } },
      });

      if (!existing) {
        await this.prisma.vendor.create({
          data: {
            userId: user.id,
            name: demo.name,
            description: demo.description,
            categoryId: category.id,
            city: demo.city,
            priceFrom: demo.priceFrom,
            priceTo: demo.priceTo,
            rating: demo.rating,
            status: demo.status,
            featured: demo.featured,
            phone: demo.phone,
            website: demo.website,
            instagram: demo.instagram,
            address: demo.address,
            yearsInBusiness: demo.yearsInBusiness,
            styles: demo.styles,
            photos: {
              create: demo.photos.map((url, order) => ({ url, order })),
            },
            packages: {
              create: demo.packages.map((pkg, order) => ({
                ...pkg,
                order,
              })),
            },
            faqs: {
              create: demo.faqs.map((faq, order) => ({ ...faq, order })),
            },
          },
        });
        continue;
      }

      if (existing._count.packages === 0) {
        await this.prisma.vendor.update({
          where: { id: existing.id },
          data: {
            priceTo: demo.priceTo,
            featured: demo.featured,
            phone: demo.phone,
            website: demo.website,
            instagram: demo.instagram,
            address: demo.address,
            yearsInBusiness: demo.yearsInBusiness,
            styles: demo.styles,
            packages: {
              create: demo.packages.map((pkg, order) => ({
                ...pkg,
                order,
              })),
            },
            faqs: {
              create: demo.faqs.map((faq, order) => ({ ...faq, order })),
            },
          },
        });
      }
    }

    for (const [email, extra] of Object.entries(DEMO_PROFILE_EXTRAS)) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) continue;
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId: user.id },
        include: {
          team: true,
          packages: { orderBy: { order: 'asc' } },
          photos: { orderBy: { order: 'asc' } },
        },
      });
      if (!vendor) continue;

      await this.prisma.vendor.update({
        where: { id: vendor.id },
        data: {
          tagline: extra.tagline,
          teamSize: extra.teamSize,
          responseTime: extra.responseTime,
          bookingLeadTime: extra.bookingLeadTime,
          availabilityNote: extra.availabilityNote,
          dealTitle: extra.dealTitle ?? null,
          dealDescription: extra.dealDescription ?? null,
          services: extra.services,
          serviceAreas: extra.serviceAreas,
          languages: extra.languages,
          ...(vendor.team.length === 0
            ? {
                team: {
                  create: extra.team.map((member, order) => ({
                    ...member,
                    order,
                  })),
                },
              }
            : {}),
        },
      });

      for (const [index, pkg] of vendor.packages.entries()) {
        await this.prisma.vendorPackage.update({
          where: { id: pkg.id },
          data: {
            duration: pkg.duration || (index === 0 ? '8 годин' : '12 годин'),
            isPopular: index === Math.min(1, vendor.packages.length - 1),
          },
        });
      }

      const demo = DEMO_VENDORS.find((item) => item.email === email);
      if (demo) {
        const knownUrls = new Set(vendor.photos.map((photo) => photo.url));
        const missing = demo.photos.filter((url) => !knownUrls.has(url));
        if (missing.length) {
          await this.prisma.vendorPhoto.createMany({
            data: missing.map((url, index) => ({
              vendorId: vendor.id,
              url,
              order: vendor.photos.length + index,
            })),
          });
        }
      }
    }
  }

  findAll(filters: VendorFilters) {
    const orderBy = this.resolveSort(filters.sort);

    return this.prisma.vendor.findMany({
      where: {
        status: 'APPROVED',
        ...(filters.featured ? { featured: true } : {}),
        ...(filters.city
          ? { city: { equals: filters.city, mode: 'insensitive' } }
          : {}),
        ...(filters.price ? { priceFrom: { lte: filters.price } } : {}),
        ...(filters.rating ? { rating: { gte: filters.rating } } : {}),
        ...(filters.category
          ? { category: { slug: filters.category } }
          : {}),
        ...(filters.style ? { styles: { has: filters.style } } : {}),
        ...(filters.q
          ? {
              OR: [
                { name: { contains: filters.q, mode: 'insensitive' } },
                { description: { contains: filters.q, mode: 'insensitive' } },
                { city: { contains: filters.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: vendorListInclude,
      orderBy,
    });
  }

  private resolveSort(
    sort?: string,
  ): Prisma.VendorOrderByWithRelationInput[] {
    switch (sort) {
      case 'price_asc':
        return [{ priceFrom: 'asc' }, { rating: 'desc' }];
      case 'price_desc':
        return [{ priceFrom: 'desc' }, { rating: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      case 'rating':
      default:
        return [{ featured: 'desc' }, { rating: 'desc' }, { name: 'asc' }];
    }
  }

  async getFilterOptions() {
    const vendors = await this.prisma.vendor.findMany({
      where: { status: 'APPROVED' },
      select: { city: true, priceFrom: true, styles: true },
    });

    const cities = [...new Set(vendors.map((v) => v.city))].sort((a, b) =>
      a.localeCompare(b, 'uk'),
    );
    const styles = [
      ...new Set(vendors.flatMap((v) => v.styles)),
    ].sort((a, b) => a.localeCompare(b, 'uk'));
    const maxPrice = vendors.reduce(
      (max, v) => Math.max(max, v.priceFrom),
      0,
    );

    return {
      cities,
      styles,
      maxPrice: maxPrice || 100000,
      ratings: [4.5, 4, 3.5, 3],
      sorts: [
        { value: 'rating', label: 'За рейтингом' },
        { value: 'price_asc', label: 'Ціна ↑' },
        { value: 'price_desc', label: 'Ціна ↓' },
        { value: 'newest', label: 'Нові' },
      ],
    };
  }

  async findOne(
    id: string,
    viewer?: { ip?: string | null; userAgent?: string },
  ) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, status: 'APPROVED' },
      include: vendorDetailInclude,
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    void this.recordView(vendor.id, viewer).catch(() => undefined);

    const similar = await this.prisma.vendor.findMany({
      where: {
        status: 'APPROVED',
        id: { not: vendor.id },
        OR: [
          { categoryId: vendor.categoryId, city: vendor.city },
          { categoryId: vendor.categoryId },
        ],
      },
      include: vendorListInclude,
      take: 4,
      orderBy: [{ rating: 'desc' }],
    });

    return { ...vendor, similar };
  }

  private async recordView(
    vendorId: string,
    viewer?: { ip?: string | null; userAgent?: string },
  ) {
    const day = new Date().toISOString().slice(0, 10);
    const raw = `${viewer?.ip || 'unknown'}|${viewer?.userAgent || ''}|${day}`;
    const { createHash } = await import('crypto');
    const viewerKey = createHash('sha256')
      .update(raw)
      .digest('hex')
      .slice(0, 32);

    await this.prisma.vendorView.upsert({
      where: {
        vendorId_viewerKey: { vendorId, viewerKey },
      },
      create: { vendorId, viewerKey },
      update: {},
    });
  }

  getMine(userId: string) {
    return this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        category: true,
        photos: { orderBy: { order: 'asc' } },
        packages: { orderBy: { order: 'asc' } },
        faqs: { orderBy: { order: 'asc' } },
        team: { orderBy: { order: 'asc' } },
      },
    });
  }

  async upsertMine(userId: string, data: UpsertVendorProfileDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Категорію не знайдено');
    }

    const existing = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    const baseData = {
      name: data.name.trim(),
      tagline: data.tagline?.trim() || '',
      description: data.description.trim(),
      categoryId: data.categoryId,
      city: data.city.trim(),
      priceFrom: data.priceFrom,
      priceTo: data.priceTo ?? null,
      phone: data.phone?.trim() || null,
      website: data.website?.trim() || null,
      instagram: data.instagram?.trim() || null,
      address: data.address?.trim() || null,
      yearsInBusiness: data.yearsInBusiness ?? null,
      teamSize: data.teamSize ?? null,
      responseTime: data.responseTime?.trim() || null,
      bookingLeadTime: data.bookingLeadTime?.trim() || null,
      availabilityNote: data.availabilityNote?.trim() || '',
      videoUrl: data.videoUrl?.trim() || null,
      dealTitle: data.dealTitle?.trim() || null,
      dealDescription: data.dealDescription?.trim() || null,
      styles: (data.styles ?? [])
        .map((s) => s.trim())
        .filter(Boolean),
      services: (data.services ?? [])
        .map((s) => s.trim())
        .filter(Boolean),
      serviceAreas: (data.serviceAreas ?? [])
        .map((s) => s.trim())
        .filter(Boolean),
      languages: (data.languages ?? [])
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (existing) {
      if (data.photoUrls) {
        await this.prisma.vendorPhoto.deleteMany({
          where: { vendorId: existing.id },
        });
      }
      if (data.packages) {
        await this.prisma.vendorPackage.deleteMany({
          where: { vendorId: existing.id },
        });
      }
      if (data.faqs) {
        await this.prisma.vendorFaq.deleteMany({
          where: { vendorId: existing.id },
        });
      }
      if (data.team) {
        await this.prisma.vendorTeamMember.deleteMany({
          where: { vendorId: existing.id },
        });
      }

      return this.prisma.vendor.update({
        where: { userId },
        data: {
          ...baseData,
          ...(data.photoUrls
            ? {
                photos: {
                  create: data.photoUrls.map((url, order) => ({
                    url,
                    order,
                  })),
                },
              }
            : {}),
          ...(data.packages
            ? {
                packages: {
                  create: data.packages.map((pkg, order) => ({
                    title: pkg.title.trim(),
                    price: pkg.price,
                    description: pkg.description?.trim() || '',
                    includes: pkg.includes?.trim() || '',
                    duration: pkg.duration?.trim() || '',
                    isPopular: pkg.isPopular ?? false,
                    order,
                  })),
                },
              }
            : {}),
          ...(data.faqs
            ? {
                faqs: {
                  create: data.faqs.map((faq, order) => ({
                    question: faq.question.trim(),
                    answer: faq.answer.trim(),
                    order,
                  })),
                },
              }
            : {}),
          ...(data.team
            ? {
                team: {
                  create: data.team.map((member, order) => ({
                    name: member.name.trim(),
                    role: member.role.trim(),
                    bio: member.bio?.trim() || '',
                    photoUrl: member.photoUrl?.trim() || null,
                    order,
                  })),
                },
              }
            : {}),
        },
        include: {
          category: true,
          photos: { orderBy: { order: 'asc' } },
          packages: { orderBy: { order: 'asc' } },
          faqs: { orderBy: { order: 'asc' } },
          team: { orderBy: { order: 'asc' } },
        },
      });
    }

    return this.prisma.vendor.create({
      data: {
        userId,
        ...baseData,
        status: 'PENDING',
        photos: data.photoUrls?.length
          ? {
              create: data.photoUrls.map((url, order) => ({
                url,
                order,
              })),
            }
          : undefined,
        packages: data.packages?.length
          ? {
              create: data.packages.map((pkg, order) => ({
                title: pkg.title.trim(),
                price: pkg.price,
                description: pkg.description?.trim() || '',
                includes: pkg.includes?.trim() || '',
                duration: pkg.duration?.trim() || '',
                isPopular: pkg.isPopular ?? false,
                order,
              })),
            }
          : undefined,
        faqs: data.faqs?.length
          ? {
              create: data.faqs.map((faq, order) => ({
                question: faq.question.trim(),
                answer: faq.answer.trim(),
                order,
              })),
            }
          : undefined,
        team: data.team?.length
          ? {
              create: data.team.map((member, order) => ({
                name: member.name.trim(),
                role: member.role.trim(),
                bio: member.bio?.trim() || '',
                photoUrl: member.photoUrl?.trim() || null,
                order,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        photos: { orderBy: { order: 'asc' } },
        packages: { orderBy: { order: 'asc' } },
        faqs: { orderBy: { order: 'asc' } },
        team: { orderBy: { order: 'asc' } },
      },
    });
  }
}
