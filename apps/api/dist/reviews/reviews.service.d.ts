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
            name: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        vendorId: string;
        rating: number;
        text: string;
    })[]>;
    create(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        vendorId: string;
        rating: number;
        text: string;
    }>;
    update(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<{
        user: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        vendorId: string;
        rating: number;
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
        userId: string;
        createdAt: Date;
        vendorId: string;
        rating: number;
        text: string;
    }) | null>;
}
