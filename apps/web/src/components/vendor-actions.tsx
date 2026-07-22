"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { addFavorite, createRequest } from "@/lib/dashboard-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";

type Props = {
  vendorId: string;
  vendorCity: string;
  vendorName?: string;
  priceText?: string;
  responseTime?: string | null;
};

export function VendorActions({
  vendorId,
  vendorCity,
  vendorName,
  priceText,
  responseTime,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [eventDate, setEventDate] = useState("2026-09-20");
  const [city, setCity] = useState(vendorCity);
  const [guests, setGuests] = useState(80);
  const [budget, setBudget] = useState(300000);
  const [text, setText] = useState("Привіт! Хочемо дізнатись про доступність.");

  async function onFavorite() {
    if (!user) {
      toast.info("Увійди, щоб зберегти");
      router.push("/login");
      return;
    }
    if (user.role !== "COUPLE" && user.role !== "ADMIN") {
      toast.error("Обране доступне для наречених");
      return;
    }
    try {
      await addFavorite(vendorId);
    } catch {
      /* api toast */
    }
  }

  async function onRequest(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.info("Увійди, щоб надіслати заявку");
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      await createRequest({
        vendorId,
        eventDate,
        city,
        guests,
        budget,
        message: text,
      });
      setOpen(false);
    } catch {
      /* api toast */
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated) {
    return null;
  }

  if (!user) {
    return (
      <aside className="h-fit rounded-2xl border border-line bg-mist p-6">
        <p className="font-[family-name:var(--font-display)] text-2xl text-ink">
          Хочеш звʼязатись?
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Увійди як наречені, щоб зберегти або надіслати заявку.
        </p>
        <Link
          href="/login"
          className="mt-6 block rounded-full bg-sage px-4 py-3 text-center text-sm font-semibold text-white hover:bg-sage-deep"
        >
          Увійти
        </Link>
      </aside>
    );
  }

  if (user.role === "VENDOR") {
    return (
      <aside className="h-fit rounded-2xl border border-line bg-mist p-6">
        <p className="font-[family-name:var(--font-display)] text-2xl text-ink">
          Кабінет підрядника
        </p>
        <Link
          href="/vendor/dashboard"
          className="mt-6 block text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
        >
          Відкрити дашборд
        </Link>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-2xl border border-line bg-white p-6 shadow-[0_16px_45px_rgba(47,54,45,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Запит безкоштовний
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
        Дізнатись, чи вільна дата
      </p>
      {vendorName ? (
        <p className="mt-2 text-sm text-ink-soft">
          Напиши {vendorName}
          {priceText ? ` · ${priceText}` : ""}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => void onFavorite()}
          className="w-full rounded-full border border-line bg-white px-4 py-3 text-sm font-medium text-ink hover:border-sage/40"
        >
          ♡ Зберегти в обране
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full rounded-full bg-sage px-4 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          Надіслати заявку
        </button>
      </div>

      {open ? (
        <form onSubmit={onRequest} className="mt-5 space-y-3 border-t border-line pt-5">
          <input
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
          />
          <CityAutocomplete
            required
            value={city}
            onChange={setCity}
            placeholder="Місто"
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={1}
              required
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
            />
            <input
              type="number"
              min={0}
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
            />
          </div>
          <textarea
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-sage-deep px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <LoadingButtonLabel loading={saving} loadingText="Надсилаємо…">
              Відправити
            </LoadingButtonLabel>
          </button>
        </form>
      ) : null}

      {responseTime ? (
        <p className="mt-4 text-center text-xs text-ink-soft">
          Зазвичай відповідає {responseTime}
        </p>
      ) : null}

      <Link
        href="/requests"
        className="mt-4 block text-center text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
      >
        Мої заявки
      </Link>
    </aside>
  );
}
