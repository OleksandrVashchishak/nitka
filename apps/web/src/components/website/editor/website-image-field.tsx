"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/client-api";
import { getErrorMessage, toast } from "@/lib/toast";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

/* eslint-disable @next/next/no-img-element */
export function WebsiteImageField({ label, value, onChange, hint }: Props) {
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
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="we-blocks__photo">
      <p className="we-blocks__photo-label">{label}</p>
      {hint ? <p className="we-blocks__photo-hint">{hint}</p> : null}
      {value ? (
        <div className="we-blocks__photo-preview">
          <img src={value} alt="" className="we-blocks__photo-img" />
        </div>
      ) : null}
      <div className="we-blocks__photo-actions">
        <button
          type="button"
          className="we-blocks__add"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading
            ? "Стискаємо й завантажуємо…"
            : value
              ? "Змінити фото"
              : "Додати фото"}
        </button>
        {value ? (
          <button
            type="button"
            className="we-blocks__photo-clear"
            disabled={uploading}
            onClick={() => onChange("")}
          >
            Прибрати
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="we-blocks__photo-input"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
    </div>
  );
}
