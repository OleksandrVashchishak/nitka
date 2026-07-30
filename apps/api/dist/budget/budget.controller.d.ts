import { AuthUser } from '../auth/current-user.decorator';
import { BudgetService } from './budget.service';
import { CreateBudgetItemDto, UpdateBudgetItemDto, UpdateBudgetPlanDto } from './dto/budget.dto';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    getMine(user: AuthUser): Promise<{
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
    updatePlan(user: AuthUser, dto: UpdateBudgetPlanDto): Promise<{
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
    createItem(user: AuthUser, dto: CreateBudgetItemDto): Promise<{
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
    updateItem(user: AuthUser, id: string, dto: UpdateBudgetItemDto): Promise<{
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
    removeItem(user: AuthUser, id: string): Promise<{
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
