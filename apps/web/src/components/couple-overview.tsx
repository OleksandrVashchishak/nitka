"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createPartnerInvite,
  getDashboardInsights,
  updateTask,
  type DashboardInsights,
  type Wedding,
  type WeddingTask,
} from "@/lib/dashboard-api";
import { toast } from "@/lib/toast";

function money(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function daysWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return "днів";
  if (d === 1) return "день";
  if (d >= 2 && d <= 4) return "дні";
  return "днів";
}

function taskWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return "задач";
  if (d === 1) return "задача";
  if (d >= 2 && d <= 4) return "задачі";
  return "задач";
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function dueMeta(iso: string | null) {
  if (!iso) return { label: "Без дати", tone: "muted" as const };
  const day = startOfDay(new Date(iso));
  const today = startOfDay(new Date());
  const diff = Math.round((day.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { label: "Прострочено", tone: "alert" as const };
  if (diff === 0) return { label: "Сьогодні", tone: "alert" as const };
  if (diff === 1) return { label: "Завтра", tone: "muted" as const };
  return {
    label: day.toLocaleDateString("uk-UA", { day: "numeric", month: "short" }),
    tone: "muted" as const,
  };
}

export function CoupleOverview({
  wedding,
  greetingName,
  partnerName,
  daysLeft,
  onTaskChange,
  onConfigure,
}: {
  wedding: Wedding;
  greetingName: string;
  partnerName: string;
  daysLeft: number;
  onTaskChange: (task: WeddingTask) => void;
  onConfigure: () => void;
}) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);

  useEffect(() => {
    void getDashboardInsights()
      .then(setInsights)
      .catch(() => setInsights(null));
  }, []);

  const done = wedding.tasks.filter((task) => task.status === "DONE").length;
  const remaining = wedding.tasks.filter((task) => task.status !== "DONE").length;
  const progress = Math.round((done / Math.max(wedding.tasks.length, 1)) * 100);
  const partnerJoined = Boolean(wedding.members?.some((m) => m.role === "PARTNER"));

  const openTasks = useMemo(
    () =>
      wedding.tasks
        .filter((task) => task.status !== "DONE")
        .sort((a, b) => {
          const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aTime - bTime;
        })
        .slice(0, 5),
    [wedding.tasks],
  );

  const overdue = wedding.tasks.filter((task) => {
    if (task.status === "DONE" || !task.dueDate) return false;
    return startOfDay(new Date(task.dueDate)) < startOfDay(new Date());
  }).length;

  const weekOpen = wedding.tasks.filter((task) => {
    if (task.status === "DONE" || !task.dueDate) return false;
    const due = startOfDay(new Date(task.dueDate));
    const today = startOfDay(new Date());
    const week = new Date(today);
    week.setDate(today.getDate() + 7);
    return due >= today && due <= week;
  }).length;

  const attention = [
    insights && insights.rsvp.pending > 0
      ? {
          title: `${insights.rsvp.pending} гостей без відповіді`,
          action: "Нагадати",
          href: "/guests",
        }
      : null,
    insights && insights.budget.remaining < 0
      ? { title: "Бюджет перевищено", action: "Коригувати", href: "/budget" }
      : null,
    insights && insights.pipeline.total < 3
      ? { title: "Мало підрядників у воронці", action: "Додати", href: "/my-vendors" }
      : null,
    overdue
      ? { title: `${overdue} прострочених задач`, action: "Відкрити", href: "/checklist" }
      : null,
  ].filter(Boolean) as Array<{ title: string; action: string; href: string }>;

  const daysLabel =
    daysLeft > 0
      ? `${daysLeft} ${daysWord(daysLeft)}`
      : daysLeft === 0
        ? "сьогодні"
        : "вже відбулось";

  return (
    <div className="relative overflow-hidden px-5 pb-10 pt-16 md:px-10 lg:pt-10">
      <FloralDecor />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-editorial text-[42px] leading-none text-[#1a1a1a] italic md:text-[52px]">
            Привіт, {greetingName}!
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-6 text-[#5c574e]">
            Ви {partnerName ? `з ${partnerName} ` : ""}одружуєтесь через{" "}
            <strong className="font-medium text-[#1a1a1a]">{daysLabel}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={onConfigure}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm text-[#1a1a1a] shadow-sm ring-1 ring-black/5"
        >
          <FlowerIcon />
          Налаштувати дашборд
        </button>
      </div>

      <div className="relative mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          value={`${money(insights?.budget.actual ?? 0)} ₴`}
          label="Витрат (факт і план)"
          href="/budget"
        />
        <StatCard
          value={`${insights?.pipeline.counts.CHOSEN ?? 0}/${Math.max(insights?.pipeline.total ?? 0, 10)}`}
          label="Підрядників"
          href="/my-vendors"
        />
        <StatCard
          value={String(insights?.rsvp.total || wedding.guests)}
          label="Гостей внесено"
          href="/guests"
        />
        <article className="relative overflow-hidden rounded-[28px] bg-[#1a1a1a] p-5 text-white">
          <RingsMark />
          <p className="relative font-editorial text-5xl italic leading-none">{progress}%</p>
          <p className="relative mt-2 text-sm text-white/70">Готовність вашого весілля</p>
          <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#c45b4a]"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="relative mt-3 flex justify-between text-xs text-white/55">
            <span>{done} виконано</span>
            <span>
              {done}/{wedding.tasks.length}
            </span>
            <span>{remaining} залишилось</span>
          </div>
        </article>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
        <article className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-[26px] leading-none text-[#1a1a1a]">
              Сьогодні{" "}
              <span className="text-base font-normal text-[#8a877f]">
                {openTasks.length} {taskWord(openTasks.length)}
              </span>
            </h2>
            <p className="text-sm text-[#8a877f]">
              Цього тижня: {weekOpen} задач
              {overdue ? (
                <>
                  {" "}
                  • <span className="text-[#c45b4a]">{overdue} прострочені</span>
                </>
              ) : null}
            </p>
          </div>

          {!partnerJoined && wedding.myRole !== "PARTNER" ? (
            <InvitePartnerBox partnerName={partnerName} />
          ) : null}

          <ul className="mt-2 divide-y divide-[#eeeae2]">
            {openTasks.length ? (
              openTasks.map((task, index) => {
                const due = dueMeta(task.dueDate);
                const who = index % 2 === 0 ? greetingName : partnerName || greetingName;
                return (
                  <li key={task.id} className="flex items-center gap-3 py-3.5">
                    <button
                      type="button"
                      aria-label={`Позначити «${task.title}» виконаною`}
                      onClick={() => {
                        void updateTask(task.id, { status: "DONE" }).then(onTaskChange);
                      }}
                      className="size-[18px] shrink-0 rounded-[5px] border border-[#cfc8bb]"
                    />
                    <span
                      className={`w-[88px] shrink-0 text-xs ${
                        due.tone === "alert" ? "text-[#c45b4a]" : "text-[#8a877f]"
                      }`}
                    >
                      {due.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] text-[#1a1a1a]">
                      {task.title}
                    </span>
                    <span className="shrink-0 text-xs text-[#8a877f]">{who}</span>
                  </li>
                );
              })
            ) : (
              <li className="py-6 text-sm text-[#8a877f]">На сьогодні все закрито.</li>
            )}
          </ul>
          <Link href="/checklist" className="mt-3 inline-flex text-sm text-[#1a1a1a] hover:underline">
            Переглянути всі задачі →
          </Link>
        </article>

        <article className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="font-[family-name:var(--font-display)] text-[26px] leading-none text-[#1a1a1a]">
            Потребує уваги
          </h2>
          <ul className="mt-6 space-y-0">
            {attention.length ? (
              attention.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start justify-between gap-3 border-b border-[#eeeae2] py-3 last:border-0"
                >
                  <p className="text-sm leading-5 text-[#1a1a1a]">{item.title}</p>
                  <Link href={item.href} className="shrink-0 text-sm text-[#c45b4a] hover:underline">
                    {item.action}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#8a877f]">Зараз усе спокійно.</li>
            )}
          </ul>
          <Link href="/checklist" className="mt-5 inline-flex text-sm text-[#1a1a1a] hover:underline">
            Переглянути все →
          </Link>
        </article>
      </div>
    </div>
  );
}

function InvitePartnerBox({ partnerName }: { partnerName: string }) {
  const [busy, setBusy] = useState(false);

  async function onInvite() {
    setBusy(true);
    try {
      const invite = await createPartnerInvite();
      const url = `${window.location.origin}${invite.path}`;
      await navigator.clipboard.writeText(url);
      toast.success("Лінк скопійовано", "Надішли партнеру — діятиме 14 днів");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не вдалось створити лінк");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-[#2a2a2a] px-5 py-4 text-white">
      <div>
        <p className="font-[family-name:var(--font-display)] text-lg">
          Запросіть {partnerName || "партнера"}
        </p>
        <p className="mt-1 max-w-sm text-sm text-white/60">
          Спільний кабінет: задачі, гості й бюджет в одному місці.
        </p>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void onInvite()}
        className="rounded-full bg-[#8a9a6b] px-5 py-2 text-sm font-medium text-white hover:bg-[#7d8d60] disabled:opacity-60"
      >
        {busy ? "Створюємо…" : "Запросити"}
      </button>
    </div>
  );
}

function StatCard({
  value,
  label,
  href,
}: {
  value: string;
  label: string;
  href: string;
}) {
  return (
    <article className="flex min-h-[148px] flex-col rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="font-editorial text-[32px] italic leading-none text-[#1a1a1a]">{value}</p>
      <p className="mt-2 text-sm text-[#8a877f]">{label}</p>
      <Link href={href} className="mt-auto pt-6 inline-flex text-sm text-[#1a1a1a]">
        Детальніше →
      </Link>
    </article>
  );
}

function FlowerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 8c0-2.2 1.4-4 2.8-4.6C9.6 2.2 8 3.2 8 5.2 8 3.2 6.4 2.2 5.2 3.4 6.6 4 8 5.8 8 8c0 2.2-1.4 4-2.8 4.6C6.4 13.8 8 12.8 8 10.8c0 2 1.6 3 2.8 1.8C9.4 12 8 10.2 8 8Z"
        stroke="#1a1a1a"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function RingsMark() {
  return (
    <svg
      className="pointer-events-none absolute -right-6 -bottom-8 h-36 w-36 text-white/10"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <circle cx="48" cy="58" r="28" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="74" cy="58" r="28" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function FloralDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute -left-8 -top-6 h-56 w-56 text-[#d9d3c6]" viewBox="0 0 220 220" fill="none">
        <path
          d="M40 120c28-8 44-34 40-62 18 22 48 28 74 12-8 30 6 58 36 72-30 10-46 36-40 64-18-22-48-28-74-12 8-30-6-58-36-74Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
      <svg className="absolute -right-10 top-24 h-64 w-64 text-[#d9d3c6]" viewBox="0 0 220 220" fill="none">
        <path
          d="M30 40c36 18 48 52 32 84 26-8 58 6 78 34-22 18-28 50-10 78-36-16-70-10-96 16 8-28-8-58-36-76 24-16 32-48 32-136Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
    </div>
  );
}
