import { TaskStatus } from '@prisma/client';
export declare const TASK_ASSIGNEES: readonly ["owner", "partner", "both", "none", "other"];
export type TaskAssignee = (typeof TASK_ASSIGNEES)[number];
export declare class UpdateTaskDto {
    status?: TaskStatus;
    dueDate?: string | null;
    title?: string;
    assignee?: TaskAssignee | null;
}
