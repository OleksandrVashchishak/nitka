"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getVendorDashboard,
  getVendorRequests,
  updateVendorRequestStatus,
  type VendorDashboard,
  type VendorRequest,
} from "@/lib/dashboard-api";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { VendorOnboardingGuide } from "@/components/vendor-onboarding-guide";
import { useAuthStore } from "@/lib/auth-store";

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

function VendorDashboardInner() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<VendorDashboard>(null);
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [dash, reqs] = await Promise.all([
          getVendorDashboard(),
          getVendorRequests().catch(() => [] as VendorRequest[]),
        ]);
        setData(dash);
        setRequests(reqs.slice(0, 5));
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
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  const hasProfile = Boolean(data?.vendor);
  const vendor = data?.vendor;
  const stats = data?.stats;
  const showGuide =
    !hasProfile ||
    vendor?.status !== "APPROVED" ||
    (stats?.requests ?? 0) === 0;

  return (
    <>
      <DashboardNav variant="VENDOR" />

      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.14em] text-ink-soft">
          Кабінет підрядника
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
          {vendor?.name ?? `Привіт, ${user?.name}`}
        </h1>
        <p className="mt-2 text-ink-soft">
          {vendor
            ? `${vendor.category.name} · ${vendor.city} · ${vendor.status}`
            : "Пройди 3 кроки — і заявки почнуть сипатись."}
        </p>
      </div>

      {error ? (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {showGuide ? (
        <div className="mb-10">
          <VendorOnboardingGuide
            hasProfile={hasProfile}
            vendorStatus={vendor?.status}
            requestsCount={stats?.requests ?? 0}
          />
        </div>
      ) : null}

      {vendor && stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Перегляди", value: stats.views },
              { label: "За 7 днів", value: stats.views7d },
              { label: "Заявки", value: stats.requests },
              { label: "В обраному", value: stats.favorites },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-mist p-5"
              >
                <p className="text-sm text-ink-soft">{stat.label}</p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {stats.viewsSeries?.length ? (
            <section className="mt-8 rounded-2xl border border-line bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                    Перегляди за тиждень
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    Унікальні за день (IP). За 30 днів: {stats.views30d}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex h-40 items-end gap-2">
                {(() => {
                  const max = Math.max(
                    1,
                    ...stats.viewsSeries.map((d) => d.count),
                  );
                  return stats.viewsSeries.map((day) => (
                    <div
                      key={day.date}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <span className="text-xs text-ink-soft">{day.count}</span>
                      <div
                        className="w-full rounded-t-md bg-sage/80"
                        style={{
                          height: `${Math.max(6, (day.count / max) * 100)}%`,
                        }}
                        title={`${day.date}: ${day.count}`}
                      />
                      <span className="text-[10px] text-ink-soft">
                        {new Intl.DateTimeFormat("uk-UA", {
                          weekday: "short",
                        }).format(new Date(day.date))}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </section>
          ) : null}

          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                Останні заявки
              </h2>
              <Link
                href="/vendor/requests"
                className="text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
              >
                Усі заявки
              </Link>
            </div>

            {requests.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-line bg-white px-5 py-8 text-ink-soft">
                Поки тихо. Переконайся, що профіль{" "}
                <span className="text-ink">APPROVED</span>, і чекай перший лід.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {requests.map((req) => (
                  <li
                    key={req.id}
                    className="rounded-2xl border border-line bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{req.user.name}</p>
                        <p className="mt-1 text-sm text-ink-soft">
                          {formatDate(req.eventDate)} · {req.city} ·{" "}
                          {formatMoney(req.budget)} грн
                        </p>
                      </div>
                      <span className="rounded-full bg-mist px-3 py-1 text-sm text-sage-deep">
                        {STATUS_LABEL[req.status]}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-ink">{req.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(["CONTACTED", "DONE", "CLOSED"] as const).map(
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
          </section>
        </>
      ) : null}
    </>
  );
}

export function VendorDashboardPage() {
  return (
    <RequireAuth roles={["VENDOR", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <VendorDashboardInner />
        </div>
      </section>
    </RequireAuth>
  );
}
