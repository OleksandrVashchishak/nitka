"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  type AdminUsersResponse,
  fetchAdminUsers,
} from "@/lib/admin-api";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";
import "@/styles/admin/admin-users.scss";

const PLANNING_STAGES = [
  { value: "", label: "Всі етапи" },
  { value: "NOT_ENGAGED", label: "NOT_ENGAGED" },
  { value: "EXPLORING", label: "EXPLORING" },
  { value: "PLANNING_NO_VENUE", label: "PLANNING_NO_VENUE" },
  { value: "PLANNING_WITH_VENUE", label: "PLANNING_WITH_VENUE" },
  { value: "FINAL_DETAILS", label: "FINAL_DETAILS" },
] as const;

const ACTIVITY_OPTIONS = [
  { value: "", label: "Уся активність" },
  { value: "active", label: "Активні ≤14д" },
  { value: "inactive", label: "Неактивні 14д+" },
  { value: "never", label: "Ніколи не логінились" },
  { value: "empty", label: "Порожні акаунти" },
] as const;

function fmtDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("uk-UA");
}

export function AdminUsersPage() {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [planningStage, setPlanningStage] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activity, setActivity] = useState("");

  const [applied, setApplied] = useState({
    q: "",
    city: "",
    planningStage: "",
    dateFrom: "",
    dateTo: "",
    activity: "",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminUsers(accessToken, {
        q: applied.q || undefined,
        city: applied.city || undefined,
        planningStage: applied.planningStage || undefined,
        dateFrom: applied.dateFrom || undefined,
        dateTo: applied.dateTo || undefined,
        activity: applied.activity || undefined,
        page,
        limit: 25,
      });
      setData(res);
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
    setApplied({
      q: q.trim(),
      city: city.trim(),
      planningStage,
      dateFrom,
      dateTo,
      activity,
    });
  }

  function onReset() {
    setQ("");
    setCity("");
    setPlanningStage("");
    setDateFrom("");
    setDateTo("");
    setActivity("");
    setPage(1);
    setApplied({
      q: "",
      city: "",
      planningStage: "",
      dateFrom: "",
      dateTo: "",
      activity: "",
    });
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <>
      <h1 className="admin-page-title">Юзери</h1>
      <p className="admin-page-sub">
        {data ? `${data.total} за фільтром` : "Завантаження…"}
      </p>

      <form className="admin-filters" onSubmit={onSearch}>
        <input
          type="search"
          placeholder="Email / імʼя"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          type="search"
          placeholder="Місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <select
          value={planningStage}
          onChange={(e) => setPlanningStage(e.target.value)}
        >
          {PLANNING_STAGES.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="Дата весілля від"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title="Дата весілля до"
        />
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          {ACTIVITY_OPTIONS.map((s) => (
            <option key={s.value || "all-act"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="admin-btn" type="submit">
          Фільтр
        </button>
        <button className="admin-btn admin-btn--ghost" type="button" onClick={onReset}>
          Скинути
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
                <th>Юзер</th>
                <th>Реєстрація</th>
                <th>Останній логін</th>
                <th>Весілля</th>
                <th>Фічі</th>
                <th>Сесія</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link href={`/admin/users/${u.id}`}>{u.email}</Link>
                    <div className="admin-muted">{u.name}</div>
                    <div className="admin-flags">
                      {u.isPartnerOnly ? (
                        <span className="admin-badge">партнер</span>
                      ) : null}
                      {u.notesCount > 0 ? (
                        <span className="admin-badge is-on">
                          notes:{u.notesCount}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>{fmtDate(u.createdAt)}</td>
                  <td>{fmtDate(u.lastLoginAt)}</td>
                  <td>
                    {u.wedding ? (
                      <>
                        <div>
                          {u.wedding.city} ·{" "}
                          {new Date(u.wedding.date).toLocaleDateString("uk-UA")}
                        </div>
                        <div className="admin-muted">
                          {u.wedding.planningStage}
                        </div>
                      </>
                    ) : (
                      <span className="admin-muted">—</span>
                    )}
                  </td>
                  <td>
                    {u.wedding ? (
                      <div className="admin-flags">
                        <span className="admin-badge">
                          г:{u.wedding.guestsCount}
                        </span>
                        <span className="admin-badge">
                          б:{u.wedding.budgetItemsCount}
                        </span>
                        <span className="admin-badge">
                          т:{u.wedding.tasksCount}
                        </span>
                        {u.wedding.hasDayPlan ? (
                          <span className="admin-badge is-on">день</span>
                        ) : null}
                        {u.wedding.hasSeating ? (
                          <span className="admin-badge is-on">розс.</span>
                        ) : null}
                        {u.wedding.websitePublished ? (
                          <span className="admin-badge is-on">сайт</span>
                        ) : null}
                        {u.wedding.hasInvitation ? (
                          <span className="admin-badge is-on">запр.</span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="admin-muted">
                        vendors:{u.vendorsCount}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`admin-badge${u.hasActiveSession ? " is-on" : " is-off"}`}
                    >
                      {u.hasActiveSession ? "активна" : "ні"}
                    </span>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-muted">
                    Нікого не знайдено
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
