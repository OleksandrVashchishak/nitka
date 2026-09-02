"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { WebsiteContent, WebsiteSections } from "@/lib/website-api";
import { getThemeById, type WeddingTheme } from "@/lib/wedding-themes";
import { safeHref, withAccent } from "@/lib/wedding-theme-utils";
import {
  BotanicalCorners,
  BokehField,
  MothMark,
  Reveal,
  RsvpButton,
  SectionEyebrow,
  SectionTitle,
  SplitMeta,
  ThemeDivider,
  WeddingSiteNav,
} from "@/components/wedding-ui";

/* eslint-disable @next/next/no-img-element */

type Props = {
  content: WebsiteContent;
  templateId: string;
  compact?: boolean;
  /** Only hero + nav + split — for template picker cards */
  cardPreview?: boolean;
};

function navItems(sections: WebsiteSections): Array<[string, string]> {
  const items: Array<[string, string]> = [["#home", "Home"]];
  if (sections.story) items.push(["#story", "Історія"]);
  if (sections.gallery) items.push(["#gallery", "Фото"]);
  if (sections.schedule) items.push(["#schedule", "Програма"]);
  if (sections.dressCode) items.push(["#dresscode", "Дрес-код"]);
  if (sections.qa) items.push(["#qa", "Q + A"]);
  if (sections.travel) items.push(["#travel", "Travel"]);
  if (sections.registry) items.push(["#registry", "Registry"]);
  if (sections.rsvp) items.push(["#rsvp", "Запрошення"]);
  return items;
}

function rsvpHref(content: WebsiteContent) {
  const url = content.rsvpUrl?.trim();
  if (!url) return "#rsvp";
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("#")) {
    return safeHref(url, "#rsvp");
  }
  // bare token → /rsvp/{token}
  if (/^[a-zA-Z0-9_-]+$/.test(url)) return `/rsvp/${url}`;
  return "#rsvp";
}

function HeroBlock({
  content,
  theme,
  compact,
}: {
  content: WebsiteContent;
  theme: WeddingTheme;
  compact?: boolean;
}) {
  const hasHero = Boolean(content.heroImageUrl);
  const hasCouple = Boolean(content.coupleImageUrl);
  const useScript = theme.headlineMode === "script";
  const composition = theme.composition;
  const photoHero = composition === "photo-hero";
  const botanical = composition === "botanical";
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (compact || !photoHero || !parallaxRef.current) return;
    const el = parallaxRef.current;
    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.25, 120);
      el.style.transform = `translateY(${y}px) scale(1.08)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compact, photoHero]);

  return (
    <header
      id="home"
      className={`relative overflow-hidden text-center ${
        photoHero && !compact
          ? "min-h-[88vh] flex flex-col justify-end"
          : compact
            ? "px-5 pb-8 pt-10"
            : botanical
              ? "px-4 pb-10 pt-20 sm:px-6 sm:pt-16 md:pt-24"
              : "px-4 pb-10 pt-20 sm:px-6 sm:pt-14 md:pt-20"
      }`}
    >
      {botanical ? <BotanicalCorners color={theme.colors.accent} /> : null}
      {theme.decorations.showBokeh || photoHero ? (
        <BokehField accent={theme.colors.accent} />
      ) : null}

      {hasHero && (photoHero || botanical) ? (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            ref={parallaxRef}
            className="wedding-parallax h-full w-full will-change-transform"
          >
            <img
              src={content.heroImageUrl}
              alt=""
              className={`h-full w-full object-cover ${photoHero ? "opacity-55" : "opacity-30"}`}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: theme.decorations.heroOverlay }}
          />
        </div>
      ) : null}

      {botanical ? (
        <div
          className="pointer-events-none absolute inset-4 border md:inset-8"
          style={{ borderColor: `${theme.colors.accent}35` }}
        />
      ) : null}

      <div
        className={`relative z-10 mx-auto max-w-3xl ${
          photoHero && !compact ? "px-6 pb-16 pt-28 md:pb-24" : ""
        }`}
      >
        {theme.decorations.showMoth || botanical ? (
          <MothMark color={theme.colors.accent} />
        ) : (
          <p
            className={`mb-3 font-wedding-script ${
              compact ? "text-2xl" : "text-3xl md:text-4xl"
            }`}
            style={{ color: theme.colors.text }}
          >
            the wedding of
          </p>
        )}

        {hasCouple && !photoHero ? (
          <div
            className={`mx-auto mb-6 overflow-hidden rounded-full ${
              compact ? "size-20" : "size-24 md:size-28"
            }`}
            style={{ boxShadow: `0 0 0 1px ${theme.colors.line}` }}
          >
            <img
              src={content.coupleImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <h1
          className={
            useScript
              ? `mx-auto max-w-full break-words font-wedding-script leading-[1.1] text-balance ${
                  compact ? "text-4xl" : "text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl"
                }`
              : `mx-auto max-w-full break-words font-[family-name:var(--font-display)] uppercase leading-[1.12] tracking-[0.02em] text-balance sm:tracking-[0.04em] ${
                  compact ? "text-3xl" : "text-[1.5rem] sm:text-4xl md:text-6xl lg:text-7xl"
                }`
          }
          style={{ color: theme.colors.text }}
        >
          {content.headline}
        </h1>

        <p
          className={`mx-auto mt-5 max-w-full break-words uppercase tracking-[0.12em] sm:tracking-[0.22em] ${
            compact ? "text-[10px]" : "text-[10px] sm:text-xs md:text-sm"
          }`}
          style={{ color: theme.colors.textMuted }}
        >
          {content.dateLabel}
          <span className="mx-2 opacity-50">•</span>
          {content.cityLabel}
        </p>

        {!compact ? (
          <p
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed md:text-base"
            style={{ color: theme.colors.textDim }}
          >
            {content.subheadline}
          </p>
        ) : null}
      </div>
    </header>
  );
}

export function WeddingSiteView({
  content,
  templateId,
  compact = false,
  cardPreview = false,
}: Props) {
  const baseTheme = getThemeById(templateId);
  const theme = useMemo(
    () => withAccent(baseTheme, content.accentColor),
    [baseTheme, content.accentColor],
  );
  const sections = content.sections ?? {
    story: true,
    schedule: true,
    dressCode: true,
    gallery: false,
    qa: false,
    travel: false,
    registry: false,
    rsvp: true,
  };
  const items = navItems(sections);
  const href = rsvpHref(content);
  const mini = compact || cardPreview;
  const [opened, setOpened] = useState(
    !content.introEnabled || mini,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!opened || !content.musicUrl || mini) return;
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => {
      /* autoplay blocked until user gesture — intro covers that */
    });
  }, [opened, content.musicUrl, mini]);

  function openInvite() {
    setOpened(true);
    if (content.musicUrl && audioRef.current) {
      void audioRef.current.play().catch(() => undefined);
    }
  }

  return (
    <div
      className="overflow-x-hidden"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      {content.musicUrl && !mini ? (
        <audio ref={audioRef} src={content.musicUrl} loop preload="none" />
      ) : null}

      {!opened && !mini ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          style={{ background: theme.colors.bg }}
        >
          {theme.decorations.showBotanical || theme.composition === "botanical" ? (
            <BotanicalCorners color={theme.colors.accent} />
          ) : null}
          {theme.decorations.showBokeh ? (
            <BokehField accent={theme.colors.accent} />
          ) : null}
          <div className="relative z-10 text-center">
            <p
              className="mx-auto max-w-full break-words px-2 font-wedding-script text-3xl leading-tight text-balance sm:text-4xl md:text-5xl"
              style={{ color: theme.colors.text }}
            >
              {content.headline}
            </p>
            <p
              className="mt-4 text-xs uppercase tracking-[0.25em]"
              style={{ color: theme.colors.textDim }}
            >
              {content.dateLabel}
            </p>
            <button
              type="button"
              onClick={openInvite}
              className="mt-10 cursor-pointer px-10 py-3 text-xs font-semibold uppercase tracking-[0.22em]"
              style={{
                background: theme.colors.accent,
                color:
                  theme.id === "classic-white" ? "#fff" : theme.colors.bg,
              }}
            >
              {content.introTitle || "Відкрити запрошення"}
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={
          !opened && !mini
            ? "pointer-events-none opacity-0"
            : "opacity-100 transition-opacity duration-700"
        }
      >
        <HeroBlock content={content} theme={theme} compact={mini} />

        <WeddingSiteNav theme={theme} items={items} />

        <Reveal>
          <section
            className={`px-6 text-center ${mini ? "pb-8" : "pb-16 md:pb-24"}`}
          >
            <SplitMeta
              theme={theme}
              dateLabel={content.dateLabel}
              cityLabel={content.cityLabel}
              compact={mini}
            />
            {!mini && sections.rsvp ? (
              <div className="mt-8 flex justify-center px-2">
                <RsvpButton theme={theme} href={href} />
              </div>
            ) : null}
          </section>
        </Reveal>

        {sections.story ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section
                id="story"
                className={`mx-auto max-w-5xl px-6 ${mini ? "py-8" : "py-14 md:py-20"}`}
              >
                <div
                  className={`items-center gap-12 ${
                    content.storyImageUrl
                      ? `grid ${mini ? "" : "md:grid-cols-2"}`
                      : "mx-auto max-w-2xl text-center"
                  }`}
                >
                  {content.storyImageUrl ? (
                    <div className="overflow-hidden">
                      <img
                        src={content.storyImageUrl}
                        alt=""
                        className="w-full object-cover"
                        style={{ aspectRatio: "4/5" }}
                      />
                    </div>
                  ) : null}
                  <div>
                    <SectionEyebrow theme={theme}>Про нас</SectionEyebrow>
                    <SectionTitle theme={theme} compact={mini} className="mt-3">
                      {content.storyTitle}
                    </SectionTitle>
                    <p
                      className={`mt-6 whitespace-pre-wrap leading-8 ${
                        mini ? "line-clamp-4 text-sm" : "text-base"
                      }`}
                      style={{ color: theme.colors.textMuted }}
                    >
                      {content.storyBody}
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.gallery && content.galleryImages?.length ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section
                id="gallery"
                className={`mx-auto max-w-5xl px-6 ${mini ? "py-8" : "py-14 md:py-20"}`}
              >
                <div className="text-center">
                  <SectionEyebrow theme={theme}>Gallery</SectionEyebrow>
                  <SectionTitle theme={theme} compact={mini} className="mt-3">
                    {content.galleryTitle}
                  </SectionTitle>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  {(cardPreview
                    ? content.galleryImages.slice(0, 3)
                    : content.galleryImages
                  ).map((url) => (
                    <div key={url} className="overflow-hidden">
                      <img
                        src={url}
                        alt=""
                        className="aspect-[4/5] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.schedule ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section id="schedule" style={{ background: theme.colors.surface }}>
                <div
                  className={`mx-auto max-w-3xl px-6 ${mini ? "py-8" : "py-14 md:py-20"}`}
                >
                  <div className="text-center">
                    <SectionEyebrow theme={theme}>План дня</SectionEyebrow>
                    <SectionTitle theme={theme} compact={mini} className="mt-3">
                      {content.scheduleTitle}
                    </SectionTitle>
                  </div>
                  <div className="mx-auto mt-10 max-w-xl overflow-x-hidden">
                    {(cardPreview
                      ? content.scheduleItems.slice(0, 3)
                      : content.scheduleItems
                    ).map((item, index) => (
                      <div
                        key={`${item.time}-${index}`}
                        className="ml-2 grid grid-cols-[56px_minmax(0,1fr)] gap-2 py-4 pl-3 sm:ml-10 sm:grid-cols-[80px_1fr] sm:gap-6 sm:py-5 sm:pl-6"
                        style={{
                          borderLeft: `1px solid ${theme.colors.line}`,
                        }}
                      >
                        <div className="relative">
                          <span
                            className="absolute -left-[19px] top-1 size-2.5 rounded-full sm:-left-[31px]"
                            style={{ background: theme.colors.accent }}
                          />
                          <span
                            className="text-sm font-medium tabular-nums"
                            style={{ color: theme.colors.accent }}
                          >
                            {item.time}
                          </span>
                        </div>
                        <div>
                          <p
                            className="font-[family-name:var(--font-display)] text-xl"
                            style={{ color: theme.colors.text }}
                          >
                            {item.title}
                          </p>
                          {item.detail ? (
                            <p
                              className="mt-1 text-sm leading-relaxed"
                              style={{ color: theme.colors.textDim }}
                            >
                              {item.detail}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.dressCode ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section
                id="dresscode"
                className={`mx-auto max-w-2xl px-6 text-center ${mini ? "py-8" : "py-14 md:py-20"}`}
              >
                <SectionEyebrow theme={theme}>Дрес-код</SectionEyebrow>
                <SectionTitle theme={theme} compact={mini} className="mt-3">
                  {content.dressCodeTitle}
                </SectionTitle>
                <p
                  className={`mt-6 whitespace-pre-wrap leading-8 ${
                    mini ? "line-clamp-3 text-sm" : "text-base"
                  }`}
                  style={{ color: theme.colors.textMuted }}
                >
                  {content.dressCodeBody}
                </p>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.qa ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section
                id="qa"
                className={`mx-auto max-w-2xl px-6 ${mini ? "py-8" : "py-14 md:py-20"}`}
              >
                <div className="text-center">
                  <SectionEyebrow theme={theme}>Q + A</SectionEyebrow>
                  <SectionTitle theme={theme} compact={mini} className="mt-3">
                    {content.qaTitle}
                  </SectionTitle>
                </div>
                <div className="mt-10 space-y-6">
                  {(cardPreview
                    ? (content.qaItems ?? []).slice(0, 2)
                    : (content.qaItems ?? [])
                  ).map((item, i) => (
                    <div
                      key={`${item.question}-${i}`}
                      className="border-t pt-5"
                      style={{ borderColor: theme.colors.line }}
                    >
                      <p
                        className="font-[family-name:var(--font-display)] text-xl"
                        style={{ color: theme.colors.text }}
                      >
                        {item.question}
                      </p>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ color: theme.colors.textMuted }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.travel ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section
                id="travel"
                style={{ background: theme.colors.surface }}
                className={`px-6 ${mini ? "py-8" : "py-14 md:py-20"}`}
              >
                <div className="mx-auto max-w-2xl text-center">
                  <SectionEyebrow theme={theme}>Travel</SectionEyebrow>
                  <SectionTitle theme={theme} compact={mini} className="mt-3">
                    {content.travelTitle}
                  </SectionTitle>
                  <p
                    className={`mt-5 whitespace-pre-wrap leading-8 ${
                      mini ? "line-clamp-3 text-sm" : "text-base"
                    }`}
                    style={{ color: theme.colors.textMuted }}
                  >
                    {content.travelBody}
                  </p>
                  <div className="mt-8 space-y-4 text-left">
                    {(cardPreview
                      ? (content.travelItems ?? []).slice(0, 2)
                      : (content.travelItems ?? [])
                    ).map((item, i) => (
                      <div key={`${item.title}-${i}`}>
                        <p
                          className="font-[family-name:var(--font-display)] text-lg"
                          style={{ color: theme.colors.text }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="mt-1 text-sm"
                          style={{ color: theme.colors.textDim }}
                        >
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.registry ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section
                id="registry"
                className={`mx-auto max-w-2xl px-6 text-center ${mini ? "py-8" : "py-14 md:py-20"}`}
              >
                <SectionEyebrow theme={theme}>Registry</SectionEyebrow>
                <SectionTitle theme={theme} compact={mini} className="mt-3">
                  {content.registryTitle}
                </SectionTitle>
                <p
                  className={`mt-5 whitespace-pre-wrap leading-8 ${
                    mini ? "line-clamp-3 text-sm" : "text-base"
                  }`}
                  style={{ color: theme.colors.textMuted }}
                >
                  {content.registryBody}
                </p>
                <div className="mt-8 space-y-3">
                  {(cardPreview
                    ? (content.registryItems ?? []).slice(0, 2)
                    : (content.registryItems ?? [])
                  ).map((item, i) => (
                    <div key={`${item.title}-${i}`}>
                      {item.url && safeHref(item.url, "") ? (
                        <a
                          href={safeHref(item.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm uppercase tracking-[0.16em] underline-offset-4 hover:underline"
                          style={{ color: theme.colors.accent }}
                        >
                          {item.title}
                        </a>
                      ) : (
                        <p
                          className="text-sm uppercase tracking-[0.16em]"
                          style={{ color: theme.colors.text }}
                        >
                          {item.title}
                        </p>
                      )}
                      {item.detail ? (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: theme.colors.textDim }}
                        >
                          {item.detail}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        {sections.rsvp ? (
          <>
            <ThemeDivider theme={theme} compact={mini} />
            <Reveal>
              <section id="rsvp" style={{ background: theme.colors.surface }}>
                <div
                  className={`mx-auto max-w-2xl px-6 text-center ${mini ? "py-8" : "py-14 md:py-20"}`}
                >
                  <SectionEyebrow theme={theme}>Запрошення</SectionEyebrow>
                  <SectionTitle theme={theme} compact={mini} className="mt-3">
                    {content.rsvpTitle}
                  </SectionTitle>
                  <p
                    className={`mt-6 whitespace-pre-wrap leading-8 ${
                      mini ? "line-clamp-3 text-sm" : "text-base"
                    }`}
                    style={{ color: theme.colors.textMuted }}
                  >
                    {content.rsvpBody}
                  </p>
                  {!mini ? (
                    <div className="mt-8">
                      <RsvpButton theme={theme} href={href} />
                    </div>
                  ) : null}
                </div>
              </section>
            </Reveal>
          </>
        ) : null}

        <footer
          className={`px-6 text-center ${mini ? "py-8" : "py-14 md:py-20"}`}
          style={{ borderTop: `1px solid ${theme.colors.line}` }}
        >
          <p
            className={`font-[family-name:var(--font-display)] ${
              mini ? "text-xl" : "text-2xl md:text-4xl"
            }`}
            style={{ color: theme.colors.text }}
          >
            {content.footerNote}
          </p>
          {!mini ? (
            <p
              className="mt-10 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: theme.colors.textDim }}
            >
              created with{" "}
              <a
                href="/"
                target="_blank"
                rel="noopener"
                className="underline-offset-2 transition hover:underline"
                style={{ color: theme.colors.accent }}
              >
                fata.studio
              </a>
            </p>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
