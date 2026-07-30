import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetItemDto, UpdateBudgetItemDto } from './dto/budget.dto';
export declare class BudgetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getWeddingForUser;
    private buildSummary;
    private groupByCategory;
    private syncDefaults;
    getMine(userId: string): Promise<{
        wedding: {
            id: string;
            date: Date;
            city: string;
            budget: number;
        };
        summary: {
            totalBudget: number;
            estimated: number;
            actual: number;
            paid: number;
            remaining: number;
            estimatedDiff: number;
            progress: number;
        };
        categories: {
            category: string;
            estimated: number;
            actual: number;
            items: {
                id: string;
                category: string;
                title: string;
                estimated: number;
                actual: number;
                paid: boolean;
                notes: string | null;
            }[];
        }[];
        items: {
            id: string;
            createdAt: Date;
            category: string;
            title: string;
            weddingId: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
        }[];
    }>;
    updatePlan(userId: string, budget: number): Promise<{
        wedding: {
            id: string;
            date: Date;
            city: string;
            budget: number;
        };
        summary: {
            totalBudget: number;
            estimated: number;
            actual: number;
            paid: number;
            remaining: number;
            estimatedDiff: number;
            progress: number;
        };
        categories: {
            category: string;
            estimated: number;
            actual: number;
            items: {
                id: string;
                category: string;
                title: string;
                estimated: number;
                actual: number;
                paid: boolean;
                notes: string | null;
            }[];
        }[];
        items: {
            id: string;
            createdAt: Date;
            category: string;
            title: string;
            weddingId: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
        }[];
    }>;
    createItem(userId: string, dto: CreateBudgetItemDto): Promise<{
        wedding: {
            id: string;
            date: Date;
            city: string;
            budget: number;
        };
        summary: {
            totalBudget: number;
            estimated: number;
            actual: number;
            paid: number;
            remaining: number;
            estimatedDiff: number;
            progress: number;
        };
        categories: {
            category: string;
            estimated: number;
            actual: number;
            items: {
                id: string;
                category: string;
                title: string;
                estimated: number;
                actual: number;
                paid: boolean;
                notes: string | null;
            }[];
        }[];
        items: {
            id: string;
            createdAt: Date;
            category: string;
            title: string;
            weddingId: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
        }[];
    }>;
    updateItem(userId: string, itemId: string, dto: UpdateBudgetItemDto): Promise<{
        wedding: {
            id: string;
            date: Date;
            city: string;
            budget: number;
        };
        summary: {
            totalBudget: number;
            estimated: number;
            actual: number;
            paid: number;
            remaining: number;
            estimatedDiff: number;
            progress: number;
        };
        categories: {
            category: string;
            estimated: number;
            actual: number;
            items: {
                id: string;
                category: string;
                title: string;
                estimated: number;
                actual: number;
                paid: boolean;
                notes: string | null;
            }[];
        }[];
        items: {
            id: string;
            createdAt: Date;
            category: string;
            title: string;
            weddingId: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
        }[];
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        wedding: {
            id: string;
            date: Date;
            city: string;
            budget: number;
        };
        summary: {
            totalBudget: number;
            estimated: number;
            actual: number;
            paid: number;
            remaining: number;
            estimatedDiff: number;
            progress: number;
        };
        categories: {
            category: string;
            estimated: number;
            actual: number;
            items: {
                id: string;
                category: string;
                title: string;
                estimated: number;
                actual: number;
                paid: boolean;
                notes: string | null;
            }[];
        }[];
        items: {
            id: string;
            createdAt: Date;
            category: string;
            title: string;
            weddingId: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
        }[];
    }>;
}
