"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import "@/app/fata-mobile-menu.css";

export const FATA_NAV = [
  { href: "/vesilnyy-plan", label: "Чеклісти" },
  { href: "/rozsadka-gostey", label: "Конструктор розсадки" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/zaprosinnya", label: "Сайт-запрошення" },
  { href: "/spysok-gostey", label: "Список гостей" },
  { href: "/content", label: "Ідеї" },
] as const;

export function FataMobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const loggedIn = Boolean(hydrated && user);

  return createPortal(
    <>
      <button
        type="button"
        className="fata-drawer-scrim"
        aria-label="Закрити меню"
        onClick={onClose}
      />
      <aside className="fata-drawer" role="dialog" aria-modal="true" aria-label="Меню">
        <div className="fata-drawer-head">
          <Link href="/" className="fata-drawer-logo" onClick={onClose}>
            <img src="/landing/logo-foot.svg" alt="fata.studio" width={148} height={32} />
          </Link>
          <button type="button" className="fata-drawer-close" aria-label="Закрити" onClick={onClose}>
           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="5.06066" y1="4" x2="18.1421" y2="17.0815" stroke="#F0FEBB" strokeWidth="1.5" strokeLinecap="round"/>
<line x1="4" y1="14.9393" x2="17.0815" y2="1.85786" stroke="#F0FEBB" strokeWidth="1.5" strokeLinecap="round"/>
</svg>

          </button>
        </div>

        <nav className="fata-drawer-nav">
          {FATA_NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="fata-drawer-cta">
          {loggedIn ? (
            <>
              <button
                type="button"
                className="fata-drawer-login"
                onClick={() => {
                  onClose();
                  void logout();
                }}
              >
                Вийти
              </button>
              <Link
                href={getHomePath(user?.role)}
                className="fata-drawer-start"
                onClick={onClose}
              >
                Кабінет
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="fata-drawer-login" onClick={onClose}>
                Увійти
              </Link>
              <Link href="/register" className="fata-drawer-start" onClick={onClose}>
                Розпочати
              </Link>
            </>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}
