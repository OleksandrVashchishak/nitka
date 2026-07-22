"use client";

import { PageLoader } from "@/components/ui-loader";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getVendorPipeline,
  removeExternalVendor,
  removeFavorite,
  updateCatalogVendorPipeline,
  updateExternalVendor,
  type VendorPipeline,
  type VendorPipelineStage,
} from "@/lib/dashboard-api";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";

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

function FavoritesInner() {
  const [data, setData] = useState<VendorPipeline>({ catalog: [], manual: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setData(await getVendorPipeline());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const columns = useMemo(
    () =>
      STAGES.map((stage) => ({
        ...stage,
        catalog: data.catalog.filter((item) => item.stage === stage.value),
        manual: data.manual.filter((item) => item.stage === stage.value),
      })),
    [data],
  );

  async function onCatalogStage(
    vendorId: string,
    stage: VendorPipelineStage,
  ) {
    try {
      await updateCatalogVendorPipeline(vendorId, { stage });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Статус не оновлено");
    }
  }

  async function onManualStage(id: string, stage: VendorPipelineStage) {
    try {
      await updateExternalVendor(id, { stage });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Статус не оновлено");
    }
  }

  async function onRemoveCatalog(vendorId: string) {
    try {
      await removeFavorite(vendorId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  async function onRemoveManual(id: string) {
    try {
      await removeExternalVendor(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  return (
    <>
      <DashboardNav variant="COUPLE" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Підрядники
          </h1>
          <p className="mt-2 text-ink-soft">
            Зберегти → зв’язатися → зустрітися → порівняти → обрати.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          + Додати свого в dashboard
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <PageLoader className="mt-4" />
      ) : data.catalog.length + data.manual.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">Поки порожньо.</p>
          <Link
            href="/vendors"
            className="mt-4 inline-flex text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-2 md:-mx-0 md:px-0">
          <div className="flex w-max gap-4 xl:w-full xl:grid xl:grid-cols-5">
            {columns.map((column) => (
              <section
                key={column.value}
                className="w-[260px] shrink-0 rounded-2xl border border-line bg-mist p-3 xl:w-auto xl:min-w-0"
              >
                <div className="flex items-center justify-between gap-2 px-1 py-2">
                  <h2 className="font-semibold text-ink">{column.label}</h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-ink-soft">
                    {column.catalog.length + column.manual.length}
                  </span>
                </div>
                <div className="mt-2 space-y-3">
                  {column.catalog.map((item) => {
                    const cover = item.vendor.photos[0]?.url;
                    return (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-xl border border-line bg-white"
                      >
                        <Link
                          href={`/vendors/${item.vendor.id}`}
                          className="relative block aspect-[16/9] bg-mist"
                        >
                          {cover ? (
                            <Image
                              src={cover}
                              alt={item.vendor.name}
                              fill
                              className="object-cover"
                              sizes="260px"
                            />
                          ) : null}
                        </Link>
                        <div className="p-3">
                          <p className="truncate font-medium text-ink">
                            {item.vendor.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-ink-soft">
                            {item.vendor.category.name} · {item.vendor.city}
                          </p>
                          {item.quotedPrice ? (
                            <p className="mt-1 text-xs text-ink">
                              Офер: {money(item.quotedPrice)} грн
                            </p>
                          ) : null}
                          <select
                            value={item.stage}
                            onChange={(e) =>
                              void onCatalogStage(
                                item.vendor.id,
                                e.target.value as VendorPipelineStage,
                              )
                            }
                            className="mt-3 w-full max-w-full rounded-lg border border-line px-2 py-2 text-xs outline-none focus:border-sage"
                          >
                            {STAGES.map((stage) => (
                              <option key={stage.value} value={stage.value}>
                                {stage.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => void onRemoveCatalog(item.vendor.id)}
                            className="mt-2 text-xs text-ink-soft underline-offset-4 hover:underline"
                          >
                            Прибрати
                          </button>
                        </div>
                      </article>
                    );
                  })}

                  {column.manual.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-dashed border-sage/40 bg-white p-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sage-deep">
                        Додано вручну
                      </p>
                      <p className="mt-1 truncate font-medium text-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-ink-soft">
                        {item.category} · {item.city}
                      </p>
                      {item.quotedPrice ? (
                        <p className="mt-1 text-xs text-ink">
                          Офер: {money(item.quotedPrice)} грн
                        </p>
                      ) : null}
                      <select
                        value={item.stage}
                        onChange={(e) =>
                          void onManualStage(
                            item.id,
                            e.target.value as VendorPipelineStage,
                          )
                        }
                        className="mt-3 w-full max-w-full rounded-lg border border-line px-2 py-2 text-xs outline-none focus:border-sage"
                      >
                        {STAGES.map((stage) => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => void onRemoveManual(item.id)}
                        className="mt-2 text-xs text-ink-soft underline-offset-4 hover:underline"
                      >
                        Видалити
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function FavoritesPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="overflow-x-hidden bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <FavoritesInner />
        </div>
      </section>
    </RequireAuth>
  );
}
