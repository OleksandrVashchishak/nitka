import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { Reveal } from "@/components/landing/reveal";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "@/styles/landing/service.scss";

const FEATURES = [
  {
    icon: "vendors",
    title: "Єдиний список усіх спеціалістів",
    text: "Зберігайте контакти фотографа, ведучого, флориста чи декоратора в одному місці без потреби шукати номери у чатах.",
  },
  {
    icon: "tasks",
    title: "Чіткі статуси бронювання",
    text: "Наочно бачте, хто вже підтверджений і заброньований, а щодо кого ви ще очікуєте відповіді або проводите переговори.",
  },
  {
    icon: "budget",
    title: "Контроль авансів та залишків",
    text: "Точно фіксуйте, кому й скільки вже виплатили в якості завдатку, та яку суму потрібно віддати безпосередньо в день весілля.",
  },
  {
    icon: "guests",
    title: "Список усіх можливих підрядників",
    text: "Боїтесь про щось забути? У нас є всі можливі типи підрядників, будьте впевнені, що нічого не упустили.",
  },
] as const;

const COMPARE_ROWS = [
  {
    problem: {
      title:
        "Загублені контакти, переписки в різних месенджерах та забуті домовленості",
      text: "Загублені контакти, переписки в різних месенджерах та забуті домовленості.",
    },
    solution: {
      title:
        "Єдина систематизована картка кожного підрядника з контактами та деталями",
      text: "Єдина систематизовано картка кожного підрядника з контактами та деталями.",
    },
  },
  {
    problem: {
      title:
        "Нерозуміння, скільки завдатків виплачено та скільки грошей треба віддати в день весілля",
      text: "Нерозуміння, скільки завдатків виплачено та скільки грошей треба віддати в день весілля.",
    },
    solution: {
      title:
        "Автоматичний облік авансів та прозорий баланс виплат по кожному спеціалісту",
      text: "Автоматичний облік авансів та прозорий баланс виплат по кожному спеціалісту.",
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
          Типові проблеми обліку підрядників та як їх вирішує fata.studio
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
    title: "Пара, яка працює з десятком різних підрядників",
    text: "Тримайте під контролем команду від фотографа й візажиста до кейтерингу та технічного підрядника без хаосу.",
  },
  {
    title: "Наречені, які прагнуть чіткого фінансового обліку",
    text: "Завжди знайте точну суму вже сплаченого авансу і плануйте фінальні розрахунки напередодні свята.",
  },
  {
    title: "Ті, хто організовує весілля самостійно",
    text: "Інструмент замінює професійного координатора у питанні систематизації контактів та статусів готовності.",
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
    title: "Додайте підрядника та його контакти",
    text: "Вкажіть роль (фотограф, ведучий, флорист), збережіть номер телефону, посилання на портфоліо чи соцмережі.",
  },
  {
    icon: "guests",
    title: "Вкажіть статуси та суми",
    text: "Відмітьте статус бронювання, внесіть суму загального гонорару та розмір сплаченого завдатку.",
  },
  {
    icon: "overview",
    title: "Контролюйте готовність та розрахунки",
    text: "Відстежуйте залишкові платежі та синхронізуйте дані з бюджетом весілля у реальному часі.",
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
    q: "Яких підрядників можна додавати до списку?",
    a: "Абсолютно всіх! Ви можете створювати будь-які категорії: фотографи, відеографи, ведучі, декоратори, стилісти, кейтеринг, флористи, кондитери чи інші церемоніймейстери.",
  },
  {
    q: "Як працює облік завдатків та фінальних виплат?",
    a: "Ви вказуєте повну вартість послуги та суму авансу. Система автоматично розраховує залишок, який необхідно сплатити в день свята або після надання послуги.",
  },
  {
    q: "Чи синхронізуються дані підрядників з бюджетом?",
    a: "Так, суми завдатків та запланованих витрат на підрядників автоматично враховуються у вашому загальному весільному бюджеті.",
  },
  {
    q: "Коли буде доступна повноцінна база весільних підрядників?",
    a: "Ми активно розширюємо каталог перевірених весільних спеціалістів України. Уже незабаром ви зможете шукати, порівнювати та бронювати найкращих фахівців прямо на Fata.studio.",
  },
  {
    q: "Чи безкоштовний цей інструмент?",
    a: "Так, функціонал ведення списку підрядників, збереження контактів та контролю розрахунків повністю безкоштовний.",
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
            Готові зібрати
          </span>
          <br />
          <span className="fata-service-cta__title-accent">команду мрії?</span>
        </h2>
        <div className="fata-service-cta__action">
          <Button href="/register" tone="ink" size="l">
            Внести підрядника безкоштовно
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

const OTHER_TOOLS = [
  {
    href: "/vesilnyy-byudzhet",
    title: "Бюджет весілля",
    text: "Повний контроль витрат, авансів та фінальних розрахунків з підрядниками в одному місці.",
  },
  {
    href: "/vesilnyy-plan",
    title: "План весілля",
    text: "Автоматичний чекліст завдань для швидкої та організованої підготовки без хаосу.",
  },
  {
    href: "/rozsadka-gostey",
    title: "Розсадка гостей",
    text: "Інтерактивна схема столів та розсадка гостей для вашого банкету.",
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

export const PAGE_TITLE = "Контроль весільних підрядників";
export const PAGE_DESCRIPTION =
  "Єдиний список підрядників весілля: контакти, статуси бронювання та облік авансів і фінальних розрахунків в одному кабінеті.";

export function PidryadnykyPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/pidryadnyky`;

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
            FATA.STUDIO • ПІДРЯДНИКИ
          </p>
          <h1 className="fata-service-hero__title">{PAGE_TITLE}</h1>
          <p className="fata-service-hero__lead">
            Забудьте про хаос у нотатках та загублені контакти. Фіксуйте
            заброньовані послуги, контролюйте фінанси завдатків та фінальні
            розрахунки в єдиному зручному кабінеті.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Організувати підрядників
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
