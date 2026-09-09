"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { SmartPlanningWizard } from "@/components/smart-planning-wizard";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import {
  createTask,
  getMyWedding,
  updateTask,
  type TaskStatus,
  type Wedding,
  type WeddingTask,
} from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import {
  smartBannerKey,
  smartPlanDoneKey,
  type SmartPlanTask,
} from "@/lib/smart-planning";
import { suggestedDueDateForPlanItem } from "@/lib/wedding-plan";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/lib/auth-store";
import "../app/couple-cabinet.css";

type StatusFilter = "all" | "open" | "done";
type TypeFilter =
  | "all"
  | "prep"
  | "vendors"
  | "attire"
  | "guests"
  | "seating"
  | "budget"
  | "invites";
type DueFilter = "all" | "soon" | "overdue" | "nodate";
type WhoFilter = "all" | "owner" | "partner";
type SortMode = "urgent" | "date" | "alpha";

type ChecklistRow = WeddingTask & {
  effectiveDue: string | null;
  taskType: Exclude<TypeFilter, "all">;
  who: "owner" | "partner";
};

const TYPE_OPTIONS: Array<{ id: TypeFilter; label: string }> = [
  { id: "all", label: "Всі" },
  { id: "prep", label: "Підготовка" },
  { id: "vendors", label: "Підрядники" },
  { id: "attire", label: "Вбрання" },
  { id: "guests", label: "Гості" },
  { id: "seating", label: "Розсадка" },
  { id: "budget", label: "Бюджет" },
  { id: "invites", label: "Запрошення" },
];

const PAGE_SIZE = 12;

function formatTaskDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
}

function effectiveDueFor(task: WeddingTask, weddingDate: string) {
  if (task.dueDate) return task.dueDate.slice(0, 10);
  return suggestedDueDateForPlanItem(
    weddingDate,
    task.categorySlug,
    task.sortOrder,
  );
}

function resolveTaskType(
  slug: string | null | undefined,
  title: string,
): Exclude<TypeFilter, "all"> {
  const key = slug ?? "";
  const lower = title.toLowerCase();
  if (key === "starter-budget" || key === "budget" || lower.includes("бюджет")) {
    return "budget";
  }
  if (
    key === "invitations" ||
    key === "invite-guests" ||
    key === "website" ||
    lower.includes("запрош")
  ) {
    return "invites";
  }
  if (lower.includes("розсад") || key === "seating") return "seating";
  if (key === "attire" || key === "beauty" || lower.includes("вбран")) {
    return "attire";
  }
  if (
    key === "starter-guests" ||
    key === "guests" ||
    key === "rsvp" ||
    lower.includes("гост")
  ) {
    return "guests";
  }
  if (
    [
      "venue",
      "photo",
      "music",
      "catering",
      "decor",
      "officiant",
      "planner",
      "cake",
      "favorites",
      "requests",
    ].includes(key) ||
    lower.includes("фото") ||
    lower.includes("місц") ||
    lower.includes("ведуч") ||
    lower.includes("підряд")
  ) {
    return "vendors";
  }
  return "prep";
}

function typeMeta(type: Exclude<TypeFilter, "all">) {
  switch (type) {
    case "vendors":
      return { label: "Підрядники", tone: "green" as const };
    case "seating":
      return { label: "Розсадка", tone: "pink" as const };
    case "attire":
      return { label: "Вбрання", tone: "blue" as const };
    case "invites":
      return { label: "Запрошення", tone: "orange" as const };
    case "guests":
      return { label: "Гості", tone: "gray" as const };
    case "budget":
      return { label: "Бюджет", tone: "gray" as const };
    default:
      return { label: "Підготовка", tone: "gray" as const };
  }
}

function taskDateTone(due: string | null, isDone: boolean) {
  if (!due || isDone) return "";
  const today = new Date().toISOString().slice(0, 10);
  if (due < today) return " is-overdue";
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);
  if (due <= soon.toISOString().slice(0, 10)) return " is-soon";
  return "";
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

function ChecklistInner() {
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");
  const [whoFilter, setWhoFilter] = useState<WhoFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("urgent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newType, setNewType] = useState<Exclude<TypeFilter, "all"> | "">("");
  const [newWho, setNewWho] = useState<WhoFilter>("owner");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showSmartBanner, setShowSmartBanner] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        setWedding(await getMyWedding());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка завантаження");
        setWedding(null);
      } finally {
        setLoading(false);
      }
    })();
    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  useEffect(() => {
    if (!wedding) return;
    try {
      const dismissed =
        localStorage.getItem(smartBannerKey(wedding.id)) === "1";
      const done = localStorage.getItem(smartPlanDoneKey(wedding.id)) === "1";
      setShowSmartBanner(!dismissed && !done);
    } catch {
      setShowSmartBanner(true);
    }
  }, [wedding]);

  useEffect(() => {
    if (searchParams.get("smart") === "1") {
      setWizardOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [statusFilter, typeFilter, dueFilter, whoFilter, sortMode]);

  const fallbackNames = (user?.name ?? "")
    .split(/\s+(?:і|&|\+)\s+/i)
    .map((name) => name.trim());
  const partnerOneName =
    wedding?.partnerOneName || fallbackNames[0] || user?.name || "Оля";
  const partnerTwoName = wedding?.partnerTwoName || fallbackNames[1] || "Партнер";
  const ownerShort = firstName(partnerOneName) || "Оля";
  const partnerShort = firstName(partnerTwoName) || "Партнер";
  const oneInitial = partnerOneName.trim().charAt(0).toUpperCase();
  const twoInitial = partnerTwoName.trim().charAt(0).toUpperCase();
  const partnerInitials =
    oneInitial && twoInitial
      ? `${oneInitial}&${twoInitial}`
      : oneInitial || twoInitial || "П";

  const rows: ChecklistRow[] = useMemo(() => {
    if (!wedding) return [];
    return wedding.tasks.map((task) => {
      const effectiveDue = effectiveDueFor(task, wedding.date);
      return {
        ...task,
        effectiveDue,
        taskType: resolveTaskType(task.categorySlug, task.title),
        who: task.sortOrder % 2 === 0 ? "owner" : "partner",
      };
    });
  }, [wedding]);

  const today = new Date().toISOString().slice(0, 10);
  const soonLimit = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  }, []);

  const counts = useMemo(() => {
    const status = { all: rows.length, open: 0, done: 0 };
    const types: Record<TypeFilter, number> = {
      all: rows.length,
      prep: 0,
      vendors: 0,
      attire: 0,
      guests: 0,
      seating: 0,
      budget: 0,
      invites: 0,
    };
    const due = { all: rows.length, soon: 0, overdue: 0, nodate: 0 };
    const who = { all: rows.length, owner: 0, partner: 0 };

    for (const row of rows) {
      if (row.status === "DONE") status.done += 1;
      else status.open += 1;
      types[row.taskType] += 1;
      who[row.who] += 1;
      if (!row.effectiveDue) due.nodate += 1;
      else if (row.effectiveDue < today && row.status !== "DONE") due.overdue += 1;
      else if (row.effectiveDue <= soonLimit) due.soon += 1;
    }
    return { status, types, due, who };
  }, [rows, today, soonLimit]);

  const filtered = useMemo(() => {
    const list = rows.filter((row) => {
      if (statusFilter === "open" && row.status === "DONE") return false;
      if (statusFilter === "done" && row.status !== "DONE") return false;
      if (typeFilter !== "all" && row.taskType !== typeFilter) return false;
      if (whoFilter !== "all" && row.who !== whoFilter) return false;
      if (dueFilter === "nodate" && row.effectiveDue) return false;
      if (dueFilter === "overdue") {
        if (!row.effectiveDue || row.effectiveDue >= today || row.status === "DONE") {
          return false;
        }
      }
      if (dueFilter === "soon") {
        if (
          !row.effectiveDue ||
          row.effectiveDue < today ||
          row.effectiveDue > soonLimit
        ) {
          return false;
        }
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortMode === "alpha") {
        return a.title.localeCompare(b.title, "uk");
      }
      const aDone = a.status === "DONE" ? 1 : 0;
      const bDone = b.status === "DONE" ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      const aDue = a.effectiveDue ?? "9999-99-99";
      const bDue = b.effectiveDue ?? "9999-99-99";
      if (sortMode === "urgent") {
        const aOver = a.effectiveDue && a.effectiveDue < today ? 0 : 1;
        const bOver = b.effectiveDue && b.effectiveDue < today ? 0 : 1;
        if (aOver !== bOver) return aOver - bOver;
      }
      if (aDue !== bDue) return aDue.localeCompare(bDue);
      return a.sortOrder - b.sortOrder;
    });
  }, [rows, statusFilter, typeFilter, dueFilter, whoFilter, sortMode, today, soonLimit]);

  const visible = filtered.slice(0, visibleCount);
  const doneCount = counts.status.done;
  const totalCount = counts.status.all;
  const remaining = totalCount - doneCount;
  const progress =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  function patchLocal(taskId: string, patch: Partial<WeddingTask>) {
    setWedding((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) =>
              t.id === taskId ? { ...t, ...patch } : t,
            ),
          }
        : prev,
    );
  }

  async function onToggle(task: ChecklistRow) {
    const next: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";
    patchLocal(task.id, { status: next });
    try {
      await updateTask(task.id, { status: next });
    } catch (err) {
      patchLocal(task.id, { status: task.status });
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  function typeToSlug(type: Exclude<TypeFilter, "all"> | "") {
    switch (type) {
      case "vendors":
        return "photo";
      case "attire":
        return "attire";
      case "guests":
        return "guests";
      case "seating":
        return "seating";
      case "budget":
        return "budget";
      case "invites":
        return "invitations";
      case "prep":
        return "vibe";
      default:
        return "phase-1";
    }
  }

  async function onSaveTask(e: FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !wedding) return;
    setAdding(true);
    try {
      const created = await createTask({
        title,
        dueDate: newDue || undefined,
        categorySlug: typeToSlug(newType),
        sortOrder: newWho === "partner" ? 1 : 0,
      });
      setWedding((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, created] } : prev,
      );
      setNewTitle("");
      setNewDue("");
      setNewType("");
      setNewWho("owner");
      setDrawerOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не додано");
    } finally {
      setAdding(false);
    }
  }

  function dismissSmartBanner() {
    setShowSmartBanner(false);
    if (!wedding) return;
    try {
      localStorage.setItem(smartBannerKey(wedding.id), "1");
    } catch {
      /* ignore */
    }
  }

  async function onSmartPlanComplete(planTasks: SmartPlanTask[]) {
    if (!wedding) return;
    const existingTitles = new Set(
      wedding.tasks.map((t) => t.title.trim().toLowerCase()),
    );
    const toCreate = planTasks.filter(
      (t) => !existingTitles.has(t.title.trim().toLowerCase()),
    );

    const created: WeddingTask[] = [];
    for (const [index, task] of toCreate.entries()) {
      const row = await createTask(
        {
          title: task.title,
          categorySlug: task.categorySlug,
          sortOrder: 100 + index,
        },
        { silent: true },
      );
      created.push(row);
    }

    const starter = wedding.tasks.find(
      (t) =>
        !t.isCustom &&
        (t.categorySlug === "starter-plan" ||
          t.title === "Побудувати список завдань"),
    );
    if (starter && starter.status !== "DONE") {
      try {
        await updateTask(starter.id, { status: "DONE" });
        patchLocal(starter.id, { status: "DONE" });
      } catch {
        /* ignore */
      }
    }

    setWedding((prev) =>
      prev ? { ...prev, tasks: [...prev.tasks, ...created] } : prev,
    );

    try {
      localStorage.setItem(smartPlanDoneKey(wedding.id), "1");
      localStorage.setItem(smartBannerKey(wedding.id), "1");
      localStorage.setItem(`fata-dashboard-smart-planning:${wedding.id}`, "1");
    } catch {
      /* ignore */
    }

    setShowSmartBanner(false);
    setWizardOpen(false);
    toast.success(
      created.length > 0
        ? `Додано ${created.length} завдань до списку`
        : "План оновлено",
    );
  }

  if (loading) {
    return <PageLoader label="Завантажуємо задачі…" />;
  }

  if (!wedding) {
    return (
      <div className="cabinet-tasks-page">
        <div className="cabinet-tasks-top">
          <h1 className="cabinet-tasks-title">Завдання</h1>
        </div>
        <div className="cabinet-panel" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "#666" }}>
            Спочатку збережи дату весілля в огляді — тоді відкриється список задач.
          </p>
          <Link href="/dashboard" className="cabinet-panel-link">
            До огляду
          </Link>
        </div>
        {error ? <p className="cabinet-tasks-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="cabinet-tasks-page">
      <div className="cabinet-tasks-top">
        <h1 className="cabinet-tasks-title">Завдання</h1>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={partnerInitials} />
        </div>
      </div>

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      <article className="cabinet-tasks-progress">
        <div className="cabinet-tasks-progress-head">
          <div className="cabinet-tasks-progress-left">
            <p className="cabinet-tasks-progress-value">{progress}%</p>
            <p className="cabinet-tasks-progress-label">готовність весілля</p>
          </div>
          <span className="cabinet-tasks-progress-ratio">
            {doneCount}/{totalCount}
          </span>
        </div>
        <div className="cabinet-tasks-progress-bar">
          <span style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <div className="cabinet-tasks-progress-meta">
          <span>{doneCount} виконано</span>
          <span>{remaining} залишилось</span>
        </div>
      </article>

      <div className="cabinet-tasks-layout">
        <aside className="cabinet-tasks-filters">
          <FilterGroup
            title="Статус"
            items={[
              { id: "all", label: "Всі", count: counts.status.all },
              { id: "open", label: "Не виконано", count: counts.status.open },
              { id: "done", label: "Виконано", count: counts.status.done },
            ]}
            active={statusFilter}
            onChange={(id) => setStatusFilter(id as StatusFilter)}
          />
          <FilterGroup
            title="Тип завдання"
            items={TYPE_OPTIONS.map((opt) => ({
              id: opt.id,
              label: opt.label,
              count: counts.types[opt.id],
            }))}
            active={typeFilter}
            onChange={(id) => setTypeFilter(id as TypeFilter)}
          />
          <FilterGroup
            title="За терміном"
            items={[
              { id: "all", label: "Всі", count: counts.due.all },
              { id: "soon", label: "Найближчі 30 днів", count: counts.due.soon },
              {
                id: "overdue",
                label: "Протерміновані",
                count: counts.due.overdue,
              },
              { id: "nodate", label: "Без дати", count: counts.due.nodate },
            ]}
            active={dueFilter}
            onChange={(id) => setDueFilter(id as DueFilter)}
          />
          <FilterGroup
            title="Чиє завдання"
            items={[
              { id: "all", label: "Всі", count: counts.who.all },
              { id: "owner", label: ownerShort, count: counts.who.owner },
              { id: "partner", label: partnerShort, count: counts.who.partner },
            ]}
            active={whoFilter}
            onChange={(id) => setWhoFilter(id as WhoFilter)}
          />
        </aside>

        <section className="cabinet-tasks-list-panel">
          <div className="cabinet-tasks-list-head">
            <h2>Список завдань</h2>
            <div className="cabinet-tasks-list-actions">
              <label className="cabinet-tasks-sort">
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                >
                  <option value="urgent">Термінові зверху</option>
                  <option value="date">За датою</option>
                  <option value="alpha">За алфавітом</option>
                </select>
              </label>
              <button
                type="button"
                className="cabinet-tasks-add-btn"
                onClick={() => setDrawerOpen(true)}
              >
                <span aria-hidden>+</span>
                Додати завдання
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="cabinet-tasks-empty">Немає задач у цьому фільтрі.</p>
          ) : (
            <ul className="cabinet-task-list">
              {visible.map((task) => {
                const done = task.status === "DONE";
                const meta = typeMeta(task.taskType);
                return (
                  <li
                    key={task.id}
                    className={`cabinet-task-row${done ? " is-done" : ""}`}
                  >
                    <button
                      type="button"
                      className="cabinet-task-check"
                      aria-label={done ? "Повернути в роботу" : "Виконано"}
                      onClick={() => void onToggle(task)}
                    >
                      {done ? (
                        <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden>
                          <path
                            fill="currentColor"
                            d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5-5L12.3 5z"
                          />
                        </svg>
                      ) : null}
                    </button>
                    <p className="cabinet-task-title">{task.title}</p>
                    <div className="cabinet-task-meta-wrap">
                      <span className={`cabinet-task-tag is-${meta.tone}`}>
                        {meta.label}
                      </span>
                      {task.effectiveDue ? (
                        <span
                          className={`cabinet-task-date${taskDateTone(
                            task.effectiveDue,
                            done,
                          )}`}
                        >
                          {formatTaskDate(task.effectiveDue)}
                        </span>
                      ) : null}
                      <span
                        className={`cabinet-task-who is-${task.who}`}
                        title={
                          task.who === "owner" ? ownerShort : partnerShort
                        }
                      >
                        {task.who === "owner"
                          ? ownerShort.charAt(0)
                          : partnerShort.charAt(0)}
                      </span>
                      <span className="cabinet-task-menu" aria-hidden>
                        ⋯
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {showSmartBanner ? (
            <aside className="cabinet-smart-banner" aria-label="Розумне планування">
              <button
                type="button"
                className="cabinet-smart-banner-close"
                aria-label="Закрити"
                onClick={dismissSmartBanner}
              >
                ×
              </button>
              <h3>Розумне планування весілля</h3>
              <p>
                Ми зібрали завдання, які найчастіше виникають під час підготовки
                до весілля. Оберіть потрібні — і створіть свій персональний план
                без зайвого.
              </p>
              <button
                type="button"
                className="cabinet-smart-banner-cta"
                onClick={() => setWizardOpen(true)}
              >
                Почати розумне планування
              </button>
            </aside>
          ) : null}

          {filtered.length > visibleCount ? (
            <button
              type="button"
              className="cabinet-panel-link cabinet-tasks-more"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            >
              Показати більше
            </button>
          ) : null}
        </section>
      </div>

      {wizardOpen ? (
        <SmartPlanningWizard
          partnerInitials={partnerInitials}
          onClose={() => setWizardOpen(false)}
          onComplete={onSmartPlanComplete}
        />
      ) : null}

      {drawerOpen ? (
        <div className="cabinet-drawer-root">
          <button
            type="button"
            className="cabinet-drawer-backdrop"
            aria-label="Закрити"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="cabinet-drawer" aria-label="Додати завдання">
            <div className="cabinet-drawer-head">
              <h2>Додати завдання</h2>
              <button
                type="button"
                className="cabinet-drawer-close"
                aria-label="Закрити"
                onClick={() => setDrawerOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="cabinet-drawer-form" onSubmit={onSaveTask}>
              <label className="cabinet-drawer-field">
                <span>Назва завдання</span>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Наприклад, Замовити весільний торт"
                  required
                />
              </label>
              <label className="cabinet-drawer-field">
                <span>Дедлайн</span>
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                />
              </label>
              <label className="cabinet-drawer-field">
                <span>Тип завдання</span>
                <select
                  value={newType}
                  onChange={(e) =>
                    setNewType(e.target.value as Exclude<TypeFilter, "all"> | "")
                  }
                >
                  <option value="">Не призначено</option>
                  {TYPE_OPTIONS.filter((o) => o.id !== "all").map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="cabinet-drawer-field">
                <span>Відповідальний</span>
                <select
                  value={newWho}
                  onChange={(e) => setNewWho(e.target.value as WhoFilter)}
                >
                  <option value="owner">{ownerShort}</option>
                  <option value="partner">{partnerShort}</option>
                </select>
              </label>
              <div className="cabinet-drawer-actions">
                <button
                  type="button"
                  className="cabinet-drawer-cancel"
                  onClick={() => setDrawerOpen(false)}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="cabinet-drawer-save"
                  disabled={adding || !newTitle.trim()}
                >
                  {adding ? "…" : "Зберегти"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({
  title,
  items,
  active,
  onChange,
}: {
  title: string;
  items: Array<{ id: string; label: string; count: number }>;
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="cabinet-filter-group">
      <p className="cabinet-filter-title">{title}</p>
      <div className="cabinet-filter-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`cabinet-filter-item${active === item.id ? " is-active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            <span className="cabinet-filter-count">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CoupleChecklistPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <Suspense fallback={<PageLoader label="Завантажуємо задачі…" />}>
        <ChecklistInner />
      </Suspense>
    </RequireAuth>
  );
}
