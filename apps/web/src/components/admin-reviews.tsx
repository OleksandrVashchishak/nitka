"use client";

import { PageLoader } from "@/components/ui-loader";
import { useEffect, useState } from "react";
import {
  deleteAdminReview,
  getAdminReviews,
  type AdminReview,
} from "@/lib/admin-api";
import { AdminNav } from "@/components/admin-nav";
import { RequireAuth } from "@/components/require-auth";

function AdminReviewsInner() {
  const [items, setItems] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setItems(await getAdminReviews());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onDelete(id: string) {
    try {
      await deleteAdminReview(id);
      setItems((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  return (
    <>
      <AdminNav />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
        Відгуки
      </h1>
      <p className="mt-2 text-ink-soft">Модерація: перегляд і видалення.</p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <PageLoader className="mt-4" />
      ) : items.length === 0 ? (
        <p className="mt-8 text-ink-soft">Відгуків поки немає.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    ★ {review.rating} · {review.vendor.name}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {review.user.name} ({review.user.email}) ·{" "}
                    {review.vendor.category.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onDelete(review.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-700"
                >
                  Видалити
                </button>
              </div>
              <p className="mt-3 text-ink">{review.text}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function AdminReviewsPage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminReviewsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
