export declare class SmartPlanTaskItemDto {
    templateId: string;
    title: string;
    categorySlug?: string;
    dueDate?: string;
    isUrgent?: boolean;
}
export declare class CreateSmartPlanTasksDto {
    tasks: SmartPlanTaskItemDto[];
}
