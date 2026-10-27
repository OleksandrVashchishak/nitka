"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { IconTrash } from "@/components/icon-trash";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";

export type PartnerInviteStatus = "form" | "confirmed";

export type PartnerInviteInfo = {
  name: string;
  email: string;
};

type Props = {
  status: PartnerInviteStatus;
  partner: PartnerInviteInfo | null;
  busy?: boolean;
  onCopyInvite: (input: {
    name: string;
    email: string;
  }) => Promise<void> | void;
  onRemove: () => Promise<void> | void;
};

function IconBadgeCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.2 4.8 8.5 9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PartnerRow({
  partner,
  badge,
  busy,
  onRemove,
  removeLabel,
}: {
  partner: PartnerInviteInfo;
  badge: ReactNode;
  busy?: boolean;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <div className="cabinet-settings-partner-row">
      <div className="cabinet-settings-partner-info">
        <p className="cabinet-settings-partner-name">{partner.name}</p>
        <p className="cabinet-settings-partner-email">{partner.email}</p>
        {badge}
      </div>
      <button
        type="button"
        className="cabinet-settings-partner-delete"
        aria-label={removeLabel}
        disabled={busy}
        onClick={onRemove}
      >
        <IconTrash size={16} />
      </button>
    </div>
  );
}

export function SettingsPartnerCard({
  status,
  partner,
  busy = false,
  onCopyInvite,
  onRemove,
}: Props) {
  const [name, setName] = useState(partner?.name ?? "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (status !== "form") return;
    if (partner?.name) setName(partner.name);
  }, [status, partner?.name]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onCopyInvite({ name: name.trim(), email: inviteEmail.trim() });
  }

  async function handleConfirmRemove() {
    await onRemove();
    setConfirmOpen(false);
  }

  return (
    <section
      className="cabinet-settings-card"
      aria-labelledby="settings-partner-title"
    >
      <h3 id="settings-partner-title" className="cabinet-settings-card-title">
        Запрошення партнера
      </h3>

      {status === "form" ? (
        <form
          className="cabinet-settings-fields"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <TextInput
            label="Ім'я партнера"
            size="m"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Роман"
            required
          />
          <TextInput
            label="Email партнера"
            size="m"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="name@example.com"
            hint="Необов'язково — надішлемо лист із запрошенням"
          />
          <div className="cabinet-settings-card-actions">
            <Button type="submit" tone="ink" size="m" loading={busy}>
              Скопіювати посилання з запрошенням
            </Button>
          </div>
        </form>
      ) : null}

      {status === "confirmed" && partner ? (
        <PartnerRow
          partner={partner}
          busy={busy}
          removeLabel="Видалити партнера"
          onRemove={() => setConfirmOpen(true)}
          badge={
            <span className="cabinet-settings-partner-badge cabinet-settings-partner-badge--ok">
              <IconBadgeCheck />
              Підтверджено
            </span>
          }
        />
      ) : null}

      <DeleteConfirmModal
        open={confirmOpen}
        title="Видалити партнера?"
        description="Партнер втратить доступ до вашого весілля. Цю дію не можна скасувати."
        loading={busy}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmRemove()}
      />
    </section>
  );
}
