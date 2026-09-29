"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import {
  NAME_CARD_DEMO_NAMES,
  NAME_CARD_DESIGNS,
  NAME_CARDS_PER_PAGE,
  chunkNames,
  extraPagesLabel,
  type NameCardDesignId,
} from "@/lib/name-cards";
import { toast } from "@/lib/toast";
import "@/styles/seating/name-cards.scss";

type Props = {
  names: string[];
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

function NameCardSheet({
  names,
  designId,
  forPrint = false,
}: {
  names: string[];
  designId: NameCardDesignId;
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
          {name ? (
            <span className="name-cards-sheet__name">{name.toUpperCase()}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function NameCardsDesign({ names, onClose }: Props) {
  const [designId, setDesignId] = useState<NameCardDesignId>("simple");
  const hasRealGuests = names.length > 0;

  const previewNames = useMemo(
    () => (hasRealGuests ? names : NAME_CARD_DEMO_NAMES),
    [hasRealGuests, names],
  );

  const pages = useMemo(() => chunkNames(previewNames), [previewNames]);
  const firstPage = pages[0] ?? [];
  const extraLabel = extraPagesLabel(Math.max(0, pages.length - 1));
  const activeDesign = NAME_CARD_DESIGNS.find((d) => d.id === designId);
  const isSimple = designId === "simple";

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
    if (!isSimple) {
      toast.info("Цей дизайн ще в роботі — обери «Простий»");
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
      className="name-cards-editor"
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-cards-editor-title"
    >
      <header className="name-cards-editor__header">
        <div className="name-cards-editor__left">
          <button
            type="button"
            className="name-cards-editor__back"
            aria-label="Назад"
            onClick={onClose}
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
          className="name-cards-editor__pdf"
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
            Оберіть вигляд вашої іменної картки.
          </p>
          <div className="name-cards-editor__list" role="list">
            {NAME_CARD_DESIGNS.map((option) => {
              const active = option.id === designId;
              const soon = "soon" in option && option.soon;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="listitem"
                  className={`name-cards-editor__card${
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
                  <div className="name-cards-editor__card-head">
                    <p className="name-cards-editor__card-name">
                      {option.name}
                    </p>
                    {active ? (
                      <span className="name-cards-editor__badge">Обраний</span>
                    ) : soon ? (
                      <span className="name-cards-editor__badge name-cards-editor__badge--soon">
                        Скоро
                      </span>
                    ) : null}
                  </div>
                  <p className="name-cards-editor__card-desc">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="name-cards-editor__preview">
          <p className="name-cards-editor__format">Формат для друку - A4</p>
          <div className="name-cards-editor__stage">
            {isSimple ? (
              <NameCardSheet names={firstPage} designId={designId} />
            ) : (
              <div className="name-cards-sheet name-cards-sheet--placeholder">
                <p>
                  Дизайн «{activeDesign?.name}» скоро з’явиться
                </p>
              </div>
            )}
          </div>
          {isSimple && extraLabel ? (
            <p className="name-cards-editor__more">{extraLabel}</p>
          ) : null}
        </div>
      </div>

      <div className="name-cards-print" aria-hidden>
        {hasRealGuests && isSimple
          ? pages.map((pageNames, pageIndex) => (
              <NameCardSheet
                key={pageIndex}
                names={pageNames}
                designId={designId}
                forPrint
              />
            ))
          : null}
      </div>
    </div>
  );
}
