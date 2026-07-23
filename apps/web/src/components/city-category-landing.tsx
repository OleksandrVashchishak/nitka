import Link from "next/link";
import Image from "next/image";
import { VendorGrid } from "@/components/vendor-grid";
import type { Vendor } from "@/lib/api";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import {
  type WeddingCity,
  type WeddingCityCategory,
  WEDDING_CITY_CATEGORIES,
  cityCategoryHref,
  vendorsByCityHref,
  weddingCityHref,
} from "@/lib/wedding-cities";

type Props = {
  city: WeddingCity;
  category: WeddingCityCategory;
  vendors: Vendor[];
};

export function CityCategoryLanding({ city, category, vendors }: Props) {
  const siteUrl = getSiteUrl();
  const path = cityCategoryHref(city, category.slug);
  const pageUrl = `${siteUrl}${path}`;
  const catalogHref = vendorsByCityHref(city.name, category.slug);
  const title = `${category.label} ${city.inCity}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: title,
        description: category.seoBlurb(city),
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
            item: `${siteUrl}${weddingCityHref(city)}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: category.label,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: category.faq(city).map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  const otherCategories = WEDDING_CITY_CATEGORIES.filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate min-h-[52vh] overflow-hidden bg-ink text-white">
        <Image
          src={city.image}
          alt={`${category.label} ${city.inCity}`}
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-28 md:px-8 md:pb-16">
          <p className="text-sm uppercase tracking-[0.16em] text-white/70">
            <Link href="/vesillya" className="hover:text-white">
              Міста
            </Link>
            {" · "}
            <Link href={weddingCityHref(city)} className="hover:text-white">
              {city.name}
            </Link>
            {" · "}
            {category.label}
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
            {category.lead(city)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={catalogHref}
              className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
            >
              Відкрити каталог
            </Link>
            <Link
              href={weddingCityHref(city)}
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Усе про весілля {city.inCity}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-ink-soft md:text-lg">
            {category.seoBlurb(city)}
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-mist/50 px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                Підібрані профілі
              </h2>
              <p className="mt-2 text-ink-soft">
                {vendors.length
                  ? `${vendors.length} у каталозі · ${city.name}`
                  : `Поки мало профілів ${city.inCity} — дивіться повний каталог`}
              </p>
            </div>
            <Link
              href={catalogHref}
              className="text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
            >
              Усі з фільтрами →
            </Link>
          </div>
          <div className="mt-8">
            {vendors.length ? (
              <VendorGrid vendors={vendors.slice(0, 9)} />
            ) : (
              <p className="rounded-2xl border border-dashed border-line bg-white px-5 py-8 text-ink-soft">
                Скоро зʼявляться більше профілів. Можна вже зараз шукати в
                каталозі або зберегти план весілля.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
            Інші категорії {city.inCity}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherCategories.map((item) => (
              <Link
                key={item.slug}
                href={cityCategoryHref(city, item.slug)}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink hover:border-sage/40"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-mist/40 px-5 py-12 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
            Часті питання
          </h2>
          <div className="mt-6 space-y-4">
            {category.faq(city).map((item) => (
              <article
                key={item.q}
                className="rounded-2xl border border-line bg-white px-5 py-4"
              >
                <h3 className="font-medium text-ink">{item.q}</h3>
                <p className="mt-2 text-sm text-ink-soft">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
