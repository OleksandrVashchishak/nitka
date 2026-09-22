"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBudget } from "@/lib/budget-api";
import {
  createPartnerInvite,
  getDashboardInsights,
  getDayPlan,
  getVendorPipeline,
  updateTask,
  type DashboardInsights,
  type VendorPipeline,
  type Wedding,
  type WeddingTask,
} from "@/lib/dashboard-api";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { IconMore } from "@/components/icon-more";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { IconTaskCheck } from "@/components/cabinet-task-icons";
import { toast } from "@/lib/toast";
import { VENDOR_MANAGER_CATEGORIES } from "@/lib/vendor-manager";
import { suggestedDueDateForPlanItem } from "@/lib/wedding-plan";

const VENDOR_TARGET = VENDOR_MANAGER_CATEGORIES.filter(
  (category) => category.slug !== "other",
).length;

const STARTER_TASKS = [
  {
    id: "checklist",
    title: "Побудувати список завдань",
    href: "/checklist",
  },
  {
    id: "guests",
    title: "Додати гостей",
    href: "/guests",
  },
  {
    id: "budget",
    title: "Внести витрати",
    href: "/budget",
  },
] as const;

function inviteDismissKey(weddingId: string) {
  return `fata-dashboard-invite-dismissed:${weddingId}`;
}

function smartPlanningKey(weddingId: string) {
  return `fata-dashboard-smart-planning:${weddingId}`;
}

function daysWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return "днів";
  if (d === 1) return "день";
  if (d >= 2 && d <= 4) return "дні";
  return "днів";
}

const USD_RATE = 41;

function formatMoneyUsd(uah: number) {
  const usd = Math.round(uah / USD_RATE);
  return `$${new Intl.NumberFormat("uk-UA").format(usd)}`;
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
    return { label: "Підрядники", tone: "lilac" as const };
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
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [smartPlanningStarted, setSmartPlanningStarted] = useState(false);

  useEffect(() => {
    try {
      setInviteDismissed(
        localStorage.getItem(inviteDismissKey(wedding.id)) === "1",
      );
      setSmartPlanningStarted(
        localStorage.getItem(smartPlanningKey(wedding.id)) === "1",
      );
    } catch {
      /* ignore */
    }
  }, [wedding.id]);

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
  const guestsInList = insights?.rsvp.total ?? 0;
  const guestCount = guestsInList || wedding.guests;
  const spendValue = spend ?? 0;
  const hasVendors = vendorChosen > 0;
  const hasSpend = spendValue > 0;
  const hasGuests = guestsInList > 0;
  const isOwner = (wedding.myRole ?? "OWNER") === "OWNER";
  const hasPartner = (wedding.members ?? []).some(
    (member) => member.role === "PARTNER",
  );
  const inviteName = partnerName.trim() || "партнера";
  const showInviteTask = isOwner && !hasPartner && !inviteDismissed;
  const isTasksFirstState =
    !smartPlanningStarted && done === 0 && !hasGuests && !hasSpend;
  const daysLabel =
    daysLeft > 0
      ? `${daysLeft} ${daysWord(daysLeft)}`
      : daysLeft === 0
        ? "сьогодні"
        : "вже відбулось";
  const photo = wedding.couplePhotoUrl || "/landing/couple.jpg";

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

  async function onInvitePartner() {
    setInviteBusy(true);
    try {
      const invite = await createPartnerInvite();
      const url = `${window.location.origin}${invite.path}`;
      await navigator.clipboard.writeText(url);
      toast.success("Лінк скопійовано", "Надішли партнеру — діятиме 14 днів");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не створено лінк");
    } finally {
      setInviteBusy(false);
    }
  }

  function onDismissInvite() {
    setInviteDismissed(true);
    try {
      localStorage.setItem(inviteDismissKey(wedding.id), "1");
    } catch {
      /* ignore */
    }
  }

  function onStartSmartPlanning() {
    setSmartPlanningStarted(true);
    try {
      localStorage.setItem(smartPlanningKey(wedding.id), "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="cabinet-overview">
      <div className="cabinet-overview-top">
        <Link href="/dashboard" className="cabinet-mobile-brand">
          fata.studi<span className="cabinet-logo-dot">o</span>
        </Link>
        <div className="cabinet-overview-greeting">
          <h1>Привіт, {greetingName}!</h1>
          <p>
            Ви {partnerName ? `з ${partnerName} ` : ""}одружуєтесь через{" "}
            <strong>{daysLabel}</strong>.
          </p>
        </div>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={partnerInitials} />
        </div>
      </div>

      <div className="cabinet-body">
        <div className="cabinet-stats">
          {statsReady && !hasSpend ? (
            <article className="cabinet-stat is-light is-cta">
              <p className="cabinet-stat-cta-title">
                Тут можна разом контролювати витрати{" "}
                <span aria-hidden>❤️</span>
              </p>
              <Link href="/budget" className="cabinet-stat-link">
                Внести витрати
              </Link>
            </article>
          ) : (
            <article className="cabinet-stat is-light">
              <p className="cabinet-stat-value">
                {statsReady && spend != null ? formatMoneyUsd(spend) : "—"}
              </p>
              <p className="cabinet-stat-label cabinet-stat-label--full">
                Витрат (фактичні і плановані)
              </p>
              <p className="cabinet-stat-label cabinet-stat-label--short">Витрат</p>
              <Link href="/budget" className="cabinet-stat-link">
                Детальніше
              </Link>
            </article>
          )}

          {statsReady && !hasVendors ? (
            <article className="cabinet-stat is-light is-cta">
              <p className="cabinet-stat-cta-title">
                Чи забронювали ви уже підрядників?
              </p>
              <Link href="/my-vendors" className="cabinet-stat-link">
                Внести підрядників
              </Link>
            </article>
          ) : (
            <article className="cabinet-stat is-light">
              <p className="cabinet-stat-value">
                {statsReady ? `${vendorChosen}/${VENDOR_TARGET}` : "—"}
              </p>
              <p className="cabinet-stat-label">Підрядників</p>
              <Link href="/my-vendors" className="cabinet-stat-link">
                Детальніше
              </Link>
            </article>
          )}

          {statsReady && !hasGuests ? (
            <article className="cabinet-stat is-light is-cta">
              <p className="cabinet-stat-cta-title">
                Давайте внесем сюди список гостей
              </p>
              <Link href="/guests" className="cabinet-stat-link">
                Внести гостей
              </Link>
            </article>
          ) : (
            <article className="cabinet-stat is-light">
              <p className="cabinet-stat-value">
                {statsReady ? guestCount : "—"}
              </p>
              <p className="cabinet-stat-label">Гостей внесено</p>
              <Link href="/guests" className="cabinet-stat-link">
                Детальніше
              </Link>
            </article>
          )}
        </div>

        <aside className="cabinet-right-col">
          <article className="cabinet-side-progress">
            <div className="cabinet-side-progress-head">
              <div className="cabinet-side-progress-title">
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

        <section className="cabinet-tasks-panel">
          <h2>Завдання</h2>
          <ul className="cabinet-task-list">
            {showInviteTask ? (
              <li className="cabinet-task-invite">
                <div className="cabinet-task-invite-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 11l3 3L22 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="cabinet-task-invite-copy">
                  <p className="cabinet-task-invite-title">
                    Запросіть {inviteName}
                  </p>
                  <p className="cabinet-task-invite-text">
                    Додайте {inviteName} до спільного доступу, щоб разом бачити
                    та редагувати ваш дашборд.
                  </p>
                </div>
                <div className="cabinet-task-invite-actions">
                  <button
                    type="button"
                    className="cabinet-task-invite-btn"
                    disabled={inviteBusy}
                    onClick={() => void onInvitePartner()}
                  >
                    {inviteBusy ? "…" : "Запросити"}
                  </button>
                  <button
                    type="button"
                    className="cabinet-task-invite-dismiss"
                    aria-label="Закрити"
                    onClick={onDismissInvite}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                      <path
                        d="M2 2l8 8M10 2 2 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ) : null}

            {isTasksFirstState
              ? STARTER_TASKS.map((item) => (
                  <li key={item.id} className="cabinet-task-row is-starter">
                    <span className="cabinet-task-check" aria-hidden />
                    <div className="cabinet-task-body">
                      <Link href={item.href} className="cabinet-task-title">
                        {item.title}
                      </Link>
                      <div className="cabinet-task-meta-wrap">
                        <div className="cabinet-task-meta" />
                        <div className="cabinet-task-actions">
                          <Link
                            href={item.href}
                            className="cabinet-task-menu"
                            aria-label="Відкрити"
                          >
                            <IconMore />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : tasks.map(({ task, due, done: isDone }) => {
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
                        <IconTaskCheck className="cabinet-task-check__mark" />
                      </button>
                      <div className="cabinet-task-body">
                        <p className="cabinet-task-title">{task.title}</p>
                        <div className="cabinet-task-meta-wrap">
                          <div className="cabinet-task-meta">
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
                          </div>
                          <div className="cabinet-task-actions">
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
                              <IconMore />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
          </ul>
          {isTasksFirstState ? (
            <Link
              href="/checklist?smart=1"
              className="cabinet-panel-link"
              onClick={onStartSmartPlanning}
            >
              Розпочати розумне планування
            </Link>
          ) : (
            <Link href="/checklist" className="cabinet-panel-link">
              Переглянути всі завдання
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
