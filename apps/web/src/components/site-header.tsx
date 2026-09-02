"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { BrandLogo } from "@/components/brand-logo";
import { FataMobileMenu } from "@/components/fata-mobile-menu";

const MARKETING_NAV = [
  { href: "/vesilnyy-plan", label: "Чеклісти" },
  { href: "/rozsadka-gostey", label: "Конструктор розсадки" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/zaprosinnya", label: "Сайт-запрошення" },
  { href: "/spysok-gostey", label: "Список гостей" },
  { href: "/blog", label: "Блог" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (
    pathname === "/" ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/w/") ||
    pathname.startsWith("/rsvp/") ||
    pathname === "/tasks" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checklist") ||
    pathname.startsWith("/day-plan") ||
    pathname.startsWith("/budget") ||
    pathname.startsWith("/guests") ||
    pathname.startsWith("/seating") ||
    pathname.startsWith("/invitations") ||
    pathname.startsWith("/website") ||
    pathname.startsWith("/my-vendors") ||
    pathname.startsWith("/favorites") ||
    pathname.startsWith("/requests")
  )
    return null;

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const dashboardHref = getHomePath(user?.role);
  const initial = (user?.name?.trim()?.[0] ?? "N").toUpperCase();

  const navLinkClass = isHome
    ? "text-[13px] font-medium text-white/90 transition hover:text-white"
    : "text-sm font-medium text-ink-soft transition hover:text-ink";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-5 md:px-10">
        <BrandLogo light={isHome} />

        <nav
          aria-label="Основне меню"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {MARKETING_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative flex h-[18px] w-7 text-ink lg:hidden"
            aria-label="Меню"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span className="absolute inset-x-0 top-[3px] h-px bg-current" />
            <span className="absolute inset-x-0 top-[13px] h-px bg-current" />
          </button>
          {hydrated && user ? (
            <div ref={menuRef} className="relative hidden lg:block">
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
                      ? "flex size-7 items-center justify-center rounded-full bg-cta font-[family-name:var(--font-display)] text-sm text-ink"
                      : "flex size-7 items-center justify-center rounded-full bg-sage font-[family-name:var(--font-display)] text-sm text-white"
                  }
                >
                  {initial}
                </span>
                <span className="hidden pr-1 sm:inline">Кабінет</span>
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-xl">
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">
                      {user.name}
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
          ) : hydrated ? (
            <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
              <Link
                href="/login"
                className={
                  isHome
                    ? "rounded-full border border-white/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-ink"
                    : "rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mist"
                }
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className={
                  isHome
                    ? "rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
                    : "rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-deep"
                }
              >
                Розпочати
              </Link>
            </div>
          ) : (
            <div className="hidden h-10 w-28 animate-pulse rounded-full bg-black/10 lg:block" />
          )}
        </nav>
      </div>

      <FataMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
