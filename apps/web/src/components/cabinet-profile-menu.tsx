"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function CabinetProfileMenu({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

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

  async function onLogout() {
    setOpen(false);
    await logout();
    router.replace("/login");
  }

  return (
    <div className="cabinet-profile-wrap" ref={wrapRef}>
      <button
        type="button"
        className="cabinet-profile"
        aria-label="Меню профілю"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="cabinet-profile-avatar">{initials}</span>
        <svg
          className={`cabinet-profile-chevron${open ? " is-open" : ""}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.25 5 4.75 9 1.25"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="cabinet-profile-menu" role="menu" aria-label="Профіль">
          <Link
            href="/settings"
            role="menuitem"
            className="cabinet-profile-menu-item"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 13a7.8 7.8 0 0 0 .05-2l2.05-1.55-2-3.46-2.4.9a7.7 7.7 0 0 0-1.75-1L14.9 2h-5.8l-.45 2.89a7.7 7.7 0 0 0-1.75 1l-2.4-.9-2 3.46L4.55 11a7.8 7.8 0 0 0 0 2l-2.05 1.55 2 3.46 2.4-.9a7.7 7.7 0 0 0 1.75 1L9.1 22h5.8l.45-2.89a7.7 7.7 0 0 0 1.75-1l2.4.9 2-3.46L19.4 13Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Налаштування
          </Link>
          <Link
            href="/support"
            role="menuitem"
            className="cabinet-profile-menu-item"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="38 75 14 16" fill="none" aria-hidden>
              <path
                d="M45.75 90.5H48c2.07 0 3.75-1.68 3.75-3.75v-4.5C51.75 78.52 48.73 75.5 45 75.5s-6.75 3.02-6.75 6.75V86c0 .414.336.75.75.75H40.5V83H38.25M51.75 83H49.5v3.75H51c.414 0 .75-.336.75-.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Підтримка
          </Link>
          <Link
            href="/feedback"
            role="menuitem"
            className="cabinet-profile-menu-item"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="38 122 16 16" fill="none" aria-hidden>
              <path
                d="M42 126.5h8M42 130.5h5M41 122h10c1.657 0 3 1.343 3 3v7c0 1.657-1.343 3-3 3h-6l-5 3v-3.17C38.835 134.418 38 133.307 38 132v-7c0-1.657 1.343-3 3-3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Відгуки та пропозиції
          </Link>
          <button
            type="button"
            role="menuitem"
            className="cabinet-profile-menu-item is-logout"
            onClick={() => void onLogout()}
          >
            <svg width="18" height="18" viewBox="38 170 14 14" fill="none" aria-hidden>
              <path
                d="m48 173.25 3.75 3.75L48 180.75M51.75 177H42.75M42.75 183.75h-3a1.5 1.5 0 0 1-1.5-1.5v-10.5a1.5 1.5 0 0 1 1.5-1.5h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Вийти з акаунту
          </button>
        </div>
      ) : null}
    </div>
  );
}
