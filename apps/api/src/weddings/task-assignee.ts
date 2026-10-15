import { TASK_ASSIGNEES, type TaskAssignee } from './dto/update-task.dto';

const OTHER_PREFIX = 'other:';

export type ParsedTaskAssignee = {
  assignee: TaskAssignee | null;
  assigneeName: string | null;
};

export function parseTaskAssignee(
  raw: string | null | undefined,
): ParsedTaskAssignee {
  if (!raw) return { assignee: null, assigneeName: null };
  if (raw.startsWith(OTHER_PREFIX)) {
    const name = raw.slice(OTHER_PREFIX.length).trim();
    return { assignee: 'other', assigneeName: name || null };
  }
  if ((TASK_ASSIGNEES as readonly string[]).includes(raw)) {
    return { assignee: raw as TaskAssignee, assigneeName: null };
  }
  return { assignee: null, assigneeName: null };
}

export function serializeTaskAssignee(
  assignee: TaskAssignee | null | undefined,
  assigneeName?: string | null,
): string | null {
  if (!assignee) return null;
  if (assignee === 'other') {
    const name = assigneeName?.trim();
    return name ? `${OTHER_PREFIX}${name}` : 'other';
  }
  return assignee;
}
