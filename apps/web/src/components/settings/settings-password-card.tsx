"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";

type Props = {
  busy?: boolean;
  onSubmit: (input: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
};

export function SettingsPasswordCard({ busy = false, onSubmit }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError("Новий пароль має бути щонайменше 8 символів");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }
    await onSubmit({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <section
      className="cabinet-settings-card"
      aria-labelledby="settings-password-title"
    >
      <h3 id="settings-password-title" className="cabinet-settings-card-title">
        Зміна пароля
      </h3>
      <form
        className="cabinet-settings-fields"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <TextInput
          label="Поточний пароль"
          size="m"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <TextInput
          label="Новий пароль"
          size="m"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Введіть новий пароль"
          required
        />
        <TextInput
          label="Підтвердження пароля"
          size="m"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Повторіть пароль"
          required
        />
        {error ? (
          <p className="cabinet-settings-stub" role="alert">
            {error}
          </p>
        ) : null}
        <div className="cabinet-settings-card-actions">
          <Button type="submit" tone="ghost" size="s" loading={busy}>
            Змінити пароль
          </Button>
        </div>
      </form>
    </section>
  );
}
