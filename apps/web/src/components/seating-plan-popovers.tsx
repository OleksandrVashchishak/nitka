"use client";

import { IconClose } from "@/components/icon-close";
import type { RsvpStatus } from "@/lib/guests-api";

export type GuestPopoverInfo = {
  key: string;
  guestId: string;
  name: string;
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
      <GuestPopFooter status={info.rsvpStatus} />
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
  onSeatElsewhere,
  onClose,
  variant = "float",
}: {
  info: GuestPopoverInfo;
  onSetRsvp: (status: RsvpStatus) => void;
  onLeaveUnseated: () => void;
  onDetach: (() => void) | null;
  onSeatElsewhere?: () => void;
  onClose: () => void;
  variant?: "float" | "sheet";
}) {
  const isSheet = variant === "sheet";

  return (
    <div
      className={`seat-pop${isSheet ? " seat-pop--sheet" : ""}`}
      role="dialog"
      aria-label={info.name}
    >
      <GuestPopHeader info={info} onClose={isSheet ? onClose : undefined} />
      <div className="seat-pop-actions">
        {info.rsvpStatus !== "MAYBE" ? (
          <button type="button" onClick={() => onSetRsvp("MAYBE")}>
            Змінити статус на «Можливо прийде»
          </button>
        ) : null}
        {info.rsvpStatus !== "NO" ? (
          <button type="button" onClick={() => onSetRsvp("NO")}>
            Змінити статус на «Не прийде»
          </button>
        ) : null}
        {info.rsvpStatus !== "YES" ? (
          <button type="button" onClick={() => onSetRsvp("YES")}>
            Змінити статус на «Прийде»
          </button>
        ) : null}
        {info.tableLabel ? (
          <button type="button" onClick={onLeaveUnseated}>
            Залишити поки що без місця
          </button>
        ) : null}
        {info.linkedName && onDetach ? (
          <button type="button" onClick={onDetach}>
            Від’єднати від {info.linkedName}
          </button>
        ) : null}
        {onSeatElsewhere ? (
          <button type="button" onClick={onSeatElsewhere}>
            Посадити за інший стіл
          </button>
        ) : null}
      </div>
      <GuestPopFooter status={info.rsvpStatus} />
      {!isSheet ? (
        <button
          type="button"
          className="seat-pop-dismiss"
          aria-label="Закрити"
          onClick={onClose}
        />
      ) : null}
    </div>
  );
}

function GuestPopHeader({
  info,
  onClose,
}: {
  info: GuestPopoverInfo;
  onClose?: () => void;
}) {
  return (
    <div className="seat-pop-head">
      <div className="seat-pop-head-row">
        <p className="seat-pop-name">{info.name}</p>
        {onClose ? (
          <button
            type="button"
            className="seat-pop-close"
            aria-label="Закрити"
            onClick={onClose}
          >
            <IconClose size={18} />
          </button>
        ) : null}
      </div>
      <div className="seat-pop-meta">
        <span>{info.groupLabel || "Без групи"}</span>
        <span>{info.tableLabel || "Без столу"}</span>
      </div>
    </div>
  );
}

function GuestPopFooter({ status }: { status: RsvpStatus }) {
  return (
    <div className="seat-pop-footer">
      {status === "YES" ? <RsvpYesIcon /> : <ClockIcon />}
      <span>{rsvpFooterLabel(status)}</span>
    </div>
  );
}

function RsvpYesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#4CAF7A" />
      <path
        d="M4.8 8.2 6.9 10.2 11.2 5.8"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
