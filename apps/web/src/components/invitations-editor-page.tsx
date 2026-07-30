"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { InvitationCard } from "@/components/invitation-card";
import { RequireAuth } from "@/components/require-auth";
import { PageLoader, LoadingButtonLabel } from "@/components/ui-loader";
import { uploadFile } from "@/lib/client-api";
import { INVITATION_THEMES } from "@/lib/invitation-themes";
import {
  getMyInvitation,
  normalizeInvitationContent,
  upsertMyInvitation,
  type InvitationContent,
  type InvitationMineResponse,
} from "@/lib/invitations-api";
import { getErrorMessage, toast } from "@/lib/toast";

const fieldClass =
  "w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-sage";

/* eslint-disable @next/next/no-img-element */
function CoverField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange(res.url);
    } catch (err) {
      toast.error("Не вдалось завантажити", getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm text-ink-soft">Обкладинка</span>
      {value ? (
        <div className="relative mb-3 aspect-[5/4] max-w-xs overflow-hidden border border-line">
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border border-line bg-white px-3 py-2 text-sm text-ink transition hover:border-sage/40 hover:bg-mist disabled:opacity-50"
        >
          {uploading ? "Завантажуємо…" : value ? "Змінити фото" : "Додати фото"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="cursor-pointer border border-line px-3 py-2 text-sm text-ink-soft hover:bg-mist"
          >
            Прибрати
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
    </div>
  );
}

function InvitationsEditorInner() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<InvitationMineResponse | null>(null);
  const [templateId, setTemplateId] = useState("sage-linen");
  const [content, setContent] = useState<InvitationContent>(
    normalizeInvitationContent(null),
  );
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const res = await getMyInvitation();
        setData(res);
        setTemplateId(res.invitation.templateId);
        setContent(
          normalizeInvitationContent(res.invitation.content, {
            headline: res.wedding.coupleName,
            dateLabel: new Intl.DateTimeFormat("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(res.wedding.date)),
            address: res.wedding.city,
          }),
        );
      } catch (err) {
        toast.error("Не вдалось завантажити", getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function patch<K extends keyof InvitationContent>(
    key: K,
    value: InvitationContent[K],
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave(e?: FormEvent) {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await upsertMyInvitation({ templateId, content });
      setContent(normalizeInvitationContent(res.invitation.content));
      setTemplateId(res.invitation.templateId);
      toast.success("Збережено", "Запрошення оновлено");
    } catch (err) {
      toast.error("Помилка", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function copyGuestLink(token: string, name: string) {
    const url = `${origin}/rsvp/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Скопійовано", `Запрошення для ${name}`);
    } catch {
      toast.error("Не вдалось скопіювати");
    }
  }

  if (loading || !data) {
    return <PageLoader label="Завантажуємо запрошення…" />;
  }

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Запрошення
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            Обери стиль і текст — гості побачать листівку за персональним
            лінком. Роздача — у розділі Гості.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/guests"
            className="border border-line bg-white px-4 py-2.5 text-sm text-ink-soft transition hover:border-sage/40 hover:bg-mist hover:text-ink"
          >
            До гостей
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => void onSave()}
            className="cursor-pointer bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-deep disabled:opacity-60"
          >
            <LoadingButtonLabel loading={saving}>Зберегти</LoadingButtonLabel>
          </button>
        </div>
      </div>

      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <form
          onSubmit={(e) => void onSave(e)}
          className="order-2 min-w-0 space-y-6 lg:order-1"
        >
          <section className="border border-line bg-white p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              Темплейт
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {INVITATION_THEMES.map((theme) => {
                const selected = templateId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setTemplateId(theme.id)}
                    className={`cursor-pointer border p-3 text-left transition ${
                      selected
                        ? "border-sage bg-sage/10"
                        : "border-line hover:border-sage/40"
                    }`}
                  >
                    <div
                      className="mb-3 h-14 border"
                      style={{
                        background: theme.colors.bg,
                        borderColor: theme.colors.line,
                      }}
                    />
                    <p className="font-[family-name:var(--font-display)] text-base text-ink">
                      {theme.name}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4 border border-line bg-white p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              Текст
            </p>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Імена</span>
              <input
                value={content.headline}
                onChange={(e) => patch("headline", e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Відкриття</span>
              <input
                value={content.opener}
                onChange={(e) => patch("opener", e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Текст</span>
              <textarea
                rows={3}
                value={content.body}
                onChange={(e) => patch("body", e.target.value)}
                className={fieldClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">Дата</span>
                <input
                  value={content.dateLabel}
                  onChange={(e) => patch("dateLabel", e.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-ink-soft">Час</span>
                <input
                  value={content.timeLabel}
                  onChange={(e) => patch("timeLabel", e.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Місце</span>
              <input
                value={content.venue}
                onChange={(e) => patch("venue", e.target.value)}
                placeholder="Назва локації"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Адреса</span>
              <input
                value={content.address}
                onChange={(e) => patch("address", e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">Дрес-код</span>
              <input
                value={content.dressCode}
                onChange={(e) => patch("dressCode", e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink-soft">
                Нотатка про підтвердження
              </span>
              <textarea
                rows={2}
                value={content.rsvpNote}
                onChange={(e) => patch("rsvpNote", e.target.value)}
                className={fieldClass}
              />
            </label>
            <CoverField
              value={content.coverImageUrl}
              onChange={(url) => patch("coverImageUrl", url)}
            />
            <label className="flex cursor-pointer items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={content.showWebsiteLink}
                onChange={(e) => patch("showWebsiteLink", e.target.checked)}
                className="mt-0.5 shrink-0"
              />
              <span className="min-w-0 leading-snug">
                Показувати лінк на весільний сайт
                {!data.website ? (
                  <span className="text-ink-soft">
                    {" "}
                    (спочатку опублікуй{" "}
                    <Link href="/website" className="underline">
                      сайт
                    </Link>
                    )
                  </span>
                ) : null}
              </span>
            </label>
          </section>

          <section className="border border-line bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                Роздати гостям
              </p>
              <Link
                href="/guests"
                className="text-sm text-sage-deep underline-offset-4 hover:underline"
              >
                Усі гості →
              </Link>
            </div>
            {data.guestsPreview.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">
                Додай гостей у списку — кожному зʼявиться персональний лінк.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.guestsPreview.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-3 border-b border-line/70 py-2 last:border-0"
                  >
                    <span className="min-w-0 truncate text-sm text-ink">
                      {g.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => void copyGuestLink(g.inviteToken, g.name)}
                      className="shrink-0 cursor-pointer text-xs font-medium uppercase tracking-[0.12em] text-sage-deep hover:underline"
                    >
                      Копіювати лінк
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-ink-soft">
              Усього гостей: {data.guestsTotal}
            </p>
          </section>
        </form>

        <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-soft">
            Превʼю листівки
          </p>
          <div
            className="overflow-hidden border border-line shadow-sm"
            style={{
              background: INVITATION_THEMES.find((t) => t.id === templateId)
                ?.colors.bg,
            }}
          >
            <InvitationCard
              templateId={templateId}
              content={content}
              guestName="Олени"
              websiteUrl={data.website?.url ?? null}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function InvitationsEditorPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <InvitationsEditorInner />
        </div>
      </section>
    </RequireAuth>
  );
}
