"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import "@/app/hero-artboard.css";
import "@/app/landing-rest.css";

const NAV = [
  { href: "/vesilnyy-plan", label: "Чеклісти" },
  { href: "/rozsadka-gostey", label: "Конструктор розсадки" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/zaprosinnya", label: "Сайт-запрошення" },
  { href: "/spysok-gostey", label: "Список гостей" },
  { href: "/content", label: "Ідеї" },
] as const;

const DARK_ROWS = [
  {
    photo: "/landing/compare-1.jpg",
    beforeTitle: "Таблиці excel",
    beforeText: "“треба зробити” списки в телеграмі і в нотатках",
    afterTitle: "Спільний чекліст",
    afterText:
      "і дашборд із миттєвим синхроном для двох з будь якого девайсу",
  },
  {
    photo: "/landing/compare-2.jpg",
    beforeTitle: "Обдзвони, напиши",
    beforeText:
      "100 гостей “ти не знаєш, чи буде він з +1?” “а ти вніс того свого дядька в список?”",
    afterTitle: "Список гостей і дизайн запрошень",
    afterText:
      "та автоматична відправка сайту-запрошення з кнопкою “Ми будемо” і підрахунком гостей",
  },
];

const LIGHT_ROWS = [
  {
    photo: "/landing/compare-3.jpg",
    beforeTitle: "Завдатки і плутанина",
    beforeText: "в гривні та валюті «куди поділися 1000$ з бюджету?»",
    afterTitle: "Прозорий трекінг витрат,",
    afterText: "авансів та кошторисів у будь-якій валюті",
  },
  {
    photo: "/landing/compare-1.jpg",
    beforeTitle: "Перемалюй схеми столів",
    beforeText: "На серветці за день до весілля",
    afterTitle: "Конструктор розсадки",
    afterText: "прив’язаний до списку гостей та їх “Буду-не буду”",
  },
  {
    photo: "/landing/compare-2.jpg",
    beforeTitle: "Дизайнер за всі гроші світу",
    beforeText:
      "Для запрошень, посадкової карти, іменних табличок, правки за $50 в день перед весіллям, бо “тьотя Віра не прийде”",
    afterTitle: "Готові дизайни",
    afterText:
      "Макети посадкових карт, друкованих запрошень та іншої поліграфії в два кліки",
  },
];

const FEATURES = [
  {
    n: "01",
    title: "Планування",
    img: "/landing/feat-1.jpg",
    points: [
      {
        title: "Персоналізований чекліст та таймлайн",
        text: "Персоналізуйте наш розумний список задач із дедлайнами і просто відмічайте зроблене.",
      },
      {
        title: "План весільного дня",
        text: "Розпишіть ранок нареченої, виїзну церемонію та перший танець по хвилинах.",
      },
    ],
  },
  {
    n: "02",
    title: "Гості, запрошення та зв’язок",
    img: "/landing/feat-2.jpg",
    points: [
      {
        title: "Конструктор сайтів-запрошень",
        text: "Зберіть красивий електронний сайт за 10 хвилин. Додайте локацію, дрес-код, таймлайн дня та важливі деталі для гостей.",
      },
      {
        title: "Розумний список гостей",
        text: "Гості підтверджують присутність і система сама враховує +1, дітей, сім’ї, та навіть статус релокації чи служби, а також нагадуйте гостям про дату, збирайте відповіді та надсилайте важливі апдейти в один клік через Telegram або Viber.",
      },
    ],
  },
  {
    n: "03",
    title: "Фінанси та окупність",
    img: "/landing/feat-3.jpg",
    points: [
      {
        title: "Бюджет без сюрпризів",
        text: "Фіксуйте заплановані та фактичні витрати. Враховуйте аванси, фіксуйте залишки підрядникам та перемикайтеся між UAH / USD.",
      },
      {
        title: "Аналітика окупності",
        text: "Забронюйте час для підрахунку після свята. Внесіть подарунки у будь-якій валюті та дізнайтеся реальний фінансовий результат вашого весілля.",
      },
    ],
  },
  {
    n: "04",
    title: "Візуалізація та Print Studio",
    img: "/landing/feat-4.jpg",
    points: [
      {
        title: "Конструктор розсадки",
        text: "Розставляйте круглі та прямокутні столи, перетягуйте гостей мишкою та бачте, хто ще залишився без місця.",
      },
      {
        title: "Друк за один клік",
        text: "Генеруйте готові до друку PDF-файли з дизайнерською картою посадки, іменними картками для столів та друкованими запрошеннями. Занесіть файл у найближчу поліграфію — і все готово.",
      },
    ],
  },
];

const FOOT_PRODUCT = [
  { href: "/vesilnyy-plan", label: "Чеклісти" },
  { href: "/spysok-gostey", label: "Список гостей" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/zaprosinnya", label: "Запрошення" },
  { href: "/rozsadka-gostey", label: "Розсадка" },
  { href: "/plan-dnya-vesillya", label: "План дня" },
] as const;

const CLOUD = [
  { id: "c1", src: "/landing/hero-photo.jpg", style: { left: 45, top: 378, width: 140, height: 153 } },
  { id: "c2", src: "/landing/feat-1.jpg", style: { left: 215, top: 483, width: 140, height: 153 } },
  { id: "c3", src: "/landing/compare-1.jpg", style: { left: 429, top: 154, width: 140, height: 153 } },
  { id: "c4", src: "/landing/feat-2.jpg", style: { left: 395, top: 499, width: 140, height: 91 } },
  { id: "c5", src: "/landing/feat-3.jpg", style: { left: 557, top: 590, width: 140, height: 91 } },
  { id: "c6", src: "/landing/feat-4.jpg", style: { left: 895, top: 216, width: 140, height: 91 } },
  { id: "c7", src: "/landing/compare-2.jpg", style: { left: 215, top: 216, width: 140, height: 91 } },
  { id: "c8", src: "/landing/compare-3.jpg", style: { left: 720, top: 531, width: 140, height: 119 } },
  { id: "c9", src: "/landing/couple.jpg", style: { left: 720, top: 171, width: 140, height: 119 } },
  { id: "c10", src: "/landing/hero-dress.jpg", style: { left: 900, top: 497, width: 140, height: 184 } },
  { id: "c11", src: "/landing/feat-1.jpg", style: { left: 1133, top: 216, width: 112, height: 122 } },
  { id: "c12", src: "/landing/hero-photo.jpg", style: { left: -19, top: 240, width: 112, height: 122 } },
  { id: "c13", src: "/landing/compare-1.jpg", style: { left: 1101, top: 451, width: 113, height: 127 } },
  { id: "c14", src: "/landing/feat-2.jpg", style: { left: 465, top: 612, width: 68, height: 76 } },
  { id: "c15", src: "/landing/feat-3.jpg", style: { left: 610, top: 133, width: 68, height: 76 } },
  { id: "c16", src: "/landing/feat-4.jpg", style: { left: 1285, top: 252, width: 106, height: 76 } },
  { id: "c17", src: "/landing/compare-2.jpg", style: { left: 1255, top: 400, width: 68, height: 76 } },
  { id: "c18", src: "/landing/compare-3.jpg", style: { left: 1337, top: 362, width: 102, height: 76 } },
] as const;

function canHover() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function FeaturesAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <section className="fata-features">
      <div className="fata-shell">
      {FEATURES.map((feature, i) => {
        const isOpen = open === i;
        return (
          <article
            key={feature.n}
            className={`fata-feature${isOpen ? " is-open" : ""}`}
            onMouseEnter={() => {
              if (canHover()) setOpen(i);
            }}
            onClick={() => {
              if (canHover()) {
                setOpen(i);
                return;
              }
              setOpen((cur) => (cur === i ? -1 : i));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen((cur) => (cur === i ? -1 : i));
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
          >
            <p className="fata-feature-n">{feature.n}</p>
            <h3>{feature.title}</h3>
            <div className="fata-feature-panel">
              <div className="fata-feature-panel-inner">
                {feature.points.map((point) => (
                  <p key={point.title} className="fata-feature-point">
                    <strong>{point.title}</strong>
                    <span>{point.text}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="fata-feature-img">
              <Image src={feature.img} alt="" fill sizes="(max-width: 1023px) 100vw, 390px" />
            </div>
          </article>
        );
      })}
      </div>
    </section>
  );
}

function Scribble() {
  return (
    <img
      className="fata-scribble"
      src="/landing/scribble.png"
      alt=""
      aria-hidden
    />
  );
}

function CrossOut() {
  return (
    <img
      className="fata-x"
      src="/landing/cross.svg"
      alt=""
      aria-hidden
    />
  );
}

function WrapWords({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      {i > 0 ? " " : null}
      <span className="fata-nowrap">{word}</span>
    </span>
  ));
}

function ComparePair({
  row,
  crossBefore = false,
}: {
  row: {
    beforeTitle: string;
    beforeText: string;
    afterTitle: string;
    afterText: string;
  };
  crossBefore?: boolean;
}) {
  return (
    <div className="fata-compare-pair">
      <div className="fata-compare-cell">
        <p className="fata-kicker">Було</p>
        <h3 className="fata-compare-title">
          {crossBefore ? <CrossOut /> : null}
          <WrapWords text={row.beforeTitle} />
        </h3>
        <p className="fata-compare-copy">{row.beforeText}</p>
      </div>
      <div className="fata-compare-rule" />
      <div className="fata-compare-cell">
        <p className="fata-kicker">Стало</p>
        <h3 className="fata-compare-title">
          <Scribble />
          <WrapWords text={row.afterTitle} />
        </h3>
        <p className="fata-compare-copy">{row.afterText}</p>
      </div>
    </div>
  );
}

function FataLogo({
  className = "fata-logo",
  src = "/landing/logo.svg",
}: {
  className?: string;
  src?: string;
}) {
  return (
    <Link href="/" className={className} aria-label="fata.studio">
      <img src={src} alt="fata.studio" width={154} height={32} />
    </Link>
  );
}

function AuthButtons({
  loginClass,
  startClass,
}: {
  loginClass: string;
  startClass: string;
}) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const dashboardHref = getHomePath(user?.role);

  if (hydrated && user) {
    return (
      <Link href={dashboardHref} className={startClass}>
        Кабінет
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className={loginClass}>
        Увійти
      </Link>
      <Link href="/register" className={startClass}>
        Розпочати
      </Link>
    </>
  );
}

function HeroCta({ className }: { className: string }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const loggedIn = Boolean(hydrated && user);

  return (
    <Link
      href={loggedIn && user ? getHomePath(user.role) : "/register"}
      className={className}
    >
      {loggedIn ? "Кабінет" : "Розпочати"}
    </Link>
  );
}

function HeroArtboard() {
  const [open, setOpen] = useState(false);

  return (
    <section className="fata-hero">
      <div className="fata-hero-stage hidden min-[1024px]:block">
        <div className="fata-hero-board">
          <FataLogo />
          <nav className="fata-nav" aria-label="Основне меню">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="fata-auth">
            <AuthButtons loginClass="fata-btn fata-btn-login" startClass="fata-btn fata-btn-start" />
          </div>
          <p className="fata-tagline">
            Єдина платформа <em>для всіх весільних завдань</em>
          </p>
          <h1 className="fata-title">
            <span className="fata-title-serif">
              <span className="fata-title-you">Ваше</span>{" "}
              <span className="fata-title-fill">ВЕСІЛЛЯ</span>
            </span>
            <span className="fata-title-sans">починається тут</span>
          </h1>
          <p className="fata-desc">
            Плануйте бюджет, запрошуйте гостей, малюйте розсадку, ведіть списки
            справ, контролюйте таймлайни — усе вдвох, в одному місці і без
            зайвого стресу.
          </p>
          <Link href="/register" className="fata-cta">
            Розпочати
          </Link>
          <div className="fata-photo">
            <Image
              src="/landing/hero-photo.jpg"
              alt="Сукня нареченої"
              fill
              priority
              sizes="555px"
            />
          </div>
        </div>
      </div>

      <div className={`fata-hero-mobile min-[1024px]:!hidden${open ? " is-open" : ""}`}>
        <div className="fata-m-head">
          <FataLogo className="fata-m-logo" />
          <button
            type="button"
            className="fata-m-burger"
            aria-label={open ? "Закрити меню" : "Меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
        {open ? (
          <nav className="fata-m-nav" aria-label="Основне меню">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <AuthButtons loginClass="fata-m-nav-login" startClass="fata-m-nav-start" />
          </nav>
        ) : null}
        <p className="fata-m-kicker">
          Єдина платформа <em>для всіх весільних завдань</em>
        </p>
        <h1 className="fata-m-title">
          <span className="fata-m-top">
            <span className="fata-m-you">Ваше</span>
            <span className="fata-m-fill">ВЕСІЛЛЯ</span>
          </span>
          <span className="fata-m-sans">починається тут</span>
        </h1>
        <p className="fata-m-desc">
          Плануйте бюджет, запрошуйте гостей, малюйте розсадку, ведіть списки
          справ, контролюйте таймлайни — усе вдвох, в одному місці і без
          зайвого стресу.
        </p>
        <div className="fata-m-photo">
          <Image
            src="/landing/hero-photo.jpg"
            alt="Сукня нареченої"
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 555px"
            priority
          />
        </div>
        <HeroCta className="fata-m-cta" />
      </div>
    </section>
  );
}

export function HomeLanding() {
  return (
    <div className="fata-page">
      <HeroArtboard />

      <section className="fata-sec2">
        <div className="fata-shell fata-sec2-grid">
        <div className="fata-sec2-photos">
          {DARK_ROWS.map((row) => (
            <div key={row.photo}>
              <Image src={row.photo} alt="" fill sizes="42vw" />
            </div>
          ))}
        </div>
        <div className="fata-sec2-body">
          <p className="fata-compare-intro">
            Ми змінюємо хаос і нерви на упорядковану спокійну організацію
            весілля:
          </p>
          <div className="fata-sec2-pairs">
            {DARK_ROWS.map((row) => (
              <ComparePair key={row.afterTitle} row={row} crossBefore />
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className="fata-sec2 is-light">
        <div className="fata-shell fata-sec2-grid">
        <div className="fata-sec2-photos">
          {LIGHT_ROWS.map((row) => (
            <div key={row.photo + row.afterTitle}>
              <Image src={row.photo} alt="" fill sizes="38vw" />
            </div>
          ))}
        </div>
        <div className="fata-sec2-body">
          <div className="fata-sec2-pairs">
            {LIGHT_ROWS.slice(0, 2).map((row) => (
              <ComparePair key={row.afterTitle} row={row} />
            ))}
          </div>
          <div className="fata-sec2-breakphoto">
            <Image
              src="/landing/compare-1.jpg"
              alt=""
              fill
              sizes="100vw"
            />
          </div>
          <div className="fata-sec2-pairs">
            {LIGHT_ROWS.slice(2).map((row) => (
              <ComparePair key={row.afterTitle} row={row} />
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className="fata-mobile">
        <div className="fata-mobile-band" />
        <div className="fata-shell fata-mobile-stage">
        <div className="fata-mobile-copy">
          <p>
            Зустріч із флористом? Примірка сукні чи дегустація меню?
            <br />
            Усі деталі, контакти підрядників, списки та кошторис — у твоєму
            смартфоні.
          </p>
        </div>
        <div className="fata-phone">
          <Image
            src="/landing/phone.png"
            alt="Мобільний застосунок fata.studio"
            width={373}
            height={773}
            sizes="373px"
          />
        </div>
        <Link href="/register" className="fata-dl">
          Скачати мобільний застосунок
        </Link>
        </div>
      </section>

      <FeaturesAccordion />

      <section className="fata-prefooter">
        <div className="fata-shell fata-prefooter-inner">
        <div className="fata-cloud" aria-hidden>
          {CLOUD.map((shot) => (
            <div key={shot.id} className="fata-cloud-item" style={shot.style}>
              <Image src={shot.src} alt="" fill sizes="220px" />
            </div>
          ))}
        </div>
        <div className="fata-prefooter-copy">
          <h2>
            З fata.studio{" "}
            <span>всі ці речі простіше і безкоштовно</span>
          </h2>
          <Link href="/register">Розпочати безкоштовно</Link>
        </div>
        </div>
      </section>

      <footer className="fata-foot">
        <div className="fata-shell fata-foot-inner">
        <div className="fata-foot-top">
          <div className="fata-foot-brand">
            <FataLogo src="/landing/logo-foot.svg" />
            <p>Сучасний інструмент для планування весілля</p>
          </div>
          <div>
            <h4>Продукт</h4>
            {FOOT_PRODUCT.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Компанія</h4>
            <Link href="/content">Про нас</Link>
            <Link href="/content">Ідеї</Link>
            <Link href="/content">Контакти</Link>
          </div>
          <div>
            <h4>Підтримка</h4>
            <Link href="/content">Допомога</Link>
            <Link href="/content">Умови використання</Link>
            <Link href="/content">Політика конфіденційності</Link>
            <Link href="/content">Зворотний зв’язок</Link>
          </div>
        </div>
        <div className="fata-foot-line" />
        <div className="fata-foot-bottom">
          <span>© 2026 fata.studio. Усі права захищені.</span>
          <span className="fata-foot-social">
            <a href="https://instagram.com" aria-label="Instagram">
              <img src="/landing/cloud/ig.svg" alt="" width={20} height={20} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <img src="/landing/cloud/fb.svg" alt="" width={20} height={20} />
            </a>
          </span>
        </div>
        </div>
      </footer>
    </div>
  );
}
