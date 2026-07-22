"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/lib/admin-api";
import { AdminNav } from "@/components/admin-nav";
import { RequireAuth } from "@/components/require-auth";

function AdminHomeInner() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setStats(await getAdminStats());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <AdminNav />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
        Адмінка
      </h1>
      <p className="mt-2 text-ink-soft">
        Модерація, юзери, відгуки й жива аналітика маркетплейсу.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading || !stats ? (
        <PageLoader className="mt-4" />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "На модерації",
                value: stats.pendingVendors,
                href: "/admin/vendors?status=PENDING",
              },
              {
                label: "Approved",
                value: stats.approvedVendors,
                href: "/admin/vendors?status=APPROVED",
              },
              {
                label: "Views 7д",
                value: stats.views7d,
                href: "/admin/vendors",
              },
              {
                label: "Заявки 7д",
                value: stats.requests7d,
                href: "/admin/requests",
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-line bg-mist p-5 transition hover:border-sage/40"
              >
                <p className="text-sm text-ink-soft">{item.label}</p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink">
                  {item.value}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Featured", value: stats.featuredVendors },
              { label: "Відгуки", value: stats.reviews, href: "/admin/reviews" },
              { label: "Пари", value: stats.couples, href: "/admin/users?role=COUPLE" },
              { label: "Акаунти підрядників", value: stats.vendors, href: "/admin/users?role=VENDOR" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href ?? "/admin"}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <p className="text-sm text-ink-soft">{item.label}</p>
                <p className="mt-1 text-2xl text-ink">{item.value}</p>
              </Link>
            ))}
          </div>

          {stats.pendingVendors > 0 ? (
            <div className="mt-8 rounded-2xl border border-sage/30 bg-mist px-6 py-5">
              <p className="text-ink">
                Черга: {stats.pendingVendors} профілів чекають approve.
              </p>
              <Link
                href="/admin/vendors?status=PENDING"
                className="mt-3 inline-flex text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
              >
                Відкрити модерацію
              </Link>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export function AdminHomePage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminHomeInner />
        </div>
      </section>
    </RequireAuth>
  );
}
