"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <footer className="bg-wine px-5 py-24 text-center text-white md:px-8 md:py-28">
        <p className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-wide md:text-5xl">
          З nitka всі ці речі простіше і безкоштовно
        </p>
        <Link href="/register" className="btn-cta mt-10">
          Розпочати безкоштовно
        </Link>
        <p className="mt-16 text-xs text-white/50">© 2026 nitka</p>
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
              Планування весілля: чекліст, бюджет, гості, розсадка, запрошення й
              сайт пари.
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
            <Link href="/rozsadka-gostey" className="hover:text-ink">
              Розсадка
            </Link>
            <Link href="/content" className="hover:text-ink">
              Ідеї
            </Link>
            <Link href="/login" className="hover:text-ink">
              Увійти
            </Link>
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs text-ink-soft">
          © 2026 nitka. Усі права захищено.
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
  return <SiteFooter />;
}
