import { TaskStatus } from '@prisma/client';
export declare class UpdateTaskDto {
    status?: TaskStatus;
    dueDate?: string | null;
    title?: string;
}
