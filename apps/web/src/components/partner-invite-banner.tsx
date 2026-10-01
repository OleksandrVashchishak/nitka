"use client";

import { IconClose } from "@/components/icon-close";
import { Button } from "@/components/ui/button";

type Props = {
  partnerName: string;
  busy?: boolean;
  onInvite: () => void;
  onDismiss: () => void;
  className?: string;
};

function IconSms({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PartnerInviteBanner({
  partnerName,
  busy = false,
  onInvite,
  onDismiss,
  className,
}: Props) {
  const name = partnerName.trim() || "партнера";

  return (
    <div
      className={["partner-invite-banner", className].filter(Boolean).join(" ")}
    >
      <div className="partner-invite-banner__body">
        <div className="partner-invite-banner__head">
          <IconSms className="partner-invite-banner__icon" />
          <p className="partner-invite-banner__title">Запросіть {name}</p>
        </div>
        <p className="partner-invite-banner__text">
          Додайте {name} до спільного доступу, щоб він міг бачити та редагувати
          ваш дашборд.
        </p>
      </div>

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
        <button
          type="button"
          className="partner-invite-banner__dismiss"
          aria-label="Закрити"
          onClick={onDismiss}
        >
          <IconClose size={16} />
        </button>
      </div>
    </div>
  );
}
