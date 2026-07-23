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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
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
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map