"use client";

import type { RsvpStatus } from "@/lib/guests-api";

export type GuestPopoverInfo = {
  key: string;
  guestId: string;
  name: string;
  index: number;
  groupLabel: string | null;
  tableLabel: string | null;
  rsvpStatus: RsvpStatus;
  isPlusOne: boolean;
  linkedName: string | null;
  swapCandidates: Array<{ key: string; name: string }>;
};

export function rsvpFooterLabel(status: RsvpStatus) {
  if (status === "YES") return "Прийде";
  if (status === "NO") return "Не прийде";
  if (status === "MAYBE") return "Можливо прийде";
  return "Ще немає відповіді";
}

export function GuestSeatPopover({
  info,
  onFree,
  onSwap,
  onClose,
}: {
  info: GuestPopoverInfo;
  onFree: () => void;
  onSwap: (otherKey: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="seat-pop" role="dialog" aria-label={info.name}>
      <GuestPopHeader info={info} />
      <div className="seat-pop-actions">
        <button type="button" onClick={onFree}>
          Звільнити місце
        </button>
        {info.swapCandidates.map((c) => (
          <button key={c.key} type="button" onClick={() => onSwap(c.key)}>
            Поміняти місцями з {c.name}
          </button>
        ))}
      </div>
      <div className="seat-pop-footer">
        <ClockIcon />
        <span>{rsvpFooterLabel(info.rsvpStatus)}</span>
      </div>
      <button
        type="button"
        className="seat-pop-dismiss"
        aria-label="Закрити"
        onClick={onClose}
      />
    </div>
  );
}

export function GuestListPopover({
  info,
  onSetRsvp,
  onLeaveUnseated,
  onDetach,
  onClose,
}: {
  info: GuestPopoverInfo;
  onSetRsvp: (status: RsvpStatus) => void;
  onLeaveUnseated: () => void;
  onDetach: (() => void) | null;
  onClose: () => void;
}) {
  return (
    <div className="seat-pop" role="dialog" aria-label={info.name}>
      <GuestPopHeader info={info} />
      <div className="seat-pop-actions">
        <button type="button" onClick={() => onSetRsvp("YES")}>
          Змінити статус на “Прийде”
        </button>
        <button type="button" onClick={() => onSetRsvp("NO")}>
          Змінити статус на “Не прийде”
        </button>
        <button type="button" onClick={onLeaveUnseated}>
          Залишити поки що без місця
        </button>
        {info.linkedName && onDetach ? (
          <button type="button" onClick={onDetach}>
            Від’єднати від {info.linkedName}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className="seat-pop-dismiss"
        aria-label="Закрити"
        onClick={onClose}
      />
    </div>
  );
}

function GuestPopHeader({ info }: { info: GuestPopoverInfo }) {
  return (
    <div className="seat-pop-head">
      <span className="seat-pop-avatar">{info.index}</span>
      <div className="seat-pop-head-text">
        <p className="seat-pop-name">{info.name}</p>
        <div className="seat-pop-meta">
          <span>{info.groupLabel || "Без групи"}</span>
          <span>{info.tableLabel || "Без столу"}</span>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.25" stroke="#C47A3A" strokeWidth="1.3" />
      <path
        d="M7 4.2V7l1.8 1.2"
        stroke="#C47A3A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
