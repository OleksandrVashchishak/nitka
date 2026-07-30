"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { PageLoader, LoadingButtonLabel } from "@/components/ui-loader";
import { renderWebsiteTemplate } from "@/components/website-templates";
import { getThemeById } from "@/lib/wedding-themes";
import {
  ACCENT_PRESETS,
  formatWeddingDate,
} from "@/lib/wedding-theme-utils";
import { uploadFile } from "@/lib/client-api";
import {
  getMyWebsite,
  upsertMyWebsite,
  type WebsiteContent,
  type WebsiteMineResponse,
  type WebsiteScheduleItem,
  type WebsiteSections,
} from "@/lib/website-api";
import { normalizeWebsiteContent } from "@/lib/normalize-website-content";
import { getErrorMessage, toast } from "@/lib/toast";

const fieldClass =
  "w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-sage";

const SECTION_LABELS: Array<[keyof WebsiteSections, string]> = [
  ["story", "Історія"],
  ["schedule", "Програма"],
  ["dressCode", "Дрес-код"],
  ["gallery", "Gallery"],
  ["qa", "Q + A"],
  ["travel", "Travel"],
  ["registry", "Registry"],
  ["rsvp", "Запрошення"],
];

/* eslint-disable @next/next/no-img-element */
function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      onChange(result.url);
      toast.success("Фото завантажено");
    } catch {
      /* api toast */
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-1 text-sm text-ink-soft">{label}</p>
      {hint ? <p className="mb-2 text-xs text-ink-soft/70">{hint}</p> : null}
      {value ? (
        <div className="group relative mb-2 overflow-hidden border border-line">
          <img
            src={value}
            alt={label}
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 cursor-pointer bg-ink/80 px-2 py-1 text-xs text-white opacity-0 transition hover:bg-ink group-hover:opacity-100"
          >
            Видалити
          </button>
        </div>
      ) : null}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border border-line bg-white px-3 py-2 text-sm text-ink-soft transition hover:border-sage/40 hover:bg-mist hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Завантажуємо…"
          : value
            ? "Замінити фото"
            : "Завантажити фото"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
    </div>
  );
}

function AccordionPanel({
  id,
  title,
  hint,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="border border-line bg-white">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-mist/60"
        aria-expanded={open}
      >
        <span>
          <span className="block text-sm font-semibold text-ink">{title}</span>
          {hint ? (
            <span className="mt-0.5 block text-xs text-ink-soft">{hint}</span>
          ) : null}
        </span>
        <span className="text-xs text-ink-soft" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open ? <div className="space-y-4 border-t border-line px-4 py-4">{children}</div> : null}
    </div>
  );
}

function SitePreview({
  templateId,
  content,
  published,
  mode,
  onModeChange,
}: {
  templateId: string;
  content: WebsiteContent;
  published: boolean;
  mode: "desktop" | "mobile";
  onModeChange: (mode: "desktop" | "mobile") => void;
}) {
  const bg = getThemeById(templateId).colors.bg;
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
          Превʼю · {published ? "опубліковано" : "чернетка"}
        </p>
        <div className="inline-flex border border-line bg-white p-1">
          {(
            [
              ["desktop", "Desktop"],
              ["mobile", "Mobile"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onModeChange(id)}
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition ${
                mode === id
                  ? "bg-sage text-white"
                  : "text-ink-soft hover:bg-mist hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "desktop" ? (
        <div
          className="min-h-[70vh] flex-1 overflow-y-auto overflow-x-hidden border border-line"
          style={{ background: bg }}
        >
          {renderWebsiteTemplate(templateId, content)}
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 justify-center overflow-x-hidden py-2">
          <div className="relative w-full max-w-[320px] rounded-[2rem] border-[8px] border-ink bg-ink p-1 shadow-xl sm:border-[10px]">
            <div className="absolute left-1/2 top-2 z-10 h-4 w-24 -translate-x-1/2 rounded-full bg-ink" />
            <div
              className="h-[min(70vh,620px)] overflow-y-auto overflow-x-hidden rounded-[1.4rem] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ background: bg }}
            >
              {renderWebsiteTemplate(templateId, content)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WebsiteEditorInner() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [needWedding, setNeedWedding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WebsiteMineResponse | null>(null);
  const [step, setStep] = useState<"template" | "editor">("template");
  const [slug, setSlug] = useState("");
  const [templateId, setTemplateId] = useState("classic-white");
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [origin, setOrigin] = useState("");
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1279px)").matches
      ? "mobile"
      : "desktop",
  );
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    publish: true,
    sections: true,
    style: false,
    basics: true,
    vibe: false,
    photos: false,
    story: false,
    gallery: false,
    schedule: false,
    dressCode: false,
    qa: false,
    travel: false,
    registry: false,
    rsvp: false,
  });

  function togglePanel(id: string) {
    setOpenPanels((current) => ({ ...current, [id]: !current[id] }));
  }

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    setNeedWedding(false);
    try {
      const res = await getMyWebsite();
      setData(res);
      setSlug(res.site?.slug ?? res.suggestedSlug);
      setTemplateId(res.site?.templateId ?? "classic-white");
      setPublished(res.site?.published ?? false);
      setContent(
        normalizeWebsiteContent(res.site?.content ?? res.defaults, res.defaults),
      );
      setStep(res.site ? "editor" : "template");
    } catch (err) {
      const message = getErrorMessage(err, "Помилка");
      if (message.toLowerCase().includes("весілля")) {
        setNeedWedding(true);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function patchContent<K extends keyof WebsiteContent>(
    key: K,
    value: WebsiteContent[K],
  ) {
    setContent((current) => (current ? { ...current, [key]: value } : current));
  }

  function patchSection(key: keyof WebsiteSections, value: boolean) {
    setContent((current) =>
      current
        ? { ...current, sections: { ...current.sections, [key]: value } }
        : current,
    );
  }

  function patchSchedule(index: number, patch: Partial<WebsiteScheduleItem>) {
    setContent((current) => {
      if (!current) return current;
      const scheduleItems = current.scheduleItems.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      );
      return { ...current, scheduleItems };
    });
  }

  function setDateFormat(format: "uk" | "en") {
    const weddingDate = data?.site?.wedding.date;
    setContent((current) => {
      if (!current) return current;
      return {
        ...current,
        dateFormat: format,
        dateLabel: weddingDate
          ? formatWeddingDate(weddingDate, format)
          : current.dateLabel,
      };
    });
  }

  async function onGalleryFile(file?: File) {
    if (!file || !content) return;
    setGalleryUploading(true);
    try {
      const result = await uploadFile(file);
      patchContent("galleryImages", [...(content.galleryImages ?? []), result.url]);
      toast.success("Додано в галерею");
    } catch {
      /* toast */
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  async function onSave(e?: FormEvent) {
    e?.preventDefault();
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      const site = await upsertMyWebsite({
        slug,
        templateId,
        published,
        content,
      });
      setSlug(site.slug);
      setPublished(site.published);
      setContent(normalizeWebsiteContent(site.content));
      setStep("editor");
      toast.success("Збережено", published ? "Сайт опубліковано" : "Чернетка");
      await load();
    } catch (err) {
      const message = getErrorMessage(err, "Не збережено");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function copyPublicLink() {
    if (!slug || !origin) return;
    try {
      await navigator.clipboard.writeText(`${origin}/w/${slug}`);
      toast.success("Скопійовано", "Публічне посилання в буфері");
    } catch {
      toast.error("Не вдалось скопіювати");
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо сайт…" />;
  }

  if (!content) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          Весільний сайт
        </h1>
        <div className="mt-6 border border-red-200 bg-red-50 px-6 py-8">
          <p className="text-sm text-red-700">
            {error ?? "Не вдалось завантажити дані сайту"}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 cursor-pointer bg-sage px-4 py-2 text-sm font-semibold text-white"
          >
            Спробувати ще
          </button>
        </div>
      </>
    );
  }

  if (needWedding) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          Весільний сайт
        </h1>
        <div className="mt-6 border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку створи весілля у кабінеті — імена й дата підтягнуться в
            темплейт.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex cursor-pointer bg-sage px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep"
          >
            До кабінету
          </Link>
        </div>
      </>
    );
  }

  if (step === "template") {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
          Весільний сайт
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          Обери стиль — композиція, кольори й декор різні. Далі підженемо тексти
          і секції.
        </p>

        {error ? (
          <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-end gap-3 border border-line bg-white p-4">
          <label className="min-w-[220px] flex-1">
            <span className="mb-1 block text-sm text-ink-soft">
              Адреса сайту
            </span>
            <div className="flex items-center border border-line focus-within:border-sage">
              <span className="shrink-0 bg-mist px-3 py-2.5 text-sm text-ink-soft">
                /w/
              </span>
              <input
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-"),
                  )
                }
                className="w-full px-3 py-2.5 text-sm outline-none"
                placeholder="maria-andriy"
              />
            </div>
          </label>
          <button
            type="button"
            disabled={saving || slug.trim().length < 2}
            onClick={() => void onSave()}
            className="cursor-pointer bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LoadingButtonLabel loading={saving} loadingText="Створюємо…">
              Обрати й продовжити
            </LoadingButtonLabel>
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(data?.templates ?? []).map((template) => {
            const selected = templateId === template.id;
            const previewBg = getThemeById(template.id).colors.bg;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setTemplateId(template.id)}
                className={`cursor-pointer border p-5 text-left transition ${
                  selected
                    ? "border-sage bg-sage/10"
                    : "border-line bg-white hover:border-sage/40"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                  Темплейт
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
                  {template.name}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">
                  {template.description}
                </p>
                <div
                  className="relative mt-4 aspect-[3/4] overflow-hidden border border-line"
                  style={{ background: previewBg }}
                >
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                      className="origin-top-left"
                      style={{
                        width: "400%",
                        transform: "scale(0.25)",
                      }}
                    >
                      {renderWebsiteTemplate(template.id, content, {
                        cardPreview: true,
                      })}
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                    style={{
                      background: `linear-gradient(to top, ${previewBg}, transparent)`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  const publicUrl = `${origin}/w/${slug}`;

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Весільний сайт
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            Зліва налаштування секціями. Справа превʼю — desktop або mobile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStep("template")}
            className="cursor-pointer border border-line bg-white px-4 py-2.5 text-sm text-ink-soft transition hover:border-sage/40 hover:bg-mist hover:text-ink"
          >
            Темплейт
          </button>
          <button
            type="button"
            onClick={() => void copyPublicLink()}
            className="cursor-pointer border border-line bg-white px-4 py-2.5 text-sm text-ink-soft transition hover:border-sage/40 hover:bg-mist hover:text-ink"
          >
            Копіювати лінк
          </button>
          {published ? (
            <Link
              href={`/w/${slug}`}
              target="_blank"
              className="cursor-pointer border border-sage px-4 py-2.5 text-sm font-semibold text-sage transition hover:bg-sage hover:text-white"
            >
              Відкрити сайт
            </Link>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(e) => void onSave(e)}
        className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]"
      >
        <div className="order-2 min-w-0 space-y-2 xl:order-1">
          <AccordionPanel
            id="publish"
            title="Публікація"
            hint="Адреса сайту і видимість"
            open={Boolean(openPanels.publish)}
            onToggle={togglePanel}
          >
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Адреса /w/</span>
              <input
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-"),
                  )
                }
                className={fieldClass}
              />
              <span className="mt-1 block break-all text-xs text-ink-soft">
                {publicUrl}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 border border-line px-3 py-3 text-sm text-ink transition hover:bg-mist">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="size-4 cursor-pointer accent-[var(--sage)]"
              />
              Опублікувати (видимий за лінком)
            </label>
          </AccordionPanel>

          <AccordionPanel
            id="sections"
            title="Секції сайту"
            hint="Що показувати гостям"
            open={Boolean(openPanels.sections)}
            onToggle={togglePanel}
          >
            <div className="grid grid-cols-2 gap-2">
              {SECTION_LABELS.map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 border border-line px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(content.sections?.[key])}
                    onChange={(e) => patchSection(key, e.target.checked)}
                    className="size-4 accent-[var(--sage)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </AccordionPanel>

          <AccordionPanel
            id="style"
            title="Стиль і дата"
            hint="Акцент і формат дати"
            open={Boolean(openPanels.style)}
            onToggle={togglePanel}
          >
            <div>
              <p className="mb-2 text-sm text-ink-soft">Акцент</p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_PRESETS.map((preset) => {
                  const active =
                    (content.accentColor || "") === preset.value ||
                    (!content.accentColor && preset.value === "");
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => patchContent("accentColor", preset.value)}
                      className={`cursor-pointer border px-3 py-1.5 text-xs transition ${
                        active
                          ? "border-sage bg-sage/10 text-ink"
                          : "border-line text-ink-soft hover:bg-mist"
                      }`}
                    >
                      <span
                        className="mr-2 inline-block size-2.5 rounded-full align-middle"
                        style={{
                          background:
                            preset.value ||
                            getThemeById(templateId).colors.accent,
                        }}
                      />
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-ink-soft">Формат дати</p>
              <div className="flex gap-2">
                {(
                  [
                    ["uk", "Українською"],
                    ["en", "EN (JULY 22, 2026)"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDateFormat(id)}
                    className={`cursor-pointer border px-3 py-1.5 text-xs ${
                      content.dateFormat === id
                        ? "border-sage bg-sage/10"
                        : "border-line"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </AccordionPanel>

          <AccordionPanel
            id="basics"
            title="Основні тексти"
            hint="Імена, дата, місто, підпис"
            open={Boolean(openPanels.basics)}
            onToggle={togglePanel}
          >
            {(
              [
                ["headline", "Заголовок (імена)"],
                ["subheadline", "Підзаголовок"],
                ["dateLabel", "Дата"],
                ["cityLabel", "Місто / локація"],
                ["footerNote", "Підпис внизу"],
              ] as Array<[keyof WebsiteContent, string]>
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-sm text-ink-soft">{label}</span>
                <input
                  value={String(content[key] ?? "")}
                  onChange={(e) => patchContent(key, e.target.value)}
                  className={fieldClass}
                />
              </label>
            ))}
          </AccordionPanel>

          <AccordionPanel
            id="vibe"
            title="Intro і музика"
            hint="Екран відкриття та трек"
            open={Boolean(openPanels.vibe)}
            onToggle={togglePanel}
          >
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={content.introEnabled}
                onChange={(e) => patchContent("introEnabled", e.target.checked)}
                className="size-4 accent-[var(--sage)]"
              />
              Екран «Відкрити запрошення»
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">
                Текст кнопки intro
              </span>
              <input
                value={content.introTitle}
                onChange={(e) => patchContent("introTitle", e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">
                URL музики (mp3/ogg, опційно)
              </span>
              <input
                value={content.musicUrl}
                onChange={(e) => patchContent("musicUrl", e.target.value)}
                placeholder="https://…"
                className={fieldClass}
              />
            </label>
          </AccordionPanel>

          <AccordionPanel
            id="photos"
            title="Фото"
            hint="Hero, пара, історія"
            open={Boolean(openPanels.photos)}
            onToggle={togglePanel}
          >
            <ImageField
              label="Головне фото (hero)"
              hint="Для Navy — full-bleed фон; для інших — опційно"
              value={content.heroImageUrl}
              onChange={(url) => patchContent("heroImageUrl", url)}
            />
            <ImageField
              label="Фото пари"
              value={content.coupleImageUrl}
              onChange={(url) => patchContent("coupleImageUrl", url)}
            />
            <ImageField
              label="Фото для історії"
              value={content.storyImageUrl}
              onChange={(url) => patchContent("storyImageUrl", url)}
            />
          </AccordionPanel>

          {content.sections.story ? (
            <AccordionPanel
              id="story"
              title="Історія"
              open={Boolean(openPanels.story)}
              onToggle={togglePanel}
            >
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Заголовок історії
                </span>
                <input
                  value={content.storyTitle}
                  onChange={(e) => patchContent("storyTitle", e.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Текст історії
                </span>
                <textarea
                  rows={4}
                  value={content.storyBody}
                  onChange={(e) => patchContent("storyBody", e.target.value)}
                  className={fieldClass}
                />
              </label>
            </AccordionPanel>
          ) : null}

          {content.sections.gallery ? (
            <AccordionPanel
              id="gallery"
              title="Gallery"
              open={Boolean(openPanels.gallery)}
              onToggle={togglePanel}
            >
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Заголовок галереї
                </span>
                <input
                  value={content.galleryTitle}
                  onChange={(e) => patchContent("galleryTitle", e.target.value)}
                  className={fieldClass}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {(content.galleryImages ?? []).map((url) => (
                  <div
                    key={url}
                    className="relative size-16 overflow-hidden border"
                  >
                    <img src={url} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        patchContent(
                          "galleryImages",
                          content.galleryImages.filter((u) => u !== url),
                        )
                      }
                      className="absolute inset-x-0 bottom-0 bg-ink/70 text-[10px] text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={galleryUploading}
                onClick={() => galleryInputRef.current?.click()}
                className="cursor-pointer border border-line px-3 py-2 text-sm"
              >
                {galleryUploading ? "Завантаження…" : "+ Фото в галерею"}
              </button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => void onGalleryFile(e.target.files?.[0])}
              />
            </AccordionPanel>
          ) : null}

          {content.sections.schedule ? (
            <AccordionPanel
              id="schedule"
              title="Програма"
              open={Boolean(openPanels.schedule)}
              onToggle={togglePanel}
            >
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Заголовок програми
                </span>
                <input
                  value={content.scheduleTitle}
                  onChange={(e) =>
                    patchContent("scheduleTitle", e.target.value)
                  }
                  className={fieldClass}
                />
              </label>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm text-ink-soft">Пункти програми</p>
                <button
                  type="button"
                  onClick={() =>
                    patchContent("scheduleItems", [
                      ...content.scheduleItems,
                      { time: "", title: "", detail: "" },
                    ])
                  }
                  className="cursor-pointer text-sm font-medium text-sage"
                >
                  + Додати
                </button>
              </div>
              <div className="space-y-3">
                {content.scheduleItems.map((item, index) => (
                  <div
                    key={`schedule-${index}`}
                    className="grid gap-2 border border-line p-3"
                  >
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <input
                        value={item.time}
                        onChange={(e) =>
                          patchSchedule(index, { time: e.target.value })
                        }
                        placeholder="15:00"
                        className={fieldClass}
                      />
                      <input
                        value={item.title}
                        onChange={(e) =>
                          patchSchedule(index, { title: e.target.value })
                        }
                        placeholder="Назва"
                        className={fieldClass}
                      />
                    </div>
                    <input
                      value={item.detail}
                      onChange={(e) =>
                        patchSchedule(index, { detail: e.target.value })
                      }
                      placeholder="Деталі"
                      className={fieldClass}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patchContent(
                          "scheduleItems",
                          content.scheduleItems.filter((_, i) => i !== index),
                        )
                      }
                      className="justify-self-start text-xs text-ink-soft hover:text-red-700"
                    >
                      Видалити
                    </button>
                  </div>
                ))}
              </div>
            </AccordionPanel>
          ) : null}

          {content.sections.dressCode ? (
            <AccordionPanel
              id="dressCode"
              title="Дрес-код"
              open={Boolean(openPanels.dressCode)}
              onToggle={togglePanel}
            >
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Заголовок дрес-коду
                </span>
                <input
                  value={content.dressCodeTitle}
                  onChange={(e) =>
                    patchContent("dressCodeTitle", e.target.value)
                  }
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Текст дрес-коду
                </span>
                <textarea
                  rows={3}
                  value={content.dressCodeBody}
                  onChange={(e) =>
                    patchContent("dressCodeBody", e.target.value)
                  }
                  className={fieldClass}
                />
              </label>
            </AccordionPanel>
          ) : null}

          {content.sections.qa ? (
            <AccordionPanel
              id="qa"
              title="Q + A"
              open={Boolean(openPanels.qa)}
              onToggle={togglePanel}
            >
              <ListEditor
                title="Питання"
                titleValue={content.qaTitle}
                onTitle={(v) => patchContent("qaTitle", v)}
                items={content.qaItems}
                onChange={(qaItems) => patchContent("qaItems", qaItems)}
                empty={() => ({ question: "", answer: "" })}
                render={(item, _i, update) => (
                  <>
                    <input
                      value={item.question}
                      onChange={(e) => update({ question: e.target.value })}
                      placeholder="Питання"
                      className={fieldClass}
                    />
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => update({ answer: e.target.value })}
                      placeholder="Відповідь"
                      className={fieldClass}
                    />
                  </>
                )}
              />
            </AccordionPanel>
          ) : null}

          {content.sections.travel ? (
            <AccordionPanel
              id="travel"
              title="Travel"
              open={Boolean(openPanels.travel)}
              onToggle={togglePanel}
            >
              <ListEditor
                title="Travel"
                titleValue={content.travelTitle}
                onTitle={(v) => patchContent("travelTitle", v)}
                bodyValue={content.travelBody}
                onBody={(v) => patchContent("travelBody", v)}
                items={content.travelItems}
                onChange={(travelItems) =>
                  patchContent("travelItems", travelItems)
                }
                empty={() => ({ title: "", detail: "" })}
                render={(item, _i, update) => (
                  <>
                    <input
                      value={item.title}
                      onChange={(e) => update({ title: e.target.value })}
                      placeholder="Назва"
                      className={fieldClass}
                    />
                    <input
                      value={item.detail}
                      onChange={(e) => update({ detail: e.target.value })}
                      placeholder="Деталі"
                      className={fieldClass}
                    />
                  </>
                )}
              />
            </AccordionPanel>
          ) : null}

          {content.sections.registry ? (
            <AccordionPanel
              id="registry"
              title="Registry"
              open={Boolean(openPanels.registry)}
              onToggle={togglePanel}
            >
              <ListEditor
                title="Registry"
                titleValue={content.registryTitle}
                onTitle={(v) => patchContent("registryTitle", v)}
                bodyValue={content.registryBody}
                onBody={(v) => patchContent("registryBody", v)}
                items={content.registryItems}
                onChange={(registryItems) =>
                  patchContent("registryItems", registryItems)
                }
                empty={() => ({ title: "", url: "", detail: "" })}
                render={(item, _i, update) => (
                  <>
                    <input
                      value={item.title}
                      onChange={(e) => update({ title: e.target.value })}
                      placeholder="Назва"
                      className={fieldClass}
                    />
                    <input
                      value={item.url}
                      onChange={(e) => update({ url: e.target.value })}
                      placeholder="https://…"
                      className={fieldClass}
                    />
                    <input
                      value={item.detail}
                      onChange={(e) => update({ detail: e.target.value })}
                      placeholder="Опис"
                      className={fieldClass}
                    />
                  </>
                )}
              />
            </AccordionPanel>
          ) : null}

          {content.sections.rsvp ? (
            <AccordionPanel
              id="rsvp"
              title="Запрошення"
              open={Boolean(openPanels.rsvp)}
              onToggle={togglePanel}
            >
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Заголовок запрошення
                </span>
                <input
                  value={content.rsvpTitle}
                  onChange={(e) => patchContent("rsvpTitle", e.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Текст запрошення
                </span>
                <textarea
                  rows={3}
                  value={content.rsvpBody}
                  onChange={(e) => patchContent("rsvpBody", e.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">
                  Посилання на запрошення
                </span>
                <input
                  value={content.rsvpUrl}
                  onChange={(e) => patchContent("rsvpUrl", e.target.value)}
                  placeholder="/rsvp/TOKEN або https://…"
                  className={fieldClass}
                />
                <span className="mt-1 block text-xs text-ink-soft">
                  Встав персональний лінк гостя з розділу Гості, або загальний
                  URL форми.
                </span>
              </label>
            </AccordionPanel>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer bg-sage px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LoadingButtonLabel loading={saving} loadingText="Зберігаємо…">
              Зберегти
            </LoadingButtonLabel>
          </button>
        </div>

        <div className="order-1 min-w-0 border border-line bg-mist/40 p-3 sm:p-4 md:p-6 xl:order-2 xl:sticky xl:top-4 xl:self-start">
          <SitePreview
            templateId={templateId}
            content={content}
            published={published}
            mode={previewMode}
            onModeChange={setPreviewMode}
          />
        </div>
      </form>
    </>
  );
}

function ListEditor<T extends object>({
  title,
  titleValue,
  onTitle,
  bodyValue,
  onBody,
  items,
  onChange,
  empty,
  render,
}: {
  title: string;
  titleValue: string;
  onTitle: (v: string) => void;
  bodyValue?: string;
  onBody?: (v: string) => void;
  items: T[];
  onChange: (items: T[]) => void;
  empty: () => T;
  render: (
    item: T,
    index: number,
    update: (patch: Partial<T>) => void,
  ) => ReactNode;
}) {
  return (
    <div className="border-t border-line pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {title}
      </p>
      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-ink-soft">Заголовок</span>
        <input
          value={titleValue}
          onChange={(e) => onTitle(e.target.value)}
          className={fieldClass}
        />
      </label>
      {onBody ? (
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-ink-soft">Текст</span>
          <textarea
            rows={2}
            value={bodyValue}
            onChange={(e) => onBody(e.target.value)}
            className={fieldClass}
          />
        </label>
      ) : null}
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => onChange([...items, empty()])}
          className="cursor-pointer text-sm font-medium text-sage"
        >
          + Додати
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-2 border border-line p-3">
            {render(item, index, (patch) =>
              onChange(
                items.map((row, i) =>
                  i === index ? { ...row, ...patch } : row,
                ),
              ),
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="justify-self-start text-xs text-ink-soft hover:text-red-700"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebsiteEditorPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <WebsiteEditorInner />
        </div>
      </section>
    </RequireAuth>
  );
}
