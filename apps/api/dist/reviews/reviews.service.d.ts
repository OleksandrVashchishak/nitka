import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
export declare class ReviewsService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private recalcVendorRating;
    listByVendor(vendorId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        vendorId: string;
        text: string;
    })[]>;
    create(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        vendorId: string;
        text: string;
    }>;
    update(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        vendorId: string;
        text: string;
    }>;
    remove(userId: string, reviewId: string): Promise<{
        ok: boolean;
    }>;
    mineForVendor(userId: string, vendorId: string): Promise<({
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        vendorId: string;
        text: string;
    }) | null>;
}
