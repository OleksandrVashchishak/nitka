"use client";

import { PageLoader } from "@/components/ui-loader";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  getMyWedding,
  updateTask,
  upsertWedding,
  type TaskStatus,
  type Wedding,
} from "@/lib/dashboard-api";
import { CoupleProfileCard } from "@/components/couple-profile-card";
import { DashboardNav } from "@/components/dashboard-nav";
import { CoupleOverview } from "@/components/couple-overview";
import { RequireAuth } from "@/components/require-auth";
import { WeddingPlanPanel } from "@/components/wedding-plan-panel";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";

function formatDateLong(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function daysUntil(dateIso: string) {
  const target = new Date(dateIso);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function CoupleDashboardInner() {
  const user = useAuthStore((s) => s.user);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("2026-09-20");
  const [city, setCity] = useState("Київ");
  const [guests, setGuests] = useState(80);
  const [budget, setBudget] = useState(300000);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#wedding-plan") setShowPlan(true);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getMyWedding();
        setWedding(data);
        if (data) {
          setDate(data.date.slice(0, 10));
          setCity(data.city);
          setGuests(data.guests);
          setBudget(data.budget);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Помилка завантаження";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selected = useMemo(() => new Date(`${date}T12:00:00`), [date]);
  const year = selected.getFullYear();
  const month = selected.getMonth();

  async function onSave(e?: FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = await upsertWedding({ date, city, guests, budget });
      setWedding(data);
      toast.success("Збережено", "Дані весілля оновлено");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveProfile(profile: {
    partnerOneName: string;
    partnerTwoName: string;
    couplePhotoUrl: string | null;
  }) {
    const data = await upsertWedding({
      date,
      city,
      guests,
      budget,
      ...profile,
    });
    setWedding(data);
  }

  function onPickDay(day: number) {
    const next = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setDate(next);
  }

  async function onUpdateTask(
    taskId: string,
    input: { status?: TaskStatus; dueDate?: string | null; title?: string },
  ) {
    try {
      const updated = await updateTask(taskId, input);
      setWedding((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) => (t.id === taskId ? updated : t)),
            }
          : prev,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не оновлено задачу";
      setError(message);
      toast.error(message);
    }
  }

  async function onCreateTask(input: {
    title: string;
    categorySlug?: string;
    dueDate?: string;
  }) {
    try {
      const created = await createTask(input);
      setWedding((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, created] } : prev,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не вдалося додати задачу";
      setError(message);
      toast.error(message);
      throw err;
    }
  }

  async function onDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);
      setWedding((prev) =>
        prev
          ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }
          : prev,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не вдалося видалити задачу";
      setError(message);
      toast.error(message);
      throw err;
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо кабінет…" />;
  }

  const left = wedding ? daysUntil(wedding.date) : daysUntil(date);
  const fallbackNames = (user?.name ?? "")
    .split(/\s+(?:і|&|\+)\s+/i)
    .map((name) => name.trim());
  const partnerOneName =
    wedding?.partnerOneName || fallbackNames[0] || user?.name || "";
  const partnerTwoName = wedding?.partnerTwoName || fallbackNames[1] || "";

  return (
    <>
      <DashboardNav variant="COUPLE" />

      {error ? (
        <p className="mx-5 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-10">
          {error}
        </p>
      ) : null}

      {wedding ? (
        <CoupleOverview
          wedding={wedding}
          greetingName={partnerOneName.split(" ")[0] || "там"}
          partnerName={partnerTwoName.split(" ")[0]}
          daysLeft={left}
          onConfigure={() => setShowPlan(true)}
          onTaskChange={(updated) =>
            setWedding((prev) =>
              prev
                ? {
                    ...prev,
                    tasks: prev.tasks.map((t) =>
                      t.id === updated.id ? updated : t,
                    ),
                  }
                : prev,
            )
          }
        />
      ) : (
        <section className="px-5 py-16 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
            Початок
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-script)] text-4xl italic text-ink">
            Збережи дату — відкриємо кабінет
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Обери день весілля нижче. Після цього зʼявляться бюджет, гості й задачі.
          </p>
        </section>
      )}

      {showPlan || !wedding ? (
        <div id="wedding-plan" className="px-5 pb-16 md:px-10">
          {wedding ? (
            <CoupleProfileCard
              partnerOneName={partnerOneName}
              partnerTwoName={partnerTwoName}
              photoUrl={wedding.couplePhotoUrl}
              daysLeft={left}
              onSave={onSaveProfile}
            />
          ) : null}
          <WeddingPlanPanel
            wedding={wedding}
            date={date}
            city={city}
            guests={guests}
            budget={budget}
            saving={saving}
            onDateChange={setDate}
            onCityChange={setCity}
            onGuestsChange={setGuests}
            onBudgetChange={setBudget}
            onPickDay={onPickDay}
            onSave={onSave}
            onUpdateTask={onUpdateTask}
            onCreateTask={onCreateTask}
            onDeleteTask={onDeleteTask}
          />
        </div>
      ) : null}
    </>
  );
}

export function CoupleDashboard() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <CoupleDashboardInner />
    </RequireAuth>
  );
}
