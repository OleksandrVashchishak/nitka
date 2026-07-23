"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin-nav";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import {
  deleteAdminContentPost,
  getAdminContentPosts,
  updateAdminContentStatus,
  type AdminContentPost,
} from "@/lib/admin-content-api";
import { contentHref, contentKindLabel } from "@/lib/content-api";

function AdminContentListInner() {
  const [items, setItems] = useState<AdminContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  async function load() {
    setLoading(true);
    try {
      const data = await getAdminContentPosts({
        q: q.trim() || undefined,
        status:
          status === "ALL"
            ? undefined
            : (status as AdminContentPost["status"]),
      });
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <AdminNav />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
            Контент
          </h1>
          <p className="mt-2 text-ink-soft">
            Статті, гайди та SEO-лендінги для /content
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/content/topics"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-sage/40"
          >
            Топіки
          </Link>
          <Link
            href="/admin/content/new"
            className="rounded-full bg-sage px-4 py-2 text-sm font-medium text-white hover:bg-sage-deep"
          >
            + Новий матеріал
          </Link>
        </div>
      </div>

      <form
        className="mt-8 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук…"
          className="min-w-[200px] flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
        >
          <option value="ALL">Усі статуси</option>
          <option value="DRAFT">Чернетки</option>
          <option value="PUBLISHED">Опубліковані</option>
          <option value="ARCHIVED">Архів</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium"
        >
          Фільтр
        </button>
      </form>

      {loading ? (
        <PageLoader />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-mist/60 text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Назва</th>
                <th className="px-4 py-3 font-medium">Тип</th>
                <th className="px-4 py-3 font-medium">Топік</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-ink-soft">/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {contentKindLabel(item.kind)}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{item.topic.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.status === "PUBLISHED"
                          ? "rounded-full bg-sage/15 px-2.5 py-1 text-xs font-medium text-sage-deep"
                          : "rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink-soft"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/content/${item.id}`}
                        className="text-xs font-medium text-sage-deep hover:underline"
                      >
                        Редагувати
                      </Link>
                      {item.status === "PUBLISHED" ? (
                        <Link
                          href={contentHref(item)}
                          target="_blank"
                          className="text-xs text-ink-soft hover:underline"
                        >
                          Відкрити
                        </Link>
                      ) : null}
                      {item.status !== "PUBLISHED" ? (
                        <button
                          type="button"
                          className="text-xs font-medium text-sage-deep"
                          onClick={() =>
                            void updateAdminContentStatus(
                              item.id,
                              "PUBLISHED",
                            ).then(load)
                          }
                        >
                          Опублікувати
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="text-xs text-ink-soft"
                          onClick={() =>
                            void updateAdminContentStatus(
                              item.id,
                              "DRAFT",
                            ).then(load)
                          }
                        >
                          У чернетку
                        </button>
                      )}
                      {item.status !== "ARCHIVED" ? (
                        <button
                          type="button"
                          className="text-xs text-ink-soft"
                          onClick={() =>
                            void updateAdminContentStatus(
                              item.id,
                              "ARCHIVED",
                            ).then(load)
                          }
                        >
                          В архів
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-xs text-red-700"
                        onClick={() => {
                          if (!confirm("Видалити матеріал?")) return;
                          void deleteAdminContentPost(item.id).then(load);
                        }}
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length ? (
            <p className="px-4 py-8 text-center text-ink-soft">
              Поки порожньо — створи перший матеріал.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function AdminContentList() {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <AdminContentListInner />
    </RequireAuth>
  );
}
