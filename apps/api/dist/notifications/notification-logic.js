"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROGRESS_MIN_TASKS = exports.PROGRESS_THRESHOLDS = exports.COUNTDOWN_THRESHOLDS = exports.SETUP_DATE_MAX = exports.SMART_TIP_MAX = exports.MIN_TASK_AGE_MS = exports.OVERDUE_REPEAT_DAYS = exports.OVERDUE_MAX = exports.LEVELS = exports.HISTORY_DAYS = exports.GROUP_WINDOW_MS = exports.DAILY_REMINDER_LIMIT = exports.DAILY_HOUR_KYIV = exports.KYIV_TZ = void 0;
exports.kyivDay = kyivDay;
exports.kyivHour = kyivHour;
exports.utcDay = utcDay;
exports.daysBetween = daysBetween;
exports.addDays = addDays;
exports.canMergeInto = canMergeInto;
exports.mergeEntityIds = mergeEntityIds;
exports.taskRecipients = taskRecipients;
exports.assigneeUserId = assigneeUserId;
exports.reminderLevel = reminderLevel;
exports.taskKeyBase = taskKeyBase;
exports.planTaskReminder = planTaskReminder;
exports.nudgeFor = nudgeFor;
exports.applyDailyLimit = applyDailyLimit;
exports.guestsNoResponseDue = guestsNoResponseDue;
exports.smartPlanningTipDue = smartPlanningTipDue;
exports.smartPlanningDateTipAllowed = smartPlanningDateTipAllowed;
exports.setupDateDue = setupDateDue;
exports.countdownThreshold = countdownThreshold;
exports.progressThreshold = progressThreshold;
const notification_catalog_1 = require("./notification-catalog");
const smart_plan_nudges_1 = require("./smart-plan-nudges");
exports.KYIV_TZ = 'Europe/Kyiv';
exports.DAILY_HOUR_KYIV = 10;
exports.DAILY_REMINDER_LIMIT = 3;
exports.GROUP_WINDOW_MS = 24 * 60 * 60 * 1000;
exports.HISTORY_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
function kyivDay(now) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: exports.KYIV_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}
function kyivHour(now) {
    const h = new Intl.DateTimeFormat('en-GB', {
        timeZone: exports.KYIV_TZ,
        hour: '2-digit',
        hour12: false,
    }).format(now);
    return Number(h) % 24;
}
function utcDay(d) {
    return d.toISOString().slice(0, 10);
}
function daysBetween(from, to) {
    return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
}
function addDays(day, n) {
    return utcDay(new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS));
}
function canMergeInto(existing, now) {
    if (!existing)
        return false;
    if (existing.readAt || existing.resolvedAt)
        return false;
    return now.getTime() - existing.createdAt.getTime() <= exports.GROUP_WINDOW_MS;
}
function mergeEntityIds(prev, next, cap = 200) {
    const out = Array.isArray(prev) ? prev.filter((v) => typeof v === 'string') : [];
    for (const id of next ?? [])
        if (!out.includes(id))
            out.push(id);
    return out.slice(-cap);
}
function taskRecipients(assigneeRaw, members) {
    const all = [members.ownerId, ...(members.partnerId ? [members.partnerId] : [])];
    if (assigneeRaw === 'owner')
        return { recipients: [members.ownerId], isOther: false };
    if (assigneeRaw === 'partner') {
        return { recipients: [members.partnerId ?? members.ownerId], isOther: false };
    }
    if (assigneeRaw && (assigneeRaw === 'other' || assigneeRaw.startsWith('other:'))) {
        return { recipients: all, isOther: true };
    }
    return { recipients: all, isOther: false };
}
function assigneeUserId(assigneeRaw, members) {
    if (assigneeRaw === 'owner')
        return members.ownerId;
    if (assigneeRaw === 'partner')
        return members.partnerId;
    return null;
}
exports.LEVELS = {
    long: { early: 14, late: 3 },
    mid: { early: 7, late: 2 },
    short: { early: 3, late: 0 },
};
function reminderLevel(task) {
    const tpl = task.templateId ? smart_plan_nudges_1.SMART_PLAN_NUDGES[task.templateId] : undefined;
    if (task.source === 'smart_planning' && tpl) {
        if (tpl.dueDays >= 180)
            return 'long';
        if (tpl.dueDays >= 60)
            return 'mid';
        return 'short';
    }
    if (!task.dueDay)
        return 'short';
    const gap = daysBetween(utcDay(task.createdAt), task.dueDay);
    if (gap > 60)
        return 'long';
    if (gap >= 14)
        return 'mid';
    return 'short';
}
exports.OVERDUE_MAX = 3;
exports.OVERDUE_REPEAT_DAYS = 7;
exports.MIN_TASK_AGE_MS = 48 * 60 * 60 * 1000;
function taskKeyBase(task) {
    return `task:${task.id}:${task.dueDay}`;
}
function planTaskReminder(task, opts) {
    const { today, now, frequency, isOther, history } = opts;
    if (task.status === 'DONE' || !task.dueDay)
        return null;
    if (now.getTime() - task.createdAt.getTime() < exports.MIN_TASK_AGE_MS)
        return null;
    const base = taskKeyBase(task);
    const r1 = `${base}:r1`;
    const r2 = `${base}:r2`;
    const daysLeft = daysBetween(today, task.dueDay);
    if (isOther && (history.sent(r1) || history.sent(r2)))
        return null;
    if (daysLeft < 0) {
        if (isOther)
            return null;
        const max = frequency === 'less' ? 1 : exports.OVERDUE_MAX;
        const { count, lastDay } = history.overdue;
        if (count >= max)
            return null;
        if (lastDay && daysBetween(lastDay, today) < exports.OVERDUE_REPEAT_DAYS)
            return null;
        return {
            type: 'task_overdue',
            dedupKey: `${base}:overdue:${count + 1}`,
            reminderNo: count + 1,
            days: -daysLeft,
        };
    }
    if (task.isUrgent)
        return null;
    const level = exports.LEVELS[reminderLevel(task)];
    const wantFirst = frequency === 'normal';
    if (daysLeft <= level.late) {
        if (history.sent(r2))
            return null;
        if (level.late === 0 && daysLeft !== 0)
            return null;
        return {
            type: daysLeft === 0 ? 'deadline_today' : 'deadline_late',
            dedupKey: r2,
            reminderNo: 2,
            days: daysLeft,
        };
    }
    if (daysLeft <= level.early) {
        if (!wantFirst || history.sent(r1) || history.sent(r2))
            return null;
        return { type: 'deadline_early', dedupKey: r1, reminderNo: 1, days: daysLeft };
    }
    return null;
}
function nudgeFor(task, reminderNo) {
    const tpl = task.templateId ? smart_plan_nudges_1.SMART_PLAN_NUDGES[task.templateId] : undefined;
    if (tpl)
        return { nudge: reminderNo === 1 ? tpl.early : tpl.late };
    const n = reminderNo === 1 ? 3 : 2;
    return { variant: pickVariantIndex(`${task.id}${reminderNo}`, n) };
}
function pickVariantIndex(seed, n) {
    let h = 0;
    for (let i = 0; i < seed.length; i += 1)
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    return Math.abs(h) % n;
}
const PRIORITY = {
    tasks: 0,
    guests: 1,
    invitationAndDayPlan: 2,
    milestones: 3,
    tips: 4,
    system: 5,
    partnerActivity: 6,
};
function applyDailyLimit(candidates, limit = exports.DAILY_REMINDER_LIMIT) {
    if (candidates.length <= limit) {
        return { send: candidates, digested: [], digestCount: 0, deferred: [] };
    }
    const deadlines = candidates.filter((c) => notification_catalog_1.DEADLINE_TYPES.has(c.type));
    const rest = candidates.filter((c) => !notification_catalog_1.DEADLINE_TYPES.has(c.type));
    const useDigest = deadlines.length >= 2;
    const digestSlots = useDigest ? 1 : 0;
    const pool = useDigest ? rest : candidates;
    const sorted = [...pool].sort((a, b) => PRIORITY[notification_catalog_1.CATEGORY_BY_TYPE[a.type]] - PRIORITY[notification_catalog_1.CATEGORY_BY_TYPE[b.type]]);
    const room = Math.max(0, limit - digestSlots);
    return {
        send: sorted.slice(0, room),
        digested: useDigest ? deadlines : [],
        digestCount: useDigest ? deadlines.length : 0,
        deferred: sorted.slice(room),
    };
}
function guestsNoResponseDue(input) {
    const { today, startDay, weddingDay, pending, history } = input;
    if (!startDay || pending <= 0)
        return false;
    const toWedding = daysBetween(today, weddingDay);
    if (toWedding <= 0)
        return false;
    if (history.length === 0)
        return daysBetween(startDay, today) >= 14;
    let interval = toWedding > 60 ? 14 : toWedding >= 30 ? 7 : 3;
    const last3 = history.slice(-3);
    if (last3.length === 3 && last3.every((h) => h.count === last3[0].count)) {
        interval *= 2;
    }
    return daysBetween(history[history.length - 1].day, today) >= interval;
}
exports.SMART_TIP_MAX = 3;
function smartPlanningTipDue(input) {
    const { today, registeredDay, hasSmartPlan, history } = input;
    if (hasSmartPlan)
        return false;
    const all = history.filter((h) => h.type === 'setup_smart_planning' || h.type === 'setup_smart_planning_date');
    if (all.length >= exports.SMART_TIP_MAX)
        return false;
    const plain = history.filter((h) => h.type === 'setup_smart_planning');
    if (plain.length === 0)
        return daysBetween(registeredDay, today) >= 2;
    if (plain.length === 1)
        return daysBetween(plain[0].day, today) >= 7;
    return false;
}
function smartPlanningDateTipAllowed(input) {
    if (input.hasSmartPlan)
        return false;
    const all = input.history.filter((h) => h.type === 'setup_smart_planning' || h.type === 'setup_smart_planning_date');
    if (all.length >= exports.SMART_TIP_MAX)
        return false;
    return !all.some((h) => h.type === 'setup_smart_planning_date');
}
exports.SETUP_DATE_MAX = 3;
function setupDateDue(input) {
    if (!input.dateUndecided)
        return false;
    if (input.history.length >= exports.SETUP_DATE_MAX)
        return false;
    if (input.history.length === 0)
        return daysBetween(input.registeredDay, input.today) >= 1;
    return daysBetween(input.history[input.history.length - 1], input.today) >= 7;
}
exports.COUNTDOWN_THRESHOLDS = [100, 30, 7];
const COUNTDOWN_GRACE = 2;
function countdownThreshold(daysLeft) {
    for (const th of exports.COUNTDOWN_THRESHOLDS) {
        if (daysLeft <= th && daysLeft >= th - COUNTDOWN_GRACE)
            return th;
    }
    return null;
}
exports.PROGRESS_THRESHOLDS = [25, 50, 75, 100];
exports.PROGRESS_MIN_TASKS = 10;
function progressThreshold(done, total, alreadySent) {
    if (total < exports.PROGRESS_MIN_TASKS)
        return null;
    const pct = (done / total) * 100;
    const reached = exports.PROGRESS_THRESHOLDS.filter((th) => pct >= th);
    if (!reached.length)
        return null;
    const top = reached[reached.length - 1];
    return alreadySent(top) ? null : top;
}
//# sourceMappingURL=notification-logic.js.map