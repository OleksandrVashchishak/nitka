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
    icon: "guests",
    title: "Гнучкий облік парами та сім'ями",
    text: "Вносьте гостей одразу групами — з парами, дітьми чи супроводжуючими (+1), щоб чітко розуміти склад кожного запрошення.",
  },
  {
    icon: "vendors",
    title: "Зручний трекінг надісланих запрошень",
    text: "Відмічайте, кому вже надіслано посилання, хто підтвердив присутність, хто відмовився, а хто ще роздумує.",
  },
  {
    icon: "overview",
    title: "Наочна статистика в 1 клік",
    text: "Бачте точні цифри: скільки відповідей вже отримано, скільки людей буде точно, а скільки ще чекають на підтвердження.",
  },
  {
    icon: "tasks",
    title: "Повна синхронізація з сервісом",
    text: "Підтверджені гості автоматично потраплять у модуль «Розсадка», щоб ви садили лише тих, хто точно завітає на свято.",
  },
] as const;

const COMPARE_ROWS = [
  {
    problem: {
      title:
        "Плутанина з «+1», забутими прізвищами пар та суперечливими списками в чатах",
      text: "Плутанина з «+1», забутими прізвищами пар та суперечливими списками в чатах.",
    },
    solution: {
      title:
        "Єдиний систематизований список із прив'язкою пар, сімей та уточненнями «+1»",
      text: "Єдиний систематизований список із прив'язкою пар, сімей та уточненнями «+1».",
    },
  },
  {
    problem: {
      title: "Складні підрахунки для ресторану: хто прийде, а хто раптово скасував візит",
      text: "Складні підрахунки для ресторану: хто прийде, а хто раптово скасував візит.",
    },
    solution: {
      title:
        "Автоматична статистика відповідей (наприклад, 18 прийдуть, 2 відмовили, 10 очікують)",
      text: "Автоматична статистика відповідей (наприклад, 18 прийдуть, 2 відмовили, 10 очікують).",
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
          Типові проблеми ведення списку гостей та як їх вирішує fata.studio
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
    title: "Пара, яка прагне чіткості та порядку",
    text: "Забудьте про записи на папірцях та розрізнені нотатки — вся інформація про гостей зібрана в одному місці.",
  },
  {
    title: "Наречені з великою кількістю сімей та компаній",
    text: "Зручно надсилайте одне запрошення на всю родину чи пару та відстежуйте їхнє спільне рішення.",
  },
  {
    title: "Ті, хто фіналізує меню та посадку для ресторану",
    text: "Знайте точну кількість дорослих і дітей, щоб не переплачувати за зайві порції та правильно розсадити столи.",
  },
  {
    title: "Пара, яка цінує свій час та емоційний спокій",
    text: "Контролюйте процес збору відповідей без необхідності постійно перепитувати кожного в особистих повідомленнях.",
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
    title: "Внесіть гостей та згрупуйте їх",
    text: "Запишіть імена, додайте пари, сім'ї чи примітки про «+1», обравши відповідні категорії (родина, друзі, колеги).",
  },
  {
    icon: "vendors",
    title: "Відправляйте запрошення та оновлюйте статуси",
    text: "Фіксуйте надсилання сайту-запрошення та відмічайте відповіді гостей: «прийдуть», «відмовилися» або «очікуємо».",
  },
  {
    icon: "overview",
    title: "Отримуйте точну статистику та передавайте далі",
    text: "Відстежуйте готовність списку у відсотках та використовуйте дані для розрахунку банкету й схеми розсадки.",
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
    q: "Як додати до списку запрошеного з парою або дитиною?",
    a: "Ви можете створити один запис для всієї сім'ї або пари та вказати конкретні імена для супроводу (+1).",
  },
  {
    q: "Як працює статистика відповідей гостей?",
    a: "Наочна лічилка показує загальну кількість запрошень та розкладені статуси: скільки відповідей отримано, скільки осіб підтвердили візит, скільки відмовилися та скільки ще перебувають у процесі прийняття рішення.",
  },
  {
    q: "Чи синхронізується список гостей з іншими інструментами?",
    a: "Так! Тільки підтверджені гості потраплять у конструктор «Розсадка», що дозволяє уникнути помилок при плануванні столів.",
  },
  {
    q: "Чи можна відмічати дітей та потреби щодо їх посадки (дитяче крісло)?",
    a: "Так, для кожної дитини ви можете відмічати, чи вона хоче сидіти з батьками, чи за дитячим столом, а також чи потрібне їй дитяче крісло.",
  },
  {
    q: "Чи безкоштовно ведення списку гостей?",
    a: "Так, додавання гостей, групування, трекінг статусів та аналітика повністю безкоштовні.",
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
            Готові скласти
          </span>
          <br />
          <span className="fata-service-cta__title-accent">список гостей?</span>
        </h2>
        <div className="fata-service-cta__action">
          <Button href="/register" tone="ink" size="l">
            Скласти список безкоштовно
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

const OTHER_TOOLS = [
  {
    href: "/rozsadka-gostey",
    title: "Розсадка гостей",
    text: "Інтерактивна схема столів та швидка розсадка підтверджених гостей за допомогою drag-and-drop.",
  },
  {
    href: "/vesilnyy-sayt",
    title: "Сайт-запрошення",
    text: "Створюйте стильні веб-запрошення та збирайте відповіді гостей онлайн.",
  },
  {
    href: "/vesilnyy-byudzhet",
    title: "Бюджет весілля",
    text: "Повний контроль витрат, авансів та фінальних розрахунків з підрядниками в одному місці.",
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

export const PAGE_TITLE = "Розумний список гостей на весілля: без плутанини з «+1»";
export const PAGE_DESCRIPTION =
  "Об'єднуйте гостей у пари та сім'ї, надсилайте запрошення та відстежуйте підтвердження присутності в одному місці.";

export function SpysokGosteyPage() {
  const jsonLd = buildServiceJsonLd({
    path: "/spysok-gostey",
    title: PAGE_TITLE,
    shortName: "Список гостей",
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
          <p className="fata-service-hero__eyebrow">FATA.STUDIO • ГОСТІ</p>
          <h1 className="fata-service-hero__title">{PAGE_TITLE}</h1>
          <p className="fata-service-hero__lead">
            Об'єднуйте гостей у пари та сім'ї, надсилайте запрошення та
            відстежуйте відповіді. Прозора статистика підтверджених присутніх
            для вашого банкету без зайвих нервів.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Внести гостей
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
