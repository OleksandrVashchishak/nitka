import { Button } from "@/components/ui/button";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
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
      {COMPARE_ROWS.map((row, i) => (
        <div
          className={`fata-service-compare__row fata-service-compare__row--${i + 1}`}
          key={row.problem.title}
        >
          <div className="fata-service-compare__problem">
            <p className="fata-service-compare__eyebrow">Проблема</p>
            <h3 className="fata-service-compare__title">
              {row.problem.title}
            </h3>
            <p className="fata-service-compare__text">{row.problem.text}</p>
          </div>
          <div className="fata-service-compare__solution">
            <CompareScribble />
            <p className="fata-service-compare__eyebrow">Рішення</p>
            <h3 className="fata-service-compare__title">
              {row.solution.title}
            </h3>
            <p className="fata-service-compare__text">{row.solution.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

const AUDIENCE = [
  {
    title: "Пара, яка тільни починає підготовку",
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
    title: "Наречені, які втомилися від бардану і непорозумінь зі статусами завдань",
    text: "Підійде тим, хто шукає новий інструмент, який таки буде працювати і де ви справді будете відслідковувати результати вашого планування разом.",
  },
] as const;

function ServiceAudience() {
  return (
    <section className="fata-service-audience">
      <div className="fata-service-audience__main">
        <h2 className="fata-service-audience__title">
          Для кого підійде ця функція
        </h2>
        <div className="fata-service-audience__list">
          {AUDIENCE.map((item, i) => (
            <div className="fata-service-audience__item" key={item.title}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceFeatures() {
  return (
    <section className="fata-service-features">
      <h2 className="fata-service-features__title">
        Як це полегшить підготовку до весілля?
      </h2>
      <div className="fata-service-features__grid">
        {FEATURES.map((feature) => (
          <div className="fata-service-features__card" key={feature.title}>
            <div className="fata-service-features__icon">
              <CabinetNavIcon name={feature.icon} size={24} />
            </div>
            <h3 className="fata-service-features__card-title">
              {feature.title}
            </h3>
            <p className="fata-service-features__card-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VesilnyyPlanPage() {
  return (
    <div className="fata-service-hero">
      <div className="fata-service-hero__main">
        <div className="fata-service-hero__copy">
          <p className="fata-service-hero__eyebrow">FATA.STUDIO • ЗАВДАННЯ</p>
          <h1 className="fata-service-hero__title">
            План весілля онлайн: список завдань без хаосу
          </h1>
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
    </div>
  );
}
