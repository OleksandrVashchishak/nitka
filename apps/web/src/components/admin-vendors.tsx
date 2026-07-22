"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAdminVendor,
  getAdminVendors,
  getAdminCategories,
  setAdminVendorFeatured,
  updateAdminVendorProfile,
  updateAdminVendorStatus,
  type AdminCategory,
  type AdminVendor,
} from "@/lib/admin-api";
import { AdminNav } from "@/components/admin-nav";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { RequireAuth } from "@/components/require-auth";

const STATUSES: Array<AdminVendor["status"] | "ALL"> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "BLOCKED",
];

function profileForm(vendor: AdminVendor) {
  return {
    name: vendor.name,
    tagline: vendor.tagline ?? "",
    description: vendor.description,
    categoryId: vendor.category.id,
    city: vendor.city,
    priceFrom: vendor.priceFrom,
    priceTo: vendor.priceTo ?? 0,
    phone: vendor.phone ?? "",
    website: vendor.website ?? "",
    instagram: vendor.instagram ?? "",
    address: vendor.address ?? "",
    yearsInBusiness: vendor.yearsInBusiness ?? 0,
    teamSize: vendor.teamSize ?? 0,
    responseTime: vendor.responseTime ?? "",
    bookingLeadTime: vendor.bookingLeadTime ?? "",
    availabilityNote: vendor.availabilityNote ?? "",
    videoUrl: vendor.videoUrl ?? "",
    dealTitle: vendor.dealTitle ?? "",
    dealDescription: vendor.dealDescription ?? "",
    styles: (vendor.styles ?? []).join(", "),
    services: (vendor.services ?? []).join(", "),
    serviceAreas: (vendor.serviceAreas ?? []).join(", "),
    languages: (vendor.languages ?? []).join(", "),
  };
}

function list(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function AdminVendorsInner() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as AdminVendor["status"]) || "ALL";
  const detailId = searchParams.get("id");

  const [status, setStatus] = useState<AdminVendor["status"] | "ALL">(
    initialStatus === "PENDING" ||
      initialStatus === "APPROVED" ||
      initialStatus === "REJECTED" ||
      initialStatus === "BLOCKED"
      ? initialStatus
      : "ALL",
  );
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AdminVendor[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [detail, setDetail] = useState<AdminVendor | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof profileForm> | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadList() {
    setLoading(true);
    setError(null);
    try {
      setItems(
        await getAdminVendors({
          status: status === "ALL" ? undefined : status,
          q: q || undefined,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    void getAdminCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      return;
    }
    void (async () => {
      try {
        const v = await getAdminVendor(detailId);
        setDetail(v);
        setForm(profileForm(v));
        setEditing(false);
        setNote(v.moderationNote ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не знайдено");
      }
    })();
  }, [detailId]);

  async function onStatus(id: string, next: AdminVendor["status"]) {
    try {
      const updated = await updateAdminVendorStatus(
        id,
        next,
        next === "REJECTED" || next === "BLOCKED" ? note : undefined,
      );
      setItems((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
      if (detail?.id === id) setDetail((d) => (d ? { ...d, ...updated } : d));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function onFeatured(id: string, featured: boolean) {
    try {
      const updated = await setAdminVendorFeatured(id, featured);
      setItems((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
      if (detail?.id === id) setDetail((d) => (d ? { ...d, ...updated } : d));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!detail || !form) return;
    setSaving(true);
    setError(null);
    try {
      await updateAdminVendorProfile(detail.id, {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        categoryId: form.categoryId,
        city: form.city,
        priceFrom: form.priceFrom,
        priceTo: form.priceTo || null,
        phone: form.phone || null,
        website: form.website || null,
        instagram: form.instagram || null,
        address: form.address || null,
        yearsInBusiness: form.yearsInBusiness || null,
        teamSize: form.teamSize || null,
        responseTime: form.responseTime || null,
        bookingLeadTime: form.bookingLeadTime || null,
        availabilityNote: form.availabilityNote,
        videoUrl: form.videoUrl || null,
        dealTitle: form.dealTitle || null,
        dealDescription: form.dealDescription || null,
        styles: list(form.styles),
        services: list(form.services),
        serviceAreas: list(form.serviceAreas),
        languages: list(form.languages),
        photoUrls: detail.photos?.map((photo) => photo.url),
        packages: detail.packages?.map((item) => ({
          title: item.title,
          price: item.price,
          description: item.description,
          includes: item.includes,
          duration: item.duration,
          isPopular: item.isPopular,
        })),
        faqs: detail.faqs?.map((item) => ({
          question: item.question,
          answer: item.answer,
        })),
        team: detail.team?.map((item) => ({
          name: item.name,
          role: item.role,
          bio: item.bio,
          photoUrl: item.photoUrl,
        })),
      });
      const updated = await getAdminVendor(detail.id);
      setDetail(updated);
      setForm(profileForm(updated));
      setEditing(false);
      setItems((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Профіль не збережено");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminNav />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
        Підрядники
      </h1>
      <p className="mt-2 text-ink-soft">
        Модерація, featured і детальний перегляд профілю.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={
              status === s
                ? "rounded-full bg-sage px-4 py-2 text-sm text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft"
            }
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void loadList();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук: назва, місто, email"
          className="min-w-[240px] flex-1 rounded-xl border border-line px-4 py-2 outline-none focus:border-sage"
        />
        <button
          type="submit"
          className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
        >
          Шукати
        </button>
      </form>

      {detail ? (
        <div className="mt-8 rounded-2xl border border-line bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-ink-soft">
                {detail.category.name} · {detail.city} · {detail.status}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl">
                {detail.name}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {detail.user.name} · {detail.user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep"
              >
                {editing ? "Скасувати" : "Редагувати профіль"}
              </button>
              <Link
                href="/admin/vendors"
                className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft"
              >
                Закрити
              </Link>
            </div>
          </div>
          <p className="mt-4 text-ink-soft">{detail.description}</p>
          {editing && form ? (
            <form
              onSubmit={onSaveProfile}
              className="mt-5 grid gap-3 rounded-2xl border border-line bg-mist/60 p-4 md:grid-cols-2"
            >
              <h3 className="font-semibold text-ink md:col-span-2">
                Публічний профіль
              </h3>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((value) =>
                    value ? { ...value, name: e.target.value } : value,
                  )
                }
                placeholder="Назва"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <input
                value={form.tagline}
                onChange={(e) =>
                  setForm((value) =>
                    value ? { ...value, tagline: e.target.value } : value,
                  )
                }
                placeholder="Короткий слоган"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm((value) =>
                    value ? { ...value, description: e.target.value } : value,
                  )
                }
                placeholder="Опис"
                rows={4}
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage md:col-span-2"
              />
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm((value) =>
                    value ? { ...value, categoryId: e.target.value } : value,
                  )
                }
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <CityAutocomplete
                required
                value={form.city}
                onChange={(city) =>
                  setForm((value) =>
                    value ? { ...value, city } : value,
                  )
                }
                placeholder="Місто"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <input
                type="number"
                min={0}
                required
                value={form.priceFrom}
                onChange={(e) =>
                  setForm((value) =>
                    value
                      ? { ...value, priceFrom: Number(e.target.value) }
                      : value,
                  )
                }
                placeholder="Ціна від"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <input
                type="number"
                min={0}
                value={form.priceTo}
                onChange={(e) =>
                  setForm((value) =>
                    value
                      ? { ...value, priceTo: Number(e.target.value) }
                      : value,
                  )
                }
                placeholder="Ціна до"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              {[
                ["phone", "Телефон"],
                ["website", "Сайт"],
                ["instagram", "Instagram"],
                ["address", "Адреса"],
                ["responseTime", "Час відповіді"],
                ["bookingLeadTime", "Бронювання наперед"],
                ["videoUrl", "Посилання на відео"],
                ["dealTitle", "Назва спецпропозиції"],
              ].map(([key, placeholder]) => (
                <input
                  key={key}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) =>
                    setForm((value) =>
                      value ? { ...value, [key]: e.target.value } : value,
                    )
                  }
                  placeholder={placeholder}
                  className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
                />
              ))}
              <input
                type="number"
                min={0}
                value={form.yearsInBusiness}
                onChange={(e) =>
                  setForm((value) =>
                    value
                      ? {
                          ...value,
                          yearsInBusiness: Number(e.target.value),
                        }
                      : value,
                  )
                }
                placeholder="Років у бізнесі"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <input
                type="number"
                min={0}
                value={form.teamSize}
                onChange={(e) =>
                  setForm((value) =>
                    value
                      ? { ...value, teamSize: Number(e.target.value) }
                      : value,
                  )
                }
                placeholder="Розмір команди"
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <textarea
                value={form.availabilityNote}
                onChange={(e) =>
                  setForm((value) =>
                    value
                      ? { ...value, availabilityNote: e.target.value }
                      : value,
                  )
                }
                placeholder="Доступність"
                rows={2}
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              <textarea
                value={form.dealDescription}
                onChange={(e) =>
                  setForm((value) =>
                    value
                      ? { ...value, dealDescription: e.target.value }
                      : value,
                  )
                }
                placeholder="Опис спецпропозиції"
                rows={2}
                className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
              />
              {[
                ["styles", "Стилі через кому"],
                ["services", "Послуги через кому"],
                ["serviceAreas", "Міста роботи через кому"],
                ["languages", "Мови через кому"],
              ].map(([key, placeholder]) => (
                <input
                  key={key}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) =>
                    setForm((value) =>
                      value ? { ...value, [key]: e.target.value } : value,
                    )
                  }
                  placeholder={placeholder}
                  className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
                />
              ))}
              <p className="text-xs text-ink-soft md:col-span-2">
                Фото, пакети, FAQ і команда зберігаються без змін. Їх детально
                редагує сам підрядник у своєму кабінеті.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60 md:col-span-2 md:justify-self-start"
              >
                {saving ? "Зберігаємо..." : "Зберегти профіль"}
              </button>
            </form>
          ) : null}
          {(detail.packages?.length ?? 0) > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-medium">Пакети</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                {detail.packages?.map((p) => (
                  <li key={p.id}>
                    {p.title} — {p.price} грн
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {(detail.photos ?? []).slice(0, 3).map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.url}
                alt=""
                className="aspect-video rounded-xl object-cover"
              />
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Причина reject / нотатка модерації"
            rows={2}
            className="mt-4 w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-sage"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {(["APPROVED", "PENDING", "REJECTED", "BLOCKED"] as const).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void onStatus(detail.id, s)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-sage/40"
                >
                  {s}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => void onFeatured(detail.id, !detail.featured)}
              className="rounded-full bg-mist px-3 py-1.5 text-xs text-sage-deep"
            >
              {detail.featured ? "Зняти Featured" : "Зробити Featured"}
            </button>
            <Link
              href={`/vendors/${detail.id}`}
              className="rounded-full border border-line px-3 py-1.5 text-xs"
            >
              Публічна сторінка
            </Link>
          </div>
        </div>
      ) : null}

      {loading ? (
        <PageLoader className="mt-4" />
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((v) => (
            <li
              key={v.id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-soft">
                    {v.category.name} · {v.city}
                    {v.featured ? " · Featured" : ""}
                  </p>
                  <h2 className="mt-1 text-xl font-medium text-ink">{v.name}</h2>
                  <p className="text-sm text-ink-soft">
                    {v.user.email} · ★ {v.rating.toFixed(1)} · заявок{" "}
                    {v._count.requests}
                  </p>
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-sm text-sage-deep">
                  {v.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/vendors?id=${v.id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-sage/40"
                >
                  Деталка
                </Link>
                {(["APPROVED", "REJECTED", "BLOCKED"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void onStatus(v.id, s)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-sage/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function AdminVendorsPage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminVendorsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
