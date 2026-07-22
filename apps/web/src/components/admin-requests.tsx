"use client";

import { PageLoader } from "@/components/ui-loader";
import { useEffect, useState } from "react";
import {
  getAdminRequests,
  type AdminRequest,
} from "@/lib/admin-api";
import { AdminNav } from "@/components/admin-nav";
import { RequireAuth } from "@/components/require-auth";

const STATUSES: Array<AdminRequest["status"] | "ALL"> = [
  "ALL",
  "NEW",
  "CONTACTED",
  "DONE",
  "CLOSED",
];

function AdminRequestsInner() {
  const [status, setStatus] = useState<AdminRequest["status"] | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AdminRequest[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(
        await getAdminRequests({
          status: status === "ALL" ? undefined : status,
          q: q || undefined,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <AdminNav />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
        Заявки
      </h1>
      <p className="mt-2 text-ink-soft">
        Фільтри + перегляд треду повідомлень.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={
              status === s
                ? "rounded-full bg-sage px-4 py-2 text-sm text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft"
            }
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук: пара, підрядник, місто"
          className="flex-1 rounded-xl border border-line px-4 py-2 outline-none focus:border-sage"
        />
        <button
          type="submit"
          className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
        >
          Шукати
        </button>
      </form>

      {loading ? (
        <PageLoader className="mt-4" />
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((req) => (
            <li
              key={req.id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {req.user.name} → {req.vendor.name}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {req.city} · {req.guests} гостей · {req.budget} грн ·{" "}
                    {req.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenId((id) => (id === req.id ? null : req.id))
                  }
                  className="rounded-full border border-line px-3 py-1.5 text-xs"
                >
                  {openId === req.id ? "Сховати тред" : "Тред"}
                </button>
              </div>
              <p className="mt-3 text-sm text-ink">{req.message}</p>
              {openId === req.id ? (
                <div className="mt-4 space-y-2 border-t border-line pt-4">
                  {(req.messages ?? []).length === 0 ? (
                    <p className="text-sm text-ink-soft">Повідомлень ще немає.</p>
                  ) : (
                    req.messages?.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-xl bg-mist px-3 py-2 text-sm"
                      >
                        <p className="text-xs text-ink-soft">
                          {m.authorRole} · {m.author.name}
                        </p>
                        <p className="mt-1 text-ink">{m.body}</p>
                        {m.phone ? (
                          <p className="mt-1 text-sage-deep">{m.phone}</p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function AdminRequestsPage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminRequestsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
