import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { Reveal } from "@/components/landing/reveal";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "@/styles/landing/service.scss";

const FEATURES = [
  {
    icon: "tasks",
    title: "Автоматичний персональний чекліст",
    text: "Розумне плануваання  генерує чіткий список тасків саме під ваш формат свята — від виїзної церемонії до кенді-бару.",
  },
  {
    icon: "guests",
    title: "Зручний розподіл обов'язків",
    text: "Вбудований планер з спільним доступом дозволяє призначати відповідальних (наречена, наречений чи спільні таски) за один клік.",
  },
  {
    icon: "dayplan",
    title: "Гнучке фільтрування та дедлайни",
    text: "Сортуйте справи за категоріями (підрядники, гості, вбрання, декор) та терміновістю, щоб нічого не випало з уваги.",
  },
  {
    icon: "overview",
    title: "Наочний прогрес готовності",
    text: "Процентний трекер готовності весілля мотивує та показує, скільки завдань вже виконано, а скільки залишилося.",
  },
] as const;

const COMPARE_ROWS = [
  {
    problem: {
      title: "Розпорошеність та хаос у нотатках",
      text: "Нотатки, екселі, списки, що ще треба зробити, що зроблено?",
    },
    solution: {
      title: "Єдиний центр управління весіллям",
      text: "Одне місце для обох партнерів з можливістю розподілу відповідальності та дедлайнами.",
    },
  },
  {
    problem: {
      title: "Страх щось забути або не встигнути",
      text: "Стрес від думки, що важлива деталь (бронювання апаратури, примірка чи замовлення торта) вислизне з уваги.",
    },
    solution: {
      title: "Все в одному місці і ми думаємо за вас",
      text: "Fata studio може помітити, що чогось бракує і нагадати про це. Fata studio знає все про підготовку весілля.",
    },
  },
] as const;

function CompareScribble() {
  return (
    <svg
      className="fata-service-compare__scribble"
      viewBox="0 0 420 140"
      fill="none"
      aria-hidden
    >
      <path
        d="M70 34C150 4 330 6 390 44c36 24 14 66-80 82-100 16-220 10-270-18C2 88 20 52 70 34c26-9 60-14 96-16"
        stroke="#FF4200"
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceCompare() {
  return (
    <section className="fata-service-compare">
      <div className="fata-service-shell">
        <h2 className="fata-service-sr-only">
          Типові проблеми підготовки до весілля та як їх вирішує fata.studio
        </h2>
        {COMPARE_ROWS.map((row, i) => (
          <div
            className={`fata-service-compare__row fata-service-compare__row--${i + 1}`}
            key={row.problem.title}
          >
            <Reveal className="fata-service-compare__problem">
              <p className="fata-service-compare__eyebrow">Проблема</p>
              <h3 className="fata-service-compare__title">
                {row.problem.title}
              </h3>
              <p className="fata-service-compare__text">{row.problem.text}</p>
            </Reveal>
            <img
              src="/landing/comparison-arrow.svg"
              alt=""
              aria-hidden
              className="fata-service-compare__arrow"
            />
            <Reveal className="fata-service-compare__solution" delay={120}>
              <CompareScribble />
              <p className="fata-service-compare__eyebrow">Рішення</p>
              <h3 className="fata-service-compare__title">
                {row.solution.title}
              </h3>
              <p className="fata-service-compare__text">{row.solution.text}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

const AUDIENCE = [
  {
    title: "Пара, яка тільки починає підготовку",
    text: "Не знаєте, з чого почати? Інтерактивний весільний органайзер автоматично сформує покроковий план підготовки до весілля з підказками.",
  },
  {
    title: "Пара, яка організовує весілля самостійно",
    text: "Замість десятків таблиць та записників ви отримуєте єдиний календар підготовки до весілля та повноцінний таск пленер, де все зібрано в одному місці.",
  },
  {
    title: "Наречені, які ділять обов'язки на двох",
    text: "Зручний додаток для підготовки до весілля дозволяє бачити, хто за що відповідає (наприклад, Оля — за декор, Роман — за транспорт), уникаючи непорозумінь.",
  },
  {
    title: "Наречені, які втомилися від бардаку і непорозумінь зі статусами завдань",
    text: "Підійде тим, хто шукає новий інструмент, який таки буде працювати і де ви справді будете відслідковувати результати вашого планування разом.",
  },
] as const;

function ServiceAudience() {
  return (
    <section className="fata-service-audience">
      <div className="fata-service-audience__main fata-service-shell">
        <h2 className="fata-service-audience__title">
          Для кого підійде ця функція
        </h2>
        <div className="fata-service-audience__list">
          {AUDIENCE.map((item, i) => (
            <Reveal
              className="fata-service-audience__item"
              key={item.title}
              delay={i * 80}
            >
              <p className="fata-service-audience__num">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="fata-service-audience__body">
                <h3 className="fata-service-audience__item-title">
                  {item.title}
                </h3>
                <p className="fata-service-audience__item-text">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceFeatures() {
  return (
    <section className="fata-service-features">
      <div className="fata-service-shell">
        <h2 className="fata-service-features__title">
          Як це полегшить підготовку до весілля?
        </h2>
        <div className="fata-service-features__grid">
          {FEATURES.map((feature, i) => (
            <Reveal
              className="fata-service-card"
              key={feature.title}
              delay={i * 80}
            >
              <div className="fata-service-card__icon">
                <CabinetNavIcon name={feature.icon} size={24} />
              </div>
              <h3 className="fata-service-card__title">{feature.title}</h3>
              <p className="fata-service-card__text">{feature.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const HOW_IT_WORKS = [
  {
    icon: "tasks",
    title: "Скористайтесь розумним плануванням",
    text: "Дайте відповідь на кілька запитань про ваше весілля (формат, наявність виїзної церемонії, гостей з інших міст), і наш весільний таск менеджер сформує готовий список завдань.",
  },
  {
    icon: "guests",
    title: "Закривайте цілі по черзі",
    text: "Локація, підрядники, гості, запрошення, вбрання — у логічному порядку, з дедлайнами та підказками по дорозі.",
  },
  {
    icon: "overview",
    title: "Тримайте все в fata.studio",
    text: "Бюджет, обране, список гостей та заявки живуть поруч із планом — один кабінет замість п'яти сервісів.",
  },
] as const;

function ServiceHowItWorks() {
  return (
    <section className="fata-service-how">
      <div className="fata-service-shell">
        <h2 className="fata-service-how__title">Як це працює?</h2>
        <div className="fata-service-how__grid">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal className="fata-service-card" key={step.title} delay={i * 80}>
              <div className="fata-service-card__icon">
                <CabinetNavIcon name={step.icon} size={24} />
              </div>
              <h3 className="fata-service-card__title">
                {i + 1}. {step.title}
              </h3>
              <p className="fata-service-card__text">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "Чи можна додавати власні завдання до списку?",
    a: "Так, ви можете легко створити власне завдання, вказати для нього дедлайн, категорію та призначити відповідального.",
  },
  {
    q: "Як працює планер з спільним доступом для пари?",
    a: "Ви надсилаєте запрошення партнеру, і він отримує повний доступ до дашборду. Ви можете разом редагувати чекліст, відмічати виконане та ділити таски.",
  },
  {
    q: "Чи підходить сервіс, якщо ми вже розпочали підготовку?",
    a: "Звісно! Під час первинного налаштування ви просто позначаєте кроки, які вже зробили, і система залишить у списку лише актуальні справи.",
  },
  {
    q: "Чи безкоштовний цей весільний планер?",
    a: "Так, базова функціональність створення завдань та розумного планування доступна безкоштовно після реєстрації.",
  },
  {
    q: "Чи є підказки, які саме завдання потрібні для мого весілля?",
    a: "Так, наш весільний пленер українською має вбудовану базу стандартних та специфічних весільних задач (від РАЦСу до кенді-бару).",
  },
] as const;

function ServiceFaq() {
  return (
    <section className="fata-service-faq">
      <div className="fata-service-faq__main fata-service-shell">
        <h2 className="fata-service-faq__title">Часті питання</h2>
        <div className="fata-service-faq__list">
          {FAQ.map((item, i) => (
            <Reveal
              className="fata-service-faq__item"
              key={item.q}
              delay={Math.min(i, 3) * 60}
            >
              <h3 className="fata-service-faq__q">{item.q}</h3>
              <p className="fata-service-faq__a">{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCta() {
  return (
    <section className="fata-service-cta">
      <Reveal className="fata-service-cta__reveal">
        <h2 className="fata-service-cta__title">
          <span className="fata-service-cta__title-light">
            Готові організувати
          </span>
          <br />
          <span className="fata-service-cta__title-accent">весілля</span>{" "}
          <span className="fata-service-cta__title-light">без хаосу?</span>
        </h2>
        <div className="fata-service-cta__action">
          <Button href="/register" tone="ink" size="l">
            Розпочати безкоштовно
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

const OTHER_TOOLS = [
  {
    href: "/budget",
    title: "Бюджет весілля",
    text: "Контролюйте витрати, аванси та фінальні розрахунки з підрядниками.",
  },
  {
    href: "/vesilnyy-sayt",
    title: "Сайт-запрошення",
    text: "Створюйте стильні веб-запрошення та збирайте відповіді гостей.",
  },
  {
    href: "/seating",
    title: "Розсадка гостей",
    text: "Інтерактивна схема столів та списки гостей в одному місці.",
  },
] as const;

function ServiceOtherTools() {
  return (
    <section className="fata-service-other">
      <div className="fata-service-shell">
        <h2 className="fata-service-other__title">Інші інструменти для пари</h2>
        <div className="fata-service-other__grid">
          {OTHER_TOOLS.map((tool, i) => (
            <Reveal
              className="fata-service-other__card"
              key={tool.href}
              delay={i * 80}
            >
              <div className="fata-service-other__image" />
              <h3 className="fata-service-other__card-title">{tool.title}</h3>
              <p className="fata-service-other__card-text">{tool.text}</p>
              <Link href={tool.href} className="fata-service-other__link">
                Читати <span aria-hidden>›</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PAGE_TITLE = "План весілля онлайн: список завдань без хаосу";
export const PAGE_DESCRIPTION =
  "Український весільний планер: персональний список справ за 3 кроки, розподіл обов'язків і дедлайни під контролем.";

export function VesilnyyPlanPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/vesilnyy-plan`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Головна",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: PAGE_TITLE,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: pageUrl,
      inLanguage: "uk-UA",
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <div className="fata-service-hero">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="fata-service-hero__main">
        <div className="fata-service-hero__copy">
          <p className="fata-service-hero__eyebrow">FATA.STUDIO • ЗАВДАННЯ</p>
          <h1 className="fata-service-hero__title">{PAGE_TITLE}</h1>
          <p className="fata-service-hero__lead">
            Забудьте про хаотичне планування. Fata.studio — це сучасний
            український весільний пленер, який формує персональний список
            справ за 3 кроки, допомагає розподіляти обов&rsquo;язки та тримає
            дедлайни під контролем.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Спробувати безкоштовно
            </Button>
            <Button href="/login" tone="outline" size="l">
              Увійти
            </Button>
          </div>
        </div>

        <div className="fata-service-hero__media">
          <div className="fata-service-hero__media-placeholder">
            місце під зображення
          </div>
        </div>
      </div>

      <ServiceFeatures />
      <ServiceCompare />
      <ServiceAudience />
      <ServiceHowItWorks />
      <ServiceFaq />
      <ServiceCta />
      <ServiceOtherTools />
    </div>
  );
}
