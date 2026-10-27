"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  type AdminWebsiteStatus,
  type AdminWebsitesResponse,
  deleteAdminWebsite,
  fetchAdminWebsites,
  setAdminWebsiteHidden,
} from "@/lib/admin-api";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";
import "@/styles/admin/admin-users.scss";
import "@/styles/admin/admin-websites.scss";

const STATUS_OPTIONS: Array<{ value: AdminWebsiteStatus; label: string }> = [
  { value: "", label: "Усі сайти" },
  { value: "published", label: "Опубліковані" },
  { value: "draft", label: "Чернетки" },
  { value: "hidden", label: "Приховані адміном" },
];

function fmtDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("uk-UA");
}

export function AdminWebsitesPage() {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AdminWebsiteStatus>("");
  const [applied, setApplied] = useState<{ q: string; status: AdminWebsiteStatus }>({
    q: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminWebsitesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminWebsites(accessToken, { ...applied, page }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  }, [accessToken, applied, page]);

  useEffect(() => {
    void load();
  }, [load]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setApplied({ q: q.trim(), status });
  }

  async function onToggleHidden(id: string, hidden: boolean) {
    if (!accessToken || busyId) return;
    setBusyId(id);
    try {
      await setAdminWebsiteHidden(accessToken, id, hidden);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося змінити");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(id: string, slug: string) {
    if (!accessToken || busyId) return;
    if (!window.confirm(`Видалити сайт /w/${slug} назавжди? Це не можна скасувати.`)) {
      return;
    }
    setBusyId(id);
    try {
      await deleteAdminWebsite(accessToken, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося видалити");
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <>
      <h1 className="admin-page-title">Сайти пар</h1>
      <p className="admin-page-sub">
        {data ? `${data.total} за фільтром` : "Завантаження…"}
      </p>

      <form className="admin-filters" onSubmit={onSearch}>
        <input
          type="search"
          placeholder="Slug / email / імʼя"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminWebsiteStatus)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="admin-btn" type="submit">
          Фільтр
        </button>
      </form>

      {error ? <p className="admin-error">{error}</p> : null}

      {loading && !data ? (
        <div className="admin-loader">Завантаження…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Сайт</th>
                <th>Пара</th>
                <th>Власник</th>
                <th>Шаблон</th>
                <th>Опубліковано</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data?.items.map((s) => (
                <tr key={s.id}>
                  <td>
                    <a href={`/w/${s.slug}`} target="_blank" rel="noreferrer">
                      /w/{s.slug}
                    </a>
                  </td>
                  <td>{s.couple}</td>
                  <td>
                    <Link href={`/admin/users/${s.owner.id}`}>{s.owner.email}</Link>
                  </td>
                  <td>{s.templateId}</td>
                  <td>{fmtDate(s.publishedAt)}</td>
                  <td>
                    {s.hidden ? (
                      <span className="admin-badge is-off">прихований</span>
                    ) : s.published ? (
                      <span className="admin-badge is-on">опублікований</span>
                    ) : (
                      <span className="admin-badge">чернетка</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-websites__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        disabled={busyId === s.id}
                        onClick={() => void onToggleHidden(s.id, !s.hidden)}
                      >
                        {s.hidden ? "Показати" : "Сховати"}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        disabled={busyId === s.id}
                        onClick={() => void onDelete(s.id, s.slug)}
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-muted">
                    Сайтів не знайдено
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {data && data.total > data.limit ? (
        <div className="admin-pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Назад
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Далі →
          </button>
        </div>
      ) : null}
    </>
  );
}
