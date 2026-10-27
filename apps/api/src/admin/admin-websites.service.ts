import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminWebsitesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: {
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 25));
    const q = query.q?.trim();

    const and: Prisma.WeddingWebsiteWhereInput[] = [];
    if (q) {
      and.push({
        OR: [
          { slug: { contains: q, mode: 'insensitive' } },
          {
            wedding: {
              user: {
                OR: [
                  { email: { contains: q, mode: 'insensitive' } },
                  { name: { contains: q, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      });
    }
    if (query.status === 'published') {
      and.push({ published: true, adminHidden: false });
    } else if (query.status === 'draft') {
      and.push({ published: false });
    } else if (query.status === 'hidden') {
      and.push({ adminHidden: true });
    }
    const where: Prisma.WeddingWebsiteWhereInput = and.length
      ? { AND: and }
      : {};

    const [total, items] = await Promise.all([
      this.prisma.weddingWebsite.count({ where }),
      this.prisma.weddingWebsite.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          templateId: true,
          published: true,
          publishedAt: true,
          adminHidden: true,
          createdAt: true,
          updatedAt: true,
          wedding: {
            select: {
              partnerOneName: true,
              partnerTwoName: true,
              user: { select: { id: true, email: true, name: true } },
            },
          },
        },
      }),
    ]);

    return {
      page,
      limit,
      total,
      items: items.map((s) => ({
        id: s.id,
        slug: s.slug,
        templateId: s.templateId,
        published: s.published,
        publishedAt: s.publishedAt,
        hidden: s.adminHidden,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        couple: `${s.wedding.partnerOneName} & ${s.wedding.partnerTwoName}`,
        owner: s.wedding.user,
      })),
    };
  }

  async setHidden(id: string, hidden: boolean) {
    await this.requireSite(id);
    await this.prisma.weddingWebsite.update({
      where: { id },
      data: { adminHidden: hidden },
    });
    return { id, hidden };
  }

  async remove(id: string) {
    await this.requireSite(id);
    await this.prisma.weddingWebsite.delete({ where: { id } });
    return { ok: true };
  }

  private async requireSite(id: string) {
    const site = await this.prisma.weddingWebsite.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!site) throw new NotFoundException('Сайт не знайдено');
  }
}
