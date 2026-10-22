"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAdminPath, isCabinetPath } from "@/lib/routes";
import "@/styles/shell/site-footer.scss";

const PRODUCT_LINKS = [
  { href: "/vesilnyy-plan", label: "Завдання" },
  { href: "/spysok-gostey", label: "Гості" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/vesilnyy-sayt", label: "Сайт-запрошення" },
  { href: "/rozsadka-gostey", label: "Розсадка" },
  { href: "/pidryadnyky", label: "Підрядники" },
  { href: "/plan-dnya", label: "План дня" },
] as const;

// TODO: підставити справжні акаунти fata.studio
const INSTAGRAM_URL = "https://instagram.com";
const FACEBOOK_URL = "https://facebook.com";

// TODO: сторінок умов і політики ще немає
const SUPPORT_LINKS = [
  { href: "/terms", label: "Умови використання" },
  { href: "/privacy", label: "Політика конфіденційності" },
  { href: "/napyshit-nam", label: "Напишіть нам" },
] as const;

const HIDDEN_PREFIXES = [
  "/register",
  "/login",
  "/partner-invite",
  "/forgot-password",
  "/confirm-email",
  "/email-confirmed",
  "/verify-email",
  "/rsvp",
  "/w/",
] as const;

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M14.5837 5.4163H14.592M5.833 1.666H14.167C16.4684 1.666 18.334 3.53163 18.334 5.833V14.167C18.334 16.4684 16.4684 18.334 14.167 18.334H5.833C3.53163 18.334 1.666 16.4684 1.666 14.167V5.833C1.666 3.53163 3.53163 1.666 5.833 1.666ZM13.3334 9.47521C13.4362 10.1688 13.3177 10.8772 12.9948 11.4995C12.6719 12.1219 12.1609 12.6266 11.5346 12.9419C10.9082 13.2571 10.1985 13.3669 9.5062 13.2555C8.81393 13.1441 8.17441 12.8172 7.6786 12.3214C7.18279 11.8256 6.85595 11.1861 6.74455 10.4938C6.63316 9.80153 6.74288 9.09176 7.05813 8.46544C7.37337 7.83912 7.87807 7.32815 8.50046 7.00521C9.12284 6.68227 9.8312 6.5638 10.5248 6.66665C11.2323 6.77156 11.8873 7.10124 12.393 7.60698C12.8988 8.11272 13.2284 8.76772 13.3334 9.47521Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12.5002 1.666H15V4.9996H12.5002C12.2792 4.9996 12.0672 5.0874 11.911 5.2437C11.7547 5.39999 11.6669 5.61197 11.6669 5.833V8.3332H15L14.1667 11.6668H11.6669V18.334H8.33382V11.6668H5.834V8.3332H8.33382V5.833C8.33382 4.72784 8.77277 3.66795 9.55412 2.88649C10.3355 2.10502 11.3952 1.666 12.5002 1.666Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo" aria-label="fata.studio">
              <img
                src="/landing/logo-foot.svg"
                alt="fata.studio"
                width={154}
                height={32}
              />
            </Link>
            <p className="site-footer__tagline">
              Сучасний інструмент для планування весілля
            </p>
          </div>

          <nav className="site-footer__col" aria-label="Продукт">
            <h4 className="site-footer__title">Продукт</h4>
            <ul className="site-footer__list">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__col" aria-label="Компанія">
            <h4 className="site-footer__title">Компанія</h4>
            <ul className="site-footer__list site-footer__list--icons">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="site-footer__link"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="site-footer__link"
                >
                  <FacebookIcon />
                  Facebook
                </a>
              </li>
              <li>
                <Link href="/blog" className="site-footer__link">
                  Ідеї
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="site-footer__col" aria-label="Підтримка">
            <h4 className="site-footer__title">Підтримка</h4>
            <ul className="site-footer__list">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__line" />

        <p className="site-footer__copy">
          © 2026 fata.studio. Усі права захищені.
        </p>
      </div>
    </footer>
  );
}

/** Один футер для всіх маркетингових сторінок; у кабінеті, адмінці, auth і на сайтах пар — прихований. */
export function SiteFooterWrapper() {
  const pathname = usePathname();
  if (
    HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    isCabinetPath(pathname) ||
    isAdminPath(pathname)
  )
    return null;
  return <SiteFooter />;
}
