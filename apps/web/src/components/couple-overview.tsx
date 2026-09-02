"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBudget } from "@/lib/budget-api";
import {
  getDashboardInsights,
  getDayPlan,
  getVendorPipeline,
  updateTask,
  type DashboardInsights,
  type VendorPipeline,
  type Wedding,
  type WeddingTask,
} from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { toast } from "@/lib/toast";
import { VENDOR_MANAGER_CATEGORIES } from "@/lib/vendor-manager";
import { suggestedDueDateForPlanItem } from "@/lib/wedding-plan";

const VENDOR_TARGET = VENDOR_MANAGER_CATEGORIES.filter(
  (category) => category.slug !== "other",
).length;

function daysWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return "днів";
  if (d === 1) return "день";
  if (d >= 2 && d <= 4) return "дні";
  return "днів";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(Math.round(value));
}

function formatTaskDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
}

function taskDue(task: WeddingTask, weddingDate: string) {
  return (
    task.dueDate?.slice(0, 10) ??
    suggestedDueDateForPlanItem(weddingDate, task.categorySlug, task.sortOrder)
  );
}

function taskDateTone(due: string | null, isDone: boolean) {
  if (!due || isDone) return "";
  const today = new Date().toISOString().slice(0, 10);
  if (due < today) return " is-overdue";
  const soon = new Date();
  soon.setDate(soon.getDate() + 14);
  if (due <= soon.toISOString().slice(0, 10)) return " is-soon";
  return "";
}

function countChosenVendorCategories(pipeline: VendorPipeline | null) {
  if (!pipeline) return 0;
  const categories = new Set<string>();
  for (const item of pipeline.catalog) {
    if (item.stage === "CHOSEN") {
      categories.add(item.vendor.category.slug);
    }
  }
  for (const item of pipeline.manual) {
    if (item.stage === "CHOSEN") {
      categories.add(item.category);
    }
  }
  return categories.size;
}

function taskCategoryMeta(slug: string | null | undefined, title: string) {
  const key = slug ?? "";
  const lower = title.toLowerCase();
  if (key === "invitations" || key === "invite-guests" || key === "website") {
    return { label: "Запрошення", tone: "orange" as const };
  }
  if (lower.includes("розсад")) {
    return { label: "Розсадка", tone: "pink" as const };
  }
  if (key === "attire" || key === "beauty" || lower.includes("вбран")) {
    return { label: "Вбрання", tone: "blue" as const };
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
      "vibe",
      "favorites",
      "requests",
    ].includes(key) ||
    lower.includes("фото") ||
    lower.includes("місц") ||
    lower.includes("ведуч")
  ) {
    return { label: "Підрядники", tone: "green" as const };
  }
  if (key === "guests" || key === "rsvp") {
    return { label: "Гості", tone: "gray" as const };
  }
  return { label: "План", tone: "gray" as const };
}

export function CoupleOverview({
  wedding,
  greetingName,
  partnerName,
  partnerInitials,
  daysLeft,
  onTaskChange,
}: {
  wedding: Wedding;
  greetingName: string;
  partnerName: string;
  partnerInitials: string;
  daysLeft: number;
  onTaskChange: (task: WeddingTask) => void;
}) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [pipeline, setPipeline] = useState<VendorPipeline | null>(null);
  const [spend, setSpend] = useState<number | null>(null);
  const [hasDayPlan, setHasDayPlan] = useState(false);
  const [statsReady, setStatsReady] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [insightsData, summaryData, pipelineData, budgetData, dayPlanData] =
          await Promise.all([
            getDashboardInsights(),
            getNotificationsSummary(),
            getVendorPipeline().catch(() => null),
            getBudget().catch(() => null),
            getDayPlan(),
          ]);
        if (cancelled) return;
        setInsights(insightsData);
        setSummary(summaryData);
        setPipeline(pipelineData);
        setHasDayPlan(Boolean(dayPlanData?.dayPlan?.events?.length));
        if (budgetData?.items?.length) {
          setSpend(
            budgetData.items.reduce(
              (total, item) => total + Math.max(item.actual, item.estimated),
              0,
            ),
          );
        } else if (insightsData) {
          setSpend(
            Math.max(insightsData.budget.actual, insightsData.budget.estimated),
          );
        } else {
          setSpend(0);
        }
      } catch {
        if (!cancelled) {
          setSpend(0);
        }
      } finally {
        if (!cancelled) setStatsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!notifyRef.current?.contains(event.target as Node)) {
        setNotifyOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const done =
    insights?.plan.done ??
    wedding.tasks.filter((task) => task.status === "DONE").length;
  const total = insights?.plan.total ?? wedding.tasks.length;
  const remaining = total - done;
  const progress =
    insights?.plan.progress ??
    Math.round((done / Math.max(total, 1)) * 100);

  const tasks = useMemo(() => {
    return [...wedding.tasks]
      .map((task) => ({
        task,
        due: taskDue(task, wedding.date),
        done: task.status === "DONE",
      }))
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        const ad = a.due ?? "9999-99-99";
        const bd = b.due ?? "9999-99-99";
        return ad.localeCompare(bd);
      })
      .slice(0, 7);
  }, [wedding.tasks, wedding.date]);

  const vendorChosen = countChosenVendorCategories(pipeline);
  const guestCount = insights?.rsvp.total || wedding.guests;
  const daysLabel =
    daysLeft > 0
      ? `${daysLeft} ${daysWord(daysLeft)}`
      : daysLeft === 0
        ? "сьогодні"
        : "вже відбулось";
  const photo = wedding.couplePhotoUrl || "/landing/couple.jpg";
  const notifyTotal = summary?.total ?? 0;

  async function onToggleTask(task: WeddingTask, isDone: boolean) {
    try {
      const updated = await updateTask(task.id, {
        status: isDone ? "TODO" : "DONE",
      });
      onTaskChange(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено задачу");
    }
  }

  return (
    <div className="cabinet-overview">
      <div className="cabinet-overview-top">
        <div className="cabinet-overview-greeting">
          <h1>Привіт, {greetingName}!</h1>
          <p>
            Ви {partnerName ? `з ${partnerName} ` : ""}одружуєтесь через{" "}
            <strong>{daysLabel}</strong>.
          </p>
        </div>
        <div className="cabinet-overview-actions">
          <div className="cabinet-notify-wrap" ref={notifyRef}>
            <button
              type="button"
              className="cabinet-bell"
              aria-label="Сповіщення"
              aria-expanded={notifyOpen}
              onClick={() => setNotifyOpen((open) => !open)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22ZM18 16v-4.5a6 6 0 1 0-12 0V16l-2 2h16l-2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {notifyTotal > 0 ? (
                <span className="cabinet-bell-badge">
                  {notifyTotal > 99 ? "99+" : notifyTotal}
                </span>
              ) : null}
            </button>
            {notifyOpen && summary?.items?.length ? (
              <div className="cabinet-notify-menu">
                {summary.items.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="cabinet-notify-item"
                    onClick={() => setNotifyOpen(false)}
                  >
                    <span>{item.label}</span>
                    <span className="cabinet-notify-count">{item.count}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/website" className="cabinet-profile" aria-label="Профіль пари">
            <span className="cabinet-profile-avatar">{partnerInitials}</span>
            <span aria-hidden>▾</span>
          </Link>
        </div>
      </div>

      <div className="cabinet-body">
        <div className="cabinet-stats">
          <article className="cabinet-stat is-light">
            <p className="cabinet-stat-value">
              {statsReady ? `${vendorChosen}/${VENDOR_TARGET}` : "—"}
            </p>
            <p className="cabinet-stat-label">Підрядників</p>
            <Link href="/my-vendors" className="cabinet-stat-link">
              Детальніше
            </Link>
          </article>
          <article className="cabinet-stat is-light">
            <p className="cabinet-stat-value">
              {statsReady && spend != null ? `${formatMoney(spend)} ₴` : "—"}
            </p>
            <p className="cabinet-stat-label">Витрат (фактичні і плановані)</p>
            <Link href="/budget" className="cabinet-stat-link">
              Детальніше
            </Link>
          </article>
          <article className="cabinet-stat is-light">
            <p className="cabinet-stat-value">
              {statsReady ? guestCount : "—"}
            </p>
            <p className="cabinet-stat-label">Гостей внесено</p>
            <Link href="/guests" className="cabinet-stat-link">
              Детальніше
            </Link>
          </article>
        </div>

        <aside className="cabinet-right-col">
          <article className="cabinet-side-progress">
            <div className="cabinet-side-progress-head">
              <div>
                <p className="cabinet-side-progress-value">{progress}%</p>
                <p className="cabinet-side-progress-label">готовність весілля</p>
              </div>
              <span className="cabinet-side-progress-ratio">
                {done}/{total}
              </span>
            </div>
            <div className="cabinet-side-progress-bar">
              <span style={{ width: `${Math.min(100, progress)}%` }} />
            </div>
            <div className="cabinet-side-progress-meta">
              <span>{done} виконано</span>
              <span>{remaining} залишилось</span>
            </div>
          </article>

          <div className="cabinet-photo">
            <Image src={photo} alt="Фото пари" fill className="object-cover" sizes="361px" />
          </div>

          <article className="cabinet-panel cabinet-day-card">
            <div className="cabinet-day-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <h3>План весільного дня</h3>
            <p>
              {hasDayPlan
                ? "Таймінг уже зібраний — можна доповнити або поділитись із підрядниками."
                : "Розпишіть свій план весільного дня та поділіться ним з вашими підрядниками."}
            </p>
            <Link href="/day-plan" className="cabinet-panel-link">
              {hasDayPlan ? "Відкрити план" : "Внести подію"}
            </Link>
          </article>
        </aside>

        <section className="cabinet-panel cabinet-tasks-panel">
          <h2>Завдання</h2>
          <ul className="cabinet-task-list">
            {tasks.map(({ task, due, done: isDone }) => {
              const cat = taskCategoryMeta(task.categorySlug, task.title);
              const who = task.sortOrder % 2 === 0 ? "owner" : "partner";
              return (
                <li
                  key={task.id}
                  className={`cabinet-task-row${isDone ? " is-done" : ""}`}
                >
                  <button
                    type="button"
                    className="cabinet-task-check"
                    aria-label={isDone ? "Повернути в роботу" : "Виконано"}
                    onClick={() => void onToggleTask(task, isDone)}
                  >
                    {isDone ? (
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
                    <span className={`cabinet-task-tag is-${cat.tone}`}>
                      {cat.label}
                    </span>
                    {due ? (
                      <span
                        className={`cabinet-task-date${taskDateTone(due, isDone)}`}
                      >
                        {formatTaskDate(due)}
                      </span>
                    ) : null}
                    <span className={`cabinet-task-who is-${who}`}>
                      {who === "owner"
                        ? greetingName.charAt(0)
                        : partnerName.charAt(0) || "P"}
                    </span>
                    <Link
                      href="/checklist"
                      className="cabinet-task-menu"
                      aria-label="Відкрити всі завдання"
                    >
                      ⋯
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/checklist" className="cabinet-panel-link">
            Переглянути всі завдання
          </Link>
        </section>
      </div>
    </div>
  );
}
