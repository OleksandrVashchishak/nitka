"use client";

import { guestInviteShareLinks } from "@/lib/invite-share";

const linkClass =
  "cursor-pointer text-xs font-medium uppercase tracking-[0.1em] text-sage-deep hover:underline";

export function InviteShareLinks({
  url,
  guestName,
  onCopy,
}: {
  url: string;
  guestName: string;
  onCopy?: () => void;
}) {
  const links = guestInviteShareLinks(url, guestName);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {onCopy ? (
        <button type="button" onClick={onCopy} className={linkClass}>
          Копіювати
        </button>
      ) : null}
      <a
        href={links.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Telegram
      </a>
      <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
        WhatsApp
      </a>
      <a href={links.viber} className={linkClass}>
        Viber
      </a>
      <a href={links.mailto} className={linkClass}>
        Email
      </a>
    </div>
  );
}
