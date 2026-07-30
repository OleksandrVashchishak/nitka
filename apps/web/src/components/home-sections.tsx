import Link from "next/link";
import Image from "next/image";
import { ContentCard } from "@/components/content-card";
import type { ContentPost } from "@/lib/content-api";
import { PRODUCT_NAV } from "@/lib/product-routes";

const STEPS = [
  {
    n: "01",
    title: "Створи основу",
    text: "Задай дату, місто й гостей — щоб план зібрався під вашу реальну картину.",
  },
  {
    n: "02",
    title: "Рухай задачі",
    text: "Чекліст і дедлайни по етапах, щоб не тримати все в голові.",
  },
  {
    n: "03",
    title: "Контролюй бюджет",
    text: "План/факт по категоріях і зрозумілий залишок без хаосу в таблицях.",
  },
];

const TOOL_BLURBS: Record<(typeof PRODUCT_NAV)[number]["id"], string> = {
  plan: "Чеклист по місяцях — від дати до таймінгу дня.",
  dayPlan: "Таймінг свята: збори, церемонія, банкет.",
  budget: "Кошторис по категоріях і залишок під контролем.",
  guests: "Список гостей і персональні посилання на запрошення.",
  seating: "Схема столів і розсадка зі списку гостей.",
  invitations: "Електронні листівки й запрошення без друку й Excel.",
  website: "Програма дня, карта й відповіді гостей в одній лінці.",
};

const REVIEWS = [
  {
    name: "Оля і Тарас",
    city: "Львів",
    text: "Нарешті маємо єдине місце для задач, бюджету й гостей. Без 15 нотаток і хаосу в чатах.",
  },
  {
    name: "Марина",
    city: "Київ",
    text: "План дня + розсадка сильно рятують. Видно повну картину свята, а не уривки в різних апках.",
  },
  {
    name: "Оксана і Влад",
    city: "Одеса",
    text: "Зручно, що запрошення, бюджет і чекліст в одному кабінеті. Підготовка стала спокійнішою.",
  },
];

/** SEO-абзац під hero — про інструменти планування без шуму */
export function HomeSeoIntro() {
  return (
    <section className="border-b border-line bg-paper px-5 py-14 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
          Планування весілля без хаосу
        </h2>
        <p className="mt-5 text-base leading-8 text-ink-soft md:text-lg">
          NITKA — онлайн-платформа для пар, які хочуть пройти підготовку без
          стресу: від першої дати до дня весілля. Ведіть{" "}
          <Link
            href="/vesilnyy-plan"
            className="font-medium text-sage-deep underline-offset-2 hover:underline"
          >
            план весілля
          </Link>
          ,{" "}
          <Link
            href="/vesilnyy-byudzhet"
            className="font-medium text-sage-deep underline-offset-2 hover:underline"
          >
            бюджет
          </Link>{" "}
          та ідеї в одному місці. Все, що зазвичай губиться по чатах і
          нотатках, тут складається в одну систему.
        </p>
      </div>
    </section>
  );
}

export function HomeBudgetTeaser() {
  return (
    <section className="relative overflow-hidden bg-sage-deep px-5 py-20 text-white md:px-8 md:py-24">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-leaf/20 blur-3xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Бюджет
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl lg:text-6xl">
            Скільки коштує весілля?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 md:text-lg">
            Не «середній чек з інтернету», а ваш кошторис: категорії, план і
            факт, залишок на екрані. Щоб ціна свята була під контролем ще до
            першої передоплати.
          </p>
        </div>
        <Link
          href="/vesilnyy-byudzhet"
          className="inline-flex shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist"
        >
          Відкрити бюджет весілля →
        </Link>
      </div>
    </section>
  );
}

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
            Три кроки — і підготовка під контролем
          </h2>
          <p className="mt-4 text-white/75">
            Менше хаосу, більше ясності у підготовці.
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
            alt="Планування весілля онлайн"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              План, бюджет, запрошення й сайт в одній системі
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            Інструменти для пари
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-5xl">
            Все для першої ітерації
          </h2>
          <p className="mt-4 text-ink-soft">
            Фокус зараз на чистому та зручному плануванні весілля.
          </p>

          <div className="mt-10 space-y-0">
            {PRODUCT_NAV.map((tool, index) => (
              <Link
                key={tool.id}
                href={tool.guestHref}
                className="group flex items-start gap-5 border-t border-line py-6 transition last:border-b hover:bg-mist/60"
              >
                <span className="mt-1 font-[family-name:var(--font-display)] text-2xl text-sage/40">
                  0{index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink transition group-hover:text-sage-deep">
                    {tool.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {TOOL_BLURBS[tool.id]}
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

export function HomeIdeas({ posts }: { posts: ContentPost[] }) {
  if (!posts.length) return null;

  return (
    <section className="border-t border-line bg-mist/40 px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
              Ідеї та поради
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-5xl">
              Читають під час підготовки
            </h2>
            <p className="mt-4 text-ink-soft">
              Гайди з бюджету, локацій, запрошень і таймінгу — щоб рішення були
              спокійнішими.
            </p>
          </div>
          <Link
            href="/content"
            className="font-medium text-sage-deep underline-offset-2 hover:underline"
          >
            Усі матеріали →
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post) => (
            <ContentCard key={post.id} post={post} />
          ))}
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
            Що кажуть пари
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
            Збери своє весілля без хаосу
          </h2>
          <p className="mt-4 max-w-lg text-white/80">
            Планування, бюджет і гості — в одній зрозумілій системі.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
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
