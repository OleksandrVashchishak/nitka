"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getMyRequests,
  sendRequestMessage,
  type CoupleRequest,
} from "@/lib/dashboard-api";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { RequestThread } from "@/components/request-thread";
import { vendorHref } from "@/lib/vendor-href";

const STATUS_LABEL: Record<CoupleRequest["status"], string> = {
  NEW: "Очікує відповіді",
  CONTACTED: "Підрядник на звʼязку",
  DONE: "Домовлено",
  CLOSED: "Закрито",
};

const FILTERS: Array<CoupleRequest["status"] | "ALL"> = [
  "ALL",
  "NEW",
  "CONTACTED",
  "DONE",
  "CLOSED",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function Timeline({ item }: { item: CoupleRequest }) {
  const vendorReply = item.messages.find((m) => m.authorRole === "VENDOR");
  const steps = [
    {
      key: "sent",
      label: "Надіслано",
      done: true,
      at: item.createdAt,
      hint: "Заявку отримав підрядник",
    },
    {
      key: "replied",
      label: "Підрядник відповів",
      done: Boolean(vendorReply) || item.status !== "NEW",
      at: vendorReply?.createdAt ?? (item.status !== "NEW" ? item.updatedAt : null),
      hint: "Чекаємо текст і контакт від підрядника",
    },
    {
      key: "done",
      label: item.status === "CLOSED" ? "Закрито" : "Домовлено",
      done: item.status === "DONE" || item.status === "CLOSED",
      at:
        item.status === "DONE" || item.status === "CLOSED"
          ? item.updatedAt
          : null,
      hint:
        item.status === "CLOSED"
          ? "Заявку закрито"
          : "Фінальний статус співпраці",
    },
  ];

  return (
    <ol className="mt-5 space-y-3 border-l border-line pl-4">
      {steps.map((step) => (
        <li key={step.key} className="relative">
          <span
            className={
              step.done
                ? "absolute -left-[21px] top-1 size-2.5 rounded-full bg-sage"
                : "absolute -left-[21px] top-1 size-2.5 rounded-full border border-line bg-white"
            }
          />
          <p className={step.done ? "font-medium text-ink" : "text-ink-soft"}>
            {step.label}
          </p>
          <p className="text-xs text-ink-soft">
            {step.at ? formatDate(step.at) : step.hint}
          </p>
        </li>
      ))}
    </ol>
  );
}

function RequestsInner() {
  const [items, setItems] = useState<CoupleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CoupleRequest["status"] | "ALL">("ALL");

  useEffect(() => {
    void (async () => {
      try {
        setItems(await getMyRequests());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visible =
    filter === "ALL" ? items : items.filter((i) => i.status === filter);

  const replied = items.filter((i) =>
    i.messages.some((m) => m.authorRole === "VENDOR"),
  ).length;
  const waiting = items.filter((i) => i.status === "NEW").length;

  return (
    <>
      <DashboardNav variant="COUPLE" />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
        Inbox заявок
      </h1>
      <p className="mt-2 text-ink-soft">
        Діалог з підрядником: надіслано → відповідь з контактом → домовленість.
      </p>

      {!loading && items.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-mist px-4 py-4">
            <p className="text-xs text-ink-soft">Усього</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">
              {items.length}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-mist px-4 py-4">
            <p className="text-xs text-ink-soft">Очікують</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">
              {waiting}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-mist px-4 py-4">
            <p className="text-xs text-ink-soft">Є відповідь</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">
              {replied}
            </p>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={
              filter === item
                ? "rounded-full bg-sage px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft hover:border-sage/40"
            }
          >
            {item === "ALL" ? "Усі" : STATUS_LABEL[item]}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader className="mt-4" />
      ) : visible.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            {items.length === 0
              ? "Заявок ще немає."
              : "Немає заявок у цьому статусі."}
          </p>
          {items.length === 0 ? (
            <Link
              href="/vendors"
              className="mt-4 inline-flex text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
            >
              Знайти підрядника
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {visible.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-line bg-white p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-soft">
                    {item.vendor.category.name}
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">
                    {item.vendor.name}
                  </h2>
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-sm text-sage-deep">
                  {STATUS_LABEL[item.status]}
                </span>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                {formatDate(item.eventDate)} · {item.city} · {item.guests}{" "}
                гостей · бюджет {formatMoney(item.budget)} грн
              </p>

              <Timeline item={item} />

              <RequestThread
                initialMessage={item.message}
                initialAt={item.createdAt}
                initialAuthor="Ви"
                messages={item.messages ?? []}
                viewer="COUPLE"
                disabled={item.status === "CLOSED"}
                onSend={async (input) => {
                  const updated = (await sendRequestMessage(
                    item.id,
                    input,
                  )) as CoupleRequest;
                  setItems((prev) =>
                    prev.map((r) => (r.id === item.id ? updated : r)),
                  );
                }}
              />

              <Link
                href={vendorHref(item.vendor)}
                className="mt-5 inline-flex text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
              >
                Профіль підрядника
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function CoupleRequestsPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <RequestsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
