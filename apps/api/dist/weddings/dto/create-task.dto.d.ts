import { type TaskAssignee } from './update-task.dto';
export declare class CreateTaskDto {
    title: string;
    categorySlug?: string;
    sortOrder?: number;
    dueDate?: string;
    assignee?: TaskAssignee;
}
