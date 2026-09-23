/**
 * Чистить тестове сміття й наповнює локальну БД демо-даними.
 * Запуск: DATABASE_URL=... npm run prisma:seed
 */
import {
  ContentStatus,
  PrismaClient,
  RsvpStatus,
  TaskStatus,
  VendorPipelineStage,
  WeddingMemberRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  CONTENT_KEEP_POST_SLUGS,
  CONTENT_POST_SLUG_ALIASES,
  CONTENT_POSTS_SEED,
  CONTENT_TOPICS_SEED,
  type SeedBlock,
} from '../src/content/content.seed-data';

const prisma = new PrismaClient();

const KEEP_EMAILS = new Set([
  'admin@nitka.local',
  'couple@test.local',
  'reviewer2@demo.local',
  // старий beauty — приберемо окремо
]);

const KEEP_DOMAIN_SUFFIXES = ['@demo.local', '@nitka.local', '@test.local'];

const PASSWORD = 'demo1234';

const GUEST_SEED: Array<{
  name: string;
  email?: string;
  phone?: string;
  side: 'BRIDE' | 'GROOM' | 'BOTH' | 'OTHER';
  rsvpStatus: RsvpStatus;
  plusOne?: boolean;
  plusOneName?: string;
  allergies?: string;
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
  },
  {
    name: 'Ірина Мельник',
    email: 'iryna@example.com',
    side: 'BRIDE',
    rsvpStatus: 'YES',
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
  },
  {
    name: 'Сергій Ткачук',
    side: 'GROOM',
    rsvpStatus: 'YES',
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
  },
  {
    name: 'Дідусь Іван',
    side: 'GROOM',
    rsvpStatus: 'YES',
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
}

async function ensureAdmin(passwordHash: string) {
  await prisma.user.upsert({
    where: { email: 'admin@nitka.local' },
    update: { name: 'Admin', role: 'COUPLE', password: passwordHash },
    create: {
      email: 'admin@nitka.local',
      name: 'Admin',
      role: 'COUPLE',
      password: passwordHash,
    },
  });
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

  const keepPostSlugs = new Set<string>(CONTENT_KEEP_POST_SLUGS);
  const keepTopicSlugs = new Set(CONTENT_TOPICS_SEED.map((t) => t.slug));

  for (const [from, to] of Object.entries(CONTENT_POST_SLUG_ALIASES)) {
    const oldPost = await prisma.contentPost.findUnique({ where: { slug: from } });
    if (!oldPost) continue;
    const taken = await prisma.contentPost.findUnique({ where: { slug: to } });
    if (!taken) {
      await prisma.contentPost.update({
        where: { id: oldPost.id },
        data: { slug: to },
      });
    } else if (taken.id !== oldPost.id) {
      await prisma.contentPost.delete({ where: { id: oldPost.id } });
    }
  }

  const topics = await prisma.contentTopic.findMany();
  const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@nitka.local' },
  });

  for (const seed of CONTENT_POSTS_SEED) {
    if (!keepPostSlugs.has(seed.slug)) continue;
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
        topicId: topic.id,
        authorId: admin?.id ?? null,
        publishedAt: new Date(),
        seoTitle: seed.seoTitle || seed.title,
        seoDescription: seed.seoDescription || seed.excerpt,
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
        topicId: topic.id,
        authorId: admin?.id ?? null,
        publishedAt: new Date(),
        seoTitle: seed.seoTitle || seed.title,
        seoDescription: seed.seoDescription || seed.excerpt,
        body,
      },
    });
  }
  await prisma.contentPost.deleteMany({
    where: { slug: { notIn: [...keepPostSlugs] } },
  });
  await prisma.contentTopic.deleteMany({
    where: { slug: { notIn: [...keepTopicSlugs] } },
  });
  console.log(`content posts: ${keepPostSlugs.size}`);
}

async function seedCoupleExternalVendors(userId: string, city: string) {
  await prisma.externalVendor.deleteMany({ where: { userId } });

  const rows: Array<{
    name: string;
    category: string;
    stage: VendorPipelineStage;
    quotedPrice: number | null;
    phone?: string;
    notes?: string;
  }> = [
    {
      name: 'Студія Світло',
      category: 'photo',
      stage: 'CHOSEN',
      quotedPrice: 42000,
      phone: '+380501234567',
      notes: 'Топ-варіант з бюджету',
    },
    {
      name: 'Ведучий Марко',
      category: 'music',
      stage: 'COMPARED',
      quotedPrice: 25000,
      phone: '+380671234567',
    },
  ];

  for (const row of rows) {
    await prisma.externalVendor.create({
      data: {
        userId,
        name: row.name,
        category: row.category,
        city,
        phone: row.phone ?? null,
        quotedPrice: row.quotedPrice,
        notes: row.notes ?? null,
        stage: row.stage,
      },
    });
  }

  return rows.length;
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
      'Зібрати всі запрошення',
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

  const externalCount = await seedCoupleExternalVendors(couple.id, wedding.city);

  console.log(
    `couple@test.local: guests=${GUEST_SEED.length}, budget=${budgetRows.length}, externalVendors=${externalCount}`,
  );
}

async function main() {
  console.log('→ cleaning junk…');
  await cleanJunk();

  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  await ensureAdmin(passwordHash);

  console.log('→ seeding content…');
  await seedContent();

  console.log('→ seeding couple fixtures…');
  await seedCouple(passwordHash);

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.externalVendor.count(),
    prisma.contentPost.count(),
    prisma.guest.count(),
    prisma.budgetItem.count(),
  ]);
  console.log(
    `done. users=${counts[0]} externalVendors=${counts[1]} posts=${counts[2]} guests=${counts[3]} budgetItems=${counts[4]}`,
  );
  console.log(`логини: couple@test.local / *@demo.local — пароль ${PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
