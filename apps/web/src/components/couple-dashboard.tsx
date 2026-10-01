"use client";

import { useCallback, useEffect, useState } from "react";
import { CabinetEmptyState } from "@/components/cabinet-empty-state";
import { CoupleOverview } from "@/components/couple-overview";
import { CouplePostWeddingOverview } from "@/components/couple-post-wedding-overview";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui-loader";
import { useAuthStore } from "@/lib/auth-store";
import { getMyWedding, type Wedding } from "@/lib/dashboard-api";

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
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getMyWedding();
      setWedding(data);
    } catch {
      setWedding(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <PageLoader label="Завантажуємо кабінет…" />;
  }

  if (error) {
    return (
      <CabinetEmptyState
        title="Проблеми на сервері"
        description={
          <p>Зараз кабінет недоступний. Почекай трохи і спробуй ще раз.</p>
        }
        actions={
          <Button
            type="button"
            tone="ink"
            size="m"
            className="cabinet-empty-cta"
            onClick={() => void load()}
          >
            Спробувати ще
          </Button>
        }
      />
    );
  }

  if (!wedding) {
    return (
      <CabinetEmptyState
        title="Кабінет ще порожній"
        description={
          <p>Як тільки зʼявиться весілля — тут відкриється огляд.</p>
        }
        actions={
          <Button
            type="button"
            tone="ink"
            size="m"
            className="cabinet-empty-cta"
            onClick={() => void load()}
          >
            Оновити
          </Button>
        }
      />
    );
  }

  const left = daysUntil(wedding.date);
  const fallbackNames = (user?.name ?? "")
    .split(/\s+(?:і|&|\+)\s+/i)
    .map((name) => name.trim());
  const partnerOneName =
    wedding.partnerOneName || fallbackNames[0] || user?.name || "";
  const partnerTwoName = wedding.partnerTwoName || fallbackNames[1] || "";
  const oneInitial = partnerOneName.trim().charAt(0).toUpperCase();
  const twoInitial = partnerTwoName.trim().charAt(0).toUpperCase();
  const partnerInitials =
    oneInitial && twoInitial
      ? `${oneInitial}&${twoInitial}`
      : oneInitial || twoInitial || "П";

  if (left < 0) {
    return (
      <CouplePostWeddingOverview
        wedding={wedding}
        partnerOneFirst={partnerOneName.split(" ")[0] || ""}
        partnerTwoFirst={partnerTwoName.split(" ")[0] || ""}
        partnerInitials={partnerInitials}
      />
    );
  }

  return (
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
  );
}

export function CoupleDashboard() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <CoupleDashboardInner />
    </RequireAuth>
  );
}
