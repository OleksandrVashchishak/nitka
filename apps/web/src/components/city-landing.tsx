import Link from "next/link";
import Image from "next/image";
import { VendorGrid } from "@/components/vendor-grid";
import type { Category, Vendor } from "@/lib/api";
import { PRODUCT_NAV } from "@/lib/product-routes";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import {
  type WeddingCity,
  WEDDING_CITIES,
  WEDDING_CITY_CATEGORIES,
  cityCategoryHref,
  vendorsByCityHref,
  weddingCityHref,
} from "@/lib/wedding-cities";

type Props = {
  city: WeddingCity;
  vendors: Vendor[];
  categories: Category[];
  relatedHref?: string | null;
  relatedTitle?: string | null;
};

export function CityLanding({
  city,
  vendors,
  categories,
  relatedHref,
  relatedTitle,
}: Props) {
  const siteUrl = getSiteUrl();
  const path = weddingCityHref(city);
  const pageUrl = `${siteUrl}${path}`;
  const catalogHref = vendorsByCityHref(city.name);

  const knownCategorySlugs = new Set(categories.map((c) => c.slug));
  const categoryLinks = WEDDING_CITY_CATEGORIES.filter((c) =>
    knownCategorySlugs.has(c.slug),
  );

  const otherCities = WEDDING_CITIES.filter((c) => c.slug !== city.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Весілля ${city.inCity}`,
        description: city.lead,
        url: pageUrl,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
        about: {
          "@type": "Place",
          name: city.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: city.name,
            addressRegion: city.region,
            addressCountry: "UA",
          },
        },
        inLanguage: "uk-UA",
      },
      {
        "@type": "FAQPage",
        mainEntity: city.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
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
            name: "Весілля в містах",
            item: `${siteUrl}/vesillya`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: city.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative min-h-[72vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={city.image}
            alt={`Весілля ${city.inCity}`}
            fill
            priority
            className="object-cover [animation:soft-zoom_18s_ease-out_forwards]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        </div>
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
          <nav className="text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Головна
            </Link>
            <span className="mx-2">/</span>
            <Link href="/vesillya" className="hover:text-white">
              Міста
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{city.name}</span>
          </nav>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-white/70">
            {SITE_NAME} · {city.region}
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-white md:text-6xl lg:text-7xl">
            Весілля {city.inCity}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 md:text-lg">
            {city.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={catalogHref}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              Каталог · {city.name}
            </Link>
            <Link
              href="/vesilnyy-plan"
              className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              План весілля
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-mist/40">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-14">
          <p className="text-base leading-8 text-ink-soft md:text-lg">
            {city.seoIntro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
          Чому пари обирають {city.name}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {city.highlights.map((item) => (
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

      {categoryLinks.length ? (
        <section className="border-y border-line bg-paper px-5 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
              Каталог
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
              Підрядники {city.inCity}
            </h2>
            <p className="mt-3 max-w-2xl text-ink-soft">
              Оберіть категорію — відкриється SEO-сторінка з підбіркою{" "}
              {city.inCity}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {categoryLinks.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cityCategoryHref(city, cat.slug)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-sage/40 hover:text-sage-deep"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href={catalogHref}
                className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-deep"
              >
                Увесь каталог · {city.name}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {vendors.length ? (
        <VendorGrid
          vendors={vendors.slice(0, 6)}
          title={`Команда ${city.inCity}`}
          subtitle="Приклади профілів з каталогу — збережіть в обране й напишіть заявку"
        />
      ) : (
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
            Каталог зростає
          </h2>
          <p className="mt-3 max-w-xl text-ink-soft">
            Поки в «{city.name}» мало опублікованих профілів — подивіться весь
            каталог або сусідні міста. Підрядники часто їздять на виїзд.
          </p>
          <Link
            href="/vendors"
            className="mt-6 inline-flex text-sm font-semibold text-sage-deep hover:underline"
          >
            Відкрити каталог →
          </Link>
        </section>
      )}

      <section className="border-y border-line bg-sage-deep text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Поради
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
              Як планувати весілля {city.inCity}
            </h2>
          </div>
          <div className="space-y-8">
            {city.tips.map((tip, i) => (
              <div key={tip.title} className="flex gap-5">
                <span className="font-[family-name:var(--font-display)] text-2xl text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {tip.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
          Інструменти для пари
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {PRODUCT_NAV.map((tool) => (
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
        </ul>
        {relatedHref && relatedTitle ? (
          <p className="mt-10 text-sm text-ink-soft">
            Гайд по темі:{" "}
            <Link
              href={relatedHref}
              className="font-medium text-sage-deep hover:underline"
            >
              {relatedTitle}
            </Link>
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
          Часті запитання
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {city.faq.map((item) => (
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
      </section>

      <section className="border-t border-line bg-mist/50 px-5 py-14 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
            Весілля в інших містах
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {otherCities.map((item) => (
              <li key={item.slug}>
                <Link
                  href={weddingCityHref(item)}
                  className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm text-ink transition hover:border-sage/40"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/vesillya"
                className="inline-flex rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-deep"
              >
                Усі міста
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
