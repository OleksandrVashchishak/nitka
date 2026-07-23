import Link from "next/link";
import Image from "next/image";
import { ProductLandingCta } from "@/components/product-landing-cta";
import { PRODUCT_NAV } from "@/lib/product-routes";
import { SITE_NAME, getSiteUrl } from "@/lib/site";

export type ProductFeature = { title: string; text: string };
export type ProductStep = { title: string; text: string };
export type ProductFaq = { q: string; a: string };
export type ProductBlock = { heading: string; paragraphs: string[] };
export type ProductAudience = { title: string; text: string };

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  seoIntro: string;
  image: string;
  imageAlt: string;
  coupleHref: string;
  registerHint: string;
  features: ProductFeature[];
  /** Що замінює / з чим порівнюємо */
  insteadOf?: { title: string; items: string[] };
  audience?: ProductAudience[];
  highlights?: string[];
  contentBlocks?: ProductBlock[];
  steps: ProductStep[];
  faq: ProductFaq[];
  relatedHref: string;
  relatedLabel: string;
  secondaryRelatedHref?: string;
  secondaryRelatedLabel?: string;
  path: string;
  midImage?: string;
  midImageAlt?: string;
};

export function ProductLanding({
  eyebrow,
  title,
  lead,
  seoIntro,
  image,
  imageAlt,
  coupleHref,
  registerHint,
  features,
  insteadOf,
  audience,
  highlights,
  contentBlocks,
  steps,
  faq,
  relatedHref,
  relatedLabel,
  secondaryRelatedHref,
  secondaryRelatedLabel,
  path,
  midImage,
  midImageAlt,
}: Props) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description: lead,
        url: pageUrl,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
        inLanguage: "uk-UA",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  const otherTools = PRODUCT_NAV.filter((item) => item.guestHref !== path);

  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative min-h-[78vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover [animation:soft-zoom_18s_ease-out_forwards]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/70 [animation:rise_0.7s_ease-out_both]">
            {SITE_NAME} · {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-white [animation:rise_0.8s_ease-out_0.05s_both] md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 [animation:rise_0.8s_ease-out_0.12s_both] md:text-lg">
            {lead}
          </p>
          <div className="mt-8 [animation:rise_0.8s_ease-out_0.18s_both]">
            <ProductLandingCta
              coupleHref={coupleHref}
              registerHint={registerHint}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-mist/40">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-14">
          <p className="text-base leading-8 text-ink-soft md:text-lg">{seoIntro}</p>
        </div>
      </section>

      {highlights?.length ? (
        <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
            Коротко: навіщо це вам
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-b border-line pb-4 text-sm leading-7 text-ink-soft"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
          Можливості
        </p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
          Що отримуєте в NITKA
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {features.map((feature, i) => (
            <div key={feature.title}>
              <p className="font-[family-name:var(--font-display)] text-4xl text-sage/35">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-ink">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {audience?.length ? (
        <section className="border-y border-line bg-mist/30">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
              Кому підійде
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {audience.map((item) => (
                <div key={item.title}>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {insteadOf ? (
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                Без розкиданих таблиць
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
                {insteadOf.title}
              </h2>
            </div>
            <ul className="space-y-4">
              {insteadOf.items.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-sage/40 pl-4 text-sm leading-7 text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {midImage ? (
        <section className="relative h-[42vh] min-h-[280px] overflow-hidden md:h-[52vh]">
          <Image
            src={midImage}
            alt={midImageAlt || ""}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/25" />
        </section>
      ) : null}

      {contentBlocks?.length ? (
        <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
          <div className="space-y-14">
            {contentBlocks.map((block) => (
              <article key={block.heading}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
                  {block.heading}
                </h2>
                {block.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mt-4 text-base leading-8 text-ink-soft"
                  >
                    {p}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-sage-deep text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Як це працює
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              Три кроки — і все під контролем
            </h2>
          </div>
          <ol className="space-y-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="font-[family-name:var(--font-display)] text-2xl text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
          Питання
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
          Часті запитання
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span className="text-sage transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 space-y-2 text-sm text-ink-soft">
          <p>
            Більше порад у блозі:{" "}
            <Link
              href={relatedHref}
              className="font-medium text-sage-deep hover:underline"
            >
              {relatedLabel}
            </Link>
          </p>
          {secondaryRelatedHref && secondaryRelatedLabel ? (
            <p>
              Ще по темі:{" "}
              <Link
                href={secondaryRelatedHref}
                className="font-medium text-sage-deep hover:underline"
              >
                {secondaryRelatedLabel}
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-t border-line bg-mist/50">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
            Інші інструменти для пари
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherTools.map((tool) => (
              <li key={tool.id}>
                <Link
                  href={tool.guestHref}
                  className="group block border-b border-line pb-4 transition hover:border-sage/40"
                >
                  <span className="font-[family-name:var(--font-display)] text-xl text-ink transition group-hover:text-sage-deep">
                    {tool.label}
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    Дізнатись більше →
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vendors"
                className="group block border-b border-line pb-4 transition hover:border-sage/40"
              >
                <span className="font-[family-name:var(--font-display)] text-xl text-ink transition group-hover:text-sage-deep">
                  Каталог підрядників
                </span>
                <span className="mt-1 block text-sm text-ink-soft">
                  Фото, локації, музика, декор →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/content"
                className="group block border-b border-line pb-4 transition hover:border-sage/40"
              >
                <span className="font-[family-name:var(--font-display)] text-xl text-ink transition group-hover:text-sage-deep">
                  Ідеї та поради
                </span>
                <span className="mt-1 block text-sm text-ink-soft">
                  Гайди й підбірки →
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-sage-deep px-8 py-12 text-white md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative max-w-xl font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              Готові зібрати весілля без хаосу?
            </h2>
            <p className="relative mt-4 max-w-lg text-sm leading-7 text-white/75 md:text-base">
              Каталог підрядників, план, бюджет, гості й запрошення — в одному
              акаунті NITKA.
            </p>
            <div className="relative mt-8">
              <ProductLandingCta
                coupleHref={coupleHref}
                tone="light"
                primaryLabel="Створити акаунт"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
