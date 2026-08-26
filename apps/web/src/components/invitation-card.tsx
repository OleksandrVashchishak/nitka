/* eslint-disable @next/next/no-img-element */
"use client";

import type { InvitationContent } from "@/lib/invitations-api";
import {
  getInvitationTheme,
  type InvitationTheme,
} from "@/lib/invitation-themes";

type Props = {
  templateId: string;
  content: InvitationContent;
  guestName?: string;
  websiteUrl?: string | null;
  compact?: boolean;
  /** Hide site link in print (QR/URL less useful on paper). */
  hideWebsiteLinkOnPrint?: boolean;
};

function MetaRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: InvitationTheme;
}) {
  if (!value.trim()) return null;
  return (
    <div className="text-center">
      <p
        className="text-[10px] uppercase tracking-[0.22em]"
        style={{ color: theme.colors.muted }}
      >
        {label}
      </p>
      <p
        className="mt-1 break-words font-[family-name:var(--font-display)] text-base leading-snug sm:text-lg"
        style={{ color: theme.colors.text }}
      >
        {value}
      </p>
    </div>
  );
}

export function InvitationCard({
  templateId,
  content,
  guestName,
  websiteUrl,
  compact = false,
  hideWebsiteLinkOnPrint = false,
}: Props) {
  const theme = getInvitationTheme(templateId);
  const headlineClass =
    theme.headlineFont === "script"
      ? "font-wedding-script leading-[1.1]"
      : "font-[family-name:var(--font-display)] uppercase tracking-[0.04em] leading-[1.15]";

  return (
    <article
      className={`relative mx-auto w-full max-w-full overflow-hidden ${
        compact ? "max-w-sm" : "max-w-xl"
      }`}
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      {theme.frame !== "none" ? (
        <div
          className={`pointer-events-none absolute ${
            theme.frame === "double"
              ? "inset-2 border-2 sm:inset-3"
              : "inset-3 border sm:inset-4"
          }`}
          style={{ borderColor: theme.colors.line }}
        />
      ) : null}

      <div
        className={`relative ${
          compact
            ? "px-6 py-10"
            : "px-5 py-10 sm:px-8 sm:py-14 md:px-12 md:py-16"
        }`}
      >
        {content.coverImageUrl ? (
          <div
            className={`mx-auto mb-8 overflow-hidden ${
              compact ? "aspect-[4/3] max-w-[220px]" : "aspect-[5/4] max-w-sm"
            }`}
            style={{ boxShadow: `0 0 0 1px ${theme.colors.line}` }}
          >
            <img
              src={content.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <p
          className={`px-1 text-center break-words ${
            compact ? "text-xl" : "text-xl sm:text-2xl md:text-3xl"
          } font-wedding-script`}
          style={{ color: theme.colors.accent }}
        >
          {content.opener}
        </p>

        <h1
          className={`mt-5 px-1 text-center text-balance break-words ${headlineClass} ${
            compact
              ? "text-3xl"
              : theme.headlineFont === "script"
                ? "text-[2.35rem] leading-tight sm:text-5xl md:text-6xl"
                : "text-[1.75rem] leading-tight sm:text-4xl md:text-5xl"
          }`}
        >
          {content.headline}
        </h1>

        {guestName ? (
          <p
            className="mt-6 px-1 text-center text-sm break-words"
            style={{ color: theme.colors.muted }}
          >
            Для{" "}
            <span style={{ color: theme.colors.text }} className="font-medium">
              {guestName}
            </span>
          </p>
        ) : null}

        <p
          className={`mx-auto mt-6 max-w-md px-1 text-center leading-relaxed ${
            compact ? "text-sm" : "text-sm sm:text-base"
          }`}
          style={{ color: theme.colors.muted }}
        >
          {content.body}
        </p>

        <div
          className={`mx-auto mt-8 grid max-w-md gap-5 sm:mt-10 sm:gap-6 ${
            content.timeLabel ? "grid-cols-2" : ""
          }`}
        >
          <MetaRow theme={theme} label="Дата" value={content.dateLabel} />
          <MetaRow theme={theme} label="Час" value={content.timeLabel} />
        </div>

        {(content.venue || content.address) && (
          <div className="mx-auto mt-8 max-w-md space-y-4">
            <MetaRow theme={theme} label="Місце" value={content.venue} />
            <MetaRow theme={theme} label="Адреса" value={content.address} />
          </div>
        )}

        {content.dressCode ? (
          <div className="mx-auto mt-8 max-w-md">
            <MetaRow theme={theme} label="Дрес-код" value={content.dressCode} />
          </div>
        ) : null}

        {content.rsvpNote ? (
          <p
            className="mx-auto mt-10 max-w-sm text-center text-sm leading-relaxed"
            style={{ color: theme.colors.muted }}
          >
            {content.rsvpNote}
          </p>
        ) : null}

        {content.showWebsiteLink && websiteUrl ? (
          <p
            className={`mt-8 text-center${
              hideWebsiteLinkOnPrint ? " no-print" : ""
            }`}
          >
            <a
              href={websiteUrl}
              className="text-xs uppercase tracking-[0.18em] underline-offset-4 hover:underline"
              style={{ color: theme.colors.accent }}
            >
              Деталі на сайті
            </a>
          </p>
        ) : null}
      </div>
    </article>
  );
}
