"use client";

import { PageLoader } from "@/components/ui-loader";
import { FormEvent, useEffect, useState } from "react";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type AdminCategory,
} from "@/lib/admin-api";
import { AdminNav } from "@/components/admin-nav";
import { RequireAuth } from "@/components/require-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminCategoriesInner() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await getAdminCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function startEdit(item: AdminCategory) {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug);
    setDescription(item.description ?? "");
    setSortOrder(item.sortOrder ?? 0);
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setSortOrder(0);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { name, slug, description, sortOrder };
      if (editingId) {
        const updated = await updateAdminCategory(editingId, payload);
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
      } else {
        const created = await createAdminCategory(payload);
        setItems((prev) => [...prev, created]);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteAdminCategory(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  return (
    <>
      <AdminNav />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
        Категорії
      </h1>
      <p className="mt-2 text-ink-soft">Назва, slug, опис і порядок сортування.</p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="mt-8 max-w-xl space-y-3 rounded-2xl border border-line bg-white p-5"
      >
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!editingId) setSlug(slugify(e.target.value) || slug);
          }}
          placeholder="Назва"
          className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        />
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug"
          className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опис"
          className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        />
        <input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          placeholder="Порядок"
          className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {editingId ? "Оновити" : "Створити"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-line px-4 py-2 text-sm"
            >
              Скасувати
            </button>
          ) : null}
        </div>
      </form>

      {loading ? (
        <PageLoader className="mt-4" />
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5"
            >
              <div>
                <p className="font-medium text-ink">
                  {item.sortOrder ?? 0}. {item.name}{" "}
                  <span className="text-ink-soft">({item.slug})</span>
                </p>
                <p className="text-sm text-ink-soft">
                  {item.description || "Без опису"} · підрядників:{" "}
                  {item._count.vendors}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs"
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(item.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-700"
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function AdminCategoriesPage() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <AdminCategoriesInner />
        </div>
      </section>
    </RequireAuth>
  );
}
