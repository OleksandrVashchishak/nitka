"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/client-api";
import { LoadingButtonLabel } from "@/components/ui-loader";
import { toast } from "@/lib/toast";

type Props = {
  urls: string[];
  onChange: (urls: string[]) => void;
};

export function PhotoUploader({ urls, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const next = [...urls];
      for (const file of Array.from(files)) {
        const uploaded = await uploadFile(file);
        next.push(uploaded.url);
      }
      onChange(next);
      toast.success(
        files.length > 1 ? "Фото завантажено" : "Фото завантажено",
        files.length > 1 ? `${files.length} файли` : undefined,
      );
    } catch {
      /* api toast */
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          <LoadingButtonLabel loading={uploading} loadingText="Завантажуємо…">
            Завантажити фото
          </LoadingButtonLabel>
        </button>
        <p className="text-xs text-ink-soft">JPEG / PNG / WebP, до 5 МБ</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => void onFiles(e.target.files)}
        />
      </div>

      {urls.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-3 grid-cols-2">
          {urls.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="group relative overflow-hidden rounded-xl border border-line bg-mist"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Фото ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-1 text-xs text-white opacity-90 hover:bg-ink"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-sm text-ink-soft">
          Додай хоча б одне фото — профіль виглядає живіше.
        </p>
      )}
    </div>
  );
}
