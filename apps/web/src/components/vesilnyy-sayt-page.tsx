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
    icon: "overview",
    title: "Готові стильні шаблони",
    text: "Обирайте дизайн, який ідеально підходить під концепцію та палітру вашого весілля — від мінімалізму до класики.",
  },
  {
    icon: "tasks",
    title: "Гнучке налаштування блоків",
    text: "Додавайте лише те, що потрібно: історію пропозиції, інформацію про наречених, дрескод, таймінг чи локацію на карті.",
  },
  {
    icon: "dayplan",
    title: "Миттєва відправка гостям",
    text: "Один клік — і готове персональне посилання вже в месенджері вашого гостя. Ніякого друку та витрат на доставку.",
  },
  {
    icon: "guests",
    title: "100% безкоштовний функціонал",
    text: "Створюйте, редагуйте та діліться своїм веб запрошенням абсолютно безкоштовно одразу після реєстрації.",
  },
] as const;

const COMPARE_ROWS = [
  {
    problem: {
      title: "Дорогий та тривалий друк паперових запрошень",
      text: "Паперові запрошення потребують друку, доставки та тривалого очікування.",
    },
    solution: {
      title: "Стильний сайт за кілька хвилин без бюджету та очікування",
      text: "Готовий сайт-запрошення без друку, без витрат та без довгого очікування.",
    },
  },
  {
    problem: {
      title: "Гості гублять деталі: таймінг, локацію чи дрескод",
      text: "Запрошення часто губляться, а важливі деталі залишаються без уваги.",
    },
    solution: {
      title: "Уся важлива інформація завжди під рукою в смартфоні кожної особи",
      text: "Таймінг, локація, дрескод та всі деталі доступні в одному місці без втрати.",
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
          Типові проблеми паперових запрошень та як їх вирішує fata.studio
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
    title: "Пара, яка цінує свій час та бюджет",
    text: "Не треба чекати місяцями на розробку чи витрачати кошти на поліграфію — створити сайт можна за кілька кліків.",
  },
  {
    title: "Наречені, які хочуть поділитися власною історією",
    text: "Додавайте блоки про знайомство, пропозицію, фотогалерею та особливі деталі про нареченого й наречену.",
  },
  {
    title: "Ті, хто організовує сучасне та технологічне весілля",
    text: "Інтерактивні запрошення зручно надсилати у Telegram, Viber чи WhatsApp безпосередньо у приватні повідомлення.",
  },
  {
    title: "Пара з гостями з інших міст чи країн",
    text: "Усі деталі (карта, тайм-план, дрескод, програма дня) завжди доступні онлайн за одним посиланням у будь-якій точці світу.",
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
    title: "Оберіть шаблон та блоки",
    text: "Виберіть красивий вигляд сайту та відмітьте потрібні секції: історія кохання, таймінг, локація, дрескод або побажання щодо подарунків.",
  },
  {
    icon: "guests",
    title: "Внесіть ваші дані",
    text: "Заповніть інформацію про дату, час, місце проведення та додайте ваші улюблені фотографії.",
  },
  {
    icon: "overview",
    title: "Скопіюйте посилання та надішліть",
    text: "Готовий сайт-запрошення миттєво доступний за унікальним посиланням. Скопіюйте його та надішліть гостям.",
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
    q: "Чи справді створення сайту-запрошення безкоштовне?",
    a: "Так, базовий функціонал створення сайту-запрошення, вибір блоків та отримання посилання повністю безкоштовні.",
  },
  {
    q: "Які блоки я можу додати на свій сайт?",
    a: "Ви можете додати історію пропозиції, інформацію про нареченого та наречену, таймінг дня, локацію з картою, колірну гаму для дрескоду та побажання щодо подарунків.",
  },
  {
    q: "Чи можу я відредагувати інформацію після публікації сайту?",
    a: "Звісно! Ви можете вносити зміни у будь-який момент в особистому кабінеті, і вони одразу оновляться за вашим посиланням.",
  },
  {
    q: "Як гості зможуть відкрити моє запрошення?",
    a: "Сайт оптимізований під будь-які пристрої. Гості просто переходять за посиланням зі свого смартфона, планшета чи ПК.",
  },
  {
    q: "Чи потрібні мені навички дизайнера чи програміста?",
    a: "Ні, наш конструктор максимально простий та інтуїтивний — ви лише обираєте готові елементи та вводите свій текст.",
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
            Готові створити ідеальне
          </span>
          <br />
          <span className="fata-service-cta__title-accent">запрошення</span>
          <span className="fata-service-cta__title-light">?</span>
        </h2>
        <div className="fata-service-cta__action">
          <Button href="/register" tone="ink" size="l">
            Створити сайт безкоштовно
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
    href: "/spysok-gostey",
    title: "Список гостей",
    text: "Зручний облік запрошених, підтвердження присутності та контакти в одному місці.",
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
                Читати <img src="/landing/chevron-right.svg" alt="" width={14} height={14} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PAGE_TITLE = "Персональний сайт-запрошення на весілля за 10 хвилин";
export const PAGE_DESCRIPTION =
  "Конструктор весільного сайту-запрошення: готові шаблони, гнучкі блоки та миттєве посилання для гостей. Безкоштовно.";

export function VesilnyySaytPage() {
  const jsonLd = buildServiceJsonLd({
    path: "/vesilnyy-sayt",
    title: PAGE_TITLE,
    shortName: "Сайт-запрошення",
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
            FATA.STUDIO • САЙТ-ЗАПРОШЕННЯ
          </p>
          <h1 className="fata-service-hero__title">{PAGE_TITLE}</h1>
          <p className="fata-service-hero__lead">
            Забудьте про паперові листівки та складний дизайн. Обирайте
            готовий шаблон, налаштовуйте блоки під свою історію та
            надсилайте стильне посилання гостям. Безкоштовно та без хаосу.
          </p>
          <div className="fata-service-hero__actions">
            <Button href="/register" tone="dark" size="l">
              Створити сайт безкоштовно
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
