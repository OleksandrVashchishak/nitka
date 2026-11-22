"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand-logo";
import {
  NAME_CARD_DEMO_DATE,
  NAME_CARD_DEMO_NAMES,
  NAME_CARD_DESIGNS,
  NAME_CARDS_PER_PAGE,
  chunkNames,
  extraPagesLabel,
  formatNameCardDate,
  isNameCardDesignReady,
  type NameCardDesignId,
} from "@/lib/name-cards";
import { toast } from "@/lib/toast";
import "@/styles/seating/name-cards.scss";

type Props = {
  names: string[];
  weddingDate?: string | null;
  onClose: () => void;
};

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M14 9H4m0 0 4.5-4.5M4 9l4.5 4.5"
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
        stroke="#ABABAB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Front face of one tent card (bottom half). */
function NameCardFace({
  name,
  designId,
  date,
  prefix,
}: {
  name: string;
  designId: NameCardDesignId;
  date: string;
  /** Class prefix, e.g. `name-cards-sheet__` → `name-cards-sheet__name`. */
  prefix: string;
}) {
  if (designId === "minimal") {
    return (
      <span className={`${prefix}face`}>
        <span className={`${prefix}greet`}>вітаємо</span>
        <span className={`${prefix}name`}>{name.toUpperCase()}</span>
        {date ? <span className={`${prefix}date`}>{date}</span> : null}
      </span>
    );
  }
  return <span className={`${prefix}name`}>{name.toUpperCase()}</span>;
}

function NameCardSheet({
  names,
  designId,
  date,
  forPrint = false,
}: {
  names: string[];
  designId: NameCardDesignId;
  date: string;
  forPrint?: boolean;
}) {
  const cells = Array.from(
    { length: NAME_CARDS_PER_PAGE },
    (_, i) => names[i] ?? "",
  );

  return (
    <div
      className={`name-cards-sheet name-cards-sheet--${designId}${
        forPrint ? " name-cards-sheet--print" : ""
      }`}
    >
      {cells.map((name, i) => (
        <div key={i} className="name-cards-sheet__cell">
          {designId === "minimal" ? (
            <span className="name-cards-sheet__fold" aria-hidden />
          ) : null}
          {name ? (
            <NameCardFace
              name={name}
              designId={designId}
              date={date}
              prefix="name-cards-sheet__"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function NameCardThumb({
  name,
  designId,
  date,
}: {
  name: string;
  designId: NameCardDesignId;
  date: string;
}) {
  if (!isNameCardDesignReady(designId)) {
    return (
      <div className="name-cards-editor__thumb-placeholder">
        Дизайн «
        {NAME_CARD_DESIGNS.find((d) => d.id === designId)?.name}» скоро
      </div>
    );
  }

  return (
    <div
      className={`name-cards-editor__thumb-card name-cards-editor__thumb-card--${designId}`}
    >
      <span className="name-cards-editor__thumb-rule" aria-hidden />
      <NameCardFace
        name={name || "Марія Левченко"}
        designId={designId}
        date={date}
        prefix="name-cards-editor__thumb-"
      />
    </div>
  );
}

export function NameCardsDesign({ names, weddingDate, onClose }: Props) {
  const [designId, setDesignId] = useState<NameCardDesignId>("simple");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasRealGuests = names.length > 0;

  const previewNames = useMemo(
    () => (hasRealGuests ? names : NAME_CARD_DEMO_NAMES),
    [hasRealGuests, names],
  );

  const pages = useMemo(() => chunkNames(previewNames), [previewNames]);
  const firstPage = pages[0] ?? [];
  const extraLabel = extraPagesLabel(Math.max(0, pages.length - 1));
  const activeDesign = NAME_CARD_DESIGNS.find((d) => d.id === designId);
  const isReady = isNameCardDesignReady(designId);
  const cardDate =
    formatNameCardDate(weddingDate) || (hasRealGuests ? "" : NAME_CARD_DEMO_DATE);
  const thumbName = previewNames[0] ?? "Марія Левченко";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
    if (!isReady) {
      toast.info("Цей дизайн ще в роботі — оберіть інший");
      return;
    }
    if (!hasRealGuests) {
      toast.info("Додайте гостей, щоб зберегти PDF");
      return;
    }
    document.body.classList.add("is-name-cards-print");
    const cleanup = () => {
      document.body.classList.remove("is-name-cards-print");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.setTimeout(() => window.print(), 50);
  }

  return (
    <div
      className={`name-cards-editor${
        mobilePreviewOpen ? " is-mobile-preview" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-cards-editor-title"
    >
      <header className="name-cards-editor__header">
        <div className="name-cards-editor__left">
          <button
            type="button"
            className="name-cards-editor__back"
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
            className="name-cards-editor__brand"
            width={115}
            height={24}
          />
        </div>
        <button
          type="button"
          className="name-cards-editor__pdf name-cards-editor__pdf--header"
          onClick={savePdf}
        >
          Зберегти PDF
        </button>
      </header>

      <div className="name-cards-editor__body">
        <aside
          className="name-cards-editor__aside"
          aria-labelledby="name-cards-editor-title"
        >
          <h1 id="name-cards-editor-title" className="name-cards-editor__title">
            Оберіть дизайн
          </h1>
          <p className="name-cards-editor__lead">
            Оберіть вигляд вашої посадкової карти.
          </p>
          <div className="name-cards-editor__list" role="list">
            {NAME_CARD_DESIGNS.map((option) => {
              const active = option.id === designId;
              const soon = "soon" in option && option.soon;
              return (
                <div
                  key={option.id}
                  role="listitem"
                  className={`name-cards-editor__card${
                    active ? " is-active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="name-cards-editor__card-main"
                    aria-pressed={active}
                    onClick={() => {
                      setDesignId(option.id);
                      if (soon) {
                        toast.info("Цей дизайн з’явиться скоро");
                      }
                    }}
                  >
                    <div className="name-cards-editor__thumb" aria-hidden>
                      <NameCardThumb
                        name={thumbName}
                        designId={option.id}
                        date={cardDate}
                      />
                    </div>
                    <div className="name-cards-editor__card-meta">
                      <div className="name-cards-editor__card-head">
                        <p className="name-cards-editor__card-name">
                          {option.name}
                        </p>
                        {active ? (
                          <span className="name-cards-editor__badge">
                            Обраний
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="name-cards-editor__view"
                    onClick={() => {
                      setDesignId(option.id);
                      setMobilePreviewOpen(true);
                    }}
                  >
                    <span>Подивитись</span>
                    <ViewChevronIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="name-cards-editor__preview">
          <p className="name-cards-editor__format">Формат для друку - A4</p>
          <div className="name-cards-editor__stage">
            {isReady ? (
              <NameCardSheet
                names={firstPage}
                designId={designId}
                date={cardDate}
              />
            ) : (
              <div className="name-cards-sheet name-cards-sheet--placeholder">
                <p>Дизайн «{activeDesign?.name}» скоро з’явиться</p>
              </div>
            )}
          </div>
          {isReady && extraLabel ? (
            <p className="name-cards-editor__more">{extraLabel}</p>
          ) : null}
        </div>
      </div>

      <div className="name-cards-editor__footer">
        <button
          type="button"
          className="name-cards-editor__pdf name-cards-editor__pdf--footer"
          onClick={savePdf}
        >
          Зберегти PDF
        </button>
      </div>

      {mounted
        ? createPortal(
            <div className="name-cards-print" aria-hidden>
              {hasRealGuests && isReady
                ? pages.map((pageNames, pageIndex) => (
                    <NameCardSheet
                      key={pageIndex}
                      names={pageNames}
                      designId={designId}
                      date={cardDate}
                      forPrint
                    />
                  ))
                : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
