"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7-4.35-7-9.2A3.8 3.8 0 0 1 12 7.2a3.8 3.8 0 0 1 7 3.6C19 15.65 12 20 12 20Z"
      />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 16.5V8.8A3.8 3.8 0 0 1 8.8 5h6.4A3.8 3.8 0 0 1 19 8.8v4.4A3.8 3.8 0 0 1 15.2 17H9.2L5 20v-3.5Z"
      />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 19a5 5 0 0 1 10 0M13.5 19a4.5 4.5 0 0 1 7 0"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated || !accessToken || !user) {
      setSummary(null);
      return;
    }
    if (user.role === "ADMIN") return;

    void (async () => {
      try {
        setSummary(await getNotificationsSummary());
      } catch {
        setSummary(null);
      }
    })();
  }, [hydrated, accessToken, user, pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const dashboardHref = getHomePath(user?.role);
  const requestsHref =
    user?.role === "VENDOR" ? "/vendor/requests" : "/requests";
  const badgeTotal = summary?.total ?? 0;
  const initial = (user?.name?.trim()?.[0] ?? "N").toUpperCase();

  const iconBtn = isHome
    ? "relative flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/15"
    : "relative flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-mist";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div className="flex items-center gap-5 md:gap-8">
          <Link
            href="/"
            className={
              isHome
                ? "font-[family-name:var(--font-display)] text-2xl tracking-[0.02em] text-white"
                : "font-[family-name:var(--font-display)] text-2xl tracking-[0.02em] text-ink"
            }
          >
            NITKA
          </Link>
          <Link
            href="/vendors"
            className={
              isHome
                ? "text-sm font-medium text-white/90 transition hover:text-white"
                : "text-sm font-medium text-ink-soft transition hover:text-ink"
            }
          >
            Каталог
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3">
          {hydrated && user ? (
            <>
              {(user.role === "COUPLE" || user.role === "ADMIN") ? (
                <Link
                  href="/favorites"
                  aria-label="Обране"
                  title="Обране"
                  className={iconBtn}
                >
                  <HeartIcon className="size-5" />
                </Link>
              ) : null}

              {user.role !== "ADMIN" ? (
                <Link
                  href={requestsHref}
                  aria-label="Повідомлення"
                  title="Повідомлення"
                  className={iconBtn}
                >
                  <ChatIcon className="size-5" />
                  {badgeTotal > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sage px-1 text-[10px] font-bold text-white">
                      {badgeTotal > 99 ? "99+" : badgeTotal}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className={
                    isHome
                      ? "inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                      : "inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-2.5 py-1.5 text-sm font-semibold text-ink shadow-sm transition hover:border-ink/30"
                  }
                >
                  <span
                    className={
                      isHome
                        ? "flex size-7 items-center justify-center rounded-full bg-white font-[family-name:var(--font-display)] text-sm text-sage-deep"
                        : "flex size-7 items-center justify-center rounded-full bg-sage font-[family-name:var(--font-display)] text-sm text-white"
                    }
                  >
                    {initial}
                  </span>
                  <span className="hidden pr-1 sm:inline">Ваш акаунт</span>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-xl">
                    <div className="border-b border-line px-4 py-3">
                      <p className="truncate text-sm font-semibold text-ink">
                        {user.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {user.role === "ADMIN"
                          ? "Адмін"
                          : user.role === "VENDOR"
                            ? "Підрядник"
                            : "Пара"}
                      </p>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="block px-4 py-2.5 text-sm text-ink transition hover:bg-mist"
                    >
                      {user.role === "ADMIN" ? "Адмінка" : "Кабінет"}
                    </Link>
                    {(user.role === "COUPLE" || user.role === "ADMIN") && (
                      <Link
                        href="/favorites"
                        className="block px-4 py-2.5 text-sm text-ink transition hover:bg-mist"
                      >
                        Обране
                      </Link>
                    )}
                    {user.role !== "ADMIN" ? (
                      <Link
                        href={requestsHref}
                        className="block px-4 py-2.5 text-sm text-ink transition hover:bg-mist"
                      >
                        Повідомлення
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="block w-full px-4 py-2.5 text-left text-sm text-ink transition hover:bg-mist"
                    >
                      Вийти
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : hydrated ? (
            <>
              <Link
                href="/register"
                className={
                  isHome
                    ? "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 sm:inline-flex"
                    : "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink transition hover:bg-mist sm:inline-flex"
                }
              >
                <PeopleIcon className="size-4" />
                Для підрядників
              </Link>
              <Link
                href="/login"
                className={
                  isHome
                    ? "rounded-full border border-white bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-ink"
                    : "rounded-full border border-ink bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mist"
                }
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className={
                  isHome
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mist"
                    : "rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-deep"
                }
              >
                Реєстрація
              </Link>
            </>
          ) : (
            <div className="h-10 w-28 animate-pulse rounded-full bg-black/10" />
          )}
        </nav>
      </div>
    </header>
  );
}
