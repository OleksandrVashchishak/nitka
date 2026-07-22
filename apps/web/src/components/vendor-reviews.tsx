"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { VendorReview } from "@/lib/api";
import {
  createReview,
  deleteReview,
  getMyReview,
  updateReview,
} from "@/lib/reviews-api";
import { useAuthStore } from "@/lib/auth-store";

type Props = {
  vendorId: string;
  initialReviews: VendorReview[];
  rating: number;
  reviewsCount: number;
};

function Stars({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "text-base" : "text-2xl";
  return (
    <div className={`flex gap-1 ${cls}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={
            n <= value
              ? "text-sage disabled:cursor-default"
              : "text-line disabled:cursor-default"
          }
          aria-label={`${n} зірок`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA").format(new Date(value));
}

export function VendorReviews({
  vendorId,
  initialReviews,
  rating,
  reviewsCount,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [reviews, setReviews] = useState(initialReviews);
  const [mine, setMine] = useState<VendorReview | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    if (!hydrated || !user || (user.role !== "COUPLE" && user.role !== "ADMIN")) {
      setMine(null);
      return;
    }
    void (async () => {
      try {
        const existing = await getMyReview(vendorId);
        setMine(existing);
        if (existing) {
          setRatingValue(existing.rating);
          setText(existing.text);
        }
      } catch {
        setMine(null);
      }
    })();
  }, [hydrated, user, vendorId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      if (mine) {
        const updated = await updateReview(mine.id, {
          rating: ratingValue,
          text,
        });
        setMine(updated);
        setReviews((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
        setOk("Відгук оновлено");
      } else {
        const created = await createReview({
          vendorId,
          rating: ratingValue,
          text,
        });
        setMine(created);
        setReviews((prev) => [created, ...prev]);
        setOk("Відгук додано");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!mine) return;
    setSaving(true);
    setError(null);
    try {
      await deleteReview(mine.id);
      setReviews((prev) => prev.filter((r) => r.id !== mine.id));
      setMine(null);
      setText("");
      setRatingValue(5);
      setOk("Відгук видалено");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setSaving(false);
    }
  }

  const canReview =
    hydrated && user && (user.role === "COUPLE" || user.role === "ADMIN");

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
            Відгуки
          </h2>
          <p className="mt-2 text-ink-soft">
            ★ {rating.toFixed(1)} · {reviewsCount} відгуків
          </p>
        </div>
      </div>

      {canReview ? (
        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-5"
        >
          <p className="font-medium text-ink">
            {mine ? "Твій відгук" : "Залишити відгук"}
          </p>
          <Stars value={ratingValue} onChange={setRatingValue} />
          <textarea
            required
            minLength={10}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Розкажи про досвід (мін. 10 символів)"
            className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {ok ? (
            <p className="rounded-xl border border-sage/30 bg-mist px-4 py-3 text-sm text-sage-deep">
              {ok}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
            >
              {saving ? "Зберігаємо..." : mine ? "Оновити" : "Надіслати"}
            </button>
            {mine ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => void onDelete()}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft hover:border-red-300"
              >
                Видалити
              </button>
            ) : null}
          </div>
        </form>
      ) : hydrated && !user ? (
        <p className="mt-6 rounded-2xl border border-line bg-mist px-5 py-4 text-sm text-ink-soft">
          Щоб залишити відгук,{" "}
          <Link href="/login" className="text-sage-deep underline-offset-4 hover:underline">
            увійди як наречені
          </Link>
          .
        </p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="mt-6 text-ink-soft">Поки немає відгуків — будь першим.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-line bg-mist p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-ink">{review.user.name}</p>
                <p className="text-sm text-ink-soft">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              <div className="mt-2">
                <Stars value={review.rating} size="sm" />
              </div>
              <p className="mt-3 text-ink">{review.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
