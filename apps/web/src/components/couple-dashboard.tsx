"use client";

import { PageLoader } from "@/components/ui-loader";
import { useEffect, useState } from "react";
import { getMyWedding, type Wedding } from "@/lib/dashboard-api";
import { CoupleOverview } from "@/components/couple-overview";
import { RequireAuth } from "@/components/require-auth";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";

function daysUntil(dateIso: string) {
  const target = new Date(dateIso);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function CoupleDashboardInner() {
  const user = useAuthStore((s) => s.user);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getMyWedding();
        setWedding(data);
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

  if (loading) {
    return <PageLoader label="Завантажуємо кабінет…" />;
  }

  const left = wedding ? daysUntil(wedding.date) : 0;
  const fallbackNames = (user?.name ?? "")
    .split(/\s+(?:і|&|\+)\s+/i)
    .map((name) => name.trim());
  const partnerOneName =
    wedding?.partnerOneName || fallbackNames[0] || user?.name || "";
  const partnerTwoName = wedding?.partnerTwoName || fallbackNames[1] || "";
  const oneInitial = partnerOneName.trim().charAt(0).toUpperCase();
  const twoInitial = partnerTwoName.trim().charAt(0).toUpperCase();
  const partnerInitials =
    oneInitial && twoInitial
      ? `${oneInitial}&${twoInitial}`
      : oneInitial || twoInitial || "П";

  return (
    <>
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
          partnerInitials={partnerInitials}
          daysLeft={left}
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
          onTaskRemove={(taskId) =>
            setWedding((prev) =>
              prev
                ? {
                    ...prev,
                    tasks: prev.tasks.filter((t) => t.id !== taskId),
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
            Пройди онбординг при реєстрації — після цього тут зʼявиться кабінет.
          </p>
        </section>
      )}
    </>
  );
}

export function CoupleDashboard() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <CoupleDashboardInner />
    </RequireAuth>
  );
}
