"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTaskAssignee = parseTaskAssignee;
exports.serializeTaskAssignee = serializeTaskAssignee;
const update_task_dto_1 = require("./dto/update-task.dto");
const OTHER_PREFIX = 'other:';
function parseTaskAssignee(raw) {
    if (!raw)
        return { assignee: null, assigneeName: null };
    if (raw.startsWith(OTHER_PREFIX)) {
        const name = raw.slice(OTHER_PREFIX.length).trim();
        return { assignee: 'other', assigneeName: name || null };
    }
    if (update_task_dto_1.TASK_ASSIGNEES.includes(raw)) {
        return { assignee: raw, assigneeName: null };
    }
    return { assignee: null, assigneeName: null };
}
function serializeTaskAssignee(assignee, assigneeName) {
    if (!assignee)
        return null;
    if (assignee === 'other') {
        const name = assigneeName?.trim();
        return name ? `${OTHER_PREFIX}${name}` : 'other';
    }
    return assignee;
}
//# sourceMappingURL=task-assignee.js.map