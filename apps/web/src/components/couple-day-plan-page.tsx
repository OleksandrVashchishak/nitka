"use client";

import { useEffect, useState } from "react";
import { openCabinetMoreMenu } from "@/lib/cabinet-more-menu";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { CabinetBackTitle } from "@/components/cabinet-back-title";
import { CabinetEmptyState } from "@/components/cabinet-empty-state";
import { DayPlanEventModal } from "@/components/day-plan/day-plan-event-modal";
import {
  IconDayPlanPlus,
  IconDayPlanShare,
} from "@/components/day-plan/day-plan-icons";
import { DayPlanTimeline } from "@/components/day-plan/day-plan-timeline";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  cloneDefaultDayPlan,
  formatDayPlanDate,
  loadDayPlanWithMigration,
  reorderDayPlanEvents,
  saveDayPlanRemote,
  sortDayPlanEvents,
  type DayPlanEvent,
} from "@/lib/day-plan";
import {
  dayPlanSharedUrl,
  fetchDayPlanShare,
  type DayPlanShareState,
} from "@/lib/day-plan-share-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";
import "@/styles/cabinet/day-plan.scss";

function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `day-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function DayPlanInner() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [events, setEvents] = useState<DayPlanEvent[]>([]);
  const [share, setShare] = useState<DayPlanShareState | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<DayPlanEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DayPlanEvent | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const wedding = await getMyWedding();
        if (!wedding) {
          setWeddingId(null);
          setEvents([]);
          return;
        }
        setWeddingId(wedding.id);
        setWeddingDate(wedding.date);
        setEvents(await loadDayPlanWithMigration(wedding.id));

        const oneRaw =
          wedding.partnerOneName?.trim() || user?.name?.trim() || "";
        const twoRaw = wedding.partnerTwoName?.trim() || "";
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
      } catch {
        setWeddingId(null);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();

    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [user?.name]);

  function persist(next: DayPlanEvent[]) {
    const sorted = sortDayPlanEvents(next);
    setEvents(sorted);
    if (weddingId) void saveDayPlanRemote(weddingId, sorted);
  }

  async function openShare() {
    if (!weddingId || shareLoading) return;
    setShareLoading(true);
    try {
      const state = share ?? (await fetchDayPlanShare());
      setShare(state);
      await navigator.clipboard.writeText(dayPlanSharedUrl(state.token));
      toast.success("Скопійовано", "Посилання на план дня в буфері");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не вдалося скопіювати посилання",
      );
    } finally {
      setShareLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setModal("create");
  }

  function onSeedDefaultPlan() {
    if (!weddingId) return;
    persist(cloneDefaultDayPlan());
    toast.success("Додано", "Готовий список подій створено");
  }

  function openEdit(event: DayPlanEvent) {
    setEditing(event);
    setModal("edit");
  }

  function onBack() {
    openCabinetMoreMenu();
  }

  function onSave(payload: {
    title: string;
    time: string;
    durationMin: number;
  }) {
    if (modal === "edit" && editing) {
      persist(
        events.map((e) =>
          e.id === editing.id ? { ...e, ...payload } : e,
        ),
      );
      toast.success("Збережено", "Подію оновлено");
    } else {
      persist([
        ...events,
        {
          id: newEventId(),
          ...payload,
        },
      ]);
      toast.success("Додано", "Подію додано до плану");
    }
    setModal(null);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    persist(events.filter((e) => e.id !== deleteTarget.id));
    toast.success("Видалено", `«${deleteTarget.title}» прибрано з плану`);
    setDeleteTarget(null);
  }

  function onReorder(fromIndex: number, toIndex: number) {
    persist(reorderDayPlanEvents(events, fromIndex, toIndex));
  }

  if (loading) {
    return <PageLoader label="Завантажуємо план дня…" />;
  }

  const dateLabel = formatDayPlanDate(weddingDate);
  const hasPlan = events.length > 0;

  return (
    <div className="cabinet-tasks-page cabinet-day-plan-page">
      <CabinetPageHeader
        title="План дня"
        summary={summary}
        initials={partnerInitials}
        className="cabinet-day-plan-desktop-top"
      />

      <div className="cabinet-day-plan-mobile-top">
        <CabinetBackTitle
          title="План дня"
          onBack={onBack}
          end={
            hasPlan ? (
              <Button
                type="button"
                tone="ghost"
                size="s"
                className="cabinet-day-plan-mobile-share"
                onClick={() => void openShare()}
                disabled={!weddingId}
              >
                <IconDayPlanShare size={16} />
                Поділитися
              </Button>
            ) : null
          }
        />
      </div>

      {hasPlan ? (
        <>
          <div className="cabinet-day-plan-toolbar">
            <p className="cabinet-day-plan-date">{dateLabel}</p>
            <div className="cabinet-day-plan-toolbar-actions">
              <Button
                type="button"
                tone="black"
                size="m"
                className="cabinet-day-plan-add-btn"
                onClick={openCreate}
              >
                <IconDayPlanPlus />
                Додати подію
              </Button>
              <Button
                type="button"
                tone="ghost"
                size="m"
                className="cabinet-day-plan-share-btn"
                onClick={() => void openShare()}
                disabled={!weddingId}
              >
                <IconDayPlanShare />
                Поділитися
              </Button>
            </div>
          </div>

          <DayPlanTimeline
            events={events}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onReorder={onReorder}
          />

          <div className="cabinet-day-plan-mobile-bar">
            <Button
              type="button"
              tone="ink"
              size="l"
              fullWidth
              className="cabinet-day-plan-mobile-add"
              onClick={openCreate}
            >
              <IconDayPlanPlus />
              Додати подію
            </Button>
          </div>
        </>
      ) : (
        <CabinetEmptyState
          className="cabinet-day-plan-empty-state"
          art={{
            src: "/cabinet/empty/day-plan-empty.svg",
            width: 279,
            height: 317,
            className: "cabinet-day-plan-empty-art",
          }}
          title="Розпочнемо планування весільного дня"
          description={<p>Внесіть події</p>}
          actions={
            <>
              <Button
                type="button"
                tone="ink"
                size="m"
                className="cabinet-empty-cta"
                onClick={openCreate}
                disabled={!weddingId}
              >
                <IconDayPlanPlus />
                Внести подію
              </Button>
              <Button
                type="button"
                tone="ghost"
                size="m"
                className="cabinet-day-plan-empty-seed"
                onClick={onSeedDefaultPlan}
                disabled={!weddingId}
              >
                Створіть готовий список подій
              </Button>
            </>
          }
        />
      )}

      {modal ? (
        <DayPlanEventModal
          mode={modal}
          initial={editing}
          onClose={() => {
            setModal(null);
            setEditing(null);
          }}
          onSave={onSave}
        />
      ) : null}

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        title="Видалити подію"
        description={
          deleteTarget
            ? `Ви впевнені, що хочете видалити «${deleteTarget.title}»?`
            : "Ви впевнені, що хочете видалити цю подію?"
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export function CoupleDayPlanPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <DayPlanInner />
    </RequireAuth>
  );
}
