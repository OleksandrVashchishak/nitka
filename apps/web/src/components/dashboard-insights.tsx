"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FavoriteHeartButton } from "@/components/favorite-heart-button";
import {
  addFavorite,
  createExternalVendor,
  getDashboardInsights,
  getVendorPipeline,
  updateCatalogVendorPipeline,
  updateExternalVendor,
  type DashboardInsights,
  type VendorPipeline,
  type VendorPipelineStage,
} from "@/lib/dashboard-api";
import { vendorHref } from "@/lib/vendor-href";

const STAGES: Array<{ value: VendorPipelineStage; label: string }> = [
  { value: "SAVED", label: "Зберегли" },
  { value: "CONTACTED", label: "Зв’язались" },
  { value: "MET", label: "Зустрілись" },
  { value: "COMPARED", label: "Порівняли" },
  { value: "CHOSEN", label: "Обрали" },
];

function money(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

type Props = {
  city: string;
};

const emptyManual = {
  name: "",
  category: "",
  phone: "",
  website: "",
  quotedPrice: 0,
  notes: "",
};

export function DashboardInsightsPanel({ city }: Props) {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [pipeline, setPipeline] = useState<VendorPipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState(emptyManual);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [nextInsights, nextPipeline] = await Promise.all([
        getDashboardInsights(),
        getVendorPipeline(),
      ]);
      setInsights(nextInsights);
      setPipeline(nextPipeline);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const candidates = useMemo(
    () => [
      ...(pipeline?.catalog.map((item) => ({
        id: item.vendor.id,
        source: "catalog" as const,
        name: item.vendor.name,
        category: item.vendor.category.name,
        stage: item.stage,
        quotedPrice: item.quotedPrice,
      })) ?? []),
      ...(pipeline?.manual.map((item) => ({
        id: item.id,
        source: "manual" as const,
        name: item.name,
        category: item.category,
        stage: item.stage,
        quotedPrice: item.quotedPrice,
      })) ?? []),
    ],
    [pipeline],
  );

  async function onStage(
    source: "catalog" | "manual",
    id: string,
    stage: VendorPipelineStage,
  ) {
    setError(null);
    try {
      if (source === "catalog") {
        await updateCatalogVendorPipeline(id, { stage });
      } else {
        await updateExternalVendor(id, { stage });
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Статус не оновлено");
    }
  }

  async function onAddManual(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createExternalVendor({
        ...manual,
        city,
        quotedPrice: manual.quotedPrice || undefined,
      });
      setManual(emptyManual);
      setShowManual(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Підрядника не додано");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveRecommendation(vendorId: string) {
    setError(null);
    try {
      await addFavorite(vendorId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено");
    }
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft">
        Рахуємо ціни й підбираємо підрядників...
      </div>
    );
  }

  if (!insights) return null;

  return (
    <section className="mt-6 space-y-6">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Ринок · {insights.city}
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
            {insights.market.average
              ? `${money(insights.market.average)} грн`
              : "Ще мало даних"}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Середній чек підрядника · {insights.market.vendorsCount} профілів
          </p>
          <div className="mt-4 space-y-2">
            {insights.market.categories.slice(0, 3).map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-ink-soft">{item.label}</span>
                <span className="font-medium text-ink">
                  {money(item.average)} грн
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-line bg-sage-deep p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Калькуляція бюджету
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl">
            {money(insights.budget.remaining)} грн
          </p>
          <p className="mt-1 text-sm text-white/70">залишилось із плану</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-white/60">На гостя</p>
              <p className="mt-1 font-medium">
                {money(insights.budget.perGuest)} грн
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-white/60">Факт</p>
              <p className="mt-1 font-medium">
                {money(insights.budget.actual)} грн
              </p>
            </div>
          </div>
          <Link
            href="/budget"
            className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4"
          >
            Детальний бюджет →
          </Link>
        </article>

        <article className="rounded-2xl border border-line bg-mist p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Підрядники
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">
                {insights.pipeline.total}
              </p>
              <p className="text-sm text-ink-soft">у вашому pipeline</p>
            </div>
            <button
              type="button"
              onClick={() => setShowManual((value) => !value)}
              className="rounded-full bg-sage px-3 py-2 text-xs font-semibold text-white hover:bg-sage-deep"
            >
              + Додати свого
            </button>
          </div>
          <div className="mt-4 flex gap-1">
            {STAGES.map((stage) => (
              <div
                key={stage.value}
                className="min-w-0 flex-1 rounded-lg bg-white px-1 py-2 text-center"
                title={stage.label}
              >
                <p className="text-sm font-semibold text-ink">
                  {insights.pipeline.counts[stage.value] ?? 0}
                </p>
                <p className="truncate text-[9px] text-ink-soft">
                  {stage.label}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      {showManual ? (
        <form
          onSubmit={onAddManual}
          className="grid gap-3 rounded-2xl border border-sage/30 bg-white p-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="md:col-span-2 lg:col-span-4">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink">
              Додати вже знайденого підрядника
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Навіть якщо його ще немає в каталозі NITKA.
            </p>
          </div>
          <input
            required
            minLength={2}
            value={manual.name}
            onChange={(e) =>
              setManual((value) => ({ ...value, name: e.target.value }))
            }
            placeholder="Назва / ім’я"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            required
            minLength={2}
            value={manual.category}
            onChange={(e) =>
              setManual((value) => ({ ...value, category: e.target.value }))
            }
            placeholder="Категорія"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            value={manual.phone}
            onChange={(e) =>
              setManual((value) => ({ ...value, phone: e.target.value }))
            }
            placeholder="Телефон"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            type="number"
            min={0}
            value={manual.quotedPrice}
            onChange={(e) =>
              setManual((value) => ({
                ...value,
                quotedPrice: Number(e.target.value),
              }))
            }
            placeholder="Запропонована ціна"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            value={manual.website}
            onChange={(e) =>
              setManual((value) => ({ ...value, website: e.target.value }))
            }
            placeholder="Сайт / Instagram"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage md:col-span-2"
          />
          <input
            value={manual.notes}
            onChange={(e) =>
              setManual((value) => ({ ...value, notes: e.target.value }))
            }
            placeholder="Нотатка"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
          >
            {saving ? "Додаємо..." : "Додати в pipeline"}
          </button>
        </form>
      ) : null}

      {candidates.length > 0 ? (
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                Зберегти → зв’язатися → зустрітися → порівняти → обрати
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Рухай кожного підрядника до фінального рішення.
              </p>
            </div>
            <Link
              href="/favorites"
              className="text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
            >
              Відкрити все →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {candidates.slice(0, 6).map((candidate) => (
              <div
                key={`${candidate.source}-${candidate.id}`}
                className="flex items-center gap-3 rounded-xl border border-line p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">
                    {candidate.name}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {candidate.category}
                    {candidate.quotedPrice
                      ? ` · ${money(candidate.quotedPrice)} грн`
                      : ""}
                  </p>
                </div>
                <select
                  value={candidate.stage}
                  onChange={(e) =>
                    void onStage(
                      candidate.source,
                      candidate.id,
                      e.target.value as VendorPipelineStage,
                    )
                  }
                  className="max-w-32 rounded-lg border border-line bg-white px-2 py-2 text-xs outline-none focus:border-sage"
                >
                  {STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {insights.recommendations.length > 0 ? (
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                Підібрано для вас
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                За містом, незакритими цілями та рейтингом.
              </p>
            </div>
            <Link
              href={`/vendors?city=${encodeURIComponent(insights.city)}`}
              className="text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
            >
              Увесь каталог →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {insights.recommendations.map((vendor) => (
              <article
                key={vendor.id}
                className="relative overflow-hidden rounded-2xl border border-line bg-white"
              >
                <FavoriteHeartButton vendorId={vendor.id} />
                <Link
                  href={vendorHref(vendor)}
                  className="block aspect-[4/3] bg-mist bg-cover bg-center"
                  style={{
                    backgroundImage: vendor.photos[0]?.url
                      ? `url("${vendor.photos[0].url}")`
                      : undefined,
                  }}
                  aria-label={`Відкрити ${vendor.name}`}
                />
                <div className="p-4">
                  <p className="text-xs font-medium text-sage-deep">
                    {vendor.reason}
                  </p>
                  <h3 className="mt-1 truncate font-[family-name:var(--font-display)] text-xl text-ink">
                    {vendor.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    від {money(vendor.priceFrom)} грн · ★{" "}
                    {vendor.rating.toFixed(1)}
                  </p>
                  <button
                    type="button"
                    onClick={() => void onSaveRecommendation(vendor.id)}
                    className="mt-3 w-full rounded-full border border-sage px-3 py-2 text-xs font-semibold text-sage-deep hover:bg-sage hover:text-white"
                  >
                    Зберегти в pipeline
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
