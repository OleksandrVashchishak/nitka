"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import {
  createAdminContentTopic,
  deleteAdminContentTopic,
  getAdminContentTopics,
  updateAdminContentTopic,
  type AdminContentTopic,
} from "@/lib/admin-content-api";

function AdminContentTopicsInner() {
  const [items, setItems] = useState<AdminContentTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await getAdminContentTopics());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateAdminContentTopic(editingId, {
        name,
        slug: slug || undefined,
        description,
      });
    } else {
      await createAdminContentTopic({
        name,
        slug: slug || undefined,
        description,
      });
    }
    setName("");
    setSlug("");
    setDescription("");
    setEditingId(null);
    await load();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <AdminNav />
      <Link
        href="/admin/content"
        className="text-sm text-ink-soft hover:text-sage-deep"
      >
        ← Контент
      </Link>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink">
        Топіки контенту
      </h1>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="mt-8 space-y-3 rounded-2xl border border-line bg-white p-5"
      >
        <p className="text-sm font-semibold text-ink">
          {editingId ? "Редагувати топік" : "Новий топік"}
        </p>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (опційно)"
          className="w-full rounded-xl border border-line px-4 py-2.5 font-mono text-sm"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опис"
          rows={2}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-sage px-4 py-2 text-sm font-medium text-white"
          >
            {editingId ? "Зберегти" : "Створити"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded-full border border-line px-4 py-2 text-sm"
              onClick={() => {
                setEditingId(null);
                setName("");
                setSlug("");
                setDescription("");
              }}
            >
              Скасувати
            </button>
          ) : null}
        </div>
      </form>

      {loading ? (
        <PageLoader />
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-soft">
                  /content/topic/{item.slug}
                  {typeof item._count?.posts === "number"
                    ? ` · ${item._count.posts} опубл.`
                    : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-sage-deep"
                  onClick={() => {
                    setEditingId(item.id);
                    setName(item.name);
                    setSlug(item.slug);
                    setDescription(item.description);
                  }}
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  className="text-xs text-red-700"
                  onClick={() => {
                    if (!confirm("Видалити топік?")) return;
                    void deleteAdminContentTopic(item.id).then(load);
                  }}
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AdminContentTopics() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <AdminContentTopicsInner />
    </RequireAuth>
  );
}
