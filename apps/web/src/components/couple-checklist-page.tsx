"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import {
  IconCalendar,
  IconClose,
  IconFilters,
  IconQuickAdd,
} from "@/components/cabinet-task-icons";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CabinetContextMenu,
  CabinetContextMenuDivider,
  CabinetContextMenuItem,
  CabinetContextMenuLabel,
} from "@/components/cabinet-context-menu";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import {
  ResponsibleAvatar,
  ResponsibleAvatarDuo,
  TaskResponsibleAvatar,
} from "@/components/responsible-avatar";
import { SmartPlanningWizard } from "@/components/smart-planning-wizard";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  createPartnerInvite,
  createTask,
  deleteTask,
  getMyWedding,
  updateTask,
  type TaskAssignee,
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
import { toast } from "@/lib/toast";
import { useAnimatedProgress } from "@/lib/use-animated-progress";
import { useAuthStore } from "@/lib/auth-store";
import "../app/couple-cabinet.css";

type StatusFilter = "all" | "open" | "done";
type TypeFilter =
  | "all"
  | "prep"
  | "vendors"
  | "attire"
  | "guests"
  | "budget"
  | "invites"
  | "other"
  | "guests_invites";
type DueFilter = "all" | "soon" | "week" | "overdue" | "nodate";
type WhoFilter = "all" | "owner" | "partner";
type SortMode = "urgent" | "date" | "alpha";
type TaskWho = TaskAssignee;

type ChecklistRow = WeddingTask & {
  effectiveDue: string | null;
  taskType: Exclude<TypeFilter, "all" | "other" | "guests_invites">;
  who: TaskWho;
};

const TYPE_OPTIONS: Array<{ id: TypeFilter; label: string }> = [
  { id: "all", label: "Всі" },
  { id: "prep", label: "Підготовка" },
  { id: "vendors", label: "Підрядники" },
  { id: "attire", label: "Вбрання" },
  { id: "guests", label: "Гості" },
  { id: "budget", label: "Бюджет" },
  { id: "invites", label: "Запрошення" },
];

const MOBILE_TYPE_OPTIONS: Array<{ id: TypeFilter; label: string }> = [
  { id: "all", label: "Всі" },
  { id: "prep", label: "Підготовка" },
  { id: "vendors", label: "Підрядники" },
  { id: "guests_invites", label: "Гості і Запрошення" },
  { id: "other", label: "Інше" },
];

const DEFAULT_FILTERS = {
  status: "all" as StatusFilter,
  type: "all" as TypeFilter,
  due: "all" as DueFilter,
  who: "all" as WhoFilter,
};

const PAGE_SIZE = 12;
const TASK_WHO_VALUES: TaskWho[] = [
  "owner",
  "partner",
  "both",
  "none",
  "other",
];

function inviteDismissKey(weddingId: string) {
  return `fata-dashboard-invite-dismissed:${weddingId}`;
}

function resolveTaskWho(task: WeddingTask): TaskWho {
  if (task.assignee && TASK_WHO_VALUES.includes(task.assignee)) {
    return task.assignee;
  }
  return task.sortOrder % 2 === 0 ? "owner" : "partner";
}

function formatTaskDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
}

function effectiveDueFor(task: WeddingTask, _weddingDate: string) {
  // Only a real dueDate — never invent suggested/plan dates in the list
  return task.dueDate ? task.dueDate.slice(0, 10) : null;
}

function resolveTaskType(
  slug: string | null | undefined,
  title: string,
): Exclude<TypeFilter, "all" | "other" | "guests_invites"> {
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
  if (
    key === "starter-guests" ||
    key === "guests" ||
    key === "rsvp" ||
    key === "seating" ||
    lower.includes("гост") ||
    lower.includes("розсад")
  ) {
    return "guests";
  }
  if (key === "attire" || key === "beauty" || lower.includes("вбран")) {
    return "attire";
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

function typeMeta(
  type: Exclude<TypeFilter, "all" | "other" | "guests_invites">,
) {
  switch (type) {
    case "vendors":
      return { label: "Підрядники", tone: "lilac" as const };
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

function matchesTypeFilter(
  taskType: ChecklistRow["taskType"],
  filter: TypeFilter,
) {
  if (filter === "all") return true;
  if (filter === "guests_invites") {
    return taskType === "guests" || taskType === "invites";
  }
  if (filter === "other") {
    return taskType === "attire" || taskType === "budget";
  }
  return taskType === filter;
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
  const router = useRouter();
  const editHandledRef = useRef<string | null>(null);
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<StatusFilter>("all");
  const [draftType, setDraftType] = useState<TypeFilter>("all");
  const [draftDue, setDraftDue] = useState<DueFilter>("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("");
  const [newType, setNewType] = useState<
    Exclude<TypeFilter, "all" | "other" | "guests_invites"> | ""
  >("");
  const [newWho, setNewWho] = useState<TaskWho>("owner");
  const [newOtherName, setNewOtherName] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showSmartBanner, setShowSmartBanner] = useState(false);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChecklistRow | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      setInviteDismissed(
        localStorage.getItem(inviteDismissKey(wedding.id)) === "1",
      );
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

  useEffect(() => {
    if (!filtersOpen) {
      setFiltersVisible(false);
      const timer = window.setTimeout(() => setFiltersMounted(false), 320);
      return () => window.clearTimeout(timer);
    }

    setDraftStatus(statusFilter);
    setDraftType(
      typeFilter === "attire" || typeFilter === "budget"
        ? "other"
        : typeFilter === "guests" || typeFilter === "invites"
          ? "guests_invites"
          : typeFilter,
    );
    setDraftDue(
      dueFilter === "soon" || dueFilter === "nodate" ? "all" : dueFilter,
    );
    setFiltersMounted(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setFiltersVisible(true));
    });
    return () => window.cancelAnimationFrame(id);
    // Sync draft only when opening the sheet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  useEffect(() => {
    if (!drawerOpen) {
      setDrawerVisible(false);
      const timer = window.setTimeout(() => setDrawerMounted(false), 320);
      return () => window.clearTimeout(timer);
    }
    setDrawerMounted(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDrawerVisible(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

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
        who: resolveTaskWho(task),
      };
    });
  }, [wedding]);

  const today = new Date().toISOString().slice(0, 10);
  const soonLimit = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  }, []);
  const weekLimit = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
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
      budget: 0,
      invites: 0,
      other: 0,
      guests_invites: 0,
    };
    const due = {
      all: rows.length,
      soon: 0,
      week: 0,
      overdue: 0,
      nodate: 0,
    };
    const who = { all: rows.length, owner: 0, partner: 0 };

    for (const row of rows) {
      if (row.status === "DONE") status.done += 1;
      else status.open += 1;
      types[row.taskType] += 1;
      if (row.taskType === "attire" || row.taskType === "budget") {
        types.other += 1;
      }
      if (row.taskType === "guests" || row.taskType === "invites") {
        types.guests_invites += 1;
      }
      if (row.who === "owner" || row.who === "both") who.owner += 1;
      if (row.who === "partner" || row.who === "both") who.partner += 1;
      if (!row.effectiveDue) due.nodate += 1;
      else if (row.effectiveDue < today && row.status !== "DONE") due.overdue += 1;
      else {
        if (row.effectiveDue <= soonLimit) due.soon += 1;
        if (row.effectiveDue <= weekLimit) due.week += 1;
      }
    }
    return { status, types, due, who };
  }, [rows, today, soonLimit, weekLimit]);

  const filtered = useMemo(() => {
    const list = rows.filter((row) => {
      if (statusFilter === "open" && row.status === "DONE") return false;
      if (statusFilter === "done" && row.status !== "DONE") return false;
      if (!matchesTypeFilter(row.taskType, typeFilter)) return false;
      if (whoFilter === "owner" && row.who !== "owner" && row.who !== "both") {
        return false;
      }
      if (
        whoFilter === "partner" &&
        row.who !== "partner" &&
        row.who !== "both"
      ) {
        return false;
      }
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
      if (dueFilter === "week") {
        if (
          !row.effectiveDue ||
          row.effectiveDue < today ||
          row.effectiveDue > weekLimit
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
  }, [
    rows,
    statusFilter,
    typeFilter,
    dueFilter,
    whoFilter,
    sortMode,
    today,
    soonLimit,
    weekLimit,
  ]);

  const filtersActive =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    dueFilter !== "all" ||
    whoFilter !== "all";

  function applyDraftFilters() {
    setStatusFilter(draftStatus);
    setTypeFilter(draftType);
    setDueFilter(draftDue);
    setFiltersOpen(false);
  }

  function resetDraftFilters() {
    setDraftStatus(DEFAULT_FILTERS.status);
    setDraftType(DEFAULT_FILTERS.type);
    setDraftDue(DEFAULT_FILTERS.due);
  }

  function resetAllFilters() {
    setStatusFilter(DEFAULT_FILTERS.status);
    setTypeFilter(DEFAULT_FILTERS.type);
    setDueFilter(DEFAULT_FILTERS.due);
    setWhoFilter(DEFAULT_FILTERS.who);
  }

  const visible = filtered.slice(0, visibleCount);
  const doneCount = counts.status.done;
  const totalCount = counts.status.all;
  const remaining = totalCount - doneCount;
  const progress =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const { displayPercent, barWidth } = useAnimatedProgress(progress);

  const isOwner = (wedding?.myRole ?? "OWNER") === "OWNER";
  const hasPartner = (wedding?.members ?? []).some(
    (member) => member.role === "PARTNER",
  );
  const inviteName = partnerShort.trim() || "партнера";
  const showInviteTask = Boolean(
    wedding && isOwner && !hasPartner && !inviteDismissed,
  );

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

  function typeToSlug(
    type: Exclude<TypeFilter, "all" | "other" | "guests_invites"> | "",
  ) {
    switch (type) {
      case "vendors":
        return "photo";
      case "attire":
        return "attire";
      case "guests":
        return "guests";
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

  function resetDrawer() {
    setEditingId(null);
    setNewTitle("");
    setNewDue("");
    setNewType("");
    setNewWho("owner");
    setNewOtherName("");
  }

  function closeDrawer() {
    setDrawerOpen(false);
    window.setTimeout(() => resetDrawer(), 320);
  }

  function openCreate() {
    resetDrawer();
    setDrawerOpen(true);
  }

  function openEdit(task: ChecklistRow) {
    setEditingId(task.id);
    setNewTitle(task.title);
    // Only real dueDate — never suggested/plan dates in the form
    setNewDue(task.dueDate?.slice(0, 10) ?? "");
    setNewType(task.taskType);
    setNewWho(task.who);
    setNewOtherName("");
    setMenuOpenId(null);
    setDrawerOpen(true);
  }

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (!editId || rows.length === 0) return;
    if (editHandledRef.current === editId) return;
    const task = rows.find((t) => t.id === editId);
    if (!task) return;
    editHandledRef.current = editId;
    openEdit(task);
    router.replace("/checklist", { scroll: false });
  }, [searchParams, rows, router]);

  async function onSaveTask(e: FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !wedding) return;
    const dueDate = newDue.trim() ? newDue.trim() : null;
    setAdding(true);
    try {
      if (editingId) {
        const existing = wedding.tasks.find((t) => t.id === editingId);
        const payload: {
          title?: string;
          dueDate: string | null;
          assignee: TaskAssignee;
        } = {
          dueDate,
          assignee: newWho,
        };
        if (existing?.isCustom) {
          payload.title = title;
        }
        const updated = await updateTask(editingId, payload);
        patchLocal(editingId, updated);
      } else {
        const created = await createTask({
          title,
          ...(dueDate ? { dueDate } : {}),
          categorySlug: typeToSlug(newType),
          sortOrder: newWho === "partner" ? 1 : 0,
          assignee: newWho,
        });
        setWedding((prev) =>
          prev ? { ...prev, tasks: [...prev.tasks, created] } : prev,
        );
      }
      setDrawerOpen(false);
      resetDrawer();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : editingId
            ? "Не оновлено"
            : "Не додано",
      );
    } finally {
      setAdding(false);
    }
  }

  async function onSetAssignee(task: ChecklistRow, assignee: TaskAssignee) {
    setMenuOpenId(null);
    if (task.who === assignee) return;
    patchLocal(task.id, { assignee });
    try {
      const updated = await updateTask(task.id, { assignee });
      patchLocal(task.id, updated);
    } catch (err) {
      patchLocal(task.id, { assignee: task.assignee ?? null });
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  function requestDelete(task: ChecklistRow) {
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
      setWedding((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter((t) => t.id !== deleteTarget.id),
            }
          : prev,
      );
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setDeleting(false);
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
    if (!wedding) return;
    try {
      localStorage.setItem(inviteDismissKey(wedding.id), "1");
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
        <div className="cabinet-tasks-empty-state">
          <p className="cabinet-tasks-empty">
            Спочатку збережи дату весілля в огляді — тоді відкриється список задач.
          </p>
          <Link href="/dashboard" className="cabinet-tasks-empty-link">
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
        <div className="cabinet-tasks-top-actions">
          <button
            type="button"
            className="cabinet-tasks-quick-add"
            aria-label="Додати завдання"
            onClick={openCreate}
          >
            <IconQuickAdd />
          </button>
          <div className="cabinet-overview-actions cabinet-tasks-desktop-actions">
            <CabinetNotificationsBell summary={summary} />
            <CabinetProfileMenu initials={partnerInitials} />
          </div>
        </div>
      </div>

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      <article className="cabinet-tasks-progress">
        <div className="cabinet-tasks-progress-head">
          <div className="cabinet-tasks-progress-left">
            <p className="cabinet-tasks-progress-value">{displayPercent}%</p>
            <p className="cabinet-tasks-progress-label">готовність весілля</p>
          </div>
          <span className="cabinet-tasks-progress-ratio">
            {doneCount}/{totalCount}
          </span>
        </div>
        <div className="cabinet-tasks-progress-bar">
          <span style={{ width: `${barWidth}%` }} />
        </div>
        <div className="cabinet-tasks-progress-meta">
          <span>{doneCount} виконано</span>
          <span>{remaining} залишилось</span>
        </div>
      </article>

      <div className="cabinet-tasks-mobile-bar">
        <button
          type="button"
          className={`cabinet-tasks-chip${filtersActive ? " is-active" : ""}`}
          onClick={() => setFiltersOpen(true)}
        >
          <IconFilters size={14} />
          Фільтри
        </button>
        <div className="cabinet-tasks-chip cabinet-tasks-chip--select">
          <Select
            tone="ghost"
            size="s"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            aria-label="Сортування"
          >
            <option value="urgent">Термінові зверху</option>
            <option value="date">За датою</option>
            <option value="alpha">За алфавітом</option>
          </Select>
        </div>
      </div>

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
              <Select
                className="cabinet-tasks-sort"
                size="m"
                shape="pill"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                aria-label="Сортування"
              >
                <option value="urgent">Термінові зверху</option>
                <option value="date">За датою</option>
                <option value="alpha">За алфавітом</option>
              </Select>
              <Button
                type="button"
                tone="black"
                size="s"
                className="cabinet-tasks-add-btn"
                onClick={openCreate}
              >
                <span aria-hidden>+</span>
                Додати завдання
              </Button>
            </div>
          </div>

          {showInviteTask ? (
            <div className="cabinet-task-invite cabinet-tasks-invite">
              <div className="cabinet-task-invite-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6.5h16v11H4v-11Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
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
                  Додайте {inviteName} до спільного доступу, щоб він міг бачити
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
            </div>
          ) : null}

          {visible.length === 0 ? (
            <div className="cabinet-tasks-empty-state">
              <p className="cabinet-tasks-empty">
                {rows.length === 0
                  ? "Поки немає завдань. Додай перше або запусти розумне планування."
                  : "Немає задач у цьому фільтрі."}
              </p>
              {rows.length === 0 ? (
                <div className="cabinet-tasks-empty-actions">
                  <button
                    type="button"
                    className="cabinet-tasks-empty-primary"
                    onClick={openCreate}
                  >
                    Додати завдання
                  </button>
                  <button
                    type="button"
                    className="cabinet-tasks-empty-link"
                    onClick={() => setWizardOpen(true)}
                  >
                    Розумне планування
                  </button>
                </div>
              ) : filtersActive ? (
                <button
                  type="button"
                  className="cabinet-tasks-empty-link"
                  onClick={resetAllFilters}
                >
                  Скинути фільтри
                </button>
              ) : null}
            </div>
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
                    <Checkbox
                      checked={done}
                      aria-label={done ? "Повернути в роботу" : "Виконано"}
                      onCheckedChange={() => void onToggle(task)}
                    />
                    <div className="cabinet-task-body">
                      <p className="cabinet-task-title">{task.title}</p>
                      <div className="cabinet-task-meta-wrap">
                        <div className="cabinet-task-meta">
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
                        </div>
                        <div className="cabinet-task-actions">
                          <TaskResponsibleAvatar
                            who={task.who}
                            ownerName={ownerShort}
                            partnerName={partnerShort}
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
                                      name={ownerShort}
                                      tone="owner"
                                    />
                                  }
                                  active={task.who === "owner"}
                                  onClick={() =>
                                    void onSetAssignee(task, "owner")
                                  }
                                >
                                  {ownerShort}
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  icon={
                                    <ResponsibleAvatar
                                      name={partnerShort}
                                      tone="partner"
                                    />
                                  }
                                  active={task.who === "partner"}
                                  onClick={() =>
                                    void onSetAssignee(task, "partner")
                                  }
                                >
                                  {partnerShort}
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  icon={
                                    <ResponsibleAvatarDuo
                                      ownerName={ownerShort}
                                      partnerName={partnerShort}
                                      aria-hidden
                                    />
                                  }
                                  active={task.who === "both"}
                                  onClick={() =>
                                    void onSetAssignee(task, "both")
                                  }
                                >
                                  Обоє
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  active={task.who === "none"}
                                  onClick={() =>
                                    void onSetAssignee(task, "none")
                                  }
                                >
                                  Ніхто
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  active={task.who === "other"}
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

      {filtersMounted ? (
        <div
          className={`cabinet-tasks-filters-sheet${
            filtersVisible ? " is-open" : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Фільтри"
        >
          <button
            type="button"
            className="cabinet-tasks-filters-sheet__backdrop"
            aria-label="Закрити фільтри"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="cabinet-tasks-filters-sheet__panel">
            <div className="cabinet-tasks-filters-sheet__head">
              <h2 className="cabinet-tasks-filters-sheet__title">Фільтри</h2>
              <button
                type="button"
                className="cabinet-tasks-filters-sheet__close"
                aria-label="Закрити"
                onClick={() => setFiltersOpen(false)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="cabinet-tasks-filters-sheet__body">
              <FilterGroup
                title="Статус"
                items={[
                  { id: "all", label: "Всі", count: counts.status.all },
                  {
                    id: "open",
                    label: "Не виконано",
                    count: counts.status.open,
                  },
                  {
                    id: "done",
                    label: "Виконано",
                    count: counts.status.done,
                  },
                ]}
                active={draftStatus}
                onChange={(id) => setDraftStatus(id as StatusFilter)}
              />
              <FilterGroup
                title="Тип завдання"
                items={MOBILE_TYPE_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  count: counts.types[opt.id],
                }))}
                active={draftType}
                onChange={(id) => setDraftType(id as TypeFilter)}
              />
              <FilterGroup
                title="За терміном"
                items={[
                  { id: "all", label: "Усі", count: counts.due.all },
                  {
                    id: "overdue",
                    label: "Прострочені",
                    count: counts.due.overdue,
                  },
                  {
                    id: "week",
                    label: "Цього тижня",
                    count: counts.due.week,
                  },
                ]}
                active={draftDue}
                onChange={(id) => setDraftDue(id as DueFilter)}
              />
            </div>

            <div className="cabinet-tasks-filters-sheet__foot">
              <button
                type="button"
                className="cabinet-tasks-filters-sheet__apply"
                onClick={applyDraftFilters}
              >
                Застосувати
              </button>
              <button
                type="button"
                className="cabinet-tasks-filters-sheet__reset"
                onClick={resetDraftFilters}
              >
                Скинути фільтри
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {wizardOpen ? (
        <SmartPlanningWizard
          partnerInitials={partnerInitials}
          onClose={() => setWizardOpen(false)}
          onComplete={onSmartPlanComplete}
        />
      ) : null}

      {drawerMounted ? (
        <div
          className={`cabinet-drawer-root${drawerVisible ? " is-open" : ""}`}
        >
          <button
            type="button"
            className="cabinet-drawer-backdrop"
            aria-label="Закрити"
            onClick={closeDrawer}
          />
          <aside
            className="cabinet-drawer cabinet-tasks-drawer"
            aria-label={editingId ? "Редагувати завдання" : "Додати завдання"}
          >
            <div className="cabinet-drawer-head">
              <h2>{editingId ? "Редагувати завдання" : "Додати завдання"}</h2>
              <button
                type="button"
                className="cabinet-drawer-close"
                aria-label="Закрити"
                onClick={closeDrawer}
              >
                <IconClose size={18} />
              </button>
            </div>
            <form className="cabinet-drawer-form" onSubmit={onSaveTask}>
              <TextInput
                label="Назва завдання"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Наприклад, Замовити весільний торт"
                required
                disabled={Boolean(
                  editingId &&
                    wedding?.tasks.find((t) => t.id === editingId) &&
                    !wedding.tasks.find((t) => t.id === editingId)?.isCustom,
                )}
              />
              <label className="cabinet-drawer-field">
                <span>Дедлайн</span>
                <div
                  className={`cabinet-tasks-date${newDue ? " has-value" : ""}`}
                >
                  <input
                    type="date"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    aria-label="Дедлайн"
                  />
                  {!newDue ? (
                    <span className="cabinet-tasks-date__placeholder" aria-hidden>
                      Оберіть дату
                    </span>
                  ) : null}
                  <IconCalendar
                    size={18}
                    className="cabinet-tasks-date__icon"
                  />
                </div>
              </label>
              {!editingId ? (
                <Select
                  label="Тип завдання"
                  value={newType}
                  onChange={(e) =>
                    setNewType(
                      e.target.value as
                        | Exclude<
                            TypeFilter,
                            "all" | "other" | "guests_invites"
                          >
                        | "",
                    )
                  }
                >
                  <option value="">Не призначено</option>
                  {TYPE_OPTIONS.filter((o) => o.id !== "all").map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              ) : null}
              <Select
                label="Відповідальний"
                value={newWho}
                onChange={(e) => setNewWho(e.target.value as TaskWho)}
                startAdornment={
                  <TaskResponsibleAvatar
                    who={newWho}
                    ownerName={ownerShort}
                    partnerName={partnerShort}
                  />
                }
              >
                <option value="owner">{ownerShort}</option>
                <option value="partner">{partnerShort}</option>
                <option value="both">Обоє</option>
                <option value="none">Ніхто</option>
                <option value="other">Хтось інший</option>
              </Select>
              {newWho === "other" ? (
                <TextInput
                  label="Вкажіть відповідального"
                  value={newOtherName}
                  onChange={(e) => setNewOtherName(e.target.value)}
                  placeholder="Введіть імʼя або роль"
                />
              ) : null}
              <div className="cabinet-drawer-actions">
                <Button
                  type="button"
                  tone="ghost"
                  size="m"
                  className="cabinet-drawer-cancel"
                  onClick={closeDrawer}
                >
                  Скасувати
                </Button>
                <Button
                  type="submit"
                  tone="black"
                  size="m"
                  className="cabinet-drawer-save"
                  disabled={adding || !newTitle.trim()}
                  loading={adding}
                  loadingText="…"
                >
                  Зберегти
                </Button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}

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
    <RequireAuth roles={["COUPLE"]}>
      <Suspense fallback={<PageLoader label="Завантажуємо задачі…" />}>
        <ChecklistInner />
      </Suspense>
    </RequireAuth>
  );
}
