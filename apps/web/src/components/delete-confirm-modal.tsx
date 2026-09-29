"use client";

import { Button } from "@/components/ui/button";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";

type DeleteConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Так, видалити",
  cancelLabel = "Скасувати",
  loading = false,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <CabinetOverlay
      open={open}
      onClose={onClose}
      title={title}
      variant="confirm"
      width={710}
      mobileVariant="center"
      closeDisabled={loading}
      closeOnBackdrop={!loading}
      footer={
        <>
          <Button
            type="button"
            tone="ghost"
            size="m"
            className="cabinet-confirm-modal__cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            tone="ink"
            size="m"
            className="cabinet-confirm-modal__confirm"
            loading={loading}
            loadingText="…"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="cabinet-confirm-modal__text">{description}</p>
    </CabinetOverlay>
  );
}
