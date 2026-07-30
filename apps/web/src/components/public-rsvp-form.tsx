"use client";

import { FormEvent, useState } from "react";
import { InvitationCard } from "@/components/invitation-card";
import {
  submitPublicRsvp,
  type PublicInvite,
  type RsvpStatus,
} from "@/lib/guests-api";
import { normalizeInvitationContent } from "@/lib/invitations-api";
import { getInvitationTheme } from "@/lib/invitation-themes";

const CHOICES: Array<{ value: RsvpStatus; label: string; hint: string }> = [
  { value: "YES", label: "Так, буду", hint: "З радістю" },
  { value: "MAYBE", label: "Можливо", hint: "Ще думаю" },
  { value: "NO", label: "Не зможу", hint: "На жаль" },
];

type Props = {
  invite: PublicInvite;
};

export function PublicRsvpForm({ invite }: Props) {
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(
    invite.rsvpStatus === "PENDING" ? "YES" : invite.rsvpStatus,
  );
  const [plusOneAttending, setPlusOneAttending] = useState(
    invite.plusOneAttending === true,
  );
  const [plusOneName, setPlusOneName] = useState(invite.plusOneName ?? "");
  const [allergies, setAllergies] = useState(invite.allergies ?? "");
  const [email, setEmail] = useState(invite.email ?? "");
  const [phone, setPhone] = useState(invite.phone ?? "");
  const [notes, setNotes] = useState(invite.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(invite.rsvpStatus !== "PENDING");
  const [savedStatus, setSavedStatus] = useState(invite.rsvpStatus);

  const templateId = invite.invitation?.templateId ?? "sage-linen";
  const theme = getInvitationTheme(templateId);
  const content = normalizeInvitationContent(invite.invitation?.content, {
    headline: invite.wedding.coupleName,
    dateLabel: new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(invite.wedding.date)),
    address: invite.wedding.city,
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await submitPublicRsvp(invite.token, {
        rsvpStatus,
        plusOneAttending: invite.plusOne ? plusOneAttending : undefined,
        plusOneName: invite.plusOne ? plusOneName : undefined,
        allergies,
        email: email || undefined,
        phone: phone || undefined,
        notes: notes || undefined,
      });
      setSavedStatus(result.rsvpStatus);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: theme.colors.bg }}>
      <div className="mx-auto w-full max-w-xl px-3 py-6 sm:px-5 sm:py-10 md:px-6 md:py-14">
        <InvitationCard
          templateId={templateId}
          content={content}
          guestName={invite.name}
          websiteUrl={invite.wedding.websiteUrl}
        />

        <div
          className="mt-4 border px-4 py-5 sm:mt-6 sm:px-5 sm:py-6 md:px-7 md:py-8"
          style={{
            background: theme.colors.surface,
            borderColor: theme.colors.line,
            color: theme.colors.text,
          }}
        >
          {done ? (
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl">
                Дякуємо!
              </p>
              <p className="mt-3 text-sm" style={{ color: theme.colors.muted }}>
                Відповідь збережено
                {savedStatus === "YES"
                  ? ": чекаємо на тебе."
                  : savedStatus === "NO"
                    ? ": шкода, що не вийде."
                    : savedStatus === "MAYBE"
                      ? ": тримаємо місце, поки думаєш."
                      : "."}
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-5 text-sm font-medium underline-offset-4 hover:underline"
                style={{ color: theme.colors.accent }}
              >
                Змінити відповідь
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <p
                className="text-center text-xs uppercase tracking-[0.18em]"
                style={{ color: theme.colors.muted }}
              >
                Підтвердження
              </p>
              <div className="grid gap-3">
                {CHOICES.map((choice) => {
                  const active = rsvpStatus === choice.value;
                  return (
                    <label
                      key={choice.value}
                      className="cursor-pointer border px-4 py-4 transition"
                      style={{
                        borderColor: active
                          ? theme.colors.accent
                          : theme.colors.line,
                        background: active
                          ? `${theme.colors.accent}18`
                          : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="rsvp"
                        className="sr-only"
                        checked={active}
                        onChange={() => setRsvpStatus(choice.value)}
                      />
                      <span className="block text-lg font-medium">
                        {choice.label}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: theme.colors.muted }}
                      >
                        {choice.hint}
                      </span>
                    </label>
                  );
                })}
              </div>

              {invite.plusOne ? (
                <div
                  className="space-y-3 border p-4"
                  style={{ borderColor: theme.colors.line }}
                >
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={plusOneAttending}
                      onChange={(e) => setPlusOneAttending(e.target.checked)}
                    />
                    Зі мною буде +1
                  </label>
                  {plusOneAttending ? (
                    <input
                      value={plusOneName}
                      onChange={(e) => setPlusOneName(e.target.value)}
                      placeholder="Імʼя +1"
                      className="w-full border px-4 py-3 outline-none"
                      style={{
                        borderColor: theme.colors.line,
                        background: theme.colors.bg,
                      }}
                    />
                  ) : null}
                </div>
              ) : null}

              <input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Алергії / дієта"
                className="w-full border px-4 py-3 outline-none"
                style={{
                  borderColor: theme.colors.line,
                  background: theme.colors.bg,
                }}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="border px-4 py-3 outline-none"
                  style={{
                    borderColor: theme.colors.line,
                    background: theme.colors.bg,
                  }}
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Телефон"
                  className="border px-4 py-3 outline-none"
                  style={{
                    borderColor: theme.colors.line,
                    background: theme.colors.bg,
                  }}
                />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Побажання / коментар"
                rows={3}
                className="w-full border px-4 py-3 outline-none"
                style={{
                  borderColor: theme.colors.line,
                  background: theme.colors.bg,
                }}
              />

              {error ? (
                <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] disabled:opacity-60"
                style={{
                  background: theme.colors.accent,
                  color: theme.id === "midnight-frame" ? theme.colors.bg : "#fff",
                }}
              >
                {saving ? "Надсилаємо..." : "Надіслати відповідь"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
