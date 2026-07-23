"use client";

import { PageLoader } from "@/components/ui-loader";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { DashboardInsightsPanel } from "@/components/dashboard-insights";
import { PartnerAccessCard } from "@/components/partner-access-card";
import { RequireAuth } from "@/components/require-auth";
import { WeddingPlanPanel } from "@/components/wedding-plan-panel";
import { useAuthStore } from "@/lib/auth-store";
import { PLAN_ITEMS } from "@/lib/wedding-plan";
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
  const done = wedding?.tasks.filter((t) => t.status === "DONE").length ?? 0;
  const total = wedding?.tasks.length ?? 0;
  const fallbackNames = (user?.name ?? "")
    .split(/\s+(?:і|&|\+)\s+/i)
    .map((name) => name.trim());
  const partnerOneName =
    wedding?.partnerOneName || fallbackNames[0] || user?.name || "";
  const partnerTwoName = wedding?.partnerTwoName || fallbackNames[1] || "";
  const nextTask = wedding?.tasks.find((task) => task.status !== "DONE");
  const nextMeta = PLAN_ITEMS.find(
    (item) => item.key === nextTask?.categorySlug,
  );

  return (
    <>
      <DashboardNav variant="COUPLE" />

      {wedding ? (
        <CoupleProfileCard
          partnerOneName={partnerOneName}
          partnerTwoName={partnerTwoName}
          photoUrl={wedding.couplePhotoUrl}
          daysLeft={left}
          onSave={onSaveProfile}
        />
      ) : null}

      {wedding ? <PartnerAccessCard wedding={wedding} /> : null}

      {error ? (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {wedding ? (
        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "До весілля",
              value:
                left > 0 ? `${left} дн.` : left === 0 ? "Сьогодні" : "Вже було",
              hint: formatDateLong(wedding.date),
            },
            {
              label: "План",
              value: `${done}/${total}`,
              hint: `${Math.round((done / Math.max(total, 1)) * 100)}% виконано`,
            },
            {
              label: "Гості",
              value: String(wedding.guests),
              hint: "у поточному плані",
            },
            {
              label: "Бюджет",
              value: `${formatMoney(wedding.budget)} ₴`,
              hint: `${formatMoney(Math.round(wedding.budget / Math.max(wedding.guests, 1)))} ₴ на гостя`,
            },
          ].map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-2xl border border-line bg-white p-4 md:p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {kpi.label}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
                {kpi.value}
              </p>
              <p className="mt-1 truncate text-xs text-ink-soft">{kpi.hint}</p>
            </article>
          ))}
        </section>
      ) : null}

      {wedding ? (
        <section className="mb-6 rounded-2xl border border-line bg-mist p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Швидкий старт
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-ink">
                З чого продовжимо?
              </h2>
            </div>
            <p className="text-sm text-ink-soft">Швидкі дії без зайвих кліків</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: nextMeta?.href || "#wedding-plan",
                icon: nextMeta?.icon || "✓",
                title: nextMeta?.title || "Переглянути план",
                hint: "Наступна ціль",
              },
              {
                href: "/guests",
                icon: "👥",
                title: "Оновити гостей",
                hint: "Список та RSVP",
              },
              {
                href: "/budget",
                icon: "₴",
                title: "Перевірити бюджет",
                hint: "Категорії й витрати",
              },
              {
                href: "#wedding-plan",
                icon: "📅",
                title: "Відкрити чекліст",
                hint: "Дати та статуси",
              },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-sage/40 hover:shadow-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sage/10">
                  {action.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">
                    {action.title}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {action.hint}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {wedding ? (
        <section className="overflow-hidden rounded-2xl border border-line bg-sage-deep text-white">
          <div className="flex flex-wrap items-end justify-between gap-4 p-5 md:p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-white/65">
                Дата весілля
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                {formatDateLong(wedding.date)}
              </h2>
              <p className="mt-2 text-white/80">
                {wedding.city} · {wedding.guests} гостей ·{" "}
                {formatMoney(wedding.budget)} грн
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/guests"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sage-deep hover:bg-mist"
              >
                Гості
              </Link>
              <Link
                href="/budget"
                className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Бюджет
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {wedding ? null : (
        <section className="mb-6 rounded-2xl border border-dashed border-sage/40 bg-sage/10 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
            Початок
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
            Збережи дату — відкриємо чекліст
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Обери день весілля нижче в плані. Після цього зʼявляться бюджет,
            гості, прогрес і персональні задачі.
          </p>
          <a
            href="#wedding-plan"
            className="mt-4 inline-flex rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            Обрати дату
          </a>
        </section>
      )}

      {wedding ? <DashboardInsightsPanel city={wedding.city} /> : null}

      <div id="wedding-plan">
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
    </>
  );
}

export function CoupleDashboard() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <CoupleDashboardInner />
        </div>
      </section>
    </RequireAuth>
  );
}
