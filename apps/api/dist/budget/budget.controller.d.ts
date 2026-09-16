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
            weddingId: string;
            category: string;
            title: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
            externalVendorId: string | null;
            createdAt: Date;
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
            weddingId: string;
            category: string;
            title: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
            externalVendorId: string | null;
            createdAt: Date;
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
            weddingId: string;
            category: string;
            title: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
            externalVendorId: string | null;
            createdAt: Date;
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
            weddingId: string;
            category: string;
            title: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
            externalVendorId: string | null;
            createdAt: Date;
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
            weddingId: string;
            category: string;
            title: string;
            estimated: number;
            actual: number;
            paid: boolean;
            notes: string | null;
            externalVendorId: string | null;
            createdAt: Date;
        }[];
    }>;
}
