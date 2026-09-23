"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <footer className="bg-wine px-5 py-24 text-center text-white md:px-8 md:py-28">
        <p className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-wide md:text-5xl">
          З fata.studio всі ці речі простіше і безкоштовно
        </p>
        <Button href="/register" tone="light" size="l" className="mt-10">
          Розпочати безкоштовно
        </Button>
        <p className="mt-16 text-xs text-white/50">© 2026 fata.studio</p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-line bg-mist">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <BrandLogo />
            <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
              Планування весілля: чекліст, бюджет, гості, запрошення й сайт
              пари.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
            <Link href="/vesilnyy-plan" className="hover:text-ink">
              Чеклісти
            </Link>
            <Link href="/vesilnyy-byudzhet" className="hover:text-ink">
              Бюджет
            </Link>
            <Link href="/spysok-gostey" className="hover:text-ink">
              Гості
            </Link>
            <Link href="/blog" className="hover:text-ink">
              Блог
            </Link>
            <Link href="/login" className="hover:text-ink">
              Увійти
            </Link>
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs text-ink-soft">
          © 2026 fata.studio. Усі права захищено.
        </p>
      </div>
    </footer>
  );
}

export function SiteFooterWrapper() {
  const pathname = usePathname();
  if (
    pathname === "/" ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/confirm-email") ||
    pathname.startsWith("/email-confirmed") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/w/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checklist") ||
    pathname.startsWith("/budget") ||
    pathname.startsWith("/guests") ||
    pathname.startsWith("/seating") ||
    pathname.startsWith("/website") ||
    pathname.startsWith("/my-vendors")
  )
    return null;
  return <SiteFooter />;
}
