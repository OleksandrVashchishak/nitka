import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  ContentKind,
  ContentStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/slug';
import {
  UpsertContentPostDto,
  UpsertContentTopicDto,
} from './dto/content.dto';
import {
  CONTENT_POSTS_SEED,
  CONTENT_TOPICS_SEED,
  type SeedBlock,
} from './content.seed-data';

const postInclude = {
  topic: true,
  author: { select: { id: true, name: true } },
} satisfies Prisma.ContentPostInclude;

const EMPTY_BODY = {
  time: Date.now(),
  blocks: [] as unknown[],
  version: '2.30.0',
};

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
          data: {
            style: b.style ?? 'unordered',
            items: b.items,
          },
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

function bodyBlockCount(body: unknown) {
  if (!body || typeof body !== 'object') return 0;
  const blocks = (body as { blocks?: unknown[] }).blocks;
  return Array.isArray(blocks) ? blocks.length : 0;
}

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedTopicsAndPosts();
  }

  listTopics() {
    return this.prisma.contentTopic.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            posts: { where: { status: ContentStatus.PUBLISHED } },
          },
        },
      },
    });
  }

  async getTopicBySlug(slug: string) {
    const topic = await this.prisma.contentTopic.findUnique({
      where: { slug },
    });
    if (!topic) throw new NotFoundException('РўРѕРїС–Рє РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
    return topic;
  }

  async listPublished(params: {
    topic?: string;
    kind?: ContentKind;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 12));
    const where: Prisma.ContentPostWhereInput = {
      status: ContentStatus.PUBLISHED,
      ...(params.kind ? { kind: params.kind } : {}),
      ...(params.featured ? { featured: true } : {}),
      ...(params.topic
        ? { topic: { slug: params.topic } }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.contentPost.findMany({
        where,
        include: postInclude,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contentPost.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getPublishedBySlug(slug: string) {
    const post = await this.prisma.contentPost.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      include: postInclude,
    });
    if (!post) throw new NotFoundException('РњР°С‚РµСЂС–Р°Р» РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
    return post;
  }

  adminListPosts(params: {
    status?: ContentStatus;
    topic?: string;
    q?: string;
  }) {
    return this.prisma.contentPost.findMany({
      where: {
        ...(params.status ? { status: params.status } : {}),
        ...(params.topic ? { topic: { slug: params.topic } } : {}),
        ...(params.q
          ? {
              OR: [
                { title: { contains: params.q, mode: 'insensitive' } },
                { slug: { contains: params.q, mode: 'insensitive' } },
                { excerpt: { contains: params.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: postInclude,
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  async adminGetPost(id: string) {
    const post = await this.prisma.contentPost.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!post) throw new NotFoundException('РњР°С‚РµСЂС–Р°Р» РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
    return post;
  }

  async createTopic(dto: UpsertContentTopicDto) {
    const slug = await this.ensureUniqueTopicSlug(
      dto.slug?.trim() || slugify(dto.name),
    );
    try {
      return await this.prisma.contentTopic.create({
        data: {
          name: dto.name.trim(),
          slug,
          description: dto.description?.trim() || '',
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    } catch {
      throw new ConflictException('РўРѕРїС–Рє Р· С‚Р°РєРёРј slug РІР¶Рµ С”');
    }
  }

  async updateTopic(id: string, dto: UpsertContentTopicDto) {
    const existing = await this.prisma.contentTopic.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('РўРѕРїС–Рє РЅРµ Р·РЅР°Р№РґРµРЅРѕ');

    const slug = await this.ensureUniqueTopicSlug(
      dto.slug?.trim() || slugify(dto.name),
      id,
    );

    try {
      return await this.prisma.contentTopic.update({
        where: { id },
        data: {
          name: dto.name.trim(),
          slug,
          description: dto.description?.trim() || '',
          ...(dto.sortOrder !== undefined
            ? { sortOrder: dto.sortOrder }
            : {}),
        },
      });
    } catch {
      throw new ConflictException('РўРѕРїС–Рє Р· С‚Р°РєРёРј slug РІР¶Рµ С”');
    }
  }

  async deleteTopic(id: string) {
    const count = await this.prisma.contentPost.count({
      where: { topicId: id },
    });
    if (count > 0) {
      throw new ConflictException(
        'РќРµ РјРѕР¶РЅР° РІРёРґР°Р»РёС‚Рё С‚РѕРїС–Рє Р· РјР°С‚РµСЂС–Р°Р»Р°РјРё',
      );
    }
    await this.prisma.contentTopic.delete({ where: { id } });
    return { ok: true };
  }

  async createPost(authorId: string, dto: UpsertContentPostDto) {
    await this.assertTopic(dto.topicId);
    const slug = await this.ensureUniquePostSlug(
      dto.slug?.trim() || slugify(dto.title),
    );
    const status = dto.status ?? ContentStatus.DRAFT;
    const seo = this.resolveSeo(dto, status);

    return this.prisma.contentPost.create({
      data: {
        title: dto.title.trim(),
        slug,
        excerpt: dto.excerpt?.trim() || '',
        coverUrl: dto.coverUrl?.trim() || null,
        kind: dto.kind ?? ContentKind.ARTICLE,
        status,
        body: (dto.body as Prisma.InputJsonValue) ?? EMPTY_BODY,
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
        ogImageUrl: dto.ogImageUrl?.trim() || null,
        city: dto.city?.trim() || null,
        vendorCategorySlug: dto.vendorCategorySlug?.trim() || null,
        featured: dto.featured ?? false,
        topicId: dto.topicId,
        authorId,
        publishedAt:
          status === ContentStatus.PUBLISHED ? new Date() : null,
      },
      include: postInclude,
    });
  }

  async updatePost(id: string, dto: UpsertContentPostDto) {
    const existing = await this.adminGetPost(id);
    await this.assertTopic(dto.topicId);

    const slug = await this.ensureUniquePostSlug(
      dto.slug?.trim() || slugify(dto.title),
      id,
    );
    const status = dto.status ?? existing.status;
    const seo = this.resolveSeo(dto, status, existing);

    return this.prisma.contentPost.update({
      where: { id },
      data: {
        title: dto.title.trim(),
        slug,
        excerpt: dto.excerpt?.trim() || '',
        coverUrl: dto.coverUrl?.trim() || null,
        kind: dto.kind ?? existing.kind,
        status,
        ...(dto.body !== undefined
          ? { body: dto.body as Prisma.InputJsonValue }
          : {}),
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
        ogImageUrl: dto.ogImageUrl?.trim() || null,
        city: dto.city?.trim() || null,
        vendorCategorySlug: dto.vendorCategorySlug?.trim() || null,
        featured: dto.featured ?? existing.featured,
        topicId: dto.topicId,
        publishedAt:
          status === ContentStatus.PUBLISHED
            ? existing.publishedAt ?? new Date()
            : existing.publishedAt,
      },
      include: postInclude,
    });
  }

  async updateStatus(id: string, status: ContentStatus) {
    const existing = await this.adminGetPost(id);
    const seoTitle =
      existing.seoTitle.trim() ||
      existing.title.trim();
    const seoDescription =
      existing.seoDescription.trim() ||
      existing.excerpt.trim() ||
      existing.title.trim();

    return this.prisma.contentPost.update({
      where: { id },
      data: {
        status,
        seoTitle,
        seoDescription,
        publishedAt:
          status === ContentStatus.PUBLISHED
            ? existing.publishedAt ?? new Date()
            : existing.publishedAt,
      },
      include: postInclude,
    });
  }

  async deletePost(id: string) {
    await this.adminGetPost(id);
    await this.prisma.contentPost.delete({ where: { id } });
    return { ok: true };
  }

  private resolveSeo(
    dto: UpsertContentPostDto,
    status: ContentStatus,
    existing?: { seoTitle: string; seoDescription: string },
  ) {
    const title = dto.title.trim();
    const excerpt = dto.excerpt?.trim() || '';
    let seoTitle = dto.seoTitle?.trim() || existing?.seoTitle?.trim() || '';
    let seoDescription =
      dto.seoDescription?.trim() ||
      existing?.seoDescription?.trim() ||
      '';

    if (status === ContentStatus.PUBLISHED) {
      if (!seoTitle) seoTitle = title;
      if (!seoDescription) seoDescription = excerpt || title;
    }

    return { seoTitle, seoDescription };
  }

  private async assertTopic(topicId: string) {
    const topic = await this.prisma.contentTopic.findUnique({
      where: { id: topicId },
    });
    if (!topic) throw new NotFoundException('РўРѕРїС–Рє РЅРµ Р·РЅР°Р№РґРµРЅРѕ');
  }

  private async ensureUniqueTopicSlug(base: string, excludeId?: string) {
    const root = slugify(base);
    let candidate = root;
    let n = 2;
    while (true) {
      const clash = await this.prisma.contentTopic.findFirst({
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

  private async ensureUniquePostSlug(base: string, excludeId?: string) {
    const root = slugify(base);
    let candidate = root;
    let n = 2;
    while (true) {
      const clash = await this.prisma.contentPost.findFirst({
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


  private async seedTopicsAndPosts() {
    for (const t of CONTENT_TOPICS_SEED) {
      await this.prisma.contentTopic.upsert({
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
          // Підтягуємо візуал seed, текст лишаємо якщо адмін уже правив name
          icon: t.icon,
          coverUrl: t.coverUrl,
          sortOrder: t.sortOrder,
          description: t.description,
        },
      });
    }

    const topics = await this.prisma.contentTopic.findMany();
    const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));

    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    for (const seed of CONTENT_POSTS_SEED) {
      const topic = bySlug[seed.topicSlug];
      if (!topic) continue;

      const existing = await this.prisma.contentPost.findUnique({
        where: { slug: seed.slug },
      });
      const body = richBody(seed.blocks);

      if (!existing) {
        await this.prisma.contentPost.create({
          data: {
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
        });
        continue;
      }

      const needsRefresh =
        !existing.coverUrl ||
        existing.coverUrl !== seed.coverUrl ||
        bodyBlockCount(existing.body) < seed.blocks.length;

      if (needsRefresh) {
        await this.prisma.contentPost.update({
          where: { id: existing.id },
          data: {
            title: seed.title,
            excerpt: seed.excerpt,
            coverUrl: seed.coverUrl,
            ogImageUrl: existing.ogImageUrl || seed.coverUrl,
            seoTitle: seed.title,
            seoDescription: seed.excerpt,
            featured: seed.featured ?? existing.featured,
            city: seed.city ?? existing.city,
            vendorCategorySlug:
              seed.vendorCategorySlug ?? existing.vendorCategorySlug,
            kind: seed.kind,
            body,
            status: ContentStatus.PUBLISHED,
            publishedAt: existing.publishedAt ?? new Date(),
          },
        });
      }
    }
  }
}
