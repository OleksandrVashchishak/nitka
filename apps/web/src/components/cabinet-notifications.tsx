"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  formatNotifyRelativeTime,
  newNotificationsWord,
  type NotificationsSummary,
} from "@/lib/notifications-api";

const PREVIEW_LIMIT = 4;

export function CabinetNotificationsBell({
  summary,
}: {
  summary: NotificationsSummary | null;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const feed = summary?.feed ?? [];
  const preview = feed.slice(0, PREVIEW_LIMIT);
  const newCount = summary?.newCount ?? preview.filter((item) => item.isNew).length;
  const badgeCount = newCount > 0 ? newCount : summary?.total ?? 0;
  const moreHref = summary?.moreHref || "/guests";

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="cabinet-notify-wrap" ref={wrapRef}>
      <button
        type="button"
        className="cabinet-bell"
        aria-label="Сповіщення"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 9.5a6 6 0 0 1 12 0v4.2l1.6 2.3H4.4L6 13.7V9.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M10 19a2.2 2.2 0 0 0 4 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        {badgeCount > 0 ? (
          <span className="cabinet-bell-badge">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="cabinet-notify-popover"
          role="dialog"
          aria-label="Сповіщення"
        >
          <div className="cabinet-notify-popover-arrow" aria-hidden />
          <div className="cabinet-notify-header">
            <h2 className="cabinet-notify-title">Сповіщення</h2>
            {newCount > 0 ? (
              <span className="cabinet-notify-pill">
                {newCount} {newNotificationsWord(newCount)}
              </span>
            ) : null}
          </div>

          {preview.length ? (
            <ul className="cabinet-notify-list">
              {preview.map((item) => (
                <li key={item.id} className="cabinet-notify-row">
                  <span
                    className={
                      item.isNew
                        ? "cabinet-notify-dot is-new"
                        : "cabinet-notify-dot"
                    }
                    aria-hidden
                  />
                  <div className="cabinet-notify-main">
                    <Link
                      href={item.href}
                      className="cabinet-notify-body"
                      onClick={() => setOpen(false)}
                    >
                      {item.body}
                    </Link>
                    {item.actionLabel && item.actionHref ? (
                      <Link
                        href={item.actionHref}
                        className="cabinet-notify-action"
                        onClick={() => setOpen(false)}
                      >
                        {item.actionLabel}
                      </Link>
                    ) : null}
                  </div>
                  <time
                    className="cabinet-notify-time"
                    dateTime={item.createdAt}
                  >
                    {formatNotifyRelativeTime(item.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cabinet-notify-empty">Немає нових сповіщень</p>
          )}

          <div className="cabinet-notify-footer">
            <Link
              href={moreHref}
              className="cabinet-notify-more"
              onClick={() => setOpen(false)}
            >
              Переглянути більше
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
