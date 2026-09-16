"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { PageLoader } from "@/components/ui-loader";
import {
  DESIGN_OPTIONS,
  designIdFromTemplate,
  type DesignOption,
} from "@/components/website/editor/design-catalog";
import { WebsiteEditorContentTab } from "@/components/website/editor/website-editor-content-tab";
import { WebsiteEditorDesignTab } from "@/components/website/editor/website-editor-design-tab";
import { WebsiteEditorHeader } from "@/components/website/editor/website-editor-header";
import {
  WebsiteEditorNav,
  type EditorTab,
} from "@/components/website/editor/website-editor-nav";
import {
  WebsiteEditorPreview,
  type PreviewMode,
} from "@/components/website/editor/website-editor-preview";
import { WebsiteEditorSettingsTab } from "@/components/website/editor/website-editor-settings-tab";
import { normalizeWebsiteContent } from "@/lib/normalize-website-content";
import { getErrorMessage, toast } from "@/lib/toast";
import {
  getMyWebsite,
  upsertMyWebsite,
  type WebsiteContent,
  type WeddingWebsite,
} from "@/lib/website-api";
import "@/app/website/styles/editor/index.scss";

type AutosaveState = "saved" | "saving" | "error";

type PendingSave = {
  templateId?: string;
  content?: WebsiteContent;
  slug?: string;
};

function splitHeadline(headline: string): [string, string] {
  const parts = headline.split(/\s+(?:та|and|&)\s+/i);
  if (parts.length >= 2) {
    return [parts[0].trim(), parts.slice(1).join(" ").trim()];
  }
  return [headline.trim(), ""];
}

function joinNames(bride: string, groom: string) {
  const a = bride.trim();
  const b = groom.trim();
  if (a && b) return `${a} та ${b}`;
  return a || b;
}

function WebsiteEditorInner() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [site, setSite] = useState<WeddingWebsite | null>(null);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [slug, setSlug] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [designId, setDesignId] = useState(DESIGN_OPTIONS[0].id);
  const [templateId, setTemplateId] = useState(DESIGN_OPTIONS[0].templateId);
  const [tab, setTab] = useState<EditorTab>("design");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [autosave, setAutosave] = useState<AutosaveState>("saved");
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [origin, setOrigin] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSave = useRef<PendingSave>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyWebsite();
      if (!res.site) {
        setSite(null);
        setContent(null);
        return;
      }
      const normalized = normalizeWebsiteContent(res.site.content, res.defaults);
      setSite(res.site);
      setContent(normalized);
      setSlug(res.site.slug);
      setTemplateId(res.site.templateId);
      setDesignId(designIdFromTemplate(res.site.templateId));
      const [bride, groom] = splitHeadline(
        normalized.headline ||
          `${res.site.wedding.partnerOneName} та ${res.site.wedding.partnerTwoName}`,
      );
      setBrideName(bride || res.site.wedding.partnerOneName);
      setGroomName(groom || res.site.wedding.partnerTwoName);
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалось відкрити редактор"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function queueSave(patch: PendingSave) {
    pendingSave.current = { ...pendingSave.current, ...patch };
    setAutosave("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void (async () => {
        const payload = pendingSave.current;
        pendingSave.current = {};
        try {
          const updated = await upsertMyWebsite(payload);
          setSite(updated);
          setSlug(updated.slug);
          setContent(normalizeWebsiteContent(updated.content));
          setAutosave("saved");
        } catch {
          setAutosave("error");
          toast.error("Не вдалось зберегти зміни");
        }
      })();
    }, 450);
  }

  function onSelectDesign(option: DesignOption) {
    setDesignId(option.id);
    setTemplateId(option.templateId);
    queueSave({ templateId: option.templateId });
  }

  function onContentChange(next: WebsiteContent) {
    setContent(next);
    queueSave({ content: next });
  }

  function onNamesChange(bride: string, groom: string) {
    setBrideName(bride);
    setGroomName(groom);
    if (!content) return;
    const next = {
      ...content,
      headline: joinNames(bride, groom),
    };
    setContent(next);
    queueSave({ content: next });
  }

  function onSlugChange(nextSlug: string) {
    setSlug(nextSlug);
    if (nextSlug.trim().length < 2) return;
    queueSave({ slug: nextSlug });
  }

  function onDescriptionChange(value: string) {
    if (!content) return;
    const next = { ...content, shareDescription: value };
    setContent(next);
    queueSave({ content: next });
  }

  async function onPublish() {
    setPublishing(true);
    try {
      const updated = await upsertMyWebsite({
        published: true,
        templateId,
        slug: slug.trim() || undefined,
        content: content ?? undefined,
      });
      setSite(updated);
      setSlug(updated.slug);
      setContent(normalizeWebsiteContent(updated.content));
      setAutosave("saved");
      toast.success("Сайт опубліковано");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось опублікувати"));
    } finally {
      setPublishing(false);
    }
  }

  async function onUnpublish() {
    setUnpublishing(true);
    try {
      const updated = await upsertMyWebsite({ published: false });
      setSite(updated);
      setAutosave("saved");
      toast.success("Публікацію скасовано");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось скасувати публікацію"));
    } finally {
      setUnpublishing(false);
    }
  }

  async function copyText(text: string, ok: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(ok);
    } catch {
      toast.error("Не вдалось скопіювати");
    }
  }

  if (loading) {
    return (
      <div className="we-editor">
        <div className="we-editor__loader">
          <PageLoader label="Відкриваємо редактор…" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="we-editor">
        <div className="we-editor__error">
          <p className="we-editor__error-text">{error}</p>
          <button
            type="button"
            className="we-header__publish"
            onClick={() => void load()}
          >
            Спробувати ще
          </button>
        </div>
      </div>
    );
  }

  if (!site || !content) {
    return (
      <div className="we-editor">
        <div className="we-editor__error">
          <p className="we-editor__error-text">
            Спочатку створи сайт на сторінці «Сайт-запрошення».
          </p>
          <Link href="/website" className="we-header__publish">
            До сайту
          </Link>
        </div>
      </div>
    );
  }

  const host = origin.replace(/^https?:\/\//, "") || "fata.studio";
  const publicHref = `${origin}${site.publicPath}`;
  const displayUrl = `${host}${site.publicPath}`;
  const fancyAddress = `${slug || site.slug}.fata.studio`;

  return (
    <div className="we-editor">
      <WebsiteEditorHeader
        autosave={autosave}
        publishing={publishing}
        onPublish={() => void onPublish()}
      />
      <div className="we-editor__body">
        <WebsiteEditorNav active={tab} onChange={setTab} />
        <div className="we-editor__main">
          {tab === "design" ? (
            <WebsiteEditorDesignTab
              selectedId={designId}
              onSelect={onSelectDesign}
            />
          ) : null}
          {tab === "content" ? (
            <WebsiteEditorContentTab
              content={content}
              brideName={brideName}
              groomName={groomName}
              onChange={onContentChange}
              onNamesChange={onNamesChange}
            />
          ) : null}
          {tab === "settings" ? (
            <WebsiteEditorSettingsTab
              slug={slug}
              publicHref={publicHref}
              shareDescription={content.shareDescription}
              published={site.published}
              publishing={publishing}
              unpublishing={unpublishing}
              onSlugChange={onSlugChange}
              onDescriptionChange={onDescriptionChange}
              onCopyAddress={() =>
                void copyText(fancyAddress, "Адресу скопійовано")
              }
              onCopyLink={() => void copyText(publicHref, "Лінк скопійовано")}
              onPublish={() => void onPublish()}
              onUnpublish={() => void onUnpublish()}
              onEditSite={() => setTab("content")}
            />
          ) : null}
          <WebsiteEditorPreview
            mode={previewMode}
            onModeChange={setPreviewMode}
            templateId={templateId}
            content={content}
            displayUrl={displayUrl}
            weddingDate={site.wedding.date}
          />
        </div>
      </div>
    </div>
  );
}

export function WebsiteEditor() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <WebsiteEditorInner />
    </RequireAuth>
  );
}
