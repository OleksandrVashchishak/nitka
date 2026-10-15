import { type TaskAssignee } from './dto/update-task.dto';
export type ParsedTaskAssignee = {
    assignee: TaskAssignee | null;
    assigneeName: string | null;
};
export declare function parseTaskAssignee(raw: string | null | undefined): ParsedTaskAssignee;
export declare function serializeTaskAssignee(assignee: TaskAssignee | null | undefined, assigneeName?: string | null): string | null;
