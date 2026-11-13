"use client";

type Props = {
  mode?: "wizard" | "publish";
  canGoBack?: boolean;
  nextLabel?: string;
  publishLabel?: string;
  publishDisabled?: boolean;
  onPreview: () => void;
  onBack?: () => void;
  onNext?: () => void;
  onPublish?: () => void;
};

export function WebsiteEditorFooter({
  mode = "wizard",
  canGoBack = true,
  nextLabel = "Далі",
  publishLabel = "Опублікувати",
  publishDisabled,
  onPreview,
  onBack,
  onNext,
  onPublish,
}: Props) {
  return (
    <footer className="we-footer">
      <button type="button" className="we-footer__preview" onClick={onPreview}>
        Перегляд сайту
        <svg
          className="we-footer__preview-chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 3.5 10.5 8 6 12.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {mode === "publish" ? (
        <button
          type="button"
          className="we-footer__btn we-footer__btn--publish"
          disabled={publishDisabled}
          onClick={onPublish}
        >
          {publishLabel}
        </button>
      ) : (
        <div className="we-footer__actions">
          <button
            type="button"
            className="we-footer__btn we-footer__btn--ghost"
            disabled={!canGoBack}
            onClick={onBack}
          >
            Назад
          </button>
          <button
            type="button"
            className="we-footer__btn we-footer__btn--solid"
            onClick={onNext}
          >
            {nextLabel}
          </button>
        </div>
      )}
    </footer>
  );
}
