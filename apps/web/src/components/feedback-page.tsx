"use client";

import { FormEvent, useEffect, useState } from "react";
import { openCabinetMoreMenu } from "@/lib/cabinet-more-menu";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { CabinetBackTitle } from "@/components/cabinet-back-title";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
import "@/styles/cabinet/feedback.scss";

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const QUESTIONS = [
  {
    key: "liked",
    label: "Що вам подобається в нашому продукті?",
    placeholder: "Напишіть, що вам сподобалося",
  },
  {
    key: "improve",
    label: "Що можна було б покращити?",
    placeholder: "Напишіть, що можна вдосконалити",
  },
  {
    key: "disliked",
    label: "Що вам не подобається?",
    placeholder: "Напишіть, що вас не влаштовує",
  },
  {
    key: "extra",
    label: "Маєте що додати?",
    placeholder: "Напишіть будь що, що хочеться нам повідомити",
  },
] as const;

type QuestionKey = (typeof QUESTIONS)[number]["key"];

const EMPTY_ANSWERS: Record<QuestionKey, string> = {
  liked: "",
  improve: "",
  disliked: "",
  extra: "",
};

function FeedbackInner() {
  const user = useAuthStore((s) => s.user);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [initials, setInitials] = useState("П");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
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

    const filled = QUESTIONS.filter((q) => answers[q.key].trim());
    if (rating == null && filled.length === 0) {
      setError("Поставте оцінку або напишіть відгук");
      return;
    }

    const message = [
      "Відгук і пропозиції",
      rating != null ? `Оцінка продукту: ${rating}/10` : null,
      ...filled.map((q) => `${q.label}\n${answers[q.key].trim()}`),
    ]
      .filter(Boolean)
      .join("\n\n");

    setBusy(true);
    setError(null);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        message,
      });
      setRating(null);
      setAnswers(EMPTY_ANSWERS);
      toast.success("Дякуємо за відгук", "Він допоможе нам стати кращими");
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
    <div className="cabinet-tasks-page cabinet-support-page cabinet-feedback-page">
      <CabinetPageHeader
        title="Відгуки і пропозиції"
        summary={summary}
        initials={initials}
        accountDesktopOnly={false}
        className="cabinet-feedback-page__desktop-top"
      />

      <div className="cabinet-feedback-page__mobile-top">
        <CabinetBackTitle title="Відгуки і пропозиції" onBack={onBack} />
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
          <Field label="Оцінка продукту (1–10)">
            <div
              className="cabinet-feedback-rating"
              role="radiogroup"
              aria-label="Оцінка продукту"
            >
              {RATINGS.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  className={`cabinet-feedback-rating__item${
                    rating === value ? " cabinet-feedback-rating__item--active" : ""
                  }`}
                  onClick={() =>
                    setRating((current) => (current === value ? null : value))
                  }
                  disabled={busy}
                >
                  {value}
                </button>
              ))}
            </div>
          </Field>
          {QUESTIONS.map((q) => (
            <Textarea
              key={q.key}
              label={q.label}
              size="l"
              name={q.key}
              placeholder={q.placeholder}
              value={answers[q.key]}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
              }
              maxLength={1200}
              disabled={busy}
              className="cabinet-feedback-text"
            />
          ))}
        </div>

        <Button
          type="submit"
          tone="ink"
          size="l"
          loading={busy}
          loadingText="Надсилаємо…"
          className="cabinet-support-submit cabinet-feedback-page__desktop-submit"
        >
          Надіслати
        </Button>

        {error ? (
          <p className="cabinet-support-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="cabinet-feedback-page__mobile-bar">
          <Button
            type="button"
            tone="ghost"
            size="l"
            className="cabinet-feedback-page__cancel"
            onClick={onBack}
            disabled={busy}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            tone="ink"
            size="l"
            loading={busy}
            loadingText="Надсилаємо…"
            className="cabinet-feedback-page__submit"
          >
            Надіслати
          </Button>
        </div>
      </form>
    </div>
  );
}

export function FeedbackPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <FeedbackInner />
    </RequireAuth>
  );
}
