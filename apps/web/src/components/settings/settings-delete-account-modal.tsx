"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { TextInput } from "@/components/ui/text-input";

type Props = {
  open: boolean;
  isOwner: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void> | void;
};

export function SettingsDeleteAccountModal({
  open,
  isOwner,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(null);
    }
  }, [open]);

  async function handleConfirm() {
    setError(null);
    if (!password.trim()) {
      setError("Введіть пароль");
      return;
    }
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося видалити");
    }
  }

  const description = isOwner
    ? "Видалення акаунта знищить весілля і всі дані (гості, бюджет, план дня тощо). Цю дію не можна скасувати."
    : "Видалення акаунта прибере ваш доступ і всі повʼязані з акаунтом дані. Цю дію не можна скасувати.";

  return (
    <CabinetOverlay
      open={open}
      onClose={onClose}
      title="Видалити акаунт"
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
            Скасувати
          </Button>
          <Button
            type="button"
            tone="ink"
            size="m"
            className="cabinet-confirm-modal__confirm"
            loading={loading}
            loadingText="…"
            onClick={() => void handleConfirm()}
          >
            Видалити акаунт
          </Button>
        </>
      }
    >
      <p className="cabinet-confirm-modal__text">{description}</p>
      <div className="cabinet-settings-delete-password">
        <TextInput
          label="Пароль"
          size="m"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleConfirm();
            }
          }}
        />
        {error ? (
          <p className="cabinet-settings-stub" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </CabinetOverlay>
  );
}
