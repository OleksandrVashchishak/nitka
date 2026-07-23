export declare class UpdateBudgetPlanDto {
    budget: number;
}
export declare class CreateBudgetItemDto {
    category: string;
    title: string;
    estimated: number;
    actual?: number;
    paid?: boolean;
    notes?: string;
}
export declare class UpdateBudgetItemDto {
    category?: string;
    title?: string;
    estimated?: number;
    actual?: number;
    paid?: boolean;
    notes?: string | null;
}
