import Link from "next/link";
import Image from "next/image";

const STEPS = [
  {
    n: "01",
    title: "Знайди",
    text: "Фільтруй за містом, категорією, стилем і бюджетом — без годин у чатах.",
  },
  {
    n: "02",
    title: "Порівняй",
    text: "Зберігай в обране й веди підрядників по етапах: від першого лайку до вибору.",
  },
  {
    n: "03",
    title: "Обери",
    text: "Пиши заявки з профілю, дивись відповіді в кабінеті й фіксуй команду.",
  },
];

const TOOLS = [
  {
    title: "План весілля",
    text: "22 цілі по місяцях — від дати до запрошень.",
    href: "/register",
  },
  {
    title: "Бюджет",
    text: "Витрати по категоріях і залишок під контролем.",
    href: "/register",
  },
  {
    title: "Гості",
    text: "Список, RSVP і плюс-один без Excel-хаосу.",
    href: "/register",
  },
];

const REVIEWS = [
  {
    name: "Оля і Тарас",
    city: "Львів",
    text: "За тиждень зібрали фотографа, локацію і декор. Найбільше зайшов пайплайн в обраному — нарешті все в одному місці.",
  },
  {
    name: "Марина",
    city: "Київ",
    text: "Можна одразу писати підрядникам і бачити відповіді в кабінеті. Без переписки в трьох месенджерах.",
  },
  {
    name: "Ігор, Studio Glow",
    city: "підрядник",
    text: "Заявки приходять з нормальним контекстом: місто, дата, гості. Менше «а скільки у вас?» з нуля.",
  },
];

export function HomeHowItWorks() {
  return (
    <section className="relative bg-sage-deep px-5 py-24 text-white md:px-8">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1400&q=80"
          alt="Весільна атмосфера"
          fill
          className="object-cover opacity-45"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-sage-deep" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Як це працює
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl">
            Три кроки — і команда зібрана
          </h2>
          <p className="mt-4 text-white/75">
            Без зайвих дашбордів. Шукаєш, порівнюєш, бронюєш.
          </p>
        </div>

        <div className="mt-14 grid max-w-3xl gap-10 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <article key={step.n} className="relative">
              {index < STEPS.length - 1 ? (
                <span className="absolute left-[3.25rem] top-5 hidden h-px w-[calc(100%-1rem)] bg-white/20 md:block" />
              ) : null}
              <p className="font-[family-name:var(--font-display)] text-5xl text-white/25">
                {step.n}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeTools() {
  return (
    <section className="bg-paper px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem]">
          <Image
            src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1400&q=80"
            alt="Планування весілля"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              План, бюджет і гості — поруч із каталогом
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            Інструменти
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-5xl">
            Не лише каталог
          </h2>
          <p className="mt-4 text-ink-soft">
            Те, що пари зазвичай розкидають по нотатках, уже зібрано в NITKA.
          </p>

          <div className="mt-10 space-y-0">
            {TOOLS.map((tool, index) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group flex items-start gap-5 border-t border-line py-6 transition last:border-b hover:bg-mist/60"
              >
                <span className="mt-1 font-[family-name:var(--font-display)] text-2xl text-sage/40">
                  0{index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink transition group-hover:text-sage-deep">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {tool.text}
                  </p>
                </div>
                <span className="mt-2 text-sage-deep opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeReviews() {
  const [featured, ...rest] = REVIEWS;

  return (
    <section className="relative overflow-hidden bg-mist px-5 py-24 md:px-8">
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sage/10 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            Відгуки
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-5xl">
            Що кажуть пари й підрядники
          </h2>
        </div>

        <blockquote className="mt-12 max-w-4xl">
          <p className="font-[family-name:var(--font-display)] text-3xl leading-snug text-ink md:text-5xl md:leading-[1.15]">
            “{featured.text}”
          </p>
          <footer className="mt-6 text-sm text-ink-soft">
            <span className="font-semibold text-ink">{featured.name}</span>
            {" · "}
            {featured.city}
          </footer>
        </blockquote>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
          {rest.map((review) => (
            <blockquote key={review.name}>
              <p className="text-lg leading-8 text-ink">“{review.text}”</p>
              <footer className="mt-4 text-sm text-ink-soft">
                <span className="font-semibold text-ink">{review.name}</span>
                {" · "}
                {review.city}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-28 text-white md:px-8">
      <Image
        src="https://images.unsplash.com/photo-1529636798458-92182e662485?w=1800&q=80"
        alt="Весільна команда"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/65" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Готові починати
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight md:text-6xl">
            Збери свою весільну команду без хаосу
          </h2>
          <p className="mt-4 max-w-lg text-white/80">
            Каталог, заявки й план весілля — під український ринок.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vendors"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Почати пошук
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Створити акаунт
          </Link>
        </div>
      </div>
    </section>
  );
}
