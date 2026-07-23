"use client";

import { FormEvent, useState } from "react";
import {
  submitPublicRsvp,
  type PublicInvite,
  type RsvpStatus,
} from "@/lib/guests-api";

const CHOICES: Array<{ value: RsvpStatus; label: string; hint: string }> = [
  { value: "YES", label: "Так, буду", hint: "З радістю" },
  { value: "MAYBE", label: "Можливо", hint: "Ще думаю" },
  { value: "NO", label: "Не зможу", hint: "На жаль" },
];

type Props = {
  invite: PublicInvite;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

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
    <div className="mx-auto max-w-xl px-5 py-16 md:px-8">
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
        <div className="bg-gradient-to-br from-sage/20 via-mist to-paper px-6 py-8 md:px-8">
          <p className="text-sm uppercase tracking-[0.16em] text-sage-deep">
            Запрошення · RSVP
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            {invite.wedding.coupleName}
          </h1>
          <p className="mt-3 text-ink-soft">
            {formatDate(invite.wedding.date)} · {invite.wedding.city}
          </p>
          <p className="mt-6 text-lg text-ink">
            Привіт, <span className="font-medium">{invite.name}</span>!
            Підтверди, будь ласка, чи будеш з нами.
          </p>
        </div>

        <div className="px-6 py-6 md:px-8 md:py-8">
          {done ? (
            <div className="rounded-2xl border border-sage/30 bg-mist p-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl text-ink">
                Дякуємо!
              </p>
              <p className="mt-3 text-ink-soft">
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
                className="mt-5 text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
              >
                Змінити відповідь
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-3">
                {CHOICES.map((choice) => (
                  <label
                    key={choice.value}
                    className={
                      rsvpStatus === choice.value
                        ? "cursor-pointer rounded-2xl border-2 border-sage bg-sage/10 px-4 py-4"
                        : "cursor-pointer rounded-2xl border border-line px-4 py-4 hover:border-sage/40"
                    }
                  >
                    <input
                      type="radio"
                      name="rsvp"
                      className="sr-only"
                      checked={rsvpStatus === choice.value}
                      onChange={() => setRsvpStatus(choice.value)}
                    />
                    <span className="block text-lg font-medium text-ink">
                      {choice.label}
                    </span>
                    <span className="text-sm text-ink-soft">{choice.hint}</span>
                  </label>
                ))}
              </div>

              {invite.plusOne ? (
                <div className="space-y-3 rounded-2xl bg-mist p-4">
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={plusOneAttending}
                      onChange={(e) => setPlusOneAttending(e.target.checked)}
                      className="size-4 accent-[var(--sage)]"
                    />
                    Зі мною буде +1
                  </label>
                  {plusOneAttending ? (
                    <input
                      value={plusOneName}
                      onChange={(e) => setPlusOneName(e.target.value)}
                      placeholder="Імʼя +1"
                      className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
                    />
                  ) : null}
                </div>
              ) : null}

              <input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Алергії / дієта"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Телефон"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Побажання / коментар"
                rows={3}
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-sage px-4 py-3.5 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
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
