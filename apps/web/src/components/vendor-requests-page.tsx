"use client";

import { PageLoader } from "@/components/ui-loader";
import { useEffect, useState } from "react";
import {
  getVendorRequests,
  sendRequestMessage,
  updateVendorRequestStatus,
  type VendorRequest,
} from "@/lib/dashboard-api";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { RequestThread } from "@/components/request-thread";

const STATUS_LABEL: Record<VendorRequest["status"], string> = {
  NEW: "Нова",
  CONTACTED: "На звʼязку",
  DONE: "Готово",
  CLOSED: "Закрито",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA").format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function VendorRequestsInner() {
  const [items, setItems] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItems(await getVendorRequests());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onStatus(id: string, status: VendorRequest["status"]) {
    try {
      const updated = await updateVendorRequestStatus(id, status);
      setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  return (
    <>
      <DashboardNav variant="VENDOR" />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
        Заявки
      </h1>
      <p className="mt-2 text-ink-soft">
        Відповідай текстом і залиш телефон — статус сам стане «на звʼязку».
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <PageLoader className="mt-4" />
      ) : items.length === 0 ? (
        <p className="mt-8 text-ink-soft">Поки порожньо.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((req) => (
            <li
              key={req.id}
              className="rounded-2xl border border-line bg-white p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{req.user.name}</p>
                  <p className="text-sm text-ink-soft">{req.user.email}</p>
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-sm text-sage-deep">
                  {STATUS_LABEL[req.status]}
                </span>
              </div>
              <p className="mt-4 text-sm text-ink-soft">
                {formatDate(req.eventDate)} · {req.city} · {req.guests} гостей ·{" "}
                {formatMoney(req.budget)} грн
              </p>

              <RequestThread
                initialMessage={req.message}
                initialAt={req.createdAt}
                initialAuthor={req.user.name}
                messages={req.messages ?? []}
                viewer="VENDOR"
                disabled={req.status === "CLOSED"}
                onSend={async (input) => {
                  const updated = (await sendRequestMessage(
                    req.id,
                    input,
                  )) as VendorRequest;
                  setItems((prev) =>
                    prev.map((r) => (r.id === req.id ? updated : r)),
                  );
                }}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {(["NEW", "CONTACTED", "DONE", "CLOSED"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void onStatus(req.id, status)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-sage/40"
                    >
                      {STATUS_LABEL[status]}
                    </button>
                  ),
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function VendorRequestsPage() {
  return (
    <RequireAuth roles={["VENDOR", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <VendorRequestsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
