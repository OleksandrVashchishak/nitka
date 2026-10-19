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
  const moreHref = summary?.moreHref || "/settings?tab=notifications";

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
        <svg
          className="cabinet-bell-icon"
          viewBox="0 0 20 22"
          fill="none"
          aria-hidden
        >
          <path
            d="M11.48 19.75C11.3023 20.1149 11.0292 20.4212 10.6873 20.6307C10.3454 20.8403 9.9507 20.9443 9.5513 20.9303C9.152 20.9163 8.7655 20.785 8.4388 20.5522C8.1121 20.3194 7.8598 19.9949 7.71 19.62M15.75 6.75C15.75 5.1587 15.1179 3.63258 13.9926 2.50736C12.8674 1.38214 11.3413 0.75 9.75 0.75C8.1587 0.75 6.63258 1.38214 5.50736 2.50736C4.38214 3.63258 3.75 5.1587 3.75 6.75C3.75 13.75 0.75 15.75 0.75 15.75H18.75C18.75 15.75 15.75 13.75 15.75 6.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
              {preview.length
                ? "Переглянути більше"
                : "Переглянути налаштування"}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
