"use client";

import type { ReactNode } from "react";
import { Button, type ButtonTone } from "@/components/ui/button";

export type CabinetFormActionsProps = {
  onCancel: () => void;
  cancelLabel?: ReactNode;
  cancelDisabled?: boolean;
  cancelClassName?: string;
  saveLabel?: ReactNode;
  /** Default `ink`. Guests / checklist / inspiration often use `black`. */
  saveTone?: Extract<ButtonTone, "ink" | "black">;
  saveType?: "submit" | "button";
  /** Used when `saveType="button"` */
  onSave?: () => void;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  saveLoadingText?: string;
  saveClassName?: string;
};

export function CabinetFormActions({
  onCancel,
  cancelLabel = "Скасувати",
  cancelDisabled,
  cancelClassName = "cabinet-drawer-cancel",
  saveLabel = "Зберегти",
  saveTone = "ink",
  saveType = "submit",
  onSave,
  saveDisabled,
  saveLoading,
  saveLoadingText,
  saveClassName = "cabinet-drawer-save",
}: CabinetFormActionsProps) {
  return (
    <>
      <Button
        type="button"
        tone="ghost"
        size="m"
        className={cancelClassName || undefined}
        onClick={onCancel}
        disabled={cancelDisabled}
      >
        {cancelLabel}
      </Button>
      <Button
        type={saveType}
        tone={saveTone}
        size="m"
        className={saveClassName || undefined}
        disabled={saveDisabled}
        loading={saveLoading}
        loadingText={saveLoadingText}
        onClick={saveType === "button" ? onSave : undefined}
      >
        {saveLabel}
      </Button>
    </>
  );
}
