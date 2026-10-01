"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { DayPlanEventModal } from "@/components/day-plan/day-plan-event-modal";
import {
  IconDayPlanBack,
  IconDayPlanPlus,
  IconDayPlanShare,
} from "@/components/day-plan/day-plan-icons";
import { DayPlanShareModal } from "@/components/day-plan/day-plan-share-modal";
import { DayPlanTimeline } from "@/components/day-plan/day-plan-timeline";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  formatDayPlanDate,
  loadDayPlanShare,
  loadDayPlanWithMigration,
  saveDayPlanRemote,
  saveDayPlanShare,
  sortDayPlanEvents,
  type DayPlanEvent,
  type DayPlanSharePerson,
} from "@/lib/day-plan";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";

function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `day-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function DayPlanInner() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [events, setEvents] = useState<DayPlanEvent[]>([]);
  const [sharePeople, setSharePeople] = useState<DayPlanSharePerson[]>([]);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [editing, setEditing] = useState<DayPlanEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DayPlanEvent | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const wedding = await getMyWedding();
        if (!wedding) {
          setWeddingId(null);
          setEvents([]);
          setSharePeople([]);
          return;
        }
        setWeddingId(wedding.id);
        setWeddingDate(wedding.date);
        setEvents(await loadDayPlanWithMigration(wedding.id));

        const partners = [wedding.partnerOneName, wedding.partnerTwoName]
          .map((name) => ({ name: name?.trim() || "" }))
          .filter((p) => p.name);
        setSharePeople(loadDayPlanShare(wedding.id, partners));

        const oneRaw =
          wedding.partnerOneName?.trim() || user?.name?.trim() || "";
        const twoRaw = wedding.partnerTwoName?.trim() || "";
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
      } catch {
        setWeddingId(null);
        setEvents([]);
        setSharePeople([]);
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

  function persistShare(next: DayPlanSharePerson[]) {
    setSharePeople(next);
    if (weddingId) saveDayPlanShare(weddingId, next);
  }

  function openCreate() {
    setEditing(null);
    setModal("create");
  }

  function openEdit(event: DayPlanEvent) {
    setEditing(event);
    setModal("edit");
  }

  function onBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard");
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

  if (loading) {
    return <PageLoader label="Завантажуємо план дня…" />;
  }

  const dateLabel = formatDayPlanDate(weddingDate);

  return (
    <div className="cabinet-tasks-page cabinet-day-plan-page">
      <CabinetPageHeader
        title="План дня"
        summary={summary}
        initials={partnerInitials}
        className="cabinet-day-plan-desktop-top"
      />

      <div className="cabinet-day-plan-mobile-top">
        <button
          type="button"
          className="cabinet-day-plan-back"
          aria-label="Назад"
          onClick={onBack}
        >
          <IconDayPlanBack />
        </button>
        <h1 className="cabinet-day-plan-mobile-title">План дня</h1>
        <Button
          type="button"
          tone="ghost"
          size="s"
          className="cabinet-day-plan-mobile-share"
          onClick={() => setShareOpen(true)}
          disabled={!weddingId}
        >
          <IconDayPlanShare size={16} />
          Поділитися
        </Button>
      </div>

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
            onClick={() => setShareOpen(true)}
            disabled={!weddingId}
          >
            <IconDayPlanShare />
            Поділитися
          </Button>
        </div>
      </div>

      {events.length ? (
        <DayPlanTimeline
          events={events}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      ) : (
        <div className="cabinet-day-plan-empty">
          <h2>Зберіть розклад весільного дня</h2>
          <p>
            Додайте події з часом і тривалістю — від зборів до танців — і
            поділіться планом з підрядниками та близькими.
          </p>
          <Button
            type="button"
            tone="ink"
            size="m"
            className="cabinet-empty-cta"
            onClick={openCreate}
          >
            Додати подію
          </Button>
        </div>
      )}

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

      {shareOpen && weddingId ? (
        <DayPlanShareModal
          weddingId={weddingId}
          people={sharePeople}
          onClose={() => setShareOpen(false)}
          onChangePeople={persistShare}
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
