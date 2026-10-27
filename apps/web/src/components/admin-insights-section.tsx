"use client";

import { useEffect, useState } from "react";
import {
  type AdminCohorts,
  type AdminTimeseries,
  fetchAdminCohorts,
  fetchAdminTimeseries,
} from "@/lib/admin-api";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin-insights.scss";

type Granularity = "day" | "week";

const CHART_W = 720;
const CHART_H = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 32 };

function fmtBucket(date: string, granularity: Granularity) {
  const d = new Date(`${date}T00:00:00`);
  const label = d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
  return granularity === "week" ? `тиж. ${label}` : label;
}

function DynamicsChart({ data }: { data: AdminTimeseries }) {
  const { points, granularity } = data;
  const max = Math.max(1, ...points.flatMap((p) => [p.registrations, p.active]));
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const slot = innerW / points.length;
  const barW = Math.max(2, slot * 0.55);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const xCenter = (i: number) => PAD.left + slot * i + slot / 2;

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xCenter(i)},${y(p.active)}`)
    .join(" ");
  const ticks = [0, Math.round(max / 2), max];
  const labelIdx = Array.from(
    new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]),
  );

  return (
    <svg
      className="admin-chart__svg"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      role="img"
      aria-label="Реєстрації та активні юзери"
    >
      {ticks.map((t) => (
        <g key={t}>
          <line
            className="admin-chart__grid"
            x1={PAD.left}
            x2={CHART_W - PAD.right}
            y1={y(t)}
            y2={y(t)}
          />
          <text className="admin-chart__tick" x={PAD.left - 6} y={y(t) + 4} textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      {points.map((p, i) => (
        <rect
          key={p.date}
          className="admin-chart__bar"
          x={xCenter(i) - barW / 2}
          y={y(p.registrations)}
          width={barW}
          height={PAD.top + innerH - y(p.registrations)}
        >
          <title>{`${fmtBucket(p.date, granularity)}: ${p.registrations} реєстрацій, ${p.active} активних`}</title>
        </rect>
      ))}
      <path className="admin-chart__line" d={line} />
      {points.map((p, i) => (
        <circle
          key={p.date}
          className="admin-chart__dot"
          cx={xCenter(i)}
          cy={y(p.active)}
          r={points.length > 40 ? 1.5 : 3}
        />
      ))}
      {labelIdx.map((i) => (
        <text
          key={i}
          className="admin-chart__tick"
          x={xCenter(i)}
          y={CHART_H - 8}
          textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
        >
          {fmtBucket(points[i].date, granularity)}
        </text>
      ))}
    </svg>
  );
}

function CohortsTable({ data }: { data: AdminCohorts }) {
  if (data.cohorts.length === 0) {
    return <p className="admin-muted">Поки немає когорт за цей період.</p>;
  }
  return (
    <div className="admin-cohorts">
      <table className="admin-cohorts__table">
        <thead>
          <tr>
            <th>Тиждень реєстрації</th>
            <th>Юзерів</th>
            {Array.from({ length: data.weeks }, (_, w) => (
              <th key={w}>{w === 0 ? "Тиж. 0" : `+${w}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.cohorts.map((row) => (
            <tr key={row.cohort}>
              <th>{fmtBucket(row.cohort, "day")}</th>
              <td>{row.size}</td>
              {row.retained.map((count, w) => {
                if (count === null) return <td key={w} className="is-empty" />;
                const pct = row.size ? Math.round((count / row.size) * 100) : 0;
                return (
                  <td
                    key={w}
                    className={`admin-cohorts__cell${pct >= 50 ? " is-strong" : ""}`}
                    style={{ ["--cohort-alpha" as string]: pct / 100 }}
                    title={`${count} з ${row.size}`}
                  >
                    {pct}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminInsightsSection() {
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [series, setSeries] = useState<AdminTimeseries | null>(null);
  const [cohorts, setCohorts] = useState<AdminCohorts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    fetchAdminTimeseries(accessToken, granularity)
      .then((res) => {
        if (!cancelled) setSeries(res);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Помилка завантаження");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, granularity]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    fetchAdminCohorts(accessToken)
      .then((res) => {
        if (!cancelled) setCohorts(res);
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

  return (
    <>
      <section className="admin-section">
        <div className="admin-section__head">
          <h2>Динаміка</h2>
          <div className="admin-segmented" role="group" aria-label="Період">
            {(["day", "week"] as const).map((g) => (
              <button
                key={g}
                type="button"
                className={`admin-segmented__btn${granularity === g ? " is-active" : ""}`}
                onClick={() => setGranularity(g)}
              >
                {g === "day" ? "30 днів" : "12 тижнів"}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-chart">
          {series ? (
            <DynamicsChart data={series} />
          ) : (
            <div className="admin-loader">Завантаження…</div>
          )}
          <div className="admin-chart__legend">
            <span className="admin-chart__legend-item admin-chart__legend-item--bar">
              Реєстрації
            </span>
            <span className="admin-chart__legend-item admin-chart__legend-item--line">
              Активні юзери
            </span>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Утримання по когортах</h2>
        <p className="admin-page-sub" style={{ marginTop: -8 }}>
          Частка юзерів, що заходили в тиждень +N після реєстрації. Історія активності
          накопичується з моменту запуску трекінгу, тому старі когорти неповні.
        </p>
        {cohorts ? (
          <CohortsTable data={cohorts} />
        ) : (
          <div className="admin-loader">Завантаження…</div>
        )}
      </section>
    </>
  );
}
