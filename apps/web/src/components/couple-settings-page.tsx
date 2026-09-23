"use client";

import { useEffect, useState } from "react";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import "../app/couple-cabinet.css";

function CoupleSettingsInner() {
  const user = useAuthStore((s) => s.user);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [initials, setInitials] = useState("П");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [wedding, summaryData] = await Promise.all([
          getMyWedding(),
          getNotificationsSummary().catch(() => null),
        ]);
        if (cancelled) return;
        setSummary(summaryData);
        const one = (
          wedding?.partnerOneName ||
          user?.name ||
          ""
        )
          .trim()
          .charAt(0)
          .toUpperCase();
        const two = (wedding?.partnerTwoName || "").trim().charAt(0).toUpperCase();
        setInitials(one && two ? `${one}&${two}` : one || two || "П");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.name]);

  if (loading) {
    return <PageLoader label="Завантажуємо налаштування…" />;
  }

  return (
    <div className="cabinet-tasks-page">
      <div className="cabinet-tasks-top">
        <h1 className="cabinet-tasks-title">Налаштування</h1>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={initials} />
        </div>
      </div>

      <section className="cabinet-panel" style={{ marginTop: 24 }}>
        <h2>Профіль</h2>
        <p>Тут згодом зʼявляться налаштування акаунта й весілля.</p>
      </section>
    </div>
  );
}

export function CoupleSettingsPage() {
  return (
    <RequireAuth>
      <CoupleSettingsInner />
    </RequireAuth>
  );
}
