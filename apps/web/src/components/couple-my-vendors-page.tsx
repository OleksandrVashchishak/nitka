"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import {
  createExternalVendor,
  getVendorPipeline,
  removeExternalVendor,
  updateExternalVendor,
  type ExternalVendor,
  type VendorPipelineStage,
} from "@/lib/dashboard-api";
import {
  VENDOR_MANAGER_CATEGORIES,
} from "@/lib/vendor-manager";
import { toast } from "@/lib/toast";

type Filter = "all" | "saved" | "hired";

const emptyForm = {
  name: "",
  category: "photo",
  city: "",
  phone: "",
  website: "",
  quotedPrice: "",
  notes: "",
  stage: "SAVED" as VendorPipelineStage,
};

function money(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function MyVendorsInner() {
  const [manual, setManual] = useState<ExternalVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const data = await getVendorPipeline();
      setManual(data.manual);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const hiredCount = useMemo(
    () => manual.filter((v) => v.stage === "CHOSEN").length,
    [manual],
  );

  const categoriesWithHire = useMemo(() => {
    const set = new Set(
      manual.filter((v) => v.stage === "CHOSEN").map((v) => v.category),
    );
    return set.size;
  }, [manual]);

  const totalCategories = VENDOR_MANAGER_CATEGORIES.length;
  const progress = Math.round((categoriesWithHire / totalCategories) * 100);

  const byCategory = useMemo(() => {
    const map = new Map<string, ExternalVendor[]>();
    for (const cat of VENDOR_MANAGER_CATEGORIES) {
      map.set(cat.slug, []);
    }
    for (const vendor of manual) {
      const key = VENDOR_MANAGER_CATEGORIES.some((c) => c.slug === vendor.category)
        ? vendor.category
        : "other";
      const list = map.get(key) ?? [];
      list.push(vendor);
      map.set(key, list);
    }
    return map;
  }, [manual]);

  const filteredCategories = useMemo(() => {
    return VENDOR_MANAGER_CATEGORIES.filter((cat) => {
      const list = byCategory.get(cat.slug) ?? [];
      if (filter === "hired") {
        return list.some((v) => v.stage === "CHOSEN");
      }
      if (filter === "saved") {
        return list.length > 0;
      }
      return true;
    });
  }, [byCategory, filter]);

  function openAdd(categorySlug?: string) {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category: categorySlug ?? "photo",
    });
    setModalOpen(true);
  }

  function openEdit(vendor: ExternalVendor) {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name,
      category: vendor.category,
      city: vendor.city,
      phone: vendor.phone ?? "",
      website: vendor.website ?? "",
      quotedPrice:
        vendor.quotedPrice != null ? String(vendor.quotedPrice) : "",
      notes: vendor.notes ?? "",
      stage: vendor.stage,
    });
    setModalOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Вкажи назву підрядника");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        city: form.city.trim() || "—",
        phone: form.phone.trim() || undefined,
        website: form.website.trim() || undefined,
        quotedPrice: form.quotedPrice
          ? Number(form.quotedPrice.replace(/\s/g, ""))
          : null,
        notes: form.notes.trim() || undefined,
        stage: form.stage,
      };
      if (editingId) {
        await updateExternalVendor(editingId, payload);
        toast.success("Оновлено", payload.name);
      } else {
        await createExternalVendor(payload);
      }
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Видалити «${name}»?`)) return;
    try {
      await removeExternalVendor(id);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    }
  }

  async function markHired(vendor: ExternalVendor) {
    try {
      await updateExternalVendor(vendor.id, { stage: "CHOSEN" });
      toast.success("Обрано", vendor.name);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо підрядників…" />;
  }

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Мої підрядники
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.12em] text-ink-soft">
            {categoriesWithHire} з {totalCategories} категорій обрано
          </p>
          <div className="mt-3 h-1.5 w-56 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-sage transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-line bg-white p-1">
            {(
              [
                { id: "all" as const, label: "Усі" },
                {
                  id: "saved" as const,
                  label: `Збережені · ${manual.length}`,
                },
                {
                  id: "hired" as const,
                  label: `Обрані · ${hiredCount}`,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  filter === item.id
                    ? "bg-sage text-white"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openAdd()}
            className="rounded-full bg-sage px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            + Додати підрядника
          </button>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-ink-soft">
        Збери команду по категоріях. Поки що можна додавати своїх підрядників
        вручну — з каталогу NITKA підключимо наступним кроком.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.map((cat) => {
          const list = byCategory.get(cat.slug) ?? [];
          const hired = list.filter((v) => v.stage === "CHOSEN");
          const expanded = openCategory === cat.slug;
          return (
            <article
              key={cat.slug}
              className="flex flex-col rounded-2xl border border-line bg-mist/80 p-5 transition hover:border-sage/30 hover:bg-white"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenCategory((current) =>
                    current === cat.slug ? null : cat.slug,
                  )
                }
                className="flex flex-1 flex-col items-center text-center"
              >
                <span className="text-4xl" aria-hidden>
                  {cat.icon}
                </span>
                <h2 className="mt-3 font-semibold text-ink">{cat.name}</h2>
                <p className="mt-1 text-xs text-ink-soft">
                  {list.length === 0
                    ? "Поки порожньо"
                    : hired.length > 0
                      ? `Обрано: ${hired.length}`
                      : `Збережено: ${list.length}`}
                </p>
              </button>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openAdd(cat.slug)}
                  className="flex-1 rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-sage/40"
                >
                  + Свого
                </button>
                {cat.catalogSlug ? (
                  <Link
                    href={`/vendors?category=${cat.catalogSlug}`}
                    className="rounded-full border border-dashed border-line px-3 py-2 text-sm text-ink-soft"
                    title="З каталогу — скоро"
                  >
                    Каталог
                  </Link>
                ) : null}
              </div>

              {expanded && list.length > 0 ? (
                <ul className="mt-4 space-y-2 border-t border-line pt-4">
                  {list.map((vendor) => (
                    <li
                      key={vendor.id}
                      className="rounded-xl bg-white px-3 py-2.5 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {vendor.stage === "CHOSEN" ? "Обрано ✓" : "Збережено"}
                            {vendor.quotedPrice != null
                              ? ` · ${money(vendor.quotedPrice)} ₴`
                              : ""}
                          </p>
                          {vendor.phone ? (
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {vendor.phone}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-col gap-1">
                          {vendor.stage !== "CHOSEN" ? (
                            <button
                              type="button"
                              onClick={() => void markHired(vendor)}
                              className="text-xs font-medium text-sage-deep hover:underline"
                            >
                              Обрати
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => openEdit(vendor)}
                            className="text-xs text-ink-soft hover:underline"
                          >
                            Змінити
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void onDelete(vendor.id, vendor.name)
                            }
                            className="text-xs text-red-700 hover:underline"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      {filteredCategories.length === 0 ? (
        <p className="mt-10 text-center text-ink-soft">
          Немає категорій у цьому фільтрі. Додай підрядника або обери «Усі».
        </p>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal
            aria-labelledby="my-vendors-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-xl md:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="my-vendors-modal-title"
                  className="font-[family-name:var(--font-display)] text-2xl text-ink"
                >
                  {editingId ? "Редагувати підрядника" : "Додати свого"}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Контакти й нотатки — лише для тебе в кабінеті.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft"
              >
                Закрити
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <input
                required
                minLength={2}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Назва / імʼя"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              >
                {VENDOR_MANAGER_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  placeholder="Місто"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="Телефон"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
              </div>
              <input
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
                placeholder="Сайт / Instagram"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <input
                inputMode="numeric"
                value={form.quotedPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quotedPrice: e.target.value }))
                }
                placeholder="Ціна / кошторис, ₴"
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Нотатки"
                rows={3}
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.stage === "CHOSEN"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stage: e.target.checked ? "CHOSEN" : "SAVED",
                    }))
                  }
                  className="size-4 accent-[var(--sage)]"
                />
                Вже обрали цього підрядника
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
              >
                {saving
                  ? "Зберігаємо…"
                  : editingId
                    ? "Зберегти зміни"
                    : "Додати"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CoupleMyVendorsPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <MyVendorsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
