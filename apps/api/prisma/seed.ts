/**
 * Чистить тестове сміття й наповнює локальну БД демо-даними.
 * Запуск: DATABASE_URL=... npm run prisma:seed
 */
import {
  ContentStatus,
  PrismaClient,
  RsvpStatus,
  TaskStatus,
  WeddingMemberRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  CONTENT_POSTS_SEED,
  CONTENT_TOPICS_SEED,
  type SeedBlock,
} from '../src/content/content.seed-data';

const prisma = new PrismaClient();

const KEEP_EMAILS = new Set([
  'admin@nitka.local',
  'couple@test.local',
  'vendor@test.local',
  'reviewer2@demo.local',
  // старий beauty — приберемо окремо
]);

const KEEP_DOMAIN_SUFFIXES = ['@demo.local', '@nitka.local', '@test.local'];

const PASSWORD = 'demo1234';

const DEFAULT_CATEGORIES = [
  { name: 'Фото', slug: 'photo', description: 'Фотографи та відеографи', sortOrder: 1 },
  { name: 'Локації', slug: 'venue', description: 'Зали, садиби, outdoor', sortOrder: 2 },
  { name: 'Музика', slug: 'music', description: 'DJ, гурти, ведучі', sortOrder: 3 },
  { name: 'Декор', slug: 'decor', description: 'Квіти та оформлення', sortOrder: 4 },
  { name: 'Beauty', slug: 'beauty', description: 'Макіяж і зачіски', sortOrder: 5 },
];

const GUEST_SEED: Array<{
  name: string;
  email?: string;
  phone?: string;
  side: 'BRIDE' | 'GROOM' | 'BOTH' | 'OTHER';
  rsvpStatus: RsvpStatus;
  plusOne?: boolean;
  plusOneName?: string;
  allergies?: string;
  tableLabel?: string;
  notes?: string;
}> = [
  {
    name: 'Олена Коваль',
    email: 'olena@example.com',
    phone: '+380501111001',
    side: 'BRIDE',
    rsvpStatus: 'YES',
    plusOne: true,
    plusOneName: 'Тарас Коваль',
    tableLabel: 'Стіл 1',
  },
  {
    name: 'Ірина Мельник',
    email: 'iryna@example.com',
    side: 'BRIDE',
    rsvpStatus: 'YES',
    tableLabel: 'Стіл 1',
  },
  {
    name: 'Марія Шевченко',
    phone: '+380671111002',
    side: 'BRIDE',
    rsvpStatus: 'MAYBE',
    allergies: 'горіхи',
  },
  {
    name: 'Катерина Бондар',
    side: 'BRIDE',
    rsvpStatus: 'PENDING',
  },
  {
    name: 'Андрій Петренко',
    email: 'andriy@example.com',
    side: 'GROOM',
    rsvpStatus: 'YES',
    plusOne: true,
    plusOneName: 'Наталя',
    tableLabel: 'Стіл 2',
  },
  {
    name: 'Сергій Ткачук',
    side: 'GROOM',
    rsvpStatus: 'YES',
    tableLabel: 'Стіл 2',
  },
  {
    name: 'Дмитро Лисенко',
    side: 'GROOM',
    rsvpStatus: 'NO',
  },
  {
    name: 'Олег Савчук',
    side: 'GROOM',
    rsvpStatus: 'PENDING',
  },
  {
    name: 'Бабуся Галина',
    side: 'BRIDE',
    rsvpStatus: 'YES',
    tableLabel: 'Стіл 3',
  },
  {
    name: 'Дідусь Іван',
    side: 'GROOM',
    rsvpStatus: 'YES',
    tableLabel: 'Стіл 3',
  },
  {
    name: 'Друзі з університету',
    side: 'BOTH',
    rsvpStatus: 'PENDING',
    notes: '4 людини — уточнити імена',
  },
  {
    name: 'Колеги з офісу',
    side: 'BOTH',
    rsvpStatus: 'MAYBE',
  },
  {
    name: 'Хрещені',
    side: 'BOTH',
    rsvpStatus: 'YES',
    plusOne: true,
    tableLabel: 'Стіл 4',
  },
  {
    name: 'Сусідка Оксана',
    side: 'OTHER',
    rsvpStatus: 'PENDING',
  },
  {
    name: 'Вікторія й Роман',
    side: 'BOTH',
    rsvpStatus: 'YES',
    tableLabel: 'Стіл 5',
  },
];

function shouldKeepEmail(email: string) {
  if (KEEP_EMAILS.has(email)) return true;
  if (email === 'beauty.pending@demo.local') return false;
  return KEEP_DOMAIN_SUFFIXES.some((suffix) => email.endsWith(suffix));
}

function richBody(blocks: SeedBlock[]) {
  return {
    time: Date.now(),
    blocks: blocks.map((b, i) => {
      if (b.type === 'header') {
        return {
          id: `h${i}`,
          type: 'header',
          data: { text: b.text, level: b.level ?? 2 },
        };
      }
      if (b.type === 'list') {
        return {
          id: `l${i}`,
          type: 'list',
          data: { style: b.style ?? 'unordered', items: b.items },
        };
      }
      if (b.type === 'quote') {
        return {
          id: `q${i}`,
          type: 'quote',
          data: { text: b.text, caption: b.caption ?? '' },
        };
      }
      return {
        id: `p${i}`,
        type: 'paragraph',
        data: { text: b.text },
      };
    }),
    version: '2.30.0',
  };
}

async function cleanJunk() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  const junk = users.filter((u) => !shouldKeepEmail(u.email));
  for (const user of junk) {
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`deleted junk user ${user.email}`);
  }

  const pendingBeauty = await prisma.user.findUnique({
    where: { email: 'beauty.pending@demo.local' },
  });
  if (pendingBeauty) {
    await prisma.user.delete({ where: { id: pendingBeauty.id } });
    console.log('deleted beauty.pending@demo.local (replaced by beauty.kyiv)');
  }

  // вендори з сміттєвими містами / іменами, якщо лишились
  const badVendors = await prisma.vendor.findMany({
    where: {
      OR: [
        { city: { in: ['іфві', 'test', 'asdf'] } },
        { name: { in: ['фів', 'test', 'asdf'] } },
      ],
    },
    include: { user: true },
  });
  for (const vendor of badVendors) {
    await prisma.user.delete({ where: { id: vendor.userId } });
    console.log(`deleted bad vendor ${vendor.name} / ${vendor.city}`);
  }
}

async function ensureAdmin(passwordHash: string) {
  await prisma.user.upsert({
    where: { email: 'admin@nitka.local' },
    update: { name: 'Admin', role: 'ADMIN', password: passwordHash },
    create: {
      email: 'admin@nitka.local',
      name: 'Admin',
      role: 'ADMIN',
      password: passwordHash,
    },
  });
}

async function ensureCategories() {
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
  }
}

async function seedContent() {
  for (const t of CONTENT_TOPICS_SEED) {
    await prisma.contentTopic.upsert({
      where: { slug: t.slug },
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        icon: t.icon,
        coverUrl: t.coverUrl,
        sortOrder: t.sortOrder,
      },
      update: {
        icon: t.icon,
        coverUrl: t.coverUrl,
        sortOrder: t.sortOrder,
        description: t.description,
      },
    });
  }

  const topics = await prisma.contentTopic.findMany();
  const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@nitka.local' },
  });

  for (const seed of CONTENT_POSTS_SEED) {
    const topic = bySlug[seed.topicSlug];
    if (!topic) continue;
    const body = richBody(seed.blocks);
    await prisma.contentPost.upsert({
      where: { slug: seed.slug },
      create: {
        title: seed.title,
        slug: seed.slug,
        excerpt: seed.excerpt,
        coverUrl: seed.coverUrl,
        ogImageUrl: seed.coverUrl,
        kind: seed.kind,
        status: ContentStatus.PUBLISHED,
        featured: seed.featured ?? false,
        city: seed.city ?? null,
        vendorCategorySlug: seed.vendorCategorySlug ?? null,
        topicId: topic.id,
        authorId: admin?.id ?? null,
        publishedAt: new Date(),
        seoTitle: seed.title,
        seoDescription: seed.excerpt,
        body,
      },
      update: {
        title: seed.title,
        excerpt: seed.excerpt,
        coverUrl: seed.coverUrl,
        ogImageUrl: seed.coverUrl,
        kind: seed.kind,
        status: ContentStatus.PUBLISHED,
        featured: seed.featured ?? false,
        city: seed.city ?? null,
        vendorCategorySlug: seed.vendorCategorySlug ?? null,
        topicId: topic.id,
        authorId: admin?.id ?? null,
        publishedAt: new Date(),
        seoTitle: seed.title,
        seoDescription: seed.excerpt,
        body,
      },
    });
  }
  console.log(`content posts: ${CONTENT_POSTS_SEED.length}`);
}

async function seedCouple(passwordHash: string) {
  const couple = await prisma.user.upsert({
    where: { email: 'couple@test.local' },
    update: {
      name: 'Марія і Андрій',
      role: 'COUPLE',
      password: passwordHash,
    },
    create: {
      email: 'couple@test.local',
      name: 'Марія і Андрій',
      role: 'COUPLE',
      password: passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: 'reviewer2@demo.local' },
    update: {
      name: 'Катя і Саша',
      role: 'COUPLE',
      password: passwordHash,
    },
    create: {
      email: 'reviewer2@demo.local',
      name: 'Катя і Саша',
      role: 'COUPLE',
      password: passwordHash,
    },
  });

  const existing = await prisma.wedding.findUnique({
    where: { userId: couple.id },
  });

  const wedding =
    existing ??
    (await prisma.wedding.create({
      data: {
        userId: couple.id,
        date: new Date('2026-09-20T12:00:00.000Z'),
        city: 'Київ',
        guests: 80,
        budget: 450000,
        partnerOneName: 'Марія',
        partnerTwoName: 'Андрій',
        planningStage: 'PLANNING_WITH_VENUE',
      },
    }));

  await prisma.wedding.update({
    where: { id: wedding.id },
    data: {
      date: new Date('2026-09-20T12:00:00.000Z'),
      city: 'Київ',
      guests: 80,
      budget: 450000,
      partnerOneName: 'Марія',
      partnerTwoName: 'Андрій',
      planningStage: 'PLANNING_WITH_VENUE',
    },
  });

  await prisma.weddingMember.upsert({
    where: { userId: couple.id },
    create: {
      weddingId: wedding.id,
      userId: couple.id,
      role: WeddingMemberRole.OWNER,
    },
    update: {
      weddingId: wedding.id,
      role: WeddingMemberRole.OWNER,
    },
  });

  await prisma.guest.deleteMany({ where: { weddingId: wedding.id } });
  for (const g of GUEST_SEED) {
    await prisma.guest.create({
      data: {
        weddingId: wedding.id,
        name: g.name,
        email: g.email ?? null,
        phone: g.phone ?? null,
        side: g.side,
        rsvpStatus: g.rsvpStatus,
        plusOne: g.plusOne ?? false,
        plusOneName: g.plusOneName ?? null,
        allergies: g.allergies ?? null,
        tableLabel: g.tableLabel ?? null,
        notes: g.notes ?? null,
        respondedAt: g.rsvpStatus === 'PENDING' ? null : new Date(),
      },
    });
  }

  await prisma.budgetItem.deleteMany({ where: { weddingId: wedding.id } });
  const budgetRows = [
    { category: 'venue', title: 'Terrace Loft — оренда', estimated: 70000, actual: 35000, paid: true },
    { category: 'catering', title: 'Банкет 80 осіб', estimated: 160000, actual: 0, paid: false },
    { category: 'photo', title: 'Студія Світло', estimated: 42000, actual: 15000, paid: true },
    { category: 'video', title: 'Відео (резерв)', estimated: 30000, actual: 0, paid: false },
    { category: 'music', title: 'Ведучий Марко', estimated: 25000, actual: 10000, paid: true },
    { category: 'decor', title: 'Ательє Пелюстка', estimated: 45000, actual: 0, paid: false },
    { category: 'beauty', title: 'Studio Glow', estimated: 15000, actual: 0, paid: false },
    { category: 'attire', title: 'Сукня + костюм', estimated: 40000, actual: 20000, paid: true },
    { category: 'rings', title: 'Обручки', estimated: 18000, actual: 18000, paid: true },
    { category: 'transport', title: 'Трансфер гостей', estimated: 8000, actual: 0, paid: false },
    { category: 'reserve', title: 'Резерв', estimated: 30000, actual: 0, paid: false },
  ];
  for (const row of budgetRows) {
    await prisma.budgetItem.create({ data: { weddingId: wedding.id, ...row } });
  }

  // трохи задач з різними статусами
  const tasks = await prisma.task.findMany({ where: { weddingId: wedding.id } });
  if (tasks.length === 0) {
    const defaults = [
      'Обрати дату весілля',
      'Знайти та зберегти локації',
      'Почати список гостей',
      'Скласти бюджет',
      'Знайти фотографа',
      'Знайти музику / DJ',
      'Обрати флористику та декор',
      'Запланувати beauty-проби',
      'Надіслати запрошення гостям',
      'Зібрати всі RSVP',
    ];
    for (const [index, title] of defaults.entries()) {
      await prisma.task.create({
        data: {
          weddingId: wedding.id,
          title,
          sortOrder: index,
          status:
            index < 3
              ? TaskStatus.DONE
              : index < 6
                ? TaskStatus.IN_PROGRESS
                : TaskStatus.TODO,
          isCustom: false,
        },
      });
    }
  } else {
    for (const [index, task] of tasks.slice(0, 6).entries()) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status:
            index < 2
              ? TaskStatus.DONE
              : index < 4
                ? TaskStatus.IN_PROGRESS
                : task.status,
        },
      });
    }
  }

  // favorites на пару approved вендорів
  const vendors = await prisma.vendor.findMany({
    where: { status: 'APPROVED' },
    take: 5,
    orderBy: { rating: 'desc' },
  });
  await prisma.favorite.deleteMany({ where: { userId: couple.id } });
  for (const [index, vendor] of vendors.entries()) {
    await prisma.favorite.create({
      data: {
        userId: couple.id,
        vendorId: vendor.id,
        stage: index === 0 ? 'CHOSEN' : index < 3 ? 'COMPARED' : 'SAVED',
        notes: index === 0 ? 'Топ-варіант' : null,
      },
    });
  }

  console.log(
    `couple@test.local: guests=${GUEST_SEED.length}, budget=${budgetRows.length}, favorites=${vendors.length}`,
  );
}

async function seedVendorTest(passwordHash: string) {
  const category = await prisma.category.findUnique({ where: { slug: 'photo' } });
  if (!category) return;

  const user = await prisma.user.upsert({
    where: { email: 'vendor@test.local' },
    update: {
      name: 'Photo Pro',
      role: 'VENDOR',
      password: passwordHash,
    },
    create: {
      email: 'vendor@test.local',
      name: 'Photo Pro',
      role: 'VENDOR',
      password: passwordHash,
    },
  });

  const existing = await prisma.vendor.findUnique({ where: { userId: user.id } });
  if (!existing) {
    await prisma.vendor.create({
      data: {
        userId: user.id,
        name: 'Photo Pro',
        slug: 'photo-pro',
        tagline: 'Тестовий профіль підрядника',
        description:
          'Демо-профіль для логіну vendor@test.local. Репортажна зйомка в Києві.',
        categoryId: category.id,
        city: 'Київ',
        priceFrom: 18000,
        priceTo: 36000,
        rating: 4.5,
        status: 'APPROVED',
        featured: false,
        phone: '+380501000000',
        styles: ['репортаж', 'тест'],
        photos: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
              order: 0,
            },
          ],
        },
        packages: {
          create: [
            {
              title: 'Тестовий пакет',
              price: 18000,
              description: '6 годин',
              includes: 'Фото · галерея',
              order: 0,
            },
          ],
        },
      },
    });
  } else {
    await prisma.vendor.update({
      where: { id: existing.id },
      data: { status: 'APPROVED', city: 'Київ', name: 'Photo Pro' },
    });
  }
}

async function main() {
  console.log('→ cleaning junk…');
  await cleanJunk();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  await ensureAdmin(passwordHash);
  await ensureCategories();

  console.log('→ seeding content…');
  await seedContent();

  console.log('→ seeding couple fixtures…');
  await seedCouple(passwordHash);

  console.log('→ seeding vendor@test.local…');
  await seedVendorTest(passwordHash);

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.contentPost.count(),
    prisma.guest.count(),
    prisma.budgetItem.count(),
  ]);
  console.log(
    `done. users=${counts[0]} vendors=${counts[1]} posts=${counts[2]} guests=${counts[3]} budgetItems=${counts[4]}`,
  );
  console.log(`логини: couple@test.local / vendor@test.local / *@demo.local — пароль ${PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
