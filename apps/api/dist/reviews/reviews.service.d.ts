import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
export declare class ReviewsService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private seedDemoReviews;
    private recalcVendorRating;
    listByVendor(vendorId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        vendorId: string;
        text: string;
    })[]>;
    create(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        vendorId: string;
        text: string;
    }>;
    update(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        vendorId: string;
        text: string;
    }>;
    remove(userId: string, reviewId: string): Promise<{
        ok: boolean;
    }>;
    mineForVendor(userId: string, vendorId: string): Promise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        vendorId: string;
        text: string;
    }) | null>;
}
