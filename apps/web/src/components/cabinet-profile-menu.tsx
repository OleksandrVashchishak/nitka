"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { useAuthStore } from "@/lib/auth-store";

export function CabinetProfileMenu({ initials }: { initials: string }) {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
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
    setLogoutBusy(true);
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
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.66675 10.7334V9.26669C1.66675 8.40003 2.37508 7.68336 3.25008 7.68336C4.75841 7.68336 5.37508 6.6167 4.61675 5.30836C4.18341 4.55836 4.44175 3.58336 5.20008 3.15003L6.64175 2.32503C7.30008 1.93336 8.15008 2.1667 8.54175 2.82503L8.63341 2.98336C9.38341 4.2917 10.6167 4.2917 11.3751 2.98336L11.4667 2.82503C11.8584 2.1667 12.7084 1.93336 13.3667 2.32503L14.8084 3.15003C15.5667 3.58336 15.8251 4.55836 15.3917 5.30836C14.6334 6.6167 15.2501 7.68336 16.7584 7.68336C17.6251 7.68336 18.3417 8.39169 18.3417 9.26669V10.7334C18.3417 11.6 17.6334 12.3167 16.7584 12.3167C15.2501 12.3167 14.6334 13.3834 15.3917 14.6917C15.8251 15.45 15.5667 16.4167 14.8084 16.85L13.3667 17.675C12.7084 18.0667 11.8584 17.8334 11.4667 17.175L11.3751 17.0167C10.6251 15.7084 9.39175 15.7084 8.63341 17.0167L8.54175 17.175C8.15008 17.8334 7.30008 18.0667 6.64175 17.675L5.20008 16.85C4.44175 16.4167 4.18341 15.4417 4.61675 14.6917C5.37508 13.3834 4.75841 12.3167 3.25008 12.3167C2.37508 12.3167 1.66675 11.6 1.66675 10.7334Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
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
            onClick={() => {
              setOpen(false);
              setLogoutOpen(true);
            }}
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

      <DeleteConfirmModal
        open={logoutOpen}
        title="Вийти з акаунту?"
        description="Ви впевнені, що хочете вийти з акаунту?"
        confirmLabel="Так, вийти"
        loading={logoutBusy}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => void onLogout()}
      />
    </div>
  );
}
