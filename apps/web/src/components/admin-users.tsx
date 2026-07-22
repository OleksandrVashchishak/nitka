"use client";

import { PageLoader } from "@/components/ui-loader";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getAdminUser,
  getAdminUsers,
  updateAdminWedding,
  updateAdminUser,
  type AdminUser,
  type AdminUserDetail,
} from "@/lib/admin-api";
import { AdminNav } from "@/components/admin-nav";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { RequireAuth } from "@/components/require-auth";
import { uploadFile } from "@/lib/client-api";

const ROLES: Array<AdminUser["role"] | "ALL"> = [
  "ALL",
  "COUPLE",
  "VENDOR",
  "ADMIN",
];

const ROLE_LABEL: Record<string, string> = {
  ALL: "Усі",
  COUPLE: "Пари",
  VENDOR: "Підрядники",
  ADMIN: "Адміни",
  GUEST: "Гості",
};

function weddingForm(detail: AdminUserDetail) {
  const wedding = detail.wedding;
  return {
    date: wedding?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    city: wedding?.city ?? "Київ",
    guests: wedding?.guests ?? 50,
    budget: wedding?.budget ?? 200000,
    partnerOneName: wedding?.partnerOneName ?? "",
    partnerTwoName: wedding?.partnerTwoName ?? "",
    couplePhotoUrl: wedding?.couplePhotoUrl ?? null,
  };
}

function AdminUsersInner() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") as AdminUser["role"] | null;
  const [role, setRole] = useState<AdminUser["role"] | "ALL">(
    initialRole && ROLES.includes(initialRole) ? initialRole : "ALL",
  );
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AdminUser[]>([]);
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [account, setAccount] = useState({
    name: "",
    email: "",
    role: "COUPLE" as AdminUser["role"],
    blocked: false,
  });
  const [wedding, setWedding] = useState<ReturnType<typeof weddingForm> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(
        await getAdminUsers({
          role: role === "ALL" ? undefined : role,
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
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  async function toggleBlock(user: AdminUser) {
    try {
      const updated = await updateAdminUser(user.id, {
        blocked: !user.blocked,
      });
      setItems((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function openProfile(id: string) {
    setError(null);
    try {
      const next = await getAdminUser(id);
      setDetail(next);
      setAccount({
        name: next.name,
        email: next.email,
        role: next.role,
        blocked: next.blocked,
      });
      setWedding(weddingForm(next));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Профіль не завантажено");
    }
  }

  async function saveAccount(e: FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminUser(detail.id, account);
      setDetail((current) =>
        current
          ? {
              ...current,
              ...updated,
              _count: { ...current._count, ...updated._count },
            }
          : current,
      );
      setItems((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Акаунт не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function saveWedding(e: FormEvent) {
    e.preventDefault();
    if (!detail || !wedding) return;
    setSaving(true);
    setError(null);
    try {
      await updateAdminWedding(detail.id, wedding);
      await openProfile(detail.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Весілля не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function uploadCouplePhoto(file?: File) {
    if (!file || !wedding) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file);
      setWedding((current) =>
        current ? { ...current, couplePhotoUrl: result.url } : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Фото не завантажено");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <AdminNav />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
        Юзери
      </h1>
      <p className="mt-2 text-ink-soft">Список акаунтів, блок / розблок.</p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {detail ? (
        <section className="mt-6 rounded-2xl border border-sage/30 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                Редагування профілю
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-ink">
                {detail.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDetail(null)}
              className="text-sm text-ink-soft underline-offset-4 hover:underline"
            >
              Закрити
            </button>
          </div>

          <form
            onSubmit={saveAccount}
            className="mt-5 grid gap-3 border-t border-line pt-5 md:grid-cols-2"
          >
            <h3 className="md:col-span-2 font-semibold text-ink">
              Дані акаунта
            </h3>
            <input
              required
              value={account.name}
              onChange={(e) =>
                setAccount((value) => ({ ...value, name: e.target.value }))
              }
              placeholder="Ім’я / назва"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <input
              type="email"
              required
              value={account.email}
              onChange={(e) =>
                setAccount((value) => ({ ...value, email: e.target.value }))
              }
              placeholder="Email"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <select
              value={account.role}
              onChange={(e) =>
                setAccount((value) => ({
                  ...value,
                  role: e.target.value as AdminUser["role"],
                }))
              }
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            >
              {ROLES.filter((item) => item !== "ALL").map((item) => (
                <option key={item} value={item}>
                  {ROLE_LABEL[item]}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={account.blocked}
                onChange={(e) =>
                  setAccount((value) => ({
                    ...value,
                    blocked: e.target.checked,
                  }))
                }
                className="size-4 accent-[var(--sage)]"
              />
              Акаунт заблоковано
            </label>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60 md:col-span-2 md:justify-self-start"
            >
              Зберегти акаунт
            </button>
          </form>

          {detail.role === "COUPLE" && wedding ? (
            <form
              onSubmit={saveWedding}
              className="mt-6 grid gap-3 border-t border-line pt-5 md:grid-cols-2 lg:grid-cols-3"
            >
              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="font-semibold text-ink">Профіль пари й весілля</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Імена, фото, дата, місто, гості та бюджет.
                </p>
              </div>
              <input
                value={wedding.partnerOneName}
                onChange={(e) =>
                  setWedding((value) =>
                    value
                      ? { ...value, partnerOneName: e.target.value }
                      : value,
                  )
                }
                placeholder="Ім’я партнера 1"
                className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <input
                value={wedding.partnerTwoName}
                onChange={(e) =>
                  setWedding((value) =>
                    value
                      ? { ...value, partnerTwoName: e.target.value }
                      : value,
                  )
                }
                placeholder="Ім’я партнера 2"
                className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-line px-4 py-3 text-sm text-sage-deep hover:border-sage/40">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) =>
                    void uploadCouplePhoto(e.target.files?.[0])
                  }
                />
                {uploading
                  ? "Завантаження..."
                  : wedding.couplePhotoUrl
                    ? "Замінити фото"
                    : "Додати фото"}
              </label>
              <input
                type="date"
                required
                value={wedding.date}
                onChange={(e) =>
                  setWedding((value) =>
                    value ? { ...value, date: e.target.value } : value,
                  )
                }
                className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <CityAutocomplete
                required
                value={wedding.city}
                onChange={(city) =>
                  setWedding((value) =>
                    value ? { ...value, city } : value,
                  )
                }
                placeholder="Місто"
                className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <input
                type="number"
                min={1}
                required
                value={wedding.guests}
                onChange={(e) =>
                  setWedding((value) =>
                    value ? { ...value, guests: Number(e.target.value) } : value,
                  )
                }
                placeholder="Гостей"
                className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <input
                type="number"
                min={0}
                required
                value={wedding.budget}
                onChange={(e) =>
                  setWedding((value) =>
                    value ? { ...value, budget: Number(e.target.value) } : value,
                  )
                }
                placeholder="Бюджет"
                className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
              >
                {detail.wedding ? "Оновити весілля" : "Створити весілля"}
              </button>
            </form>
          ) : null}

          {detail.vendor ? (
            <div className="mt-6 border-t border-line pt-5">
              <h3 className="font-semibold text-ink">Профіль підрядника</h3>
              <p className="mt-1 text-sm text-ink-soft">
                {detail.vendor.name} · {detail.vendor.status}
              </p>
              <Link
                href={`/admin/vendors?id=${detail.vendor.id}`}
                className="mt-3 inline-flex rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep"
              >
                Редагувати профіль підрядника
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={
              role === r
                ? "rounded-full bg-sage px-4 py-2 text-sm text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft"
            }
          >
            {ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук по імені / email"
          className="flex-1 rounded-xl border border-line px-4 py-2 outline-none focus:border-sage"
        />
        <button
          type="submit"
          className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
        >
          Шукати
        </button>
      </form>

      {loading ? (
        <PageLoader className="mt-4" />
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((user) => (
            <li
              key={user.id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{user.name}</p>
                  <p className="text-sm text-ink-soft">
                    {user.email} · {ROLE_LABEL[user.role] ?? user.role}
                    {user.vendor ? ` · ${user.vendor.name}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    Заявок: {user._count.requests} · відгуків:{" "}
                    {user._count.reviews}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void openProfile(user.id)}
                    className="rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-white hover:bg-sage-deep"
                  >
                    Редагувати профіль
                  </button>
                  {user.blocked ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">
                      BLOCKED
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void toggleBlock(user)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs hover:border-sage/40"
                  >
                    {user.blocked ? "Розблокувати" : "Заблокувати"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function AdminUsersPage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminUsersInner />
        </div>
      </section>
    </RequireAuth>
  );
}
