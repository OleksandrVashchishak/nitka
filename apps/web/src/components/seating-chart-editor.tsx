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

function ViewChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M5 3.5 9 7l-4 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
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
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
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

  const activeDesign = SEATING_CHART_DESIGNS.find((d) => d.id === designId);

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
  }, [mobilePreviewOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (mobilePreviewOpen) {
          setMobilePreviewOpen(false);
          return;
        }
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, mobilePreviewOpen]);

  function savePdf() {
    if (designId !== "modern") {
      toast.info("Цей дизайн ще в роботі — обери «Вишуканий»");
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

  function renderSheet(id: SeatingChartDesignId) {
    if (id === "modern") {
      return <SeatingChartModern data={data} />;
    }
    return (
      <div className="seat-chart-sheet seat-chart-sheet--placeholder">
        <p>
          Дизайн «
          {SEATING_CHART_DESIGNS.find((d) => d.id === id)?.name}» скоро
          з’явиться
        </p>
      </div>
    );
  }

  return (
    <div
      className={`seat-chart-editor${
        mobilePreviewOpen ? " is-mobile-preview" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="seat-chart-editor-title"
    >
      <header className="seat-chart-editor__header">
        <div className="seat-chart-editor__left">
          <button
            type="button"
            className="seat-chart-editor__back"
            aria-label={mobilePreviewOpen ? "Назад до дизайнів" : "Назад"}
            onClick={() => {
              if (mobilePreviewOpen) {
                setMobilePreviewOpen(false);
                return;
              }
              onClose();
            }}
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
          className="seat-chart-editor__pdf seat-chart-editor__pdf--header"
          onClick={savePdf}
        >
          Зберегти PDF
        </button>
      </header>

      <div className="seat-chart-editor__body">
        <aside
          className="seat-chart-editor__aside"
          aria-labelledby="seat-chart-editor-title"
        >
          <h1 id="seat-chart-editor-title" className="seat-chart-editor__title">
            Оберіть дизайн
          </h1>
          <p className="seat-chart-editor__lead">
            Оберіть вигляд вашої посадкової карти.
          </p>
          <div className="seat-chart-editor__list" role="list">
            {SEATING_CHART_DESIGNS.map((option) => {
              const active = option.id === designId;
              const soon = "soon" in option && option.soon;
              return (
                <div
                  key={option.id}
                  role="listitem"
                  className={`seat-chart-editor__card${
                    active ? " is-active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="seat-chart-editor__card-main"
                    aria-pressed={active}
                    onClick={() => {
                      setDesignId(option.id);
                      if (soon) {
                        toast.info("Цей дизайн з’явиться скоро");
                      }
                    }}
                  >
                    <div className="seat-chart-editor__thumb" aria-hidden>
                      <div className="seat-chart-editor__thumb-scale">
                        {renderSheet(option.id)}
                      </div>
                    </div>
                    <div className="seat-chart-editor__card-meta">
                      <div className="seat-chart-editor__card-head">
                        <p className="seat-chart-editor__card-name">
                          {option.name}
                        </p>
                        {active ? (
                          <span className="seat-chart-editor__badge">
                            Обраний
                          </span>
                        ) : soon ? (
                          <span className="seat-chart-editor__badge seat-chart-editor__badge--soon">
                            Скоро
                          </span>
                        ) : null}
                      </div>
                      <p className="seat-chart-editor__card-desc">
                        {option.description}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="seat-chart-editor__view"
                    onClick={() => {
                      setDesignId(option.id);
                      setMobilePreviewOpen(true);
                    }}
                  >
                    Подивитись
                    <ViewChevronIcon />
                  </button>
                </div>
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
              {renderSheet(designId)}
            </div>
          </div>
          {mobilePreviewOpen && activeDesign ? (
            <p className="seat-chart-editor__preview-caption">
              {activeDesign.name}
            </p>
          ) : null}
        </div>
      </div>

      <div className="seat-chart-editor__footer">
        <button
          type="button"
          className="seat-chart-editor__pdf seat-chart-editor__pdf--footer"
          onClick={savePdf}
        >
          Зберегти PDF
        </button>
      </div>
    </div>
  );
}
