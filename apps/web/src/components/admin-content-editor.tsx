"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { ContentEditor } from "@/components/content-editor";
import { CityAutocomplete } from "@/components/city-autocomplete";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import { PhotoUploader } from "@/components/photo-uploader";
import {
  createAdminContentPost,
  getAdminContentPost,
  getAdminContentTopics,
  updateAdminContentPost,
  type AdminContentTopic,
} from "@/lib/admin-content-api";
import type {
  ContentKind,
  ContentStatus,
  EditorJsBody,
} from "@/lib/content-api";
import { getCategories, type Category } from "@/lib/api";
import { slugify } from "@/lib/slugify";

type Props = {
  postId?: string;
};

function AdminContentEditorInner({ postId }: Props) {
  const router = useRouter();
  const isNew = !postId || postId === "new";
  const getBodyRef = useRef<(() => Promise<EditorJsBody>) | null>(null);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [topics, setTopics] = useState<AdminContentTopic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [initialBody, setInitialBody] = useState<EditorJsBody | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [kind, setKind] = useState<ContentKind>("ARTICLE");
  const [status, setStatus] = useState<ContentStatus>("DRAFT");
  const [topicId, setTopicId] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [city, setCity] = useState("");
  const [vendorCategorySlug, setVendorCategorySlug] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    void (async () => {
      const [topicList, cats] = await Promise.all([
        getAdminContentTopics(),
        getCategories().catch(() => [] as Category[]),
      ]);
      setTopics(topicList);
      setCategories(cats);
      if (!topicId && topicList[0]) setTopicId(topicList[0].id);

      if (!isNew && postId) {
        const post = await getAdminContentPost(postId);
        setTitle(post.title);
        setSlug(post.slug);
        setSlugTouched(true);
        setExcerpt(post.excerpt);
        setCoverUrl(post.coverUrl || "");
        setKind(post.kind);
        setStatus(post.status);
        setTopicId(post.topicId);
        setSeoTitle(post.seoTitle);
        setSeoDescription(post.seoDescription);
        setOgImageUrl(post.ogImageUrl || "");
        setCity(post.city || "");
        setVendorCategorySlug(post.vendorCategorySlug || "");
        setFeatured(post.featured);
        setInitialBody(post.body);
        setEditorKey((k) => k + 1);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isNew]);

  async function onSubmit(e: FormEvent, nextStatus?: ContentStatus) {
    e.preventDefault();
    if (!topicId) return;
    setSaving(true);
    try {
      const body = getBodyRef.current
        ? await getBodyRef.current()
        : initialBody || { blocks: [] };
      const payload = {
        title,
        slug: slug.trim() || undefined,
        excerpt,
        coverUrl: coverUrl || null,
        kind,
        status: nextStatus ?? status,
        body,
        seoTitle,
        seoDescription,
        ogImageUrl: ogImageUrl || null,
        city: city || null,
        vendorCategorySlug: vendorCategorySlug || null,
        featured,
        topicId,
      };

      if (isNew) {
        const created = await createAdminContentPost(payload);
        router.replace(`/admin/content/${created.id}`);
      } else if (postId) {
        await updateAdminContentPost(postId, payload);
        setStatus(payload.status ?? status);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/content"
            className="text-sm text-ink-soft hover:text-sage-deep"
          >
            ← До списку
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-ink">
            {isNew ? "Новий матеріал" : "Редактор"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={(e) => void onSubmit(e, "DRAFT")}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            Зберегти чернетку
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={(e) => void onSubmit(e, "PUBLISHED")}
            className="rounded-full bg-sage px-4 py-2 text-sm font-medium text-white hover:bg-sage-deep disabled:opacity-60"
          >
            Опублікувати
          </button>
        </div>
      </div>

      <form className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]" onSubmit={(e) => void onSubmit(e)}>
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-ink-soft">Заголовок</span>
            <input
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) {
                  setSlug(slugify(e.target.value));
                }
              }}
              className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-lg"
            />
          </label>

          <label className="block">
            <span className="text-sm text-ink-soft">Slug (URL)</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-ink-soft">/content/{slug || "…"}</p>
          </label>

          <label className="block">
            <span className="text-sm text-ink-soft">Короткий опис</span>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm"
            />
          </label>

          <div>
            <p className="mb-2 text-sm text-ink-soft">Контент (EditorJS)</p>
            <ContentEditor
              key={editorKey}
              initial={initialBody}
              onReady={(getData) => {
                getBodyRef.current = getData;
              }}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">Налаштування</p>
            <label className="mt-3 block">
              <span className="text-xs text-ink-soft">Тип</span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as ContentKind)}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
              >
                <option value="ARTICLE">Стаття</option>
                <option value="GUIDE">Гайд</option>
                <option value="LANDING">SEO-лендінг</option>
              </select>
            </label>
            <label className="mt-3 block">
              <span className="text-xs text-ink-soft">Топік</span>
              <select
                required
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured на хабі
            </label>
            <p className="mt-3 text-xs text-ink-soft">Статус: {status}</p>
          </div>

          {(kind === "LANDING" || city || vendorCategorySlug) && (
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="text-sm font-semibold text-ink">Підрядники на сторінці</p>
              <label className="mt-3 block">
                <span className="text-xs text-ink-soft">Місто</span>
                <div className="mt-1">
                  <CityAutocomplete value={city} onChange={setCity} />
                </div>
              </label>
              <label className="mt-3 block">
                <span className="text-xs text-ink-soft">Категорія каталогу</span>
                <select
                  value={vendorCategorySlug}
                  onChange={(e) => setVendorCategorySlug(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">SEO</p>
            <label className="mt-3 block">
              <span className="text-xs text-ink-soft">SEO title</span>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
                placeholder="Авто з заголовка при publish"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-xs text-ink-soft">SEO description</span>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-xs text-ink-soft">OG image URL</span>
              <input
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">Обкладинка</p>
            <div className="mt-3">
              <PhotoUploader
                urls={coverUrl ? [coverUrl] : []}
                onChange={(urls) => setCoverUrl(urls[urls.length - 1] || "")}
              />
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export function AdminContentEditor({ postId }: Props) {
  return (
    <RequireAuth roles={["ADMIN"]}>
      <AdminContentEditorInner postId={postId} />
    </RequireAuth>
  );
}
