import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_CATEGORIES = [
  {
    name: 'Фото',
    slug: 'photo',
    description: 'Фотографи та відеографи',
    sortOrder: 1,
  },
  {
    name: 'Локації',
    slug: 'venue',
    description: 'Зали, садиби, outdoor',
    sortOrder: 2,
  },
  {
    name: 'Музика',
    slug: 'music',
    description: 'DJ, гурти, ведучі',
    sortOrder: 3,
  },
  {
    name: 'Декор',
    slug: 'decor',
    description: 'Квіти та оформлення',
    sortOrder: 4,
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Макіяж і зачіски',
    sortOrder: 5,
  },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const category of DEFAULT_CATEGORIES) {
      await this.prisma.category.upsert({
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

  findAll() {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }
}
