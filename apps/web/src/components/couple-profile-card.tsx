"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { uploadFile } from "@/lib/client-api";

type Props = {
  partnerOneName: string;
  partnerTwoName: string;
  photoUrl: string | null;
  daysLeft: number;
  onSave: (profile: {
    partnerOneName: string;
    partnerTwoName: string;
    couplePhotoUrl: string | null;
  }) => Promise<void>;
};

export function CoupleProfileCard({
  partnerOneName,
  partnerTwoName,
  photoUrl,
  daysLeft,
  onSave,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [first, setFirst] = useState(partnerOneName);
  const [second, setSecond] = useState(partnerTwoName);
  const [photo, setPhoto] = useState<string | null>(photoUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFirst(partnerOneName);
    setSecond(partnerTwoName);
    setPhoto(photoUrl);
  }, [partnerOneName, partnerTwoName, photoUrl]);

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file);
      setPhoto(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Фото не завантажено");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        partnerOneName: first.trim(),
        partnerTwoName: second.trim(),
        couplePhotoUrl: photo,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Профіль не збережено");
    } finally {
      setSaving(false);
    }
  }

  const initials = `${first.trim()[0] ?? "♡"}${second.trim()[0] ?? ""}`;

  function daysLabel(days: number) {
    if (days === 0) return "Ваш день сьогодні!";
    if (days < 0) return "Ваша історія вже почалась";
    const n = Math.abs(days);
    const mod10 = n % 10;
    const mod100 = n % 100;
    let unit = "днів";
    if (mod10 === 1 && mod100 !== 11) unit = "день";
    else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
      unit = "дні";
    return `${n} ${unit} до вашого дня`;
  }

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-line bg-white">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center md:p-7">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-mist bg-sage/10 font-[family-name:var(--font-display)] text-3xl text-sage-deep md:size-28"
          aria-label="Змінити фото пари"
        >
          {photo ? (
            <span
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${photo}")` }}
            />
          ) : (
            initials
          )}
          <span className="absolute inset-x-0 bottom-0 bg-ink/65 py-1 text-center text-[10px] font-sans text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            {uploading ? "Завантаження..." : "Змінити"}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
            Ваше весілля
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            {first || "Партнер 1"} <span className="text-sage">♡</span>{" "}
            {second || "Партнер 2"}
          </h1>
          <p className="mt-2 text-ink-soft">{daysLabel(daysLeft)}</p>
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </div>

        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="self-start rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-sage/40 sm:self-center"
        >
          {editing ? "Закрити" : "Редагувати"}
        </button>
      </div>

      {editing ? (
        <form
          onSubmit={submit}
          className="grid gap-3 border-t border-line bg-mist/60 p-5 sm:grid-cols-[1fr_1fr_auto] md:px-7"
        >
          <input
            required
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder="Ім’я партнера 1"
            className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
          />
          <input
            required
            value={second}
            onChange={(e) => setSecond(e.target.value)}
            placeholder="Ім’я партнера 2"
            className="rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage"
          />
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
          >
            {saving ? "Зберігаємо..." : "Зберегти"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
