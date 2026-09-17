"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { FATA_NAV, FataMobileMenu } from "@/components/fata-mobile-menu";

function shouldHideHeader(pathname: string) {
  return (
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/confirm-email") ||
    pathname.startsWith("/email-confirmed") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/w/") ||
    pathname.startsWith("/rsvp/") ||
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
    pathname.startsWith("/requests") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/vendor")
  );
}

function FataLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`fata-logo ${className}`.trim()} aria-label="fata.studio">
      <img src="/landing/logo.svg" alt="fata.studio" width={154} height={32} />
    </Link>
  );
}

function AuthButtons() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const dashboardHref = getHomePath(user?.role);

  if (!hydrated) {
    return <div className="fata-auth-skeleton" aria-hidden />;
  }

  if (user) {
    return (
      <Link href={dashboardHref} className="fata-btn fata-btn-start">
        Кабінет
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className="fata-btn fata-btn-login">
        Увійти
      </Link>
      <Link href="/register" className="fata-btn fata-btn-start">
        Розпочати
      </Link>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hidden = shouldHideHeader(pathname);
  const isHome = pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (hidden) {
      document.body.classList.remove("has-fata-header", "has-fata-header-home");
      return;
    }
    document.body.classList.toggle("has-fata-header", !isHome);
    document.body.classList.toggle("has-fata-header-home", isHome);
    return () => {
      document.body.classList.remove("has-fata-header", "has-fata-header-home");
    };
  }, [hidden, isHome]);

  if (hidden) return null;

  return (
    <header className="fata-site-header">
      <div className="fata-site-header-inner">
        <FataLogo />
        <nav className="fata-nav" aria-label="Основне меню">
          {FATA_NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="fata-auth">
          <AuthButtons />
        </div>
        <button
          type="button"
          className="fata-m-burger fata-site-burger"
          aria-label="Меню"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <FataMobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
