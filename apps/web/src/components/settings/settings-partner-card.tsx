"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { IconTrash } from "@/components/icon-trash";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";

export type PartnerInviteStatus =
  | "form"
  | "pending"
  | "confirmed"
  | "rejected";

export type PartnerInviteInfo = {
  name: string;
  email: string;
};

type Props = {
  status: PartnerInviteStatus;
  partner: PartnerInviteInfo | null;
  busy?: boolean;
  onSendInvite: (input: { name: string; email: string }) => Promise<void> | void;
  onResend: () => Promise<void> | void;
  onSendOtherEmail: () => void;
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

function IconBadgeClose() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M2 2l6 6M8 2 2 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBadgeClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M6 3.75V6l1.5 1.25"
        stroke="currentColor"
        strokeWidth="1.3"
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
  onSendInvite,
  onResend,
  onSendOtherEmail,
  onRemove,
}: Props) {
  const [name, setName] = useState(partner?.name ?? "");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (status !== "form") return;
    if (partner?.name) setName(partner.name);
    if (partner?.email) setEmail(partner.email);
  }, [status, partner?.name, partner?.email]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSendInvite({ name: name.trim(), email: email.trim() });
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="roman@example.com"
            required
          />
          <div className="cabinet-settings-card-actions">
            <Button
              type="submit"
              tone="outline"
              size="s"
              loading={busy}
              className="cabinet-settings-btn-invite"
            >
              Відправити запрошення
            </Button>
          </div>
        </form>
      ) : null}

      {status === "pending" && partner ? (
        <PartnerRow
          partner={partner}
          busy={busy}
          removeLabel="Скасувати запрошення"
          onRemove={() => void onRemove()}
          badge={
            <span className="cabinet-settings-partner-badge cabinet-settings-partner-badge--pending">
              <IconBadgeClock />
              Очікує підтвердження
            </span>
          }
        />
      ) : null}

      {status === "confirmed" && partner ? (
        <PartnerRow
          partner={partner}
          busy={busy}
          removeLabel="Видалити партнера"
          onRemove={() => void onRemove()}
          badge={
            <span className="cabinet-settings-partner-badge cabinet-settings-partner-badge--ok">
              <IconBadgeCheck />
              Підтверджено
            </span>
          }
        />
      ) : null}

      {status === "rejected" && partner ? (
        <>
          <PartnerRow
            partner={partner}
            busy={busy}
            removeLabel="Видалити запрошення"
            onRemove={() => void onRemove()}
            badge={
              <span className="cabinet-settings-partner-badge cabinet-settings-partner-badge--no">
                <IconBadgeClose />
                Відмова
              </span>
            }
          />
          <div className="cabinet-settings-card-actions">
            <Button
              type="button"
              tone="ghost"
              size="s"
              loading={busy}
              onClick={() => void onResend()}
            >
              Відправити ще раз
            </Button>
            <Button
              type="button"
              tone="accent"
              size="s"
              className="cabinet-settings-btn-accent"
              disabled={busy}
              onClick={onSendOtherEmail}
            >
              Відправити на інший email
            </Button>
          </div>
        </>
      ) : null}
    </section>
  );
}
