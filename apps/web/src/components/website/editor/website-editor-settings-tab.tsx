"use client";

import Link from "next/link";
import { IconCopy } from "@/components/website/editor/website-editor-icons";
import {
  IconExternalLink,
  IconLink,
  IconPencil,
} from "@/components/website/website-icons";

type Props = {
  slug: string;
  publicHref: string;
  shareDescription: string;
  published: boolean;
  publishing: boolean;
  unpublishing: boolean;
  onSlugChange: (slug: string) => void;
  onDescriptionChange: (value: string) => void;
  onCopyAddress: () => void;
  onCopyLink: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onEditSite: () => void;
};

const DOMAIN_SUFFIX = ".fata.studio";

function slugFromAddress(value: string) {
  const trimmed = value.trim().toLowerCase();
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
  const withoutSuffix = withoutProtocol.endsWith(DOMAIN_SUFFIX)
    ? withoutProtocol.slice(0, -DOMAIN_SUFFIX.length)
    : withoutProtocol.replace(/\/.*$/, "").split(".")[0] ?? withoutProtocol;
  return withoutSuffix
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function WebsiteEditorSettingsTab({
  slug,
  publicHref,
  shareDescription,
  published,
  publishing,
  unpublishing,
  onSlugChange,
  onDescriptionChange,
  onCopyAddress,
  onCopyLink,
  onPublish,
  onUnpublish,
  onEditSite,
}: Props) {
  const addressValue = `${slug || "your-wedding"}${DOMAIN_SUFFIX}`;

  return (
    <section className="we-settings" aria-labelledby="we-settings-title">
      <div className="we-settings__head">
        <h1 id="we-settings-title" className="we-settings__title">
          Внесіть налаштування
        </h1>
        <p className="we-settings__text">
          Обери домен та внеси фінальні деталі
        </p>
      </div>

      <div className="we-settings__body">
        <label className="we-settings__field">
          <span className="we-settings__label">Адреса твого веб-сайту</span>
          <div className="we-settings__address">
            <input
              className="we-settings__address-input"
              value={addressValue}
              onChange={(e) => onSlugChange(slugFromAddress(e.target.value))}
              spellCheck={false}
            />
            <button
              type="button"
              className="we-settings__copy"
              aria-label="Скопіювати адресу"
              onClick={onCopyAddress}
            >
              <IconCopy />
            </button>
          </div>
        </label>

        <label className="we-settings__field">
          <span className="we-settings__label">Опис вебсайту</span>
          <textarea
            className="we-settings__textarea"
            value={shareDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Запрошуємо на наше весілля 25.07.27"
          />
          <span className="we-settings__hint">
            Цей опис буде видно, коли ви будете надсилати лінк на ваш сайт
          </span>
        </label>

        {!published ? (
          <button
            type="button"
            className="we-settings__publish"
            disabled={publishing || slug.trim().length < 2}
            onClick={onPublish}
          >
            {publishing ? "Публікуємо…" : "Опублікувати"}
          </button>
        ) : (
          <>
            <div className="we-settings__live">
              <div className="we-settings__live-head">
                <h2 className="we-settings__live-title">Опубліковано</h2>
                <span className="we-settings__live-badge">Live</span>
              </div>
              <p className="we-settings__live-text">Ваш сайт уже в мережі</p>
              <hr className="we-settings__live-divider" />
              <div className="we-settings__live-actions">
                <a
                  href={publicHref}
                  target="_blank"
                  rel="noreferrer"
                  className="we-settings__btn we-settings__btn--solid"
                >
                  <IconExternalLink />
                  Перейти на сайт
                </a>
                <button
                  type="button"
                  className="we-settings__btn we-settings__btn--outline"
                  onClick={onCopyLink}
                >
                  <IconLink />
                  Скопіювати лінк
                </button>
              </div>
            </div>

            <div className="we-settings__footer">
              <button
                type="button"
                className="we-settings__link"
                onClick={onEditSite}
              >
                <IconPencil />
                Редагувати сайт
              </button>
              <button
                type="button"
                className="we-settings__link we-settings__link--muted"
                disabled={unpublishing}
                onClick={onUnpublish}
              >
                {unpublishing ? "Скасовуємо…" : "Скасувати публікацію"}
              </button>
            </div>

            <Link href="/website" className="we-settings__back">
              Повернутись до вкладки Огляд
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
