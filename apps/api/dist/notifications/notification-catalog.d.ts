export declare const NOTIFICATION_TYPES: readonly ["partner_guests_added", "partner_guests_removed", "partner_tasks_added", "partner_tasks_done", "partner_vendor_booked", "partner_vendor_added", "partner_expenses_added", "partner_seating_updated", "partner_site_published", "partner_dayplan_updated", "partner_inspo_added", "task_assigned", "deadline_early", "deadline_late", "deadline_today", "task_overdue", "deadline_digest", "urgent_digest", "guests_no_response", "guests_no_response_deadline", "seating_unassigned", "invitation_unpublished", "dayplan_share", "dayplan_tomorrow", "countdown", "countdown_tomorrow", "progress", "setup_date", "setup_partner", "setup_smart_planning", "setup_smart_planning_date", "post_wedding_feedback", "partner_joined", "partner_invite_declined"];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type NotificationCategory = 'tasks' | 'guests' | 'partnerActivity' | 'invitationAndDayPlan' | 'milestones' | 'tips' | 'system';
export declare const CATEGORY_BY_TYPE: Record<NotificationType, NotificationCategory>;
export declare const REMINDER_TYPES: ReadonlySet<NotificationType>;
export declare const DEADLINE_TYPES: ReadonlySet<NotificationType>;
export type TaskFrequency = 'normal' | 'less';
export type NotificationSettings = {
    tasks: boolean;
    taskFrequency: TaskFrequency;
    guests: boolean;
    partnerActivity: boolean;
    invitationAndDayPlan: boolean;
    milestones: boolean;
    tips: boolean;
    channels: {
        push: boolean;
        email: boolean;
    };
};
export declare const DEFAULT_SETTINGS: NotificationSettings;
export declare function isTypeEnabled(settings: NotificationSettings, type: NotificationType): boolean;
export declare function pluralUk(n: number, forms: [string, string, string]): string;
export declare function countWord(n: number, forms: [string, string, string]): string;
export declare const WORDS: {
    guestGen: [string, string, string];
    guestNom: [string, string, string];
    task: [string, string, string];
    urgentTask: [string, string, string];
    vendor: [string, string, string];
    expense: [string, string, string];
    event: [string, string, string];
    photo: [string, string, string];
    day: [string, string, string];
};
export type Gender = 'female' | 'male' | null;
export declare function verb(gender: Gender, masc: string, fem: string, neutral?: string): string;
export type Segment = {
    text: string;
    bold?: boolean;
};
export type IconKind = 'partner' | 'partner_muted' | 'deadline' | 'overdue' | 'digest' | 'guests' | 'seating' | 'site' | 'dayplan' | 'countdown' | 'progress' | 'tip' | 'setup';
export type NotificationAction = {
    label: string;
    variant: 'primary' | 'secondary';
    href?: string;
    action?: 'complete_task';
};
export type RenderedNotification = {
    segments: Segment[];
    icon: IconKind;
    iconLetter?: string;
    href: string;
    actions: NotificationAction[];
};
export type NotificationPayload = {
    actorId?: string;
    taskId?: string;
    taskTitle?: string;
    entityIds?: string[];
    amount?: number;
    days?: number;
    dueDate?: string;
    nudge?: string;
    variant?: number;
    vendorId?: string;
    vendorLabel?: string;
    threshold?: number;
    done?: number;
    total?: number;
    milestone?: string;
    siteUrl?: string;
    [k: string]: unknown;
};
export type RenderInput = {
    type: NotificationType;
    count: number;
    payload: NotificationPayload;
    actor?: {
        name: string;
        gender: Gender;
    } | null;
};
export declare function formatDayMonth(iso?: string): string;
export declare function formatUah(amount: number): string;
export declare const GENERIC_EARLY: string[];
export declare const GENERIC_LATE: string[];
export declare function pickVariant(seed: string, n: number): number;
export declare function renderNotification(input: RenderInput): RenderedNotification;
export declare function plainText(segments: Segment[]): string;
export declare const VENDOR_CATEGORY_ACC: Record<string, string>;
