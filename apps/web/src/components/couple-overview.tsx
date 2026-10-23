"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { getBudget } from "@/lib/budget-api";
import {
  createPartnerInvite,
  deleteTask,
  getDashboardInsights,
  getVendorPipeline,
  updateTask,
  type DashboardInsights,
  type TaskAssignee,
  type VendorPipeline,
  type Wedding,
  type WeddingTask,
} from "@/lib/dashboard-api";
import {
  fetchDayPlan,
  sortDayPlanEvents,
  type DayPlanEvent,
} from "@/lib/day-plan";
import { hasUserInspirationContent } from "@/lib/inspiration-boards";
import {
  CabinetContextMenu,
  CabinetContextMenuDivider,
  CabinetContextMenuItem,
} from "@/components/cabinet-context-menu";
import { TaskAssigneeMenuBlock } from "@/components/task-assignee-menu";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { BrandLogo } from "@/components/brand-logo";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { PartnerInviteBanner } from "@/components/partner-invite-banner";
import { useMenuOutsideClose } from "@/hooks/use-menu-outside-close";
import { IconButton } from "@/components/ui/icon-button";
import { uaNameInstrumental } from "@/lib/ua-name-case";
import {
  cabinetCategoryMeta,
  resolveCabinetCategory,
} from "@/lib/cabinet-categories";


import {
  ResponsibleAvatar,
  TaskResponsibleAvatar,
} from "@/components/responsible-avatar";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { DateInput } from "@/components/ui/date-input";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";
import { useAnimatedProgress } from "@/lib/use-animated-progress";

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

/** Скільки «слотів» плану дня показуємо в бейджі на огляді (Figma). */
const DAY_PLAN_OVERVIEW_TARGET = 12;
const DAY_PLAN_OVERVIEW_PREVIEW = 4;

function unplannedMomentsLabel(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return `${n} моментів ще не заплановано`;
  if (d === 1) return `${n} момент ще не запланований`;
  if (d >= 2 && d <= 4) return `${n} моменти ще не заплановані`;
  return `${n} моментів ще не заплановано`;
}

const USD_RATE = 41;
/** Чекнуті на огляді лишаються видимими добу (і після релоаду). */
const DONE_LINGER_MS = 24 * 60 * 60 * 1000;

type DoneLingerMap = Record<string, number>;

function doneLingerKey(weddingId: string) {
  return `fata-overview-done-linger:${weddingId}`;
}

function pruneDoneLinger(map: DoneLingerMap, now = Date.now()): DoneLingerMap {
  const next: DoneLingerMap = {};
  for (const [id, at] of Object.entries(map)) {
    if (typeof at === "number" && now - at < DONE_LINGER_MS) next[id] = at;
  }
  return next;
}

function readDoneLinger(weddingId: string): DoneLingerMap {
  try {
    const raw = localStorage.getItem(doneLingerKey(weddingId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DoneLingerMap;
    if (!parsed || typeof parsed !== "object") return {};
    const pruned = pruneDoneLinger(parsed);
    if (Object.keys(pruned).length !== Object.keys(parsed).length) {
      localStorage.setItem(doneLingerKey(weddingId), JSON.stringify(pruned));
    }
    return pruned;
  } catch {
    return {};
  }
}

function writeDoneLinger(weddingId: string, map: DoneLingerMap) {
  try {
    const pruned = pruneDoneLinger(map);
    localStorage.setItem(doneLingerKey(weddingId), JSON.stringify(pruned));
  } catch {
    /* ignore */
  }
}

function formatMoneyUsd(uah: number) {
  const usd = Math.round(uah / USD_RATE);
  return `$${new Intl.NumberFormat("uk-UA").format(usd)}`;
}

function formatTaskDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
}

function taskDue(task: WeddingTask, _weddingDate: string) {
  return task.dueDate ? task.dueDate.slice(0, 10) : null;
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

/** Заповнені категорії з обраного плану / розмір плану. */
function vendorPlanProgress(pipeline: VendorPipeline | null) {
  if (!pipeline) return { filled: 0, total: 0 };
  const plan = pipeline.plan ?? [];
  if (!plan.length) return { filled: 0, total: 0 };
  const filledCategories = new Set(
    pipeline.manual.map((item) => item.category).filter(Boolean),
  );
  let filled = 0;
  for (const slug of plan) {
    if (filledCategories.has(slug)) filled += 1;
  }
  return { filled, total: plan.length };
}

function taskCategoryMeta(slug: string | null | undefined, title: string) {
  return cabinetCategoryMeta(resolveCabinetCategory(slug, title));
}

export function CoupleOverview({
  wedding,
  greetingName,
  partnerName,
  partnerInitials,
  daysLeft,
  onTaskChange,
  onTaskRemove,
}: {
  wedding: Wedding;
  greetingName: string;
  partnerName: string;
  partnerInitials: string;
  daysLeft: number;
  onTaskChange: (task: WeddingTask) => void;
  onTaskRemove: (taskId: string) => void;
}) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [pipeline, setPipeline] = useState<VendorPipeline | null>(null);
  const [spend, setSpend] = useState<number | null>(null);
  const [dayPlanEvents, setDayPlanEvents] = useState<DayPlanEvent[]>([]);
  const [statsReady, setStatsReady] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [smartPlanningStarted, setSmartPlanningStarted] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WeddingTask | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WeddingTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editWho, setEditWho] = useState<TaskAssignee>("none");
  const [editOtherName, setEditOtherName] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  /** taskId → коли чекнули; тримаємо на огляді 24 год. */
  const [doneLinger, setDoneLinger] = useState<DoneLingerMap>({});
  const [hasInspiration, setHasInspiration] = useState(false);
  const lingerExpiryTimerRef = useRef<number | null>(null);

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
    setDoneLinger(readDoneLinger(wedding.id));
  }, [wedding.id]);

  useEffect(() => {
    function refreshInspiration() {
      setHasInspiration(hasUserInspirationContent(wedding.id));
    }
    refreshInspiration();
    window.addEventListener("focus", refreshInspiration);
    window.addEventListener("storage", refreshInspiration);
    return () => {
      window.removeEventListener("focus", refreshInspiration);
      window.removeEventListener("storage", refreshInspiration);
    };
  }, [wedding.id]);

  // Коли спливе найближчий 24h-термін — прибрати з списку без релоаду.
  useEffect(() => {
    if (lingerExpiryTimerRef.current != null) {
      window.clearTimeout(lingerExpiryTimerRef.current);
      lingerExpiryTimerRef.current = null;
    }
    const now = Date.now();
    const pruned = pruneDoneLinger(doneLinger, now);
    if (Object.keys(pruned).length !== Object.keys(doneLinger).length) {
      setDoneLinger(pruned);
      writeDoneLinger(wedding.id, pruned);
      return;
    }
    let soonest = Infinity;
    for (const at of Object.values(pruned)) {
      const expires = at + DONE_LINGER_MS;
      if (expires < soonest) soonest = expires;
    }
    if (!Number.isFinite(soonest)) return;
    const delay = Math.max(soonest - now + 50, 0);
    lingerExpiryTimerRef.current = window.setTimeout(() => {
      const next = pruneDoneLinger(readDoneLinger(wedding.id));
      setDoneLinger(next);
      writeDoneLinger(wedding.id, next);
    }, delay);
    return () => {
      if (lingerExpiryTimerRef.current != null) {
        window.clearTimeout(lingerExpiryTimerRef.current);
        lingerExpiryTimerRef.current = null;
      }
    };
  }, [doneLinger, wedding.id]);

  useMenuOutsideClose(Boolean(menuOpenId), () => setMenuOpenId(null));

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
            fetchDayPlan().catch(() => ({ weddingId: "", events: null })),
          ]);
        if (cancelled) return;
        setInsights(insightsData);
        setSummary(summaryData);
        setPipeline(pipelineData);
        setDayPlanEvents(
          dayPlanData.events?.length
            ? sortDayPlanEvents(dayPlanData.events)
            : [],
        );
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

  // Живі таски, не stale insights — інакше прогрес оновлюється лише після reload.
  const done = wedding.tasks.filter((task) => task.status === "DONE").length;
  const total = wedding.tasks.length;
  const remaining = total - done;
  const progress = Math.round((done / Math.max(total, 1)) * 100);
  const { displayPercent, barWidth } = useAnimatedProgress(progress);

  const tasks = useMemo(() => {
    const now = Date.now();
    return [...wedding.tasks]
      .map((task) => {
        const lingerAt = doneLinger[task.id];
        const lingering =
          typeof lingerAt === "number" && now - lingerAt < DONE_LINGER_MS;
        const done = task.status === "DONE";
        return {
          task,
          due: taskDue(task, wedding.date),
          done,
          // DONE без свіжого чеку (або після 24 год) — ховаємо з огляду.
          settledDone: done && !lingering,
        };
      })
      .filter(({ settledDone }) => !settledDone)
      // Не штовхаємо чекнуті вниз — інакше вони вилітають з топ-7.
      .sort((a, b) => {
        const ad = a.due ?? "9999-99-99";
        const bd = b.due ?? "9999-99-99";
        return ad.localeCompare(bd);
      })
      .slice(0, 7);
  }, [wedding.tasks, wedding.date, doneLinger]);

  const { filled: vendorFilled, total: vendorPlanTotal } =
    vendorPlanProgress(pipeline);
  const guestsInList = insights?.rsvp.total ?? 0;
  const guestCount = guestsInList || wedding.guests;
  const rsvpYes = insights?.rsvp.yes ?? 0;
  const rsvpNo = insights?.rsvp.no ?? 0;
  const rsvpWaiting = insights?.rsvp.pending ?? 0;
  const rsvpAnswered =
    (insights?.rsvp.yes ?? 0) +
    (insights?.rsvp.no ?? 0) +
    (insights?.rsvp.maybe ?? 0);
  const spendValue = spend ?? 0;
  const hasVendorPlan = vendorPlanTotal > 0;
  const hasSpend = spendValue > 0;
  const hasGuests = guestsInList > 0;
  const hasDayPlan = dayPlanEvents.length > 0;
  const dayPlanPreview = dayPlanEvents.slice(0, DAY_PLAN_OVERVIEW_PREVIEW);
  const dayPlanPlanned = dayPlanEvents.length;
  const dayPlanTarget = Math.max(DAY_PLAN_OVERVIEW_TARGET, dayPlanPlanned);
  const dayPlanUnplanned = Math.max(0, dayPlanTarget - dayPlanPlanned);
  const isOwner = (wedding.myRole ?? "OWNER") === "OWNER";
  const hasPartner = (wedding.members ?? []).some(
    (member) => member.role === "PARTNER",
  );
  const inviteName = partnerName.trim() || "партнера";
  const showInviteTask = isOwner && !hasPartner && !inviteDismissed;
  const isTasksFirstState =
    !smartPlanningStarted && done === 0 && !hasGuests && !hasSpend;
  /** Стартові «Побудувати список / Додати гостей / Внести витрати» — ще не план. */
  const hasOwnTasks = wedding.tasks.some(
    (task) => !task.categorySlug?.startsWith("starter-"),
  );
  const showReadiness = smartPlanningStarted || hasOwnTasks;
  const daysLabel =
    daysLeft > 0
      ? `${daysLeft} ${daysWord(daysLeft)}`
      : daysLeft === 0
        ? "сьогодні"
        : "вже відбулось";
  const photo = wedding.couplePhotoUrl || "/landing/couple.jpg";

  function markDoneLinger(taskId: string) {
    setDoneLinger((prev) => {
      const next = { ...prev, [taskId]: Date.now() };
      writeDoneLinger(wedding.id, next);
      return next;
    });
  }

  function clearDoneLinger(taskId: string) {
    setDoneLinger((prev) => {
      if (!(taskId in prev)) return prev;
      const next = { ...prev };
      delete next[taskId];
      writeDoneLinger(wedding.id, next);
      return next;
    });
  }

  async function onToggleTask(task: WeddingTask, isDone: boolean) {
    const markingDone = !isDone;
    const nextStatus = markingDone ? "DONE" : "TODO";
    if (markingDone) markDoneLinger(task.id);

    // Оптимістично — прогрес і галочка одразу, не чекаємо API.
    onTaskChange({ ...task, status: nextStatus });
    try {
      const updated = await updateTask(task.id, { status: nextStatus });
      onTaskChange(updated);
      if (!markingDone) clearDoneLinger(task.id);
    } catch (err) {
      if (markingDone) clearDoneLinger(task.id);
      onTaskChange(task);
      toast.error(err instanceof Error ? err.message : "Не оновлено задачу");
    }
  }

  async function onSetAssignee(
    task: WeddingTask,
    assignee: TaskAssignee,
    options?: { keepMenuOpen?: boolean; assigneeName?: string | null },
  ) {
    if (!options?.keepMenuOpen) setMenuOpenId(null);
    const current =
      task.assignee === "owner" ||
      task.assignee === "partner" ||
      task.assignee === "both" ||
      task.assignee === "none" ||
      task.assignee === "other"
        ? task.assignee
        : null;
    const nextName =
      assignee === "other"
        ? (options?.assigneeName !== undefined
            ? options.assigneeName
            : (task.assigneeName ?? null))
        : null;
    const sameWho = current === assignee;
    const sameName =
      assignee !== "other" ||
      (task.assigneeName?.trim() ?? "") === (nextName?.trim() ?? "");
    if (sameWho && sameName) return;
    try {
      const updated = await updateTask(task.id, {
        assignee,
        ...(assignee === "other" ? { assigneeName: nextName } : { assigneeName: null }),
      });
      onTaskChange(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  function openEdit(task: WeddingTask) {
    setMenuOpenId(null);
    setEditTarget(task);
    setEditTitle(task.title);
    setEditDue(task.dueDate?.slice(0, 10) ?? "");
    setEditWho(task.assignee ?? "none");
    setEditOtherName(task.assigneeName?.trim() ?? "");
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    const title = editTitle.trim();
    if (!editTarget || !title) return;
    setEditSaving(true);
    try {
      const updated = await updateTask(editTarget.id, {
        ...(editTarget.isCustom ? { title } : {}),
        dueDate: editDue.trim() ? editDue.trim() : null,
        assignee: editWho,
        assigneeName: editWho === "other" ? editOtherName.trim() || null : null,
      });
      onTaskChange(updated);
      setEditOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setEditSaving(false);
    }
  }

  function requestDelete(task: WeddingTask) {
    setMenuOpenId(null);
    if (!task.isCustom) {
      toast.error("Шаблонну задачу видалити не можна");
      return;
    }
    setDeleteTarget(task);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.id);
      onTaskRemove(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setDeleting(false);
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
        <BrandLogo href="/dashboard" className="cabinet-mobile-brand" />
        <div className="cabinet-overview-greeting">
          <h1>Привіт, {greetingName}!</h1>

          <p>
            Ви {partnerName ? `з ${uaNameInstrumental(partnerName)} ` : ""}одружуєтесь через{" "}

            <strong>{daysLabel}</strong>.
          </p>
        </div>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={partnerInitials} />
        </div>
      </div>

      <div className="cabinet-body">
        {showInviteTask ? (
          <PartnerInviteBanner
            className="partner-invite-banner--overview-mobile"
            partnerName={inviteName}
            busy={inviteBusy}
            onInvite={() => void onInvitePartner()}
            onDismiss={onDismissInvite}
          />
        ) : null}
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

          {statsReady && !hasVendorPlan ? (
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
                {statsReady ? `${vendorFilled}/${vendorPlanTotal}` : "—"}
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
          {showReadiness ? (
            <article className="cabinet-side-progress">
              <div className="cabinet-side-progress-head">
                <div className="cabinet-side-progress-title">
                  <p className="cabinet-side-progress-value">{displayPercent}%</p>
                  <p className="cabinet-side-progress-label">готовність весілля</p>
                </div>
                <span className="cabinet-side-progress-ratio">
                  {done}/{total}
                </span>
              </div>
              <div className="cabinet-side-progress-bar">
                <span style={{ width: `${barWidth}%` }} />
              </div>
              <div className="cabinet-side-progress-meta">
                <span>{done} виконано</span>
                <span>{remaining} залишилось</span>
              </div>
            </article>
          ) : null}

          {hasInspiration ? (
            <Link
              href="/inspiration"
              className="cabinet-photo"
              aria-label="Дошка натхнення"
            >
              <Image
                src={photo}
                alt="Дошка натхнення"
                fill
                className="object-cover"
                sizes="361px"
              />
            </Link>
          ) : (
            <div className="cabinet-photo">
              <Image
                src={photo}
                alt="Фото пари"
                fill
                className="object-cover"
                sizes="361px"
              />
              <Link href="/inspiration" className="cabinet-photo-cta">
                Побудувати спільну дошку натхнення
              </Link>
            </div>
          )}

          {hasGuests ? (
            <article className="cabinet-overview-guests">
              <div className="cabinet-overview-guests-head">
                <h2 className="cabinet-overview-guests-title">Гості</h2>
                <p className="cabinet-overview-guests-status">
                  {rsvpAnswered} відповіли
                </p>
              </div>
              <ul className="cabinet-overview-guests-rows">
                <li className="cabinet-overview-guests-row">
                  <span className="cabinet-overview-guests-label">Прийдуть</span>
                  <span className="cabinet-overview-guests-value">{rsvpYes}</span>
                </li>
                <li className="cabinet-overview-guests-row">
                  <span className="cabinet-overview-guests-label">
                    Очікуємо відповіді
                  </span>
                  <span className="cabinet-overview-guests-value">
                    {rsvpWaiting}
                  </span>
                </li>
                <li className="cabinet-overview-guests-row">
                  <span className="cabinet-overview-guests-label">
                    Не прийдуть
                  </span>
                  <span className="cabinet-overview-guests-value">{rsvpNo}</span>
                </li>
              </ul>
              <Link href="/guests" className="cabinet-overview-guests-link">
                Перейти до гостей
              </Link>
            </article>
          ) : null}

          {hasDayPlan ? (
            <article className="cabinet-overview-day-plan is-filled">
              <div className="cabinet-overview-day-plan-head">
                <h2 className="cabinet-overview-day-plan-title">
                  План весільного дня
                </h2>
                <span className="cabinet-overview-day-plan-badge">
                  {dayPlanPlanned}/{dayPlanTarget}
                </span>
              </div>
              <ul className="cabinet-overview-day-plan-timeline">
                {dayPlanPreview.map((event) => (
                  <li key={event.id} className="cabinet-overview-day-plan-item">
                    <span className="cabinet-overview-day-plan-time">
                      {event.time}
                    </span>
                    <span
                      className="cabinet-overview-day-plan-sep"
                      aria-hidden
                    />
                    <span className="cabinet-overview-day-plan-event">
                      {event.title}
                    </span>
                  </li>
                ))}
              </ul>
              {dayPlanUnplanned > 0 ? (
                <p className="cabinet-overview-day-plan-note">
                  {unplannedMomentsLabel(dayPlanUnplanned)}
                </p>
              ) : null}
              <Link href="/day-plan" className="cabinet-overview-day-plan-link">
                Відкрити план дня
              </Link>
            </article>
          ) : (
            <article className="cabinet-overview-day-plan">
              <h2 className="cabinet-overview-day-plan-title">
                План весільного дня
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="cabinet-overview-day-plan-icon"
                src="/cabinet/empty/day-plan.svg"
                alt=""
                width={48}
                height={48}
                aria-hidden
              />
              <p className="cabinet-overview-day-plan-text">
                Розпишіть свій план весільного дня та поділіться ним з вашими
                підрядниками
              </p>
              <Link href="/day-plan" className="cabinet-overview-day-plan-link">
                Додати план
              </Link>
            </article>
          )}
        </aside>

        <section className="cabinet-tasks-panel">
          <h2>Завдання</h2>
          {showInviteTask ? (
            <PartnerInviteBanner
              className="partner-invite-banner--overview-desktop"
              partnerName={inviteName}
              busy={inviteBusy}
              onInvite={() => void onInvitePartner()}
              onDismiss={onDismissInvite}
            />
          ) : null}
          <ul className="cabinet-task-list">
            {tasks.map(({ task, due, done: isDone }) => {
              const cat = taskCategoryMeta(task.categorySlug, task.title);
              const who =
                task.assignee === "owner" ||
                task.assignee === "partner" ||
                task.assignee === "both" ||
                task.assignee === "none" ||
                task.assignee === "other"
                  ? task.assignee
                  : "none";
              return (
                <li
                  key={task.id}
                  className={`cabinet-task-row${isDone ? " is-done" : ""}`}
                >
                  <Checkbox
                    checked={isDone}
                    aria-label={isDone ? "Повернути в роботу" : "Виконано"}
                    onCheckedChange={() => void onToggleTask(task, isDone)}
                  />
                  <div className="cabinet-task-body">
                    <div className="cabinet-task-main">
                      <p className="cabinet-task-title">{task.title}</p>
                      <span className={`cabinet-task-tag is-${cat.tone}`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="cabinet-task-meta-wrap">
                      <span
                        className={`cabinet-task-date${due ? taskDateTone(due, isDone) : ""}`}
                      >
                        {due ? formatTaskDate(due) : null}
                      </span>
                      <div className="cabinet-task-actions">
                        <span className="cabinet-task-assignee-slot">
                          <TaskResponsibleAvatar
                            who={who}
                            ownerName={greetingName}
                            partnerName={partnerName}
                            otherName={task.assigneeName}
                          />
                        </span>
                        <div className="cabinet-ctx-menu-wrap">
                          <IconButton
                            variant="ghost"
                            aria-label="Меню завдання"
                            aria-expanded={menuOpenId === task.id}
                            icon={<IconMore />}
                            onClick={() =>
                              setMenuOpenId((id) =>
                                id === task.id ? null : task.id,
                              )
                            }
                          />
                          {menuOpenId === task.id ? (
                            <CabinetContextMenu>
                              <CabinetContextMenuItem
                                icon={<IconEdit />}
                                onClick={() => openEdit(task)}
                              >
                                Редагувати
                              </CabinetContextMenuItem>
                              <CabinetContextMenuItem
                                icon={<IconTrash />}
                                danger
                                onClick={() => requestDelete(task)}
                              >
                                Видалити
                              </CabinetContextMenuItem>

                              <CabinetContextMenuDivider />
                              <TaskAssigneeMenuBlock
                                who={who}
                                otherName={task.assigneeName}
                                ownerName={greetingName}
                                partnerName={partnerName}
                                onSelect={(assignee) =>
                                  void onSetAssignee(task, assignee, {
                                    keepMenuOpen: assignee === "other",
                                  })
                                }
                                onSaveOtherName={(name) => {
                                  setMenuOpenId(null);
                                  void onSetAssignee(task, "other", {
                                    assigneeName: name || null,
                                  });
                                }}
                              />
                            </CabinetContextMenu>
                          ) : null}
                        </div>
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

      <CabinetOverlay
        open={editOpen}
        onClose={closeEdit}
        title="Редагувати завдання"
        variant="drawer"
        width={500}
        panelClassName="cabinet-tasks-drawer"
        asForm
        onSubmit={onSaveEdit}
        footer={
          <CabinetFormActions
            onCancel={closeEdit}
            saveTone="black"
            saveDisabled={editSaving || !editTitle.trim()}
            saveLoading={editSaving}
            saveLoadingText="…"
          />
        }
      >
        <TextInput
          label="Назва завдання"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          required
          disabled={Boolean(editTarget && !editTarget.isCustom)}
        />
        <DateInput
          label="Дедлайн"
          value={editDue}
          onChange={(e) => setEditDue(e.target.value)}
          placeholder="Оберіть дату"
        />
        <Select
          label="Відповідальний"
          value={editWho}
          onChange={(e) => setEditWho(e.target.value as TaskAssignee)}
          startAdornment={
            editWho === "none" ? (
              <ResponsibleAvatar tone="none" letter="—" title="Ніхто" aria-hidden />
            ) : (
              <TaskResponsibleAvatar
                who={editWho}
                ownerName={greetingName}
                partnerName={partnerName}
                otherName={editOtherName}
              />
            )
          }
        >
          <option value="none">Ніхто</option>
          <option value="owner">{greetingName}</option>
          <option value="partner">{partnerName}</option>
          <option value="both">Обоє</option>
          <option value="other">Хтось інший</option>
        </Select>
        {editWho === "other" ? (
          <TextInput
            label="Вкажіть відповідального"
            value={editOtherName}
            onChange={(e) => setEditOtherName(e.target.value)}
            placeholder="Напишіть відповідального"
          />
        ) : null}
      </CabinetOverlay>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        title="Видалити завдання"
        description="Ви впевнені, що хочете видалити це завдання?"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
