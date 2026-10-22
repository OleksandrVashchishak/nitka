import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { Reveal } from "@/components/landing/reveal";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "@/styles/landing/service.scss";

const FEATURES = [
  {
    icon: "tasks",
    title: "Гнучкі конфігурації столів",
    text: "Обирайте будь-які форми: круглі, прямокутні, Т- та П-подібні столи, президіум чи дитячу зону. Розсаджуйте гостей легким Drag-and-Drop.",
  },
  {
    icon: "guests",
    title: "Розумне групування гостей",
    text: "Об'єднуйте гостей у групи — родину нареченого, колег чи шкільних друзів, — щоб зручно садити їх разом або цілими сім'ями.",
  },
  {
    icon: "dayplan",
    title: "Автоматичні статуси присутніх",
    text: "Статуси («прийдуть» / «не прийдуть») автоматично підтягуються зі вкладки «Гості», тож ви бачите лише актуальний список для розсадки.",
  },
  {
    icon: "overview",
    title: "Готові макети під друк",
    text: "В один клік формуйте дизайн посадкової карти та іменних карток на столи без витрат на сторонніх дизайнерів.",
  },
] as const;

const COMPARE_ROWS = [
  {
    problem: {
      title: "Зайві витрати на дизайнера та правки в останні дні",
      text: "Кожна зміна розсадки вимагає нових версток, макетів та повторних витрат на дизайнера.",
    },
    solution: {
      title:
        "Власноруч створіть дизайн посадкової карти та іменних карток безкоштовно",
      text: "Генеруйте макети А4 без сторонніх послуг, без повторних витрат і без терміну очікування.",
    },
  },
  {
    problem: {
      title: "Хаос зі зміною списку гостей напередодні весілля",
      text: "Кожне скасування чи нове підтвердження вимагає ручної пересадки, нової верстки та повторного друку.",
    },
    solution: {
      title: "Миттєво пересаджуйте гостей та оновлюйте макети під друк без стресу",
      text: "Зміна списку гостей напередодні? Пересаджуйте гостей в одному інтерфейсі й отримуйте оновлені листи під друк.",
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
        d="M48 78c-18-28 38-58 118-64 86-6 168 8 198 38 28 28 8 54-48 64-62 12-168 16-228-2-42-12-52-38-28-52 18-10 62-4 96 6"
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
          Типові проблеми розсадки гостей та як їх вирішує fata.studio
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
    title: "Пара, яка прагне контролювати свій весільний бюджет",
    text: "Не витрачайте кошти на послуги графічних дизайнерів для оформлення схем столів та посадкової карти.",
  },
  {
    title: "Наречені, які хочуть комфорту для кожного гостя",
    text: "Зручно групуйте гостей за інтересами, віком чи родинними зв'язками, щоб усім було затишно за столом.",
  },
  {
    title: "Ті, хто зіштовхується зі змінами в останні дні",
    text: "Якщо хтось із гостей раптово скасує візит або прийде з парою — ви легко змінете схему та передрукуєте макети.",
  },
  {
    title: "Організатори та пари з великою кількістю гостей",
    text: "Інтерактивна план-карта дозволяє швидко орієнтуватися у сотнях посадкових місць, без плутанини у виборах.",
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
    title: "Сформуйте план залу та столи",
    text: "Додайте необхідну кількість столів, оберіть їхню форму (круглі, прямокутні, президіум) та вкажіть кількість місць за кожним.",
  },
  {
    icon: "guests",
    title: "Погрупуйте і розсадіть гостей за допомогою Drag-and-Drop",
    text: "Перетягуйте гостей із синхронізованого списку на відповідні місця, групуючи за сім'ями чи компаніями.",
  },
  {
    icon: "overview",
    title: "Згенеруйте макети та роздрукуйте",
    text: "Оберіть стильний дизайн для посадкової карти та іменних карток і завантажте готові макети для миттєвого друку.",
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
    q: "Чи синхронізується розсадка зі списком гостей?",
    a: "Так, усі статуси («підтвердження» або «ні, не зможуть прийти») автоматично оновлюються з вашого загального списку гостей, тож ви садите лише тих, хто точно буде.",
  },
  {
    q: "Які типи столів можна додавати на схему?",
    a: "Ви можете обирати круглі, прямокутні, Т- та П-подібні столи, окремий президіум для наречених та дитячі столи.",
  },
  {
    q: "Як роздрукувати посадкову карту та картки на столи?",
    a: "Сервіс автоматично перетворює готові макети. Вам достатньо лише скачати PDF-файл та роздрукувати його на домашньому принтері чи в найближчій поліграфії.",
  },
  {
    q: "Чи можу я вносити зміни за день до весілля?",
    a: "Звісно! Ви можете змінювати розсадку в будь-який момент, пересаджувати гостей в один клік і одразу отримувати оновлені листи під друк.",
  },
  {
    q: "Чи потрібно платити за завантаження дизайну карток?",
    a: "Ні, базова генерація схем розсадки, посадкових карт та іменних карток повністю безкоштовна після реєстрації.",
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
            Готові створити ідеальну
          </span>
          <br />
          <span className="fata-service-cta__title-accent">розсадку</span>
          <span className="fata-service-cta__title-light">?</span>
        </h2>
        <div className="fata-service-cta__action">
          <Button href="/register" tone="ink" size="l">
            Створити схему безкоштовно
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

const OTHER_TOOLS = [
  {
    href: "/vesilnyy-plan",
    title: "План весілля",
    text: "Автоматичний чекліст завдань для швидкої та організованої підготовки без хаосу.",
  },
  {
    href: "/vesilnyy-sayt",
    title: "Сайт-запрошення",
    text: "Створюйте стильні веб-запрошення та збирайте відповіді гостей онлайн.",
  },
  {
    href: "/guests",
    title: "Список гостей",
    text: "Зручний облік запрошених, підтвердження присутності та контакти в одному місці.",
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

export const PAGE_TITLE = "Інтерактивна розсадка гостей на весілля";
export const PAGE_DESCRIPTION =
  "Схема столів для весілля онлайн: розсадка гостей перетягуванням, готові макети посадкових карт та іменних карток для друку.";

export function RozsadkaGosteyPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/rozsadka-gostey`;

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
          <p className="fata-service-hero__eyebrow">
            FATA.STUDIO • РОЗСАДКА ГОСТЕЙ
          </p>
          <h1 className="fata-service-hero__title">{PAGE_TITLE}</h1>
          <p className="fata-service-hero__lead">
            Створюйте схему столів у будь-якій конфігурації, розсаджуйте
            гостей простим перетягуванням та генеруйте готові макети
            посадкових карт. Економте час, бюджет та нерви в останні дні
            перед святом.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Створити схему розсадки
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
