"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { PRODUCT_NAV } from "@/lib/product-routes";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (pathname.startsWith("/w/") || pathname.startsWith("/rsvp/")) return null;
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) setMenuOpen(false);
      if (!toolsRef.current?.contains(target)) setToolsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const dashboardHref = getHomePath(user?.role);
  const initial = (user?.name?.trim()?.[0] ?? "N").toUpperCase();
  const isCouple = user?.role === "COUPLE" || user?.role === "ADMIN";

  const navLinkClass = isHome
    ? "text-sm font-medium text-white/90 transition hover:text-white"
    : "text-sm font-medium text-ink-soft transition hover:text-ink";

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
          <nav
            aria-label="Основне меню"
            className="flex items-center gap-4 sm:gap-5 md:gap-6"
          >
            <Link href="/content" className={navLinkClass}>
              Ідеї
            </Link>
            <div ref={toolsRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setToolsOpen((open) => !open);
                  setMenuOpen(false);
                }}
                aria-expanded={toolsOpen}
                aria-haspopup="menu"
                className={`${navLinkClass} inline-flex items-center gap-1`}
              >
                Інструменти
                <span
                  className={`text-[10px] transition ${toolsOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {toolsOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-xl"
                >
                  {PRODUCT_NAV.map((item) => {
                    const href = isCouple ? item.coupleHref : item.guestHref;
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-ink transition hover:bg-mist"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </nav>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3">
          {hydrated && user ? (
            <>
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
                          : "Пара"}
                      </p>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="block px-4 py-2.5 text-sm text-ink transition hover:bg-mist"
                    >
                      {user.role === "ADMIN" ? "Адмінка" : "Кабінет"}
                    </Link>
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
