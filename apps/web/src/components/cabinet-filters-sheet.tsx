"use client";

import { useEffect, type ReactNode } from "react";
import { IconClose } from "@/components/icon-close";
import { IconButton } from "@/components/ui/icon-button";
import {
  OVERLAY_EXIT_MS,
  useOverlayPresence,
} from "@/hooks/use-overlay-presence";

export type CabinetFiltersSheetProps = {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  children: ReactNode;
  title?: string;
  applyLabel?: string;
  resetLabel?: string;
};

export function CabinetFiltersSheet({
  open,
  onClose,
  onApply,
  onReset,
  children,
  title = "Фільтри",
  applyLabel = "Застосувати",
  resetLabel = "Скинути фільтри",
}: CabinetFiltersSheetProps) {
  const { mounted, visible } = useOverlayPresence(
    open,
    OVERLAY_EXIT_MS.drawer,
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`cabinet-tasks-filters-sheet${visible ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="cabinet-tasks-filters-sheet__backdrop"
        aria-label="Закрити фільтри"
        onClick={onClose}
      />
      <div className="cabinet-tasks-filters-sheet__panel">
        <div className="cabinet-tasks-filters-sheet__head">
          <h2 className="cabinet-tasks-filters-sheet__title">{title}</h2>
          <IconButton
            aria-label="Закрити"
            variant="close"
            icon={<IconClose size={18} />}
            onClick={onClose}
          />
        </div>

        <div className="cabinet-tasks-filters-sheet__body">{children}</div>

        <div className="cabinet-tasks-filters-sheet__foot">
          <button
            type="button"
            className="cabinet-tasks-filters-sheet__apply"
            onClick={onApply}
          >
            {applyLabel}
          </button>
          <button
            type="button"
            className="cabinet-tasks-filters-sheet__reset"
            onClick={onReset}
          >
            {resetLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
