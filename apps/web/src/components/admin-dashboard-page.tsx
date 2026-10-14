"use client";

import { useEffect, useState } from "react";
import {
  type AdminStats,
  fetchAdminStats,
} from "@/lib/admin-api";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";
import "@/styles/admin/admin-dashboard.scss";

const FEATURE_LABELS: Record<keyof AdminStats["features"], string> = {
  guests: "Гості",
  budget: "Бюджет",
  tasks: "Чекліст",
  vendors: "Підрядники",
  dayPlan: "План дня",
  seating: "Розсадка",
  website: "Сайт створено",
  publishedWebsite: "Сайт опубліковано",
  invitation: "Запрошення",
};

const DROPOFF_LABELS: Array<{
  key: keyof AdminStats["dropoff"];
  label: string;
}> = [
  { key: "guestsNoBudget", label: "Є гості → нема бюджету" },
  { key: "budgetNoWebsite", label: "Є бюджет → нема сайту" },
  { key: "websiteNotPublished", label: "Сайт є → не published" },
  { key: "guestsNoDayPlan", label: "Є гості → нема плану дня" },
  { key: "dayPlanNoSeating", label: "Є план дня → нема розсадки" },
  { key: "guestsNoSeating", label: "Є гості → нема розсадки" },
  { key: "tasksNoBudget", label: "Є чекліст → нема бюджету" },
];

const FUNNEL_STEPS: Array<{
  key: "withWedding" | "withGuests" | "withBudget" | "withWebsite" | "withPublished";
  label: string;
}> = [
  { key: "withWedding", label: "Весілля" },
  { key: "withGuests", label: "Гості" },
  { key: "withBudget", label: "Бюджет" },
  { key: "withWebsite", label: "Сайт" },
  { key: "withPublished", label: "Published" },
];

export function AdminDashboardPage() {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    fetchAdminStats(accessToken)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Помилка завантаження");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (error) {
    return <p className="admin-error">{error}</p>;
  }

  if (!stats) {
    return <div className="admin-loader">Завантаження статистики…</div>;
  }

  const sc = stats.funnel.stepConversion;

  return (
    <>
      <h1 className="admin-page-title">Огляд</h1>
      <p className="admin-page-sub">
        Оновлено {new Date(stats.generatedAt).toLocaleString("uk-UA")}
      </p>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Юзерів усього</p>
          <p className="admin-stat-card__value">{stats.users.total}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">За 7 днів</p>
          <p className="admin-stat-card__value">{stats.users.last7d}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">За 30 днів</p>
          <p className="admin-stat-card__value">{stats.users.last30d}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__label">Порожні акаунти</p>
          <p className="admin-stat-card__value">{stats.users.emptyAccounts}</p>
        </div>
      </div>

      <section className="admin-section">
        <h2>Активні vs мертві</h2>
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Активні (логін ≤14д)</p>
            <p className="admin-stat-card__value">{stats.users.active14d}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Неактивні 14д+</p>
            <p className="admin-stat-card__value">{stats.users.inactive14d}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Ніколи не логінились</p>
            <p className="admin-stat-card__value">{stats.users.neverLoggedIn}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Порожні (без wedding)</p>
            <p className="admin-stat-card__value">{stats.users.emptyAccounts}</p>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Funnel активації</h2>
        <p className="admin-page-sub" style={{ marginTop: -8 }}>
          База: {stats.funnel.registered} реєстрацій · конверсія кроків:
          весілля→гості {sc.weddingToGuests}% · гості→бюджет {sc.guestsToBudget}% ·
          бюджет→сайт {sc.budgetToWebsite}% · сайт→publish {sc.websiteToPublished}%
        </p>
        <div className="admin-funnel">
          {FUNNEL_STEPS.map((step) => {
            const count = stats.funnel[step.key];
            const ofReg = stats.funnel.ofRegistered[step.key] ?? 0;
            const width = Math.max(8, ofReg);
            return (
              <div key={step.key} className="admin-funnel__row">
                <div className="admin-funnel__meta">
                  <span>{step.label}</span>
                  <strong>
                    {count} · {ofReg}%
                  </strong>
                </div>
                <div className="admin-funnel__track">
                  <div
                    className="admin-funnel__bar"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="admin-section">
        <h2>Drop-off (де кидають)</h2>
        <div className="admin-feature-grid">
          {DROPOFF_LABELS.map((item) => (
            <div key={item.key} className="admin-feature-chip">
              <span>{item.label}</span>
              <strong>{stats.dropoff[item.key]}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Весілля</h2>
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Усього</p>
            <p className="admin-stat-card__value">{stats.weddings.total}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">З партнером</p>
            <p className="admin-stat-card__value">{stats.weddings.withPartner}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">RSVP відповідей</p>
            <p className="admin-stat-card__value">
              {stats.engagement.rsvpResponded}
            </p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Push-пристрої</p>
            <p className="admin-stat-card__value">
              {stats.engagement.pushDevices}
            </p>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Використання фіч</h2>
        <div className="admin-feature-grid">
          {(Object.keys(FEATURE_LABELS) as Array<keyof AdminStats["features"]>).map(
            (key) => (
              <div key={key} className="admin-feature-chip">
                <span>{FEATURE_LABELS[key]}</span>
                <strong>{stats.features[key]}</strong>
              </div>
            ),
          )}
        </div>
      </section>
    </>
  );
}
