"use client";

import Link from "next/link";
import { IconBack } from "@/components/website/editor/website-editor-icons";

type AutosaveState = "saved" | "saving" | "error";

type Props = {
  autosave: AutosaveState;
  publishing: boolean;
  onPublish: () => void;
};

const AUTOSAVE_LABEL: Record<AutosaveState, string> = {
  saved: "Авто-збереження",
  saving: "Зберігаємо…",
  error: "Помилка збереження",
};

export function WebsiteEditorHeader({
  autosave,
  publishing,
  onPublish,
}: Props) {
  return (
    <header className="we-header">
      <div className="we-header__left">
        <Link href="/website" className="we-header__back" aria-label="Назад">
          <IconBack />
        </Link>
        <Link href="/dashboard" className="we-header__brand">
          fata.studi<span className="we-header__brand-dot">o</span>
        </Link>
      </div>
      <div className="we-header__right">
        <span className="we-header__autosave">
          <span
            className={`we-header__autosave-dot${
              autosave === "saving"
                ? " we-header__autosave-dot--pending"
                : autosave === "error"
                  ? " we-header__autosave-dot--error"
                  : ""
            }`}
          />
          {AUTOSAVE_LABEL[autosave]}
        </span>
        <button
          type="button"
          className="we-header__publish"
          disabled={publishing}
          onClick={onPublish}
        >
          {publishing ? "Публікуємо…" : "Опублікувати"}
        </button>
      </div>
    </header>
  );
}
