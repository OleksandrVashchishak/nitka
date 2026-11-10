"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { renderWebsiteTemplate } from "@/components/website-templates";
import { PreviewIframe } from "@/components/website/editor/preview-iframe";
import {
  IconExternalLink,
  IconLink,
  IconPencil,
} from "@/components/website/website-icons";
import type { WebsiteContent } from "@/lib/website-api";

const PREVIEW_SITE_WIDTH = 1440;

export type WebsiteSummaryVariant = "draft" | "unpublished" | "published";

type Props = {
  variant: WebsiteSummaryVariant;
  templateId: string;
  content: WebsiteContent;
  weddingDate?: string | null;
  names: string;
  description: string;
  displayUrl: string;
  publicHref: string;
  lastEditedLabel?: string;
  busy: boolean;
  onCopyLink: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onEdit: () => void;
};

export function WebsiteSummary({
  variant,
  templateId,
  content,
  weddingDate,
  names,
  description,
  displayUrl,
  publicHref,
  lastEditedLabel,
  busy,
  onCopyLink,
  onPublish,
  onUnpublish,
  onEdit,
}: Props) {
  const coverRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = coverRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / PREVIEW_SITE_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const published = variant === "published";
  const draft = variant === "draft";

  return (
    <aside className="ws-summary">
      <div
        ref={coverRef}
        className="ws-summary__cover"
        style={{ "--ws-prev-scale": scale } as CSSProperties}
        aria-hidden
      >
        <PreviewIframe className="ws-summary__cover-frame" scrollable={false}>
          <div className="ws-summary__site">
            {renderWebsiteTemplate(templateId, content, { weddingDate })}
          </div>
        </PreviewIframe>
      </div>

      <div className="ws-summary__card">
        <div className="ws-summary__head">
          <h2 className="ws-summary__names">{names}</h2>
          {published ? (
            <span className="ws-badge">Опубліковано</span>
          ) : (
            <span className="ws-badge ws-badge--unpublished">
              Не опубліковано
            </span>
          )}
        </div>

        {draft ? (
          lastEditedLabel ? (
            <p className="ws-summary__meta">
              Останнє редагування: {lastEditedLabel}
            </p>
          ) : null
        ) : (
          <p className="ws-summary__desc">{description}</p>
        )}
        <hr
          className={`ws-summary__divider${draft ? " ws-summary__desktop" : ""}`}
        />
        {draft ? null : <p className="ws-summary__url">{displayUrl}</p>}

        {draft ? (
          <button
            type="button"
            className="ws-btn ws-btn--solid ws-btn--block ws-summary__desktop"
            onClick={onEdit}
          >
            Продовжити створювати сайт
          </button>
        ) : null}

        {variant === "unpublished" ? (
          <div className="ws-summary__actions ws-summary__desktop">
            <button
              type="button"
              className="ws-btn ws-btn--solid"
              disabled={busy}
              onClick={onPublish}
            >
              Опублікувати
            </button>
            <button type="button" className="ws-summary__link" onClick={onEdit}>
              <span className="ws-summary__link-icon">
                <IconPencil />
              </span>
              Редагувати сайт
            </button>
          </div>
        ) : null}

        {published ? (
          <div className="ws-summary__buttons">
            <a
              href={publicHref}
              target="_blank"
              rel="noreferrer"
              className="ws-btn ws-btn--solid ws-summary__desktop"
            >
              <span className="ws-btn__icon">
                <IconExternalLink />
              </span>
              Перейти на сайт
            </a>
            <button
              type="button"
              className="ws-btn ws-btn--outline"
              onClick={onCopyLink}
            >
              <span className="ws-btn__icon">
                <IconLink />
              </span>
              Скопіювати лінк
            </button>
            <button
              type="button"
              className="ws-summary__cancel"
              disabled={busy}
              onClick={onUnpublish}
            >
              Скасувати публікацію
            </button>
          </div>
        ) : null}
      </div>

      {published ? (
        <div className="ws-summary__footer ws-summary__desktop">
          <button type="button" className="ws-summary__link" onClick={onEdit}>
            <span className="ws-summary__link-icon">
              <IconPencil />
            </span>
            Редагувати сайт
          </button>
          <button
            type="button"
            className="ws-summary__link ws-summary__link--muted"
            disabled={busy}
            onClick={onUnpublish}
          >
            Скасувати публікацію
          </button>
        </div>
      ) : null}

      <div className="ws-summary__bar">
        {draft ? (
          <button
            type="button"
            className="ws-btn ws-btn--bar ws-btn--bar-solid"
            onClick={onEdit}
          >
            Продовжити створювати сайт
          </button>
        ) : (
          <>
            <button
              type="button"
              className="ws-btn ws-btn--bar ws-btn--bar-outline"
              onClick={onEdit}
            >
              Редагувати сайт
            </button>
            {published ? (
              <a
                href={publicHref}
                target="_blank"
                rel="noreferrer"
                className="ws-btn ws-btn--bar ws-btn--bar-solid"
              >
                Перейти на сайт
              </a>
            ) : (
              <button
                type="button"
                className="ws-btn ws-btn--bar ws-btn--bar-solid"
                disabled={busy}
                onClick={onPublish}
              >
                Опублікувати
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
