"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DayPlanEventModal } from "@/components/day-plan/day-plan-event-modal";
import { IconDayPlanPlus } from "@/components/day-plan/day-plan-icons";
import { DayPlanTimeline } from "@/components/day-plan/day-plan-timeline";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import {
  formatDayPlanDate,
  reorderDayPlanEvents,
  sortDayPlanEvents,
  type DayPlanEvent,
} from "@/lib/day-plan";
import {
  fetchDayPlanPublic,
  fetchDayPlanSharedAccess,
  persistDayPlanByShareToken,
} from "@/lib/day-plan-share-api";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";
import "@/styles/cabinet/day-plan.scss";

function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `day-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function DayPlanSharedPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateLabel, setDateLabel] = useState("");
  const [coupleLabel, setCoupleLabel] = useState("");
  const [events, setEvents] = useState<DayPlanEvent[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<DayPlanEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DayPlanEvent | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDayPlanPublic(token);
        setEvents(sortDayPlanEvents(data.events));
        setDateLabel(formatDayPlanDate(data.date));
        const partners = [data.partnerOneName, data.partnerTwoName]
          .map((n) => n.trim())
          .filter(Boolean);
        setCoupleLabel(partners.length ? partners.join(" & ") : "План дня");

        if (accessToken) {
          try {
            const access = await fetchDayPlanSharedAccess(token);
            setCanEdit(Boolean(access?.canEdit));
          } catch {
            setCanEdit(false);
          }
        } else {
          setCanEdit(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Посилання недійсне");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, hydrated, accessToken]);

  async function persist(next: DayPlanEvent[]) {
    const sorted = sortDayPlanEvents(next);
    setEvents(sorted);
    try {
      await persistDayPlanByShareToken(token, sorted);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не вдалося зберегти зміни",
      );
    }
  }

  function openCreate() {
    setEditing(null);
    setModal("create");
  }

  function openEdit(event: DayPlanEvent) {
    setEditing(event);
    setModal("edit");
  }

  function onSave(payload: {
    title: string;
    time: string;
    durationMin: number;
  }) {
    if (modal === "edit" && editing) {
      void persist(
        events.map((e) =>
          e.id === editing.id ? { ...e, ...payload } : e,
        ),
      );
      toast.success("Збережено", "Подію оновлено");
    } else {
      void persist([
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
    void persist(events.filter((e) => e.id !== deleteTarget.id));
    toast.success("Видалено", `«${deleteTarget.title}» прибрано з плану`);
    setDeleteTarget(null);
  }

  function onReorder(fromIndex: number, toIndex: number) {
    void persist(reorderDayPlanEvents(events, fromIndex, toIndex));
  }

  if (!hydrated || loading) {
    return <PageLoader label="Завантажуємо план дня…" />;
  }

  if (error) {
    return (
      <div className="cabinet-day-plan-shared">
        <div className="cabinet-day-plan-shared-inner">
          <Link href="/" className="cabinet-day-plan-shared-brand" aria-label="fata.studio">
            <img src="/landing/logo-dark.svg" alt="fata.studio" width={154} height={32} />
          </Link>
          <h1>Посилання недійсне</h1>
          <p>{error}</p>
          <Link href="/">На головну</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cabinet-day-plan-shared">
      <div className="cabinet-day-plan-shared-inner">
        <Link href="/" className="cabinet-day-plan-shared-brand" aria-label="fata.studio">
          <img src="/landing/logo-dark.svg" alt="fata.studio" width={154} height={32} />
        </Link>
        <header className="cabinet-day-plan-shared-head">
          <div>
            <p className="cabinet-day-plan-shared-eyebrow">План весільного дня</p>
            <h1>{coupleLabel}</h1>
            <p className="cabinet-day-plan-date">{dateLabel}</p>
          </div>
          {canEdit ? (
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
          ) : null}
        </header>

        {events.length ? (
          <DayPlanTimeline
            events={events}
            readOnly={!canEdit}
            onEdit={canEdit ? openEdit : undefined}
            onDelete={canEdit ? setDeleteTarget : undefined}
            onReorder={canEdit ? onReorder : undefined}
          />
        ) : (
          <div className="cabinet-day-plan-empty">
            <h2>Поки що порожньо</h2>
            <p>Подій у плані дня ще немає.</p>
            {canEdit ? (
              <Button
                type="button"
                tone="ink"
                size="m"
                className="cabinet-empty-cta"
                onClick={openCreate}
              >
                Додати подію
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {canEdit && modal ? (
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

      {canEdit ? (
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
      ) : null}
    </div>
  );
}
