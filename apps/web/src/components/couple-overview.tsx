"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  CabinetContextMenu,
  CabinetContextMenuDivider,
  CabinetContextMenuItem,
  CabinetContextMenuLabel,
} from "@/components/cabinet-context-menu";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { BrandLogo } from "@/components/brand-logo";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import {
  ResponsibleAvatar,
  ResponsibleAvatarDuo,
  TaskResponsibleAvatar,
} from "@/components/responsible-avatar";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";
import { useAnimatedProgress } from "@/lib/use-animated-progress";
import { VENDOR_MANAGER_CATEGORIES } from "@/lib/vendor-manager";

const VENDOR_TARGET = VENDOR_MANAGER_CATEGORIES.filter(
  (category) => category.slug !== "other",
).length;

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

function countChosenVendorCategories(pipeline: VendorPipeline | null) {
  if (!pipeline) return 0;
  const categories = new Set<string>();
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
  const [statsReady, setStatsReady] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [smartPlanningStarted, setSmartPlanningStarted] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WeddingTask | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

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
    if (!menuOpenId) return;
    function onDocClick(event: MouseEvent) {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(".cabinet-ctx-menu-wrap")
      ) {
        setMenuOpenId(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpenId(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpenId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [insightsData, summaryData, pipelineData, budgetData] =
          await Promise.all([
            getDashboardInsights(),
            getNotificationsSummary(),
            getVendorPipeline().catch(() => null),
            getBudget().catch(() => null),
          ]);
        if (cancelled) return;
        setInsights(insightsData);
        setSummary(summaryData);
        setPipeline(pipelineData);
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
  const { displayPercent, barWidth } = useAnimatedProgress(progress);

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

  async function onSetAssignee(task: WeddingTask, assignee: TaskAssignee) {
    setMenuOpenId(null);
    const current =
      task.assignee === "owner" ||
      task.assignee === "partner" ||
      task.assignee === "both" ||
      task.assignee === "none" ||
      task.assignee === "other"
        ? task.assignee
        : null;
    if (current === assignee) return;
    try {
      const updated = await updateTask(task.id, { assignee });
      onTaskChange(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  function openEdit(task: WeddingTask) {
    setMenuOpenId(null);
    router.push(`/checklist?edit=${encodeURIComponent(task.id)}`);
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

          <div className="cabinet-photo">
            <Image src={photo} alt="Фото пари" fill className="object-cover" sizes="361px" />
          </div>
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
                  <Button
                    type="button"
                    tone="black"
                    size="s"
                    className="cabinet-task-invite-btn"
                    loading={inviteBusy}
                    loadingText="…"
                    onClick={() => void onInvitePartner()}
                  >
                    Запросити
                  </Button>
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

            {tasks.map(({ task, due, done: isDone }) => {
              const cat = taskCategoryMeta(task.categorySlug, task.title);
              const who =
                task.assignee === "owner" ||
                task.assignee === "partner" ||
                task.assignee === "both" ||
                task.assignee === "none" ||
                task.assignee === "other"
                  ? task.assignee
                  : task.sortOrder % 2 === 0
                    ? "owner"
                    : "partner";
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
                        <TaskResponsibleAvatar
                          who={who}
                          ownerName={greetingName}
                          partnerName={partnerName}
                        />
                        <div className="cabinet-ctx-menu-wrap">
                          <button
                            type="button"
                            className="cabinet-task-menu"
                            aria-label="Меню завдання"
                            aria-expanded={menuOpenId === task.id}
                            onClick={() =>
                              setMenuOpenId((id) =>
                                id === task.id ? null : task.id,
                              )
                            }
                          >
                            <IconMore />
                          </button>
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
                              <CabinetContextMenuLabel>
                                Хто відповідальний
                              </CabinetContextMenuLabel>

                              <CabinetContextMenuItem
                                icon={
                                  <ResponsibleAvatar
                                    name={greetingName}
                                    tone="owner"
                                  />
                                }
                                active={who === "owner"}
                                onClick={() =>
                                  void onSetAssignee(task, "owner")
                                }
                              >
                                {greetingName}
                              </CabinetContextMenuItem>
                              <CabinetContextMenuItem
                                icon={
                                  <ResponsibleAvatar
                                    name={partnerName}
                                    tone="partner"
                                  />
                                }
                                active={who === "partner"}
                                onClick={() =>
                                  void onSetAssignee(task, "partner")
                                }
                              >
                                {partnerName}
                              </CabinetContextMenuItem>
                              <CabinetContextMenuItem
                                icon={
                                  <ResponsibleAvatarDuo
                                    ownerName={greetingName}
                                    partnerName={partnerName}
                                    aria-hidden
                                  />
                                }
                                active={who === "both"}
                                onClick={() =>
                                  void onSetAssignee(task, "both")
                                }
                              >
                                Обоє
                              </CabinetContextMenuItem>
                              <CabinetContextMenuItem
                                active={who === "none"}
                                onClick={() =>
                                  void onSetAssignee(task, "none")
                                }
                              >
                                Ніхто
                              </CabinetContextMenuItem>
                              <CabinetContextMenuItem
                                active={who === "other"}
                                onClick={() =>
                                  void onSetAssignee(task, "other")
                                }
                              >
                                Хтось інший
                              </CabinetContextMenuItem>
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

      {deleteTarget ? (
        <div
          className="cabinet-modal-root"
          role="dialog"
          aria-modal="true"
          aria-label="Видалити завдання"
        >
          <button
            type="button"
            className="cabinet-modal-backdrop"
            aria-label="Закрити"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="cabinet-modal cabinet-confirm-modal">
            <div className="cabinet-modal-head">
              <div>
                <h2>Видалити завдання</h2>
                <p>Ви впевнені, що хочете видалити це завдання?</p>
              </div>
              <button
                type="button"
                className="cabinet-modal-close"
                aria-label="Закрити"
                onClick={() => setDeleteTarget(null)}
              >
                ×
              </button>
            </div>
            <div className="cabinet-modal-actions">
              <Button
                type="button"
                tone="ghost"
                size="m"
                className="cabinet-drawer-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Скасувати
              </Button>
              <Button
                type="button"
                tone="ink"
                size="m"
                className="cabinet-confirm-delete"
                loading={deleting}
                loadingText="…"
                onClick={() => void confirmDelete()}
              >
                Так, видалити
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
