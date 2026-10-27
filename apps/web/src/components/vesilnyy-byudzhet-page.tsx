import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { Reveal } from "@/components/landing/reveal";
import {
  buildServiceJsonLd,
  serializeJsonLd,
} from "@/lib/service-json-ld";
import "@/styles/landing/service.scss";

const FEATURES = [
  {
    icon: "budget",
    title: "Мультивалютність у 1 клік",
    text: "Легко перемикайтеся між гривнею (₴) та доларом ($) — уся аналітика та підсумки миттєво перераховуються за зручним для вас курсом.",
  },
  {
    icon: "guests",
    title: "Персональний розподіл витрат",
    text: "Чітко фіксуйте, чиї це витрати: нареченого, нареченої, спільні чи внески батьків, щоб уникнути непорозумінь.",
  },
  {
    icon: "vendors",
    title: "Авто-синхронізація з підрядниками",
    text: "Усі внесені підрядники, їхні гонорари та сплачені завдатки автоматично підтягуються в бюджет без подвійного введення.",
  },
  {
    icon: "overview",
    title: "Підсумки за категоріями та виплатами",
    text: "Бачите підсумки фактичних витрат по категоріях та виплатам підрядникам, щоб швидко орієнтуватися в поточному стані.",
  },
] as const;

const COMPARE_ROWS = [
  {
    problem: {
      title: "Заплутані Excel-таблиці, плутанина у валютах та ручні перерахунки",
      text: "Різні валюти й розрізнені таблиці ускладнюють облік і змушують перераховувати суми вручну.",
    },
    solution: {
      title: "Автоматичний онлайн-калькулятор із миттєвим перемиканням між ₴ та $",
      text: "Вносьте витрати у зручній валюті й миттєво переглядайте загальний кошторис у гривнях або доларах.",
    },
  },
  {
    problem: {
      title:
        "Нерозуміння, хто за що вже заплатив і скільки завдатків віддано підрядникам",
      text: "Важко відстежити внески кожного та зрозуміти, які аванси вже сплачені, а які платежі ще попереду.",
    },
    solution: {
      title: "Чіткий облік джерел фінансування та наскрізна синхронізація з підрядниками",
      text: "Бачте внески кожного, а сплачені аванси підрядників автоматично враховуються в загальному бюджеті.",
    },
  },
] as const;

function CompareScribble() {
  return (
    <img
      src="/landing/comparison-scribble.svg"
      alt=""
      aria-hidden
      className="fata-service-compare__scribble"
    />
  );
}

function ServiceCompare() {
  return (
    <section className="fata-service-compare">
      <div className="fata-service-shell">
        <h2 className="fata-service-sr-only">
          Типові проблеми ведення бюджету весілля та як їх вирішує fata.studio
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
    title: "Пара, яка розплачується в різних валютах",
    text: "Зручно вести фікс в гривні за банкет та розраховуватись в доларах з фотографом чи декор-студією.",
  },
  {
    title: "Наречені, які ділять весільний кошторис",
    text: "Фіксуйте особисті та спільні покупки, а також внески рідних для абсолютної фінансової прозорості.",
  },
  {
    title: "Ті, хто контролює кожну копійку та закупівлю",
    text: "Розподіляйте всі витрати за зручними категоріями: від образів наречених і каблучок до кейтерингу й дрібного декору.",
  },
  {
    title: "Пара, яка хоче тримати всі платежі під контролем",
    text: "Бачте загальну суму витрат, сплачені аванси та решту виплат підрядникам, щоб не губитися в розрахунках.",
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
    title: "Заповнюйте фактичні витрати та категорії",
    text: "Вкажіть фактичні платежі, оберіть валюту (₴ чи $) та розподіліть витрати за категоріями.",
  },
  {
    icon: "vendors",
    title: "Вносьте підрядників та реальні витрати",
    text: "Записуйте кожну покупку, вказуйте платника, а підрядники з вкладки «Підрядники» додадуться автоматично.",
  },
  {
    icon: "overview",
    title: "Аналізуйте підсумки витрат у реальному часі",
    text: "Відстежуйте підсумки витрат за категоріями, суму виплачених авансів та решту виплат підрядникам в одному місці.",
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
    q: "Чи безкоштовний весільний калькулятор бюджету?",
    a: "Так, базовий функціонал обліку фактичних витрат, підсумків та синхронізації з підрядниками повністю безкоштовний для всіх зареєстрованих користувачів.",
  },
  {
    q: "Чи можна розділити витрати між нареченим, нареченою та батьками?",
    a: "Так, для кожного пункту витрат можна вказати джерело фінансування (наречена, наречений, спільні кошти, батьки), щоб бачити персональний підсумок для кожного.",
  },
  {
    q: "Чи бачитиму я підсумки витрат за категоріями та виплатами?",
    a: "Звісно. Система показує підсумки фактичних витрат за категоріями та виплатами підрядникам, щоб ви мали повний огляд поточних платежів.",
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
            Готові вести облік витрат
          </span>
          <br />
          <span className="fata-service-cta__title-accent">без плутанини?</span>
        </h2>
        <div className="fata-service-cta__action">
          <Button href="/register" tone="ink" size="l">
            Почати облік витрат
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

const OTHER_TOOLS = [
  {
    href: "/pidryadnyky",
    title: "Підрядники",
    text: "Єдиний список фахівців, облік їхніх контактів, статусів бронювання та завдатків.",
  },
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
                Читати <img src="/landing/chevron-right.svg" alt="" width={14} height={14} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PAGE_TITLE =
  "Розумний бюджет весілля: повний контроль витрат без переплат";
export const PAGE_DESCRIPTION =
  "Відстежуйте витрати в гривнях і доларах, діліть внески та бачте аванси підрядників автоматично в бюджеті весілля.";

export function VesilnyyByudzhetPage() {
  const jsonLd = buildServiceJsonLd({
    path: "/vesilnyy-byudzhet",
    title: PAGE_TITLE,
    shortName: "Бюджет весілля",
    description: PAGE_DESCRIPTION,
    faq: FAQ,
  });

  return (
    <div className="fata-service-hero">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <div className="fata-service-hero__main">
        <div className="fata-service-hero__copy">
          <p className="fata-service-hero__eyebrow">
            FATA.STUDIO • БЮДЖЕТ ВЕСІЛЛЯ
          </p>
          <h1 className="fata-service-hero__title">{PAGE_TITLE}</h1>
          <p className="fata-service-hero__lead">
            Відстежуйте витрати в гривнях та доларах, розділяйте внески та
            бачте автоматично враховані аванси підрядників в єдиній прозорій
            таблиці.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Почати облік витрат
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
