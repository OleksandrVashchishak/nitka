import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { slugify } from '../common/slug';
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
    email: 'beauty.kyiv@demo.local',
    name: 'Studio Glow',
    description:
      'Весільний макіяж і зачіски: натуральний і вечірній образ, пробні виходи, виїзд на локацію.',
    categorySlug: 'beauty',
    city: 'Київ',
    priceFrom: 12000,
    priceTo: 25000,
    rating: 4.8,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380661234567',
    instagram: 'studio.glow.kyiv',
    yearsInBusiness: 4,
    styles: ['natural', 'гламур', 'мʼякий'],
    photos: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Наречена',
        price: 12000,
        description: 'Макіяж + зачіска',
        includes: 'Пробний образ · день весілля',
      },
      {
        title: 'Наречена + свідки',
        price: 18000,
        description: 'До 3 образів',
        includes: 'Пробний · день Х · фіксація зачіски',
      },
    ],
    faqs: [
      {
        question: 'Чи їздите на локацію?',
        answer: 'Так, у межах Києва та області. Виїзд за місто — за домовленістю.',
      },
    ],
  },
  {
    email: 'photo.lviv@demo.local',
    name: 'Кадр і Тінь',
    description:
      'Весільна фотозйомка у Львові: репортаж старим містом, заміські садиби, спокійний таймінг.',
    categorySlug: 'photo',
    city: 'Львів',
    priceFrom: 24000,
    priceTo: 48000,
    rating: 4.8,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380671001122',
    instagram: 'kadr.itin',
    yearsInBusiness: 6,
    styles: ['репортаж', 'плівковий вайб', 'місто'],
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
    ],
    packages: [
      {
        title: 'День',
        price: 24000,
        description: '8 годин',
        includes: 'Фотограф · 350+ фото · галерея',
      },
      {
        title: 'Повний день',
        price: 38000,
        description: '12 годин',
        includes: '2 фотографи · альбом · love story',
      },
    ],
    faqs: [
      {
        question: 'Чи знімаєте в центрі Львова?',
        answer: 'Так, знаємо тихі дворики й маршрути без натовпу.',
      },
    ],
  },
  {
    email: 'photo.odesa@demo.local',
    name: 'Світло моря',
    description:
      'Весільні історії біля моря: золота година, відкриті майданчики, легка постановка.',
    categorySlug: 'photo',
    city: 'Одеса',
    priceFrom: 26000,
    priceTo: 52000,
    rating: 4.9,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380931223344',
    instagram: 'svitlo.morya',
    yearsInBusiness: 7,
    styles: ['море', 'світло', 'lifestyle'],
    photos: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Захід сонця',
        price: 26000,
        description: '6 годин',
        includes: 'Золота година · галерея · превʼю 48 год',
      },
    ],
    faqs: [],
  },
  {
    email: 'photo.kharkiv@demo.local',
    name: 'Плівка Харків',
    description:
      'Репортаж і портрети для камерних і великих весіль у Харкові та області.',
    categorySlug: 'photo',
    city: 'Харків',
    priceFrom: 22000,
    priceTo: 45000,
    rating: 4.7,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380501445566',
    instagram: 'plivka.kh',
    yearsInBusiness: 5,
    styles: ['репортаж', 'портрет', 'documentary'],
    photos: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Базовий день',
        price: 22000,
        description: '8 годин',
        includes: 'Фотограф · онлайн-галерея',
      },
    ],
    faqs: [],
  },
  {
    email: 'venue.kyiv@demo.local',
    name: 'Terrace Loft',
    description:
      'Лофт із терасою в Києві: панорамні вікна, білий зал на 90 гостей, окрема зона церемонії.',
    categorySlug: 'venue',
    city: 'Київ',
    priceFrom: 70000,
    priceTo: 140000,
    rating: 4.8,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380441112233',
    instagram: 'terrace.loft.kyiv',
    address: 'Київ, Поділ',
    yearsInBusiness: 4,
    styles: ['лофт', 'міський', 'мінімалізм'],
    photos: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1478144592103-25e218a04891?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Оренда залу',
        price: 70000,
        description: 'До 90 гостей',
        includes: 'Зал · тераса · координатор',
      },
      {
        title: 'Зал + кейтеринг-партнер',
        price: 110000,
        description: 'Пакет із кухнею',
        includes: 'Зал · меню · сервіс',
      },
    ],
    faqs: [
      {
        question: 'Чи є план B на дощ?',
        answer: 'Так, церемонію можна перенести в зал без доплати.',
      },
    ],
  },
  {
    email: 'venue.odesa@demo.local',
    name: 'Villa Aurora',
    description:
      'Садиба біля Одеси з видом і садом. Ідеально для літніх весіль і заходу сонця.',
    categorySlug: 'venue',
    city: 'Одеса',
    priceFrom: 80000,
    priceTo: 150000,
    rating: 4.9,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380487778899',
    instagram: 'villa.aurora.odesa',
    yearsInBusiness: 6,
    styles: ['сад', 'море', 'outdoor'],
    photos: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    ],
    packages: [
      {
        title: 'День у віллі',
        price: 80000,
        description: 'До 100 гостей',
        includes: 'Сад · зал · паркінг',
      },
    ],
    faqs: [],
  },
  {
    email: 'venue.dnipro@demo.local',
    name: 'Riverside Hall',
    description:
      'Сучасний зал у Дніпрі біля води: світлий інтерʼєр, сцена, зручна логістика для гостей.',
    categorySlug: 'venue',
    city: 'Дніпро',
    priceFrom: 55000,
    priceTo: 110000,
    rating: 4.6,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380567001100',
    instagram: 'riverside.hall.dp',
    yearsInBusiness: 3,
    styles: ['сучасний', 'міський', 'river'],
    photos: [
      'https://images.unsplash.com/photo-1478144592103-25e218a04891?w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Банкет',
        price: 55000,
        description: 'До 120 гостей',
        includes: 'Зал · сцена · гримерка',
      },
    ],
    faqs: [],
  },
  {
    email: 'music.kyiv@demo.local',
    name: 'Ведучий Марко',
    description:
      'Теплий ведучий без кринжу: живий сценарій під вашу пару, таймінг із фото і локацією.',
    categorySlug: 'music',
    city: 'Київ',
    priceFrom: 20000,
    priceTo: 40000,
    rating: 4.9,
    status: 'APPROVED' as const,
    featured: true,
    phone: '+380501998877',
    instagram: 'veduchyi.marko',
    yearsInBusiness: 9,
    styles: ['warm', 'інтерактив', 'без пафосу'],
    photos: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Вечір',
        price: 20000,
        description: '6 годин',
        includes: 'Сценарій · мікрофон · таймінг',
      },
      {
        title: 'Повний день',
        price: 32000,
        description: 'Церемонія + банкет',
        includes: 'Ведучий · координація моментів',
      },
    ],
    faqs: [],
  },
  {
    email: 'music.lviv@demo.local',
    name: 'Band Evening',
    description:
      'Кавер-бенд зі Львова: перший танець, live-блоки й танцпол до останнього треку.',
    categorySlug: 'music',
    city: 'Львів',
    priceFrom: 35000,
    priceTo: 70000,
    rating: 4.8,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380671223344',
    instagram: 'band.evening.lviv',
    yearsInBusiness: 8,
    styles: ['live', 'кавери', 'вечірка'],
    photos: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Live 3 години',
        price: 35000,
        description: 'Ключові моменти',
        includes: '4 музиканти · звук',
      },
      {
        title: 'Live + DJ',
        price: 55000,
        description: 'Вечір під ключ',
        includes: 'Бенд · DJ · світло',
      },
    ],
    faqs: [],
  },
  {
    email: 'decor.lviv@demo.local',
    name: 'Квіткова Майстерня',
    description:
      'Сезонна флористика у Львові: арки, столи, букети з фактурою й без візуального шуму.',
    categorySlug: 'decor',
    city: 'Львів',
    priceFrom: 18000,
    priceTo: 65000,
    rating: 4.7,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380672334455',
    instagram: 'kvitkova.maisternia',
    yearsInBusiness: 5,
    styles: ['сезонний', 'сад', 'текстури'],
    photos: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Церемонія',
        price: 18000,
        description: 'Арка + букет',
        includes: 'Арка · букет · бутоньєрка',
      },
      {
        title: 'Зал',
        price: 45000,
        description: 'Повний декор',
        includes: 'Столи · президія · монтаж',
      },
    ],
    faqs: [],
  },
  {
    email: 'decor.odesa@demo.local',
    name: 'Salt & Bloom',
    description:
      'Декор для одеських локацій: вітер, світло, легкі тканини й сезонні квіти.',
    categorySlug: 'decor',
    city: 'Одеса',
    priceFrom: 20000,
    priceTo: 75000,
    rating: 4.8,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380931556677',
    instagram: 'salt.and.bloom',
    yearsInBusiness: 4,
    styles: ['легкий', 'море', 'романтичний'],
    photos: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Церемонія на повітрі',
        price: 25000,
        description: 'З урахуванням вітру',
        includes: 'Арка · якір · букет',
      },
    ],
    faqs: [],
  },
  {
    email: 'beauty.lviv@demo.local',
    name: 'Atelier Soft',
    description:
      'Мʼякий весільний образ у Львові: шкіра, зачіска, стійкість на цілий день.',
    categorySlug: 'beauty',
    city: 'Львів',
    priceFrom: 10000,
    priceTo: 22000,
    rating: 4.9,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380673445566',
    instagram: 'atelier.soft.lviv',
    yearsInBusiness: 6,
    styles: ['soft glam', 'natural', 'bridal'],
    photos: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Наречена',
        price: 10000,
        description: 'Макіяж + зачіска',
        includes: 'Проба · день Х',
      },
    ],
    faqs: [],
  },
  {
    email: 'photo.dnipro@demo.local',
    name: 'Frame DP',
    description:
      'Весільний репортаж у Дніпрі: місто, річка, заміські локації. Швидке превʼю.',
    categorySlug: 'photo',
    city: 'Дніпро',
    priceFrom: 20000,
    priceTo: 42000,
    rating: 4.6,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380567112233',
    instagram: 'frame.dp',
    yearsInBusiness: 4,
    styles: ['репортаж', 'місто', 'парний портрет'],
    photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80',
    ],
    packages: [
      {
        title: 'День',
        price: 20000,
        description: '8 годин',
        includes: 'Фотограф · галерея',
      },
    ],
    faqs: [],
  },
  {
    email: 'music.kharkiv@demo.local',
    name: 'DJ Pulse',
    description:
      'DJ для весіль у Харкові: від тихої церемонії до танцполу, своя апаратура.',
    categorySlug: 'music',
    city: 'Харків',
    priceFrom: 15000,
    priceTo: 30000,
    rating: 4.5,
    status: 'APPROVED' as const,
    featured: false,
    phone: '+380501667788',
    instagram: 'dj.pulse.kh',
    yearsInBusiness: 5,
    styles: ['dance', 'open format', 'ceremony'],
    photos: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    ],
    packages: [
      {
        title: 'Вечір',
        price: 15000,
        description: '5 годин',
        includes: 'DJ · світло · мікрофон',
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
    // Не валимо boot, якщо seed/backfill slug впаде (напр. тимчасовий DB glitch)
    try {
      await this.bootstrapDemoVendors();
    } catch (err) {
      console.error('[vendors] bootstrap failed', err);
    }
  }

  private async bootstrapDemoVendors() {
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
            slug: await this.ensureUniqueSlug(slugify(demo.name)),
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
      } else {
        // Підтягуємо статус/рейтинг/місто з демо, не затираючи кастомний опис
        await this.prisma.vendor.update({
          where: { id: existing.id },
          data: {
            name: demo.name,
            city: demo.city,
            priceFrom: demo.priceFrom,
            priceTo: demo.priceTo,
            rating: demo.rating,
            status: demo.status,
            featured: demo.featured,
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

    await this.backfillMissingSlugs();
  }

  private async ensureUniqueSlug(base: string, excludeId?: string) {
    const root = slugify(base);
    let candidate = root;
    let n = 2;
    while (true) {
      const clash = await this.prisma.vendor.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
      });
      if (!clash) return candidate;
      candidate = `${root}-${n}`;
      n += 1;
    }
  }

  private async backfillMissingSlugs() {
    const missing = await this.prisma.vendor.findMany({
      where: { OR: [{ slug: null }, { slug: '' }] },
      select: { id: true, name: true },
    });
    for (const vendor of missing) {
      const slug = await this.ensureUniqueSlug(vendor.name || vendor.id, vendor.id);
      await this.prisma.vendor.update({
        where: { id: vendor.id },
        data: { slug },
      });
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
    slugOrId: string,
    viewer?: { ip?: string | null; userAgent?: string },
  ) {
    const vendor = await this.prisma.vendor.findFirst({
      where: {
        status: 'APPROVED',
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
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

      const slug =
        existing.slug ||
        (await this.ensureUniqueSlug(baseData.name, existing.id));

      return this.prisma.vendor.update({
        where: { userId },
        data: {
          ...baseData,
          slug,
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
        slug: await this.ensureUniqueSlug(baseData.name),
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
