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
                strokeWidth="1.6"
              />
              <path
                d="M19.4 13a7.8 7.8 0 0 0 .05-2l2.05-1.55-2-3.46-2.4.9a7.7 7.7 0 0 0-1.75-1L14.9 2h-5.8l-.45 2.89a7.7 7.7 0 0 0-1.75 1l-2.4-.9-2 3.46L4.55 11a7.8 7.8 0 0 0 0 2l-2.05 1.55 2 3.46 2.4-.9a7.7 7.7 0 0 0 1.75 1L9.1 22h5.8l.45-2.89a7.7 7.7 0 0 0 1.75-1l2.4.9 2-3.46L19.4 13Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            Налаштування
          </Link>
          <button
            type="button"
            role="menuitem"
            className="cabinet-profile-menu-item is-logout"
            onClick={() => void onLogout()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M14 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M10 12h11m0 0-3.5-3.5M21 12l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Вийти з акаунту
          </button>
        </div>
      ) : null}
    </div>
  );
}
