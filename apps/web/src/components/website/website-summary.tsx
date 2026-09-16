"use client";

import Image from "next/image";
import {
  IconExternalLink,
  IconLink,
  IconPencil,
} from "@/components/website/website-icons";

export type WebsiteSummaryVariant = "draft" | "unpublished" | "published";

type Props = {
  variant: WebsiteSummaryVariant;
  coverUrl: string;
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
  coverUrl,
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
  const unpublishedBadge = (
    <span className="ws-badge ws-badge--unpublished">Не опубліковано</span>
  );

  if (variant === "draft") {
    return (
      <aside className="ws-summary ws-summary--solo">
        <div className="ws-summary__stack">
          <div className="ws-summary__cover">
            <Image
              src={coverUrl}
              alt=""
              width={361}
              height={361}
              className="ws-summary__cover-img"
              unoptimized={coverUrl.startsWith("http")}
            />
          </div>
          <div className="ws-summary__card">
            <div className="ws-summary__head">
              <h2 className="ws-summary__names">{names}</h2>
              {unpublishedBadge}
            </div>
            {lastEditedLabel ? (
              <>
                <hr className="ws-summary__divider" />
                <p className="ws-summary__meta">
                  Останнє редагування: {lastEditedLabel}
                </p>
              </>
            ) : null}
            <div className="ws-summary__buttons">
              <button
                type="button"
                className="ws-btn ws-btn--solid ws-btn--block"
                onClick={onEdit}
              >
                Продовжити створювати сайт
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "unpublished") {
    return (
      <aside className="ws-summary ws-summary--solo">
        <div className="ws-summary__stack">
          <div className="ws-summary__cover">
            <Image
              src={coverUrl}
              alt=""
              width={361}
              height={361}
              className="ws-summary__cover-img"
              unoptimized={coverUrl.startsWith("http")}
            />
          </div>
          <div className="ws-summary__card">
            <div className="ws-summary__head">
              <h2 className="ws-summary__names">{names}</h2>
              {unpublishedBadge}
            </div>
            <p className="ws-summary__desc">{description}</p>
            <hr className="ws-summary__divider" />
            <p className="ws-summary__url">{displayUrl}</p>
            <div className="ws-summary__actions">
              <button
                type="button"
                className="ws-btn ws-btn--solid"
                disabled={busy}
                onClick={onPublish}
              >
                Опублікувати
              </button>
              <button
                type="button"
                className="ws-summary__link"
                onClick={onEdit}
              >
                <span className="ws-summary__link-icon">
                  <IconPencil />
                </span>
                Редагувати сайт
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="ws-summary">
      <div className="ws-summary__cover">
        <Image
          src={coverUrl}
          alt=""
          width={361}
          height={361}
          className="ws-summary__cover-img"
          unoptimized={coverUrl.startsWith("http")}
        />
      </div>

      <div className="ws-summary__card">
        <div className="ws-summary__head">
          <h2 className="ws-summary__names">{names}</h2>
          <span className="ws-badge">Опубліковано</span>
        </div>

        <p className="ws-summary__desc">{description}</p>
        <hr className="ws-summary__divider" />
        <p className="ws-summary__url">{displayUrl}</p>

        <div className="ws-summary__buttons">
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            className="ws-btn ws-btn--solid ws-btn--block"
          >
            <span className="ws-btn__icon">
              <IconExternalLink />
            </span>
            Перейти на сайт
          </a>
          <button
            type="button"
            className="ws-btn ws-btn--outline ws-btn--block"
            onClick={onCopyLink}
          >
            <span className="ws-btn__icon">
              <IconLink />
            </span>
            Скопіювати лінк
          </button>
        </div>
      </div>

      <div className="ws-summary__footer">
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
    </aside>
  );
}
