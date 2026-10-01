"use client";

import { SettingsPasswordCard } from "@/components/settings/settings-password-card";
import { SettingsPersonalCard } from "@/components/settings/settings-personal-card";
import {
  SettingsPartnerCard,
  type PartnerInviteInfo,
  type PartnerInviteStatus,
} from "@/components/settings/settings-partner-card";

type Props = {
  name: string;
  email: string;
  weddingDate: string;
  partnerStatus: PartnerInviteStatus;
  partner: PartnerInviteInfo | null;
  inviteBusy?: boolean;
  passwordBusy?: boolean;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
  onWeddingDateChange: (value: string) => void;
  onWeddingDateBlur: () => void;
  onPasswordSubmit: (input: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
  onSendInvite: (input: { name: string; email: string }) => Promise<void> | void;
  onResendInvite: () => Promise<void> | void;
  onSendOtherEmail: () => void;
  onRemovePartner: () => Promise<void> | void;
};

export function SettingsProfilePanel({
  name,
  email,
  weddingDate,
  partnerStatus,
  partner,
  inviteBusy = false,
  passwordBusy = false,
  onNameChange,
  onNameBlur,
  onWeddingDateChange,
  onWeddingDateBlur,
  onPasswordSubmit,
  onSendInvite,
  onResendInvite,
  onSendOtherEmail,
  onRemovePartner,
}: Props) {
  return (
    <div className="cabinet-settings-main">
      <header className="cabinet-settings-head">
        <h2 className="cabinet-settings-head-title">Профіль</h2>
        <p className="cabinet-settings-head-text">
          Особисті дані, безпека та спільний доступ до весілля.
        </p>
      </header>

      <SettingsPersonalCard
        name={name}
        email={email}
        weddingDate={weddingDate}
        onNameChange={onNameChange}
        onNameBlur={onNameBlur}
        onWeddingDateChange={onWeddingDateChange}
        onWeddingDateBlur={onWeddingDateBlur}
      />

      <SettingsPasswordCard busy={passwordBusy} onSubmit={onPasswordSubmit} />

      <SettingsPartnerCard
        status={partnerStatus}
        partner={partner}
        busy={inviteBusy}
        onSendInvite={onSendInvite}
        onResend={onResendInvite}
        onSendOtherEmail={onSendOtherEmail}
        onRemove={onRemovePartner}
      />
    </div>
  );
}
