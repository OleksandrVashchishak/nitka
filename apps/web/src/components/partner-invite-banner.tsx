"use client";

import { IconClose } from "@/components/icon-close";
import { IconSms } from "@/components/icon-sms";
import { Button } from "@/components/ui/button";
import { detectUaNameGender, uaNameAccusative } from "@/lib/ua-name-case";

type Props = {
  partnerName: string;
  busy?: boolean;
  onInvite: () => void;
  onDismiss: () => void;
  className?: string;
};

export function PartnerInviteBanner({
  partnerName,
  busy = false,
  onInvite,
  onDismiss,
  className,
}: Props) {
  const name = uaNameAccusative(partnerName);
  const raw = partnerName.trim();
  const feminine =
    !!raw &&
    !/^партнер/i.test(raw) &&
    detectUaNameGender(raw) === "feminine";

  return (
    <div
      className={["partner-invite-banner", className].filter(Boolean).join(" ")}
    >
      <div className="partner-invite-banner__head">
        <IconSms className="partner-invite-banner__icon" />
        <p className="partner-invite-banner__title">Запросіть {name}</p>
      </div>

      <button
        type="button"
        className="partner-invite-banner__dismiss"
        aria-label="Закрити"
        onClick={onDismiss}
      >
          <IconClose size={20} />
      </button>

      <p className="partner-invite-banner__text">
        Додайте {name} до спільного доступу, щоб{" "}
        {feminine ? "вона могла" : "він міг"} бачити та редагувати ваш дашборд.
      </p>

      <div className="partner-invite-banner__actions">
        <Button
          type="button"
          tone="ink"
          size="s"
          className="partner-invite-banner__btn"
          loading={busy}
          loadingText="…"
          onClick={onInvite}
        >
          Запросити
        </Button>
      </div>
    </div>
  );
}
