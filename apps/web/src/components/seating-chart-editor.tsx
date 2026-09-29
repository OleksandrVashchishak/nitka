"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SeatingChartModern } from "@/components/seating-chart-modern";
import {
  buildSeatingChartData,
  SEATING_CHART_DESIGNS,
  type SeatingChartDesignId,
  type SeatingChartGuest,
  type SeatingChartTable,
} from "@/lib/seating-chart";
import { toast } from "@/lib/toast";
import "@/styles/seating/chart.scss";

type Props = {
  tables: SeatingChartTable[];
  guests: SeatingChartGuest[];
  partnerOneName: string;
  partnerTwoName: string;
  weddingDate: string | null | undefined;
  onClose: () => void;
};

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M11.5 4.5 7 9l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SeatingChartEditor({
  tables,
  guests,
  partnerOneName,
  partnerTwoName,
  weddingDate,
  onClose,
}: Props) {
  const [designId, setDesignId] =
    useState<SeatingChartDesignId>("modern");
  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const guestsByKey = useMemo(() => {
    const m = new Map<string, SeatingChartGuest>();
    for (const g of guests) m.set(g.key, g);
    return m;
  }, [guests]);

  const data = useMemo(
    () =>
      buildSeatingChartData({
        tables,
        guestsByKey,
        partnerOneName,
        partnerTwoName,
        weddingDate,
      }),
    [tables, guestsByKey, partnerOneName, partnerTwoName, weddingDate],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function fit() {
      const wrap = scaleWrapRef.current;
      if (!wrap) return;
      const pad = 48;
      const availW = Math.max(wrap.clientWidth - pad, 200);
      const availH = Math.max(wrap.clientHeight - pad, 200);
      const next = Math.min(availW / 990, availH / 728, 1);
      setScale(next);
    }
    fit();
    const ro = new ResizeObserver(fit);
    if (scaleWrapRef.current) ro.observe(scaleWrapRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function savePdf() {
    if (designId !== "modern") {
      toast.info("Цей дизайн ще в роботі — обери «Сучасний»");
      return;
    }
    const seated =
      data.presidium.length +
      data.kids.length +
      data.tables.reduce((n, t) => n + t.names.length, 0);
    if (seated === 0) {
      toast.info("Спочатку розсади гостей на плані");
      return;
    }
    document.body.classList.add("is-seat-chart-print");
    const cleanup = () => {
      document.body.classList.remove("is-seat-chart-print");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <div
      className="seat-chart-editor"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seat-chart-editor-title"
    >
      <header className="seat-chart-editor__header">
        <div className="seat-chart-editor__left">
          <button
            type="button"
            className="seat-chart-editor__back"
            aria-label="Назад"
            onClick={onClose}
          >
            <BackIcon />
          </button>
          <BrandLogo
            href="/dashboard"
            className="seat-chart-editor__brand"
            width={115}
            height={24}
          />
        </div>
        <button
          type="button"
          className="seat-chart-editor__pdf"
          onClick={savePdf}
        >
          Зберегти PDF
        </button>
      </header>

      <div className="seat-chart-editor__body">
        <aside className="seat-chart-editor__aside" aria-labelledby="seat-chart-editor-title">
          <h1 id="seat-chart-editor-title" className="seat-chart-editor__title">
            Оберіть дизайн
          </h1>
          <div className="seat-chart-editor__list" role="list">
            {SEATING_CHART_DESIGNS.map((option) => {
              const active = option.id === designId;
              const soon = "soon" in option && option.soon;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="listitem"
                  className={`seat-chart-editor__card${
                    active ? " is-active" : ""
                  }`}
                  aria-pressed={active}
                  onClick={() => {
                    setDesignId(option.id);
                    if (soon) {
                      toast.info("Цей дизайн з’явиться скоро");
                    }
                  }}
                >
                  <div className="seat-chart-editor__card-head">
                    <p className="seat-chart-editor__card-name">{option.name}</p>
                    {active ? (
                      <span className="seat-chart-editor__badge">Обраний</span>
                    ) : soon ? (
                      <span className="seat-chart-editor__badge seat-chart-editor__badge--soon">
                        Скоро
                      </span>
                    ) : null}
                  </div>
                  <p className="seat-chart-editor__card-desc">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="seat-chart-editor__preview" ref={scaleWrapRef}>
          <div
            className="seat-chart-editor__stage"
            style={{
              width: 990 * scale,
              height: 728 * scale,
            }}
          >
            <div
              className="seat-chart-editor__sheet-scale"
              style={{
                transform: `scale(${scale})`,
              }}
            >
              {designId === "modern" ? (
                <SeatingChartModern data={data} />
              ) : (
                <div className="seat-chart-sheet seat-chart-sheet--placeholder">
                  <p>Дизайн «{SEATING_CHART_DESIGNS.find((d) => d.id === designId)?.name}» скоро з’явиться</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
