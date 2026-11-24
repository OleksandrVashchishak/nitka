import {
  CATEGORIES,
  TASK_TEMPLATES,
  type CategoryId,
  type Due,
  type FlagId,
  type TaskTemplate,
} from "@/lib/smart-planning-config";
import type { CabinetCategoryId } from "@/lib/cabinet-categories";

/** Специфікація: smart-planning-spec.md, розділ 6. Усі функції чисті. */

export function isVisible(t: TaskTemplate, flags: ReadonlySet<FlagId>): boolean {
  if (t.showIf && !t.showIf.some((f) => flags.has(f))) return false;
  if (t.hideIf && t.hideIf.some((f) => flags.has(f))) return false;
  return true;
}

export function labels(t: TaskTemplate, flags: ReadonlySet<FlagId>) {
  const o = t.override?.find((item) => item.if.some((f) => flags.has(f)));
  return {
    step2: o?.step2Label ?? t.step2Label,
    step3: o?.step3Label ?? t.step3Label,
  };
}

// ───────── Дати (рядки YYYY-MM-DD, без часових поясів)

function parseIsoDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { y, m, d };
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysInMonth(y: number, m: number) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function addDays(iso: string, days: number) {
  const { y, m, d } = parseIsoDate(iso);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return toIso(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/** Календарні місяці; кінець місяця клемпиться до останнього дня. */
function subMonths(iso: string, months: number) {
  const { y, m, d } = parseIsoDate(iso);
  const total = y * 12 + (m - 1) - months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return toIso(ny, nm, Math.min(d, daysInMonth(ny, nm)));
}

/** Локальна «сьогодні» у форматі YYYY-MM-DD. */
export function todayIso(now = new Date()) {
  return toIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function computeDue(
  due: Due,
  weddingDate: string | null,
  today: string,
): { dueDate: string | null; isUrgent: boolean } {
  if (!weddingDate) return { dueDate: null, isUrgent: false };
  const raw =
    "months" in due
      ? subMonths(weddingDate, due.months)
      : addDays(weddingDate, -7 * due.weeks);
  if (raw < today) return { dueDate: addDays(today, 7), isUrgent: true };
  return { dueDate: raw, isUrgent: false };
}

// ───────── План

export type PlanTask = TaskTemplate & {
  dueDate: string | null;
  isUrgent: boolean;
  labels: { step2: string; step3: string };
};

export type BuildPlanInput = {
  flags: ReadonlySet<FlagId>;
  doneIds: ReadonlySet<string>;
  deletedIds: ReadonlySet<string>;
  existingTemplateIds: ReadonlySet<string>;
  weddingDate: string | null;
  today: string;
};

export function buildPlan({
  flags,
  doneIds,
  deletedIds,
  existingTemplateIds,
  weddingDate,
  today,
}: BuildPlanInput): PlanTask[] {
  return TASK_TEMPLATES.filter((t) => isVisible(t, flags))
    .filter((t) => !existingTemplateIds.has(t.id))
    .filter((t) => !doneIds.has(t.id))
    .filter((t) => !deletedIds.has(t.id))
    .map((t) => ({
      ...t,
      ...computeDue(t.due, weddingDate, today),
      labels: labels(t, flags),
    }));
}

/** Крок 2: видимі шаблони без уже існуючих у вкладці «Завдання». */
export function step2Templates(
  flags: ReadonlySet<FlagId>,
  existingTemplateIds: ReadonlySet<string>,
) {
  return TASK_TEMPLATES.filter((t) => isVisible(t, flags)).filter(
    (t) => !existingTemplateIds.has(t.id),
  );
}

/** Правило 4.5: прибрати відмітки кроку 2 для шаблонів, що стали невидимими. */
export function pruneDoneIds(
  doneIds: ReadonlySet<string>,
  flags: ReadonlySet<FlagId>,
): Set<string> {
  const visible = new Set(
    TASK_TEMPLATES.filter((t) => isVisible(t, flags)).map((t) => t.id),
  );
  return new Set([...doneIds].filter((id) => visible.has(id)));
}

/** Групування в порядку CATEGORIES; порожні категорії не повертаються. */
export function groupByCategory<T extends { category: CategoryId }>(items: T[]) {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
    title: cat.title,
    items: items.filter((item) => item.category === cat.id),
  })).filter((group) => group.items.length > 0);
}

/** Крок 3: за дедлайном (найближчі зверху), за рівних — порядок конфігу. */
export function sortByDue(tasks: PlanTask[]): PlanTask[] {
  return tasks
    .map((task, index) => ({ task, index }))
    .sort((a, b) => {
      const da = a.task.dueDate;
      const db = b.task.dueDate;
      if (da && db && da !== db) return da < db ? -1 : 1;
      return a.index - b.index;
    })
    .map(({ task }) => task);
}

// ───────── Тексти

const ukPlural = new Intl.PluralRules("uk");

/** 1 / 2–4 → «завдання», 0 / 5–20 / 11–14 → «завдань». */
export function pluralTasks(n: number) {
  const form = ukPlural.select(n);
  return form === "one" || form === "few" ? "завдання" : "завдань";
}

// ───────── Збереження у вкладку «Завдання»

/** Категорія плану → категорія вкладки «Завдання». */
const CATEGORY_TO_CABINET: Record<CategoryId, CabinetCategoryId> = {
  basics: "other",
  ceremony: "other",
  traditions: "other",
  team: "vendors",
  decor: "decor",
  looks: "attire",
  guests: "other",
  banquet: "banquet",
  offsite: "banquet",
  wedding_day: "other",
  honeymoon: "other",
};

/** categorySlug = `<категорія плану>@<категорія кабінету>` (див. resolveCabinetCategory). */
export function planCategorySlug(category: CategoryId) {
  return `${category}@${CATEGORY_TO_CABINET[category]}`;
}

export function smartBannerKey(weddingId: string) {
  return `fata-smart-plan-banner:${weddingId}`;
}

export function smartPlanDoneKey(weddingId: string) {
  return `fata-smart-plan-done:${weddingId}`;
}
