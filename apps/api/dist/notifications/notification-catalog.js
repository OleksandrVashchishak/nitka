"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENDOR_CATEGORY_ACC = exports.GENERIC_LATE = exports.GENERIC_EARLY = exports.WORDS = exports.DEFAULT_SETTINGS = exports.DEADLINE_TYPES = exports.REMINDER_TYPES = exports.CATEGORY_BY_TYPE = exports.NOTIFICATION_TYPES = void 0;
exports.isTypeEnabled = isTypeEnabled;
exports.pluralUk = pluralUk;
exports.countWord = countWord;
exports.verb = verb;
exports.formatDayMonth = formatDayMonth;
exports.formatUah = formatUah;
exports.pickVariant = pickVariant;
exports.renderNotification = renderNotification;
exports.plainText = plainText;
exports.NOTIFICATION_TYPES = [
    'partner_guests_added',
    'partner_guests_removed',
    'partner_tasks_added',
    'partner_tasks_done',
    'partner_vendor_booked',
    'partner_vendor_added',
    'partner_expenses_added',
    'partner_seating_updated',
    'partner_site_published',
    'partner_dayplan_updated',
    'partner_inspo_added',
    'task_assigned',
    'deadline_early',
    'deadline_late',
    'deadline_today',
    'task_overdue',
    'deadline_digest',
    'urgent_digest',
    'guests_no_response',
    'guests_no_response_deadline',
    'seating_unassigned',
    'invitation_unpublished',
    'dayplan_share',
    'dayplan_tomorrow',
    'countdown',
    'countdown_tomorrow',
    'progress',
    'setup_date',
    'setup_partner',
    'setup_smart_planning',
    'setup_smart_planning_date',
    'post_wedding_feedback',
    'partner_joined',
    'partner_invite_declined',
];
exports.CATEGORY_BY_TYPE = {
    partner_guests_added: 'partnerActivity',
    partner_guests_removed: 'partnerActivity',
    partner_tasks_added: 'partnerActivity',
    partner_tasks_done: 'partnerActivity',
    partner_vendor_booked: 'partnerActivity',
    partner_vendor_added: 'partnerActivity',
    partner_expenses_added: 'partnerActivity',
    partner_seating_updated: 'partnerActivity',
    partner_site_published: 'partnerActivity',
    partner_dayplan_updated: 'partnerActivity',
    partner_inspo_added: 'partnerActivity',
    task_assigned: 'tasks',
    deadline_early: 'tasks',
    deadline_late: 'tasks',
    deadline_today: 'tasks',
    task_overdue: 'tasks',
    deadline_digest: 'tasks',
    urgent_digest: 'tasks',
    guests_no_response: 'guests',
    guests_no_response_deadline: 'guests',
    seating_unassigned: 'guests',
    invitation_unpublished: 'invitationAndDayPlan',
    dayplan_share: 'invitationAndDayPlan',
    dayplan_tomorrow: 'invitationAndDayPlan',
    countdown: 'milestones',
    countdown_tomorrow: 'milestones',
    progress: 'milestones',
    setup_date: 'tips',
    setup_partner: 'tips',
    setup_smart_planning: 'tips',
    setup_smart_planning_date: 'tips',
    post_wedding_feedback: 'tips',
    partner_joined: 'system',
    partner_invite_declined: 'system',
};
exports.REMINDER_TYPES = new Set([
    'deadline_early',
    'deadline_late',
    'deadline_today',
    'task_overdue',
    'urgent_digest',
    'guests_no_response',
    'guests_no_response_deadline',
    'seating_unassigned',
    'invitation_unpublished',
    'dayplan_share',
    'dayplan_tomorrow',
    'countdown',
    'countdown_tomorrow',
    'progress',
    'setup_date',
    'setup_partner',
    'setup_smart_planning',
    'setup_smart_planning_date',
    'post_wedding_feedback',
]);
exports.DEADLINE_TYPES = new Set([
    'deadline_early',
    'deadline_late',
    'deadline_today',
    'task_overdue',
]);
exports.DEFAULT_SETTINGS = {
    tasks: true,
    taskFrequency: 'normal',
    guests: true,
    partnerActivity: true,
    invitationAndDayPlan: true,
    milestones: true,
    tips: true,
    channels: { push: true, email: true },
};
function isTypeEnabled(settings, type) {
    const category = exports.CATEGORY_BY_TYPE[type];
    if (category === 'system')
        return true;
    return settings[category];
}
const pluralRules = new Intl.PluralRules('uk');
function pluralUk(n, forms) {
    const rule = pluralRules.select(Math.abs(Math.trunc(n)));
    if (rule === 'one')
        return forms[0];
    if (rule === 'few')
        return forms[1];
    return forms[2];
}
function countWord(n, forms) {
    return `${n} ${pluralUk(n, forms)}`;
}
exports.WORDS = {
    guestGen: ['гостя', 'гостей', 'гостей'],
    guestNom: ['гість', 'гості', 'гостей'],
    task: ['завдання', 'завдання', 'завдань'],
    urgentTask: ['термінове завдання', 'термінові завдання', 'термінових завдань'],
    vendor: ['підрядника', 'підрядників', 'підрядників'],
    expense: ['витрату', 'витрати', 'витрат'],
    event: ['подію', 'події', 'подій'],
    photo: ['фото', 'фото', 'фото'],
    day: ['день', 'дні', 'днів'],
};
function verb(gender, masc, fem, neutral) {
    if (gender === 'female')
        return fem;
    if (gender === 'male')
        return masc;
    return neutral ?? `${masc}(ла)`;
}
const ROUTES = {
    dashboard: '/dashboard',
    guests: '/guests',
    guestsNoResponse: '/guests?status=no_response',
    tasks: '/checklist',
    tasksDone: '/checklist?status=done',
    tasksThisWeek: '/checklist?due=this_week',
    tasksUrgent: '/checklist?due=overdue,this_week',
    task: (id) => (id ? `/checklist?edit=${encodeURIComponent(id)}` : '/checklist'),
    vendors: '/my-vendors',
    vendor: (id) => (id ? `/my-vendors?vendor=${encodeURIComponent(id)}` : '/my-vendors'),
    budget: '/budget',
    seating: '/seating',
    dayPlan: '/day-plan',
    dayPlanShare: '/day-plan?share=1',
    inspiration: '/inspiration',
    siteEditor: '/website/edit',
    site: '/website',
    smartPlanning: '/checklist?smart=1',
    profile: '/settings?tab=profile',
    profileDate: '/settings?tab=profile&focus=date',
    profilePartner: '/settings?tab=profile&focus=partner',
    feedback: '/feedback',
};
const b = (text) => ({ text, bold: true });
const t = (text) => ({ text });
const UA_MONTHS_GEN = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];
function formatDayMonth(iso) {
    if (!iso)
        return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return '';
    return `${d.getUTCDate()} ${UA_MONTHS_GEN[d.getUTCMonth()]}`;
}
function formatUah(amount) {
    const rounded = Math.round(amount);
    const grouped = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${rounded < 0 ? '−' : ''}${grouped} ₴`;
}
exports.GENERIC_EARLY = [
    'Не забудьте: {title} — до {date}',
    'До дедлайну {title} {N}',
    'Як справи з {title}? Дедлайн {date}',
];
exports.GENERIC_LATE = [
    'Залишилось {N}, щоб {title}',
    'Дедлайн {title} вже {date}',
];
function fillTemplate(template, vars) {
    const out = [];
    const parts = template.split(/(\{title\}|\{N\}|\{date\})/);
    for (const part of parts) {
        if (!part)
            continue;
        if (part === '{title}')
            out.push(b(`«${vars.title}»`));
        else if (part === '{N}')
            out.push(b(countWord(vars.days, exports.WORDS.day)));
        else if (part === '{date}')
            out.push(t(vars.date));
        else
            out.push(t(part));
    }
    return out;
}
function pickVariant(seed, n) {
    let h = 0;
    for (let i = 0; i < seed.length; i += 1) {
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    return Math.abs(h) % n;
}
function firstName(name) {
    return name.trim().split(/\s+/)[0] || 'Партнер';
}
const PROGRESS_TITLE = {
    25: 'Чверть плану виконана',
    50: 'Половина плану виконана',
    75: 'Три чверті плану виконано',
    100: 'Увесь план виконано!',
};
function renderNotification(input) {
    const { type, payload } = input;
    const n = Math.max(1, input.count || 1);
    const actorName = firstName(input.actor?.name ?? '');
    const g = input.actor?.gender ?? null;
    const letter = actorName.charAt(0).toUpperCase();
    const partner = (segments, action) => ({
        segments: [b(actorName), ...segments],
        icon: 'partner',
        iconLetter: letter,
        href: action.href ?? ROUTES.dashboard,
        actions: [action],
    });
    const view = (href, label = 'Переглянути') => ({
        label,
        variant: 'secondary',
        href,
    });
    const goTask = {
        label: 'Перейти до завдання',
        variant: 'primary',
        href: ROUTES.task(payload.taskId),
    };
    const days = payload.days ?? 0;
    const title = payload.taskTitle ?? 'завдання';
    switch (type) {
        case 'partner_guests_added':
            return partner([t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, exports.WORDS.guestGen))], view(ROUTES.guests));
        case 'partner_guests_removed':
            return partner([t(` ${verb(g, 'видалив', 'видалила')} `), b(countWord(n, exports.WORDS.guestGen))], view(ROUTES.guests, 'Переглянути гостей'));
        case 'partner_tasks_added':
            return partner([t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, exports.WORDS.task))], view(ROUTES.tasks));
        case 'partner_tasks_done':
            return partner([t(` ${verb(g, 'виконав', 'виконала')} `), b(countWord(n, exports.WORDS.task))], view(ROUTES.tasksDone));
        case 'partner_vendor_booked': {
            const booked = verb(g, 'забронював', 'забронювала');
            if (n > 1) {
                return partner([t(` ${booked} `), b(countWord(n, exports.WORDS.vendor))], view(ROUTES.vendors));
            }
            return partner([t(` ${booked} ${payload.vendorLabel || 'підрядника'}`)], view(ROUTES.vendor(payload.vendorId), 'Перейти до підрядника'));
        }
        case 'partner_vendor_added':
            return partner([t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, exports.WORDS.vendor))], view(ROUTES.vendors));
        case 'partner_expenses_added':
            return partner([
                t(` ${verb(g, 'додав', 'додала')} ${countWord(n, exports.WORDS.expense)} на `),
                b(formatUah(payload.amount ?? 0)),
            ], view(ROUTES.budget, 'Перейти до бюджету'));
        case 'partner_seating_updated':
            return partner([t(` ${verb(g, 'оновив', 'оновила')} розсадку`)], view(ROUTES.seating, 'Відкрити розсадку'));
        case 'partner_site_published':
            return partner([t(` ${verb(g, 'опублікував', 'опублікувала')} сайт-запрошення`)], view(payload.siteUrl || ROUTES.site, 'Переглянути сайт'));
        case 'partner_dayplan_updated':
            return partner([t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, exports.WORDS.event)), t(' в план дня')], view(ROUTES.dayPlan, 'Відкрити план дня'));
        case 'partner_inspo_added':
            return partner([t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, exports.WORDS.photo)), t(' на дошку натхнення')], view(ROUTES.inspiration));
        case 'task_assigned':
            return {
                segments: [
                    b(actorName),
                    t(` ${verb(g, 'призначив', 'призначила')} вам завдання `),
                    b(`«${title}»`),
                ],
                icon: 'partner',
                iconLetter: letter,
                href: goTask.href,
                actions: [goTask],
            };
        case 'deadline_early': {
            const segments = payload.nudge
                ? [t(`${payload.nudge} До дедлайну `), b(countWord(days, exports.WORDS.day)), t('.')]
                : fillTemplate(exports.GENERIC_EARLY[(payload.variant ?? 0) % exports.GENERIC_EARLY.length], {
                    title,
                    days,
                    date: formatDayMonth(payload.dueDate),
                });
            return {
                segments,
                icon: 'deadline',
                href: goTask.href,
                actions: [goTask, { label: 'Вже зроблено', variant: 'secondary', action: 'complete_task' }],
            };
        }
        case 'deadline_late': {
            const segments = payload.nudge
                ? [t(`${payload.nudge} — дедлайн `), b(`за ${countWord(days, exports.WORDS.day)}`)]
                : fillTemplate(exports.GENERIC_LATE[(payload.variant ?? 0) % exports.GENERIC_LATE.length], {
                    title,
                    days,
                    date: formatDayMonth(payload.dueDate),
                });
            return {
                segments,
                icon: 'deadline',
                href: goTask.href,
                actions: [goTask, { label: 'Вже зроблено', variant: 'secondary', action: 'complete_task' }],
            };
        }
        case 'deadline_today':
            return {
                segments: [t('Сьогодні дедлайн: '), b(`«${title}»`)],
                icon: 'deadline',
                href: goTask.href,
                actions: [goTask, { label: 'Вже зроблено', variant: 'secondary', action: 'complete_task' }],
            };
        case 'task_overdue': {
            const ago = days <= 1 ? 'учора' : `${countWord(days, exports.WORDS.day)} тому`;
            return {
                segments: [t('Дедлайн '), b(`«${title}»`), t(` минув ${ago}. Вже зробили?`)],
                icon: 'overdue',
                href: goTask.href,
                actions: [
                    goTask,
                    { label: 'Позначити виконаним', variant: 'secondary', action: 'complete_task' },
                ],
            };
        }
        case 'deadline_digest':
            return {
                segments: [t('Цього тижня дедлайн у '), b(countWord(n, exports.WORDS.task))],
                icon: 'digest',
                href: ROUTES.tasksThisWeek,
                actions: [{ label: 'Переглянути завдання', variant: 'primary', href: ROUTES.tasksThisWeek }],
            };
        case 'urgent_digest':
            return {
                segments: [
                    t('У вашому плані '),
                    b(countWord(n, exports.WORDS.urgentTask)),
                    t('. Почніть з найважливіших'),
                ],
                icon: 'overdue',
                href: ROUTES.tasksUrgent,
                actions: [{ label: 'Переглянути завдання', variant: 'primary', href: ROUTES.tasksUrgent }],
            };
        case 'guests_no_response': {
            const segments = pluralUk(n, ['one', 'few', 'many']) === 'one'
                ? [b(countWord(n, exports.WORDS.guestNom)), t(' ще не повідомив, чи прийде')]
                : [b(countWord(n, exports.WORDS.guestNom)), t(' ще не повідомили, чи прийдуть')];
            return {
                segments,
                icon: 'guests',
                href: ROUTES.guestsNoResponse,
                actions: [{ label: 'Переглянути гостей', variant: 'primary', href: ROUTES.guestsNoResponse }],
            };
        }
        case 'guests_no_response_deadline': {
            const what = payload.milestone === 'guests_confirm'
                ? 'Через 3 дні дедлайн «Дізнатися, хто з гостей точно прийде», а '
                : 'Через 3 дні час складати розсадку, а ';
            const one = pluralUk(n, ['one', 'few', 'many']) === 'one';
            return {
                segments: [
                    t(what),
                    b(countWord(n, exports.WORDS.guestNom)),
                    t(one ? ' ще не відповів' : ' ще не відповіли'),
                ],
                icon: 'guests',
                href: ROUTES.guestsNoResponse,
                actions: [{ label: 'Переглянути гостей', variant: 'primary', href: ROUTES.guestsNoResponse }],
            };
        }
        case 'seating_unassigned': {
            const one = pluralUk(n, ['one', 'few', 'many']) === 'one';
            return {
                segments: [
                    b(countWord(n, exports.WORDS.guestNom)),
                    t(one
                        ? ', який підтвердив участь, ще не має місця'
                        : ', які підтвердили участь, ще не мають місця'),
                ],
                icon: 'seating',
                href: ROUTES.seating,
                actions: [{ label: 'Відкрити розсадку', variant: 'primary', href: ROUTES.seating }],
            };
        }
        case 'invitation_unpublished':
            return {
                segments: [
                    t('Ваш сайт-запрошення ще не опубліковано, а розсилка — '),
                    b(`за ${countWord(days, exports.WORDS.day)}`),
                ],
                icon: 'site',
                href: ROUTES.siteEditor,
                actions: [{ label: 'Відкрити редактор', variant: 'primary', href: ROUTES.siteEditor }],
            };
        case 'dayplan_share':
            return {
                segments: [b('Тиждень до весілля!'), t(' Поділіться планом дня з підрядниками')],
                icon: 'dayplan',
                href: ROUTES.dayPlanShare,
                actions: [{ label: 'Поділитися планом', variant: 'primary', href: ROUTES.dayPlanShare }],
            };
        case 'dayplan_tomorrow':
            return {
                segments: [b('Завтра ваш день.'), t(' Ось план, щоб нічого не забути')],
                icon: 'dayplan',
                href: ROUTES.dayPlan,
                actions: [{ label: 'Відкрити план дня', variant: 'primary', href: ROUTES.dayPlan }],
            };
        case 'countdown':
            return {
                segments: [t('До весілля '), b(`${countWord(days, exports.WORDS.day)}!`)],
                icon: 'countdown',
                href: ROUTES.dashboard,
                actions: [],
            };
        case 'countdown_tomorrow':
            return {
                segments: [b('Завтра ваше весілля!'), t(' Ми вами пишаємося')],
                icon: 'countdown',
                href: ROUTES.dashboard,
                actions: [],
            };
        case 'progress': {
            const threshold = payload.threshold ?? 50;
            return {
                segments: [
                    b(PROGRESS_TITLE[threshold] ?? `Виконано ${threshold}% плану`),
                    t(` — ${payload.done ?? 0} з ${countWord(payload.total ?? 0, exports.WORDS.task)}`),
                ],
                icon: 'progress',
                href: ROUTES.tasks,
                actions: [view(ROUTES.tasks, 'Переглянути завдання')],
            };
        }
        case 'setup_date':
            return {
                segments: [t('Вкажіть дату весілля, щоб ми розставили дедлайни')],
                icon: 'setup',
                href: ROUTES.profileDate,
                actions: [{ label: 'Вказати дату', variant: 'primary', href: ROUTES.profileDate }],
            };
        case 'setup_partner':
            return {
                segments: [t('Запросіть партнера, щоб планувати разом')],
                icon: 'setup',
                href: ROUTES.profilePartner,
                actions: [{ label: 'Запросити', variant: 'primary', href: ROUTES.profilePartner }],
            };
        case 'setup_smart_planning':
            return {
                segments: [
                    t('Зараз у вас загальний список. Складіть персональний план під ваше весілля — це 2 хвилини'),
                ],
                icon: 'tip',
                href: ROUTES.smartPlanning,
                actions: [{ label: 'Скласти план', variant: 'primary', href: ROUTES.smartPlanning }],
            };
        case 'setup_smart_planning_date':
            return {
                segments: [t('Тепер, коли є дата, можемо розставити дедлайни під ваше весілля')],
                icon: 'tip',
                href: ROUTES.smartPlanning,
                actions: [{ label: 'Скласти план', variant: 'primary', href: ROUTES.smartPlanning }],
            };
        case 'post_wedding_feedback':
            return {
                segments: [b('Вітаємо з весіллям!'), t(' Розкажіть, як вам було з fata.studio')],
                icon: 'tip',
                href: ROUTES.feedback,
                actions: [{ label: 'Залишити відгук', variant: 'primary', href: ROUTES.feedback }],
            };
        case 'partner_joined':
            return {
                segments: [
                    b(actorName),
                    t(` ${verb(g, 'приєднався', 'приєдналася', 'приєднався(лася)')} до планування`),
                ],
                icon: 'partner',
                iconLetter: letter,
                href: ROUTES.dashboard,
                actions: [],
            };
        case 'partner_invite_declined':
            return {
                segments: [
                    b(actorName),
                    t(` ${verb(g, 'відхилив', 'відхилила')} запрошення до спільного доступу`),
                ],
                icon: 'partner_muted',
                iconLetter: letter,
                href: ROUTES.profilePartner,
                actions: [{ label: 'Надіслати ще раз', variant: 'primary', href: ROUTES.profilePartner }],
            };
    }
}
function plainText(segments) {
    return segments.map((s) => s.text).join('');
}
exports.VENDOR_CATEGORY_ACC = {
    venue: 'локацію',
    host: 'ведучого',
    photo: 'фотографа',
    video: 'відеографа',
    band: 'музикантів',
    dj: 'DJ',
    planner: 'організатора',
    decor: 'декоратора',
    florist: 'флориста',
    hair: 'стиліста зачіски',
    makeup: 'візажиста',
    attire: 'весільний салон',
    catering: 'кейтеринг',
    'ceremony-venue': 'локацію для церемонії',
    officiant: 'церемоніймейстера',
    transport: 'транспорт',
    choreographer: 'хореографа',
    cake: 'весільний торт',
    pastry: 'пекаря',
    candybar: 'кенді-бар',
    hotel: 'проживання для гостей',
};
//# sourceMappingURL=notification-catalog.js.map