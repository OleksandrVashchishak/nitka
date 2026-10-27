"use client";

import { FormEvent, useEffect, useState } from "react";
import { openCabinetMoreMenu } from "@/lib/cabinet-more-menu";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { CabinetBackTitle } from "@/components/cabinet-back-title";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TextInput } from "@/components/ui/text-input";
import { PageLoader } from "@/components/ui-loader";
import { submitContactMessage } from "@/lib/contact-api";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";
import "@/styles/cabinet/support.scss";

function SupportInner() {
  const user = useAuthStore((s) => s.user);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [initials, setInitials] = useState("П");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [weddingData, summaryData] = await Promise.all([
          getMyWedding().catch(() => null),
          getNotificationsSummary().catch(() => null),
        ]);
        if (cancelled) return;
        setSummary(summaryData);

        const displayName =
          weddingData?.partnerOneName?.trim() || user?.name?.trim() || "";
        setName(displayName);
        setEmail(user?.email?.trim() || "");

        const one = displayName.trim().charAt(0).toUpperCase();
        const two = (weddingData?.partnerTwoName || "")
          .trim()
          .charAt(0)
          .toUpperCase();
        setInitials(one && two ? `${one}&${two}` : one || two || "П");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.name]);

  function onBack() {
    openCabinetMoreMenu();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setMessage("");
      toast.success("Надіслано", "Ми відповімо якнайшвидше");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося надіслати");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо…" />;
  }

  return (
    <div className="cabinet-tasks-page cabinet-support-page">
      <CabinetPageHeader
        title="Підтримка"
        summary={summary}
        initials={initials}
        accountDesktopOnly={false}
        className="cabinet-support-page__desktop-top"
      />

      <div className="cabinet-support-page__mobile-top">
        <CabinetBackTitle title="Підтримка" onBack={onBack} />
      </div>

      <form className="cabinet-support-card" onSubmit={onSubmit} noValidate>
        <div className="cabinet-support-fields">
          <TextInput
            label="Ім'я"
            size="l"
            name="name"
            autoComplete="name"
            placeholder="Анна"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            disabled={busy}
          />
          <TextInput
            label="Email"
            size="l"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="anna@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            disabled={busy}
          />
          <Textarea
            label="Ваше запитання"
            size="l"
            name="message"
            placeholder="Напишіть запитання"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={5000}
            disabled={busy}
            className="cabinet-support-message"
          />
        </div>

        <Button
          type="submit"
          tone="ink"
          size="l"
          loading={busy}
          loadingText="Надсилаємо…"
          className="cabinet-support-submit"
        >
          Надіслати
        </Button>

        {error ? (
          <p className="cabinet-support-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}

export function SupportPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <SupportInner />
    </RequireAuth>
  );
}
