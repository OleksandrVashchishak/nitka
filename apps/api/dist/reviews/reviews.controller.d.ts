import type { Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    listByVendor(vendorId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        vendorId: string;
        userId: string;
        rating: number;
        text: string;
        createdAt: Date;
    })[]>;
    mineForVendor(user: AuthUser, vendorId: string, res: Response): Promise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        vendorId: string;
        userId: string;
        rating: number;
        text: string;
        createdAt: Date;
    }) | undefined>;
    create(user: AuthUser, dto: CreateReviewDto): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        vendorId: string;
        userId: string;
        rating: number;
        text: string;
        createdAt: Date;
    }>;
    update(user: AuthUser, id: string, dto: UpdateReviewDto): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        vendorId: string;
        userId: string;
        rating: number;
        text: string;
        createdAt: Date;
    }>;
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
