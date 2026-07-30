"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const COLUMNS = [
  {
    title: "Пара",
    links: [
      { href: "/content", label: "Ідеї та поради" },
      { href: "/vesilnyy-plan", label: "План весілля" },
      { href: "/plan-dnya-vesillya", label: "План дня весілля" },
      { href: "/vesilnyy-byudzhet", label: "Бюджет весілля" },
      { href: "/spysok-gostey", label: "Гості та запрошення" },
      { href: "/rozsadka-gostey", label: "Розсадка гостей" },
      { href: "/zaprosinnya", label: "Онлайн-запрошення" },
      { href: "/vesilnyy-sayt", label: "Весільний сайт" },
      { href: "/register", label: "Зареєструватись" },
      { href: "/dashboard", label: "Кабінет пари" },
    ],
  },
  {
    title: "NITKA",
    links: [
      { href: "/#how-it-works", label: "Як це працює" },
      { href: "/vesilnyy-plan", label: "План весілля" },
      { href: "/plan-dnya-vesillya", label: "План дня весілля" },
      { href: "/vesilnyy-byudzhet", label: "Бюджет весілля" },
      { href: "/spysok-gostey", label: "Гості та запрошення" },
      { href: "/rozsadka-gostey", label: "Розсадка гостей" },
      { href: "/zaprosinnya", label: "Онлайн-запрошення" },
      { href: "/vesilnyy-sayt", label: "Весільний сайт" },
      { href: "/content", label: "Ідеї та поради" },
      { href: "/login", label: "Увійти" },
    ],
  },
  {
    title: "Контакти",
    links: [
      { href: "mailto:hello@nitka.ua", label: "hello@nitka.ua" },
      { href: "tel:+380441112233", label: "+38 044 111 22 33" },
      { href: "#", label: "Instagram" },
      { href: "#", label: "Telegram" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-mist">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-3xl text-ink">
              NITKA
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
              Просте планування весілля українською: задачі, бюджет, гості,
              розсадка, запрошення й сайт пари.
            </p>
          <p className="mt-5 text-xs text-ink-soft">
            Працюємо онлайн по всій Україні ·{" "}
            <Link href="/content" className="hover:text-sage-deep">
              ідеї, гайди, планування
            </Link>
          </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-ink">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition hover:text-sage-deep"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NITKA. Усі права захищено.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="hover:text-sage-deep">
              Політика конфіденційності
            </Link>
            <Link href="#" className="hover:text-sage-deep">
              Умови використання
            </Link>
            <Link href="#" className="hover:text-sage-deep">
              Для преси
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteFooterWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/w/") || pathname.startsWith("/rsvp/")) return null;
  return <SiteFooter />;
}
