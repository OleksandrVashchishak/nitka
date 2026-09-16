import type { Response } from 'express';
import { AuthUser } from '../auth/current-user.decorator';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
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
    mineForVendor(user: AuthUser, vendorId: string, res: Response): Promise<({
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
    }) | undefined>;
    create(user: AuthUser, dto: CreateReviewDto): Promise<{
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
    update(user: AuthUser, id: string, dto: UpdateReviewDto): Promise<{
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
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
