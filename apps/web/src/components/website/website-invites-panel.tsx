"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Guest } from "@/lib/guests-api";
import {
  IconChevronDown,
  IconInstagram,
  IconMore,
  IconSmile,
  IconTelegram,
  IconViber,
} from "@/components/website/website-icons";

type InviteMethod = "telegram" | "instagram" | "viber" | "phone" | "email" | "other";
type SortMode = "sent_first" | "alpha";

type Props = {
  guests: Guest[];
  ownerInitial: string;
  partnerInitial: string;
  onMarkSent: (guestId: string) => void;
  onMarkAllSent: () => void;
  sendingAll: boolean;
};

function isInvited(guest: Guest) {
  if ((guest.notes ?? "").includes("[invited]")) return true;
  return Boolean(guest.respondedAt);
}

function parseMethod(notes: string | null): InviteMethod {
  const match = notes?.match(/invite:(\w+)/i);
  const value = (match?.[1] ?? "").toLowerCase();
  if (
    value === "telegram" ||
    value === "instagram" ||
    value === "viber" ||
    value === "phone" ||
    value === "email"
  ) {
    return value;
  }
  if (value === "messenger") return "other";
  return "other";
}

function channelLabel(guest: Guest, method: InviteMethod) {
  if (method === "telegram") return guest.phone || guest.email || "Telegram";
  if (method === "instagram") return guest.email || guest.phone || "Instagram";
  if (method === "viber") return guest.phone || "Viber";
  if (method === "email") return guest.email || "Email";
  if (guest.phone) return guest.phone;
  if (guest.email) return guest.email;
  return null;
}

function ChannelIcon({ method }: { method: InviteMethod }) {
  if (method === "telegram") return <IconTelegram />;
  if (method === "instagram") return <IconInstagram />;
  if (method === "viber") return <IconViber />;
  return null;
}

const SORT_LABELS: Record<SortMode, string> = {
  sent_first: "Надіслані зверху",
  alpha: "За алфавітом",
};

export function WebsiteInvitesPanel({
  guests,
  ownerInitial,
  partnerInitial,
  onMarkSent,
  onMarkAllSent,
  sendingAll,
}: Props) {
  const [sortMode, setSortMode] = useState<SortMode>("sent_first");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const sentCount = guests.filter(isInvited).length;
  const headcount = guests.reduce(
    (sum, g) => sum + 1 + (g.plusOne ? 1 : 0),
    0,
  );
  const invitedHeadcount = guests
    .filter(isInvited)
    .reduce((sum, g) => sum + 1 + (g.plusOne ? 1 : 0), 0);

  const rows = useMemo(() => {
    const list = [...guests];
    list.sort((a, b) => {
      if (sortMode === "alpha") return a.name.localeCompare(b.name, "uk");
      const aSent = isInvited(a) ? 0 : 1;
      const bSent = isInvited(b) ? 0 : 1;
      if (aSent !== bSent) return aSent - bSent;
      return a.name.localeCompare(b.name, "uk");
    });
    return list;
  }, [guests, sortMode]);

  if (guests.length === 0) {
    return (
      <section className="ws-invites ws-invites--empty" aria-labelledby="ws-invites-empty-title">
        <h2 id="ws-invites-empty-title" className="ws-invites__title">
          Додайте гостей і надсилайте запрошення
        </h2>
        <p className="ws-invites__text">
          Тут можна додати гостей, надіслати їм посилання на сайт-запрошення та
          відстежувати статуси: хто вже отримав запрошення, а кому ще треба
          написати.
        </p>
        <div className="ws-invites__cta-row">
          <Link href="/guests" className="ws-btn ws-btn--solid">
            Додати гостей
          </Link>
          <Link href="/guests" className="ws-btn ws-btn--outline">
            Імпорт CSV списку з гостями
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ws-invites" aria-labelledby="ws-invites-title">
      <div className="ws-invites__toolbar">
        <h2 id="ws-invites-title" className="ws-invites__title">
          Запрошення
        </h2>
        <div className="ws-invites__toolbar-right">
          <div className="ws-invites__sort" ref={sortRef}>
            <button
              type="button"
              className="ws-invites__sort-btn"
              onClick={() => setSortOpen((v) => !v)}
              aria-expanded={sortOpen}
            >
              {SORT_LABELS[sortMode]}
              <IconChevronDown />
            </button>
            {sortOpen ? (
              <div className="ws-invites__sort-menu" role="listbox">
                {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`ws-invites__sort-option${
                      sortMode === mode ? " ws-invites__sort-option--active" : ""
                    }`}
                    onClick={() => {
                      setSortMode(mode);
                      setSortOpen(false);
                    }}
                  >
                    {SORT_LABELS[mode]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="ws-btn ws-btn--solid"
            disabled={sendingAll || sentCount === guests.length}
            onClick={onMarkAllSent}
          >
            {sendingAll ? "Надсилаємо…" : "Надіслати всім"}
          </button>
        </div>
      </div>

      <div className="ws-invites__stats">
        <article className="ws-invites__stat">
          <p className="ws-invites__stat-value">
            {sentCount}/{guests.length}
          </p>
          <p className="ws-invites__stat-label">Запрошень надіслано</p>
        </article>
        <article className="ws-invites__stat">
          <p className="ws-invites__stat-value">
            {invitedHeadcount}/{headcount}
          </p>
          <p className="ws-invites__stat-label">Гостей запрошено</p>
        </article>
      </div>

      <div className="ws-invites__scroll">
        <table className="ws-invites__table">
          <thead>
            <tr>
              <th className="ws-invites__th">Ім&apos;я гостей</th>
              <th className="ws-invites__th">Куди надіслано</th>
              <th className="ws-invites__th">Статус</th>
              <th className="ws-invites__th">Чиї гості</th>
              <th className="ws-invites__th" />
            </tr>
          </thead>
          <tbody>
            {rows.map((guest) => {
              const method = parseMethod(guest.notes);
              const channel = channelLabel(guest, method);
              const sent = isInvited(guest);
              const ownerClass =
                guest.side === "BRIDE"
                  ? "ws-invites__owner--bride"
                  : guest.side === "GROOM"
                    ? "ws-invites__owner--groom"
                    : "ws-invites__owner--both";
              const ownerLetter =
                guest.side === "BRIDE"
                  ? ownerInitial
                  : guest.side === "GROOM"
                    ? partnerInitial
                    : ownerInitial;

              return (
                <tr key={guest.id} className="ws-invites__row">
                  <td className="ws-invites__td">
                    <div className="ws-invites__names">
                      <p className="ws-invites__name">
                        {guest.name}
                        {guest.plusOne ? <IconSmile /> : null}
                      </p>
                      {guest.plusOne && guest.plusOneName ? (
                        <p className="ws-invites__name">{guest.plusOneName}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="ws-invites__td">
                    {channel ? (
                      <span className="ws-invites__channel">
                        <span className="ws-invites__channel-icon">
                          <ChannelIcon method={method} />
                        </span>
                        {channel}
                      </span>
                    ) : (
                      <span className="ws-invites__channel-muted">—</span>
                    )}
                  </td>
                  <td className="ws-invites__td">
                    {sent ? (
                      <span className="ws-badge ws-badge--sent">
                        <span className="ws-badge__dot" />
                        Надіслано
                      </span>
                    ) : channel ? (
                      <button
                        type="button"
                        className="ws-invites__status-btn"
                        onClick={() => onMarkSent(guest.id)}
                      >
                        Надіслати
                      </button>
                    ) : (
                      <Link href="/guests" className="ws-invites__status-btn">
                        Додати контакти
                      </Link>
                    )}
                  </td>
                  <td className="ws-invites__td">
                    <span className={`ws-invites__owner ${ownerClass}`}>
                      {ownerLetter}
                    </span>
                  </td>
                  <td className="ws-invites__td">
                    <Link
                      href="/guests"
                      className="ws-invites__menu-btn"
                      aria-label="Відкрити гостя"
                    >
                      <IconMore />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
