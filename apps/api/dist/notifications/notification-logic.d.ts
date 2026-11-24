import { type NotificationType, type TaskFrequency } from './notification-catalog';
export declare const KYIV_TZ = "Europe/Kyiv";
export declare const DAILY_HOUR_KYIV = 10;
export declare const DAILY_REMINDER_LIMIT = 3;
export declare const GROUP_WINDOW_MS: number;
export declare const HISTORY_DAYS = 30;
export declare function kyivDay(now: Date): string;
export declare function kyivHour(now: Date): number;
export declare function utcDay(d: Date): string;
export declare function daysBetween(from: string, to: string): number;
export declare function addDays(day: string, n: number): string;
export type GroupCandidate = {
    readAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date;
};
export declare function canMergeInto(existing: GroupCandidate | null, now: Date): boolean;
export declare function mergeEntityIds(prev: unknown, next: string[] | undefined, cap?: number): string[];
export type Members = {
    ownerId: string;
    partnerId: string | null;
};
export declare function taskRecipients(assigneeRaw: string | null, members: Members): {
    recipients: string[];
    isOther: boolean;
};
export declare function assigneeUserId(assigneeRaw: string | null, members: Members): string | null;
export type ReminderLevel = 'long' | 'mid' | 'short';
export declare const LEVELS: Record<ReminderLevel, {
    early: number;
    late: number;
}>;
export type ReminderTask = {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDay: string | null;
    createdAt: Date;
    templateId: string | null;
    source: string | null;
    isUrgent: boolean;
    assignee: string | null;
};
export declare function reminderLevel(task: ReminderTask): ReminderLevel;
export type PlannedReminder = {
    type: Extract<NotificationType, 'deadline_early' | 'deadline_late' | 'deadline_today' | 'task_overdue'>;
    dedupKey: string;
    reminderNo: number;
    days: number;
};
export type ReminderHistory = {
    sent: (dedupKey: string) => boolean;
    overdue: {
        count: number;
        lastDay: string | null;
    };
};
export declare const OVERDUE_MAX = 3;
export declare const OVERDUE_REPEAT_DAYS = 7;
export declare const MIN_TASK_AGE_MS: number;
export declare function taskKeyBase(task: Pick<ReminderTask, 'id' | 'dueDay'>): string;
export declare function planTaskReminder(task: ReminderTask, opts: {
    today: string;
    now: Date;
    frequency: TaskFrequency;
    isOther: boolean;
    history: ReminderHistory;
}): PlannedReminder | null;
export declare function nudgeFor(task: ReminderTask, reminderNo: number): {
    nudge: string;
    variant?: undefined;
} | {
    variant: number;
    nudge?: undefined;
};
export type DailyCandidate = {
    type: NotificationType;
    dedupKey: string;
};
export type DailyPlan<T extends DailyCandidate> = {
    send: T[];
    digested: T[];
    digestCount: number;
    deferred: T[];
};
export declare function applyDailyLimit<T extends DailyCandidate>(candidates: T[], limit?: number): DailyPlan<T>;
export type SentRecord = {
    day: string;
    count: number;
};
export declare function guestsNoResponseDue(input: {
    today: string;
    startDay: string | null;
    weddingDay: string;
    pending: number;
    history: SentRecord[];
}): boolean;
export type TipHistory = Array<{
    type: NotificationType;
    day: string;
}>;
export declare const SMART_TIP_MAX = 3;
export declare function smartPlanningTipDue(input: {
    today: string;
    registeredDay: string;
    hasSmartPlan: boolean;
    history: TipHistory;
}): boolean;
export declare function smartPlanningDateTipAllowed(input: {
    hasSmartPlan: boolean;
    history: TipHistory;
}): boolean;
export declare const SETUP_DATE_MAX = 3;
export declare function setupDateDue(input: {
    today: string;
    registeredDay: string;
    dateUndecided: boolean;
    history: string[];
}): boolean;
export declare const COUNTDOWN_THRESHOLDS: readonly [100, 30, 7];
export declare function countdownThreshold(daysLeft: number): number | null;
export declare const PROGRESS_THRESHOLDS: readonly [25, 50, 75, 100];
export declare const PROGRESS_MIN_TASKS = 10;
export declare function progressThreshold(done: number, total: number, alreadySent: (threshold: number) => boolean): number | null;
