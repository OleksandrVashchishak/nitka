import Link from "next/link";

const COLUMNS = [
  {
    title: "Пара",
    links: [
      { href: "/vendors", label: "Каталог підрядників" },
      { href: "/content", label: "Ідеї та поради" },
      { href: "/vesilnyy-plan", label: "План весілля" },
      { href: "/plan-dnya-vesillya", label: "План дня весілля" },
      { href: "/vesilnyy-byudzhet", label: "Бюджет весілля" },
      { href: "/spysok-gostey", label: "Гості та RSVP" },
      { href: "/rozsadka-gostey", label: "Розсадка гостей" },
      { href: "/moyi-pidryadnyky", label: "Мої підрядники" },
      { href: "/zaprosinnya", label: "Онлайн-запрошення" },
      { href: "/vesilnyy-sayt", label: "Весільний сайт" },
      { href: "/register", label: "Зареєструватись" },
      { href: "/dashboard", label: "Кабінет пари" },
    ],
  },
  {
    title: "Міста",
    links: [
      { href: "/vesillya", label: "Усі міста" },
      { href: "/vesillya/kyiv", label: "Весілля в Києві" },
      { href: "/vesillya/lviv", label: "Весілля у Львові" },
      { href: "/vesillya/odesa", label: "Весілля в Одесі" },
      { href: "/vesillya/kharkiv", label: "Весілля у Харкові" },
      { href: "/vesillya/dnipro", label: "Весілля у Дніпрі" },
    ],
  },
  {
    title: "Підрядник",
    links: [
      { href: "/register", label: "Стати підрядником" },
      { href: "/vendor/dashboard", label: "Кабінет підрядника" },
      { href: "/vendor/profile", label: "Публічний профіль" },
      { href: "/vendor/requests", label: "Заявки" },
    ],
  },
  {
    title: "NITKA",
    links: [
      { href: "/#how-it-works", label: "Як це працює" },
      { href: "/vesilnyy-plan", label: "План весілля" },
      { href: "/plan-dnya-vesillya", label: "План дня весілля" },
      { href: "/vesilnyy-byudzhet", label: "Бюджет весілля" },
      { href: "/spysok-gostey", label: "Гості та RSVP" },
      { href: "/rozsadka-gostey", label: "Розсадка гостей" },
      { href: "/moyi-pidryadnyky", label: "Мої підрядники" },
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
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(5,1fr)]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-3xl text-ink">
              NITKA
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
              Український маркетплейс весільних підрядників і простий план
              весілля в одному місці.
            </p>
          <p className="mt-5 text-xs text-ink-soft">
            Працюємо онлайн по всій Україні ·{" "}
            <Link href="/vesillya" className="hover:text-sage-deep">
              Київ · Львів · Одеса · Харків
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
