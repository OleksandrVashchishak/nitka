"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteService = void 0;
const common_1 = require("@nestjs/common");
const slug_1 = require("../common/slug");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
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
const DEFAULT_SECTIONS = {
    story: true,
    schedule: true,
    dressCode: true,
    gallery: false,
    qa: false,
    travel: false,
    registry: false,
    rsvp: true,
};
function formatDate(date, format) {
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
function defaultContent(wedding) {
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
        storyBody: 'Коротко розкажіть, як усе почалось — кілька теплих речень буде достатньо.',
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
        rsvpBody: 'Підтверди участь персональним посиланням на запрошення, яке ми надішлемо.',
        rsvpUrl: '',
        footerNote: 'З любовʼю, ми',
        sections: { ...DEFAULT_SECTIONS },
        introEnabled: false,
        introTitle: 'Відкрити запрошення',
        musicUrl: '',
    };
}
function asStringArray(value, fallback) {
    if (!Array.isArray(value))
        return fallback;
    return value.map((item) => String(item ?? '')).filter(Boolean);
}
function asSections(value, fallback) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { ...fallback };
    }
    const raw = value;
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
function asContent(value, fallback) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return fallback;
    }
    const raw = value;
    const scheduleItems = Array.isArray(raw.scheduleItems)
        ? raw.scheduleItems
            .filter((item) => Boolean(item && typeof item === 'object'))
            .map((item) => ({
            time: String(item.time ?? ''),
            title: String(item.title ?? ''),
            detail: String(item.detail ?? ''),
        }))
        : fallback.scheduleItems;
    const qaItems = Array.isArray(raw.qaItems)
        ? raw.qaItems
            .filter((item) => Boolean(item && typeof item === 'object'))
            .map((item) => ({
            question: String(item.question ?? ''),
            answer: String(item.answer ?? ''),
        }))
        : fallback.qaItems;
    const travelItems = Array.isArray(raw.travelItems)
        ? raw.travelItems
            .filter((item) => Boolean(item && typeof item === 'object'))
            .map((item) => ({
            title: String(item.title ?? ''),
            detail: String(item.detail ?? ''),
        }))
        : fallback.travelItems;
    const registryItems = Array.isArray(raw.registryItems)
        ? raw.registryItems
            .filter((item) => Boolean(item && typeof item === 'object'))
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
function serialize(site, wedding) {
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
let WebsiteService = class WebsiteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMine(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId);
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
    async upsertMine(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId);
        const existing = await this.prisma.weddingWebsite.findUnique({
            where: { weddingId: wedding.id },
        });
        const templateId = dto.templateId ?? existing?.templateId ?? 'classic-white';
        if (!TEMPLATE_IDS.has(templateId)) {
            throw new common_1.BadRequestException('Невідомий темплейт');
        }
        const fallback = defaultContent(wedding);
        const content = asContent(dto.content ?? existing?.content ?? fallback, fallback);
        let slug = (dto.slug ?? existing?.slug ?? this.suggestSlug(wedding))
            .trim()
            .toLowerCase();
        slug = (0, slug_1.slugify)(slug);
        if (slug.length < 2) {
            throw new common_1.BadRequestException('Slug занадто короткий');
        }
        const clash = await this.prisma.weddingWebsite.findFirst({
            where: {
                slug,
                ...(existing ? { NOT: { id: existing.id } } : {}),
            },
        });
        if (clash) {
            throw new common_1.ConflictException('Цей адрес уже зайнятий');
        }
        const published = dto.published ?? existing?.published ?? false;
        const site = existing
            ? await this.prisma.weddingWebsite.update({
                where: { id: existing.id },
                data: {
                    slug,
                    templateId,
                    published,
                    content: content,
                },
            })
            : await this.prisma.weddingWebsite.create({
                data: {
                    weddingId: wedding.id,
                    slug,
                    templateId,
                    published,
                    content: content,
                },
            });
        return serialize(site, wedding);
    }
    async getPublicBySlug(slugRaw) {
        const slug = slugRaw.trim().toLowerCase();
        const site = await this.prisma.weddingWebsite.findUnique({
            where: { slug },
            include: { wedding: true },
        });
        if (!site || !site.published) {
            throw new common_1.NotFoundException('Сайт не знайдено');
        }
        return serialize(site, site.wedding);
    }
    suggestSlug(wedding) {
        const base = (0, slug_1.slugify)(`${wedding.partnerOneName}-${wedding.partnerTwoName}`);
        return base.length >= 2 ? base : `wedding-${Date.now().toString(36)}`;
    }
};
exports.WebsiteService = WebsiteService;
exports.WebsiteService = WebsiteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebsiteService);
//# sourceMappingURL=website.service.js.map