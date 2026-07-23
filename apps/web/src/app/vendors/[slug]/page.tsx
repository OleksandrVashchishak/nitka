import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getVendor } from "@/lib/api";
import { VendorActions } from "@/components/vendor-actions";
import { VendorReviews } from "@/components/vendor-reviews";
import { VendorHeroGallery } from "@/components/vendor-hero-gallery";
import { VendorGrid } from "@/components/vendor-grid";
import { getSiteUrl, truncateMeta } from "@/lib/site";
import { vendorHref } from "@/lib/vendor-href";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function cleanUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendor(slug);
  if (!vendor) {
    return { title: "Підрядника не знайдено" };
  }

  const title = `${vendor.name} — ${vendor.category.name}, ${vendor.city}`;
  const description = truncateMeta(
    vendor.tagline ||
      vendor.description ||
      `${vendor.name} — весільний підрядник у місті ${vendor.city}.`,
  );
  const path = vendorHref(vendor);
  const image = vendor.photos[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      ...(image ? { images: [{ url: image, alt: vendor.name }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function VendorPage({ params }: Props) {
  const { slug } = await params;
  const vendor = await getVendor(slug);
  if (!vendor) notFound();

  if (vendor.slug && slug !== vendor.slug) {
    permanentRedirect(vendorHref(vendor));
  }

  const reviews = vendor.reviews ?? [];
  const reviewsCount = vendor._count?.reviews ?? reviews.length;
  const packages = vendor.packages ?? [];
  const faqs = vendor.faqs ?? [];
  const styles = vendor.styles ?? [];
  const services = vendor.services ?? [];
  const team = vendor.team ?? [];
  const similar = vendor.similar ?? [];
  const priceText =
    vendor.priceTo && vendor.priceTo > vendor.priceFrom
      ? `${formatPrice(vendor.priceFrom)}–${formatPrice(vendor.priceTo)} грн`
      : `від ${formatPrice(vendor.priceFrom)} грн`;

  const facts = [
    vendor.yearsInBusiness
      ? {
          label: "Досвід",
          value: `${vendor.yearsInBusiness} років у справі`,
          icon: "✦",
        }
      : null,
    vendor.teamSize
      ? {
          label: "Команда",
          value: `${vendor.teamSize} людей`,
          icon: "👥",
        }
      : null,
    vendor.responseTime
      ? { label: "Відповідає", value: vendor.responseTime, icon: "↗" }
      : null,
    vendor.bookingLeadTime
      ? {
          label: "Бронювання",
          value: vendor.bookingLeadTime,
          icon: "◷",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: string }>;

  const nav = [
    { href: "#about", label: "Про нас" },
    ...(packages.length ? [{ href: "#pricing", label: "Ціни" }] : []),
    ...(services.length ? [{ href: "#services", label: "Послуги" }] : []),
    ...(team.length ? [{ href: "#team", label: "Команда" }] : []),
    ...(vendor.availabilityNote
      ? [{ href: "#availability", label: "Доступність" }]
      : []),
    { href: "#reviews", label: `Відгуки (${reviewsCount})` },
    { href: "#contact", label: "Контакти" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: vendor.name,
    description: truncateMeta(vendor.description || vendor.tagline || "", 300),
    url: `${getSiteUrl()}${vendorHref(vendor)}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: vendor.city,
      addressCountry: "UA",
      ...(vendor.address ? { streetAddress: vendor.address } : {}),
    },
    ...(vendor.photos[0]?.url
      ? { image: vendor.photos.map((p) => p.url) }
      : {}),
    ...(vendor.phone ? { telephone: vendor.phone } : {}),
    ...(vendor.website || vendor.instagram
      ? {
          sameAs: [
            ...(vendor.website ? [cleanUrl(vendor.website)] : []),
            ...(vendor.instagram
              ? [
                  vendor.instagram.startsWith("http")
                    ? vendor.instagram
                    : `https://instagram.com/${vendor.instagram.replace(/^@/, "")}`,
                ]
              : []),
          ],
        }
      : {}),
    priceRange: priceText,
    ...(reviewsCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: vendor.rating,
            reviewCount: reviewsCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-paper pb-16">
      <div className="px-3 pt-4 md:px-6">
        <VendorHeroGallery photos={vendor.photos} name={vendor.name} />
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-7 md:px-8">
        <nav
          aria-label="Навігація профілю"
          className="sticky top-0 z-30 -mx-5 overflow-x-auto border-y border-line bg-paper/95 px-5 backdrop-blur md:-mx-8 md:px-8"
        >
          <ul className="flex min-w-max gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block border-b-2 border-transparent py-4 text-sm font-medium text-ink-soft hover:border-sage hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="border-b border-line py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link
                  href={`/vendors?category=${vendor.category.slug}`}
                  className="font-medium text-sage-deep hover:underline"
                >
                  {vendor.category.name}
                </Link>
                <span className="text-ink-soft">· {vendor.city}</span>
                {vendor.featured ? (
                  <span className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-semibold text-sage-deep">
                    Вибір NITKA
                  </span>
                ) : null}
              </div>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-6xl">
                {vendor.name}
              </h1>
              {vendor.tagline ? (
                <p className="mt-3 text-lg text-ink-soft">{vendor.tagline}</p>
              ) : null}
              <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-ink">
                <a href="#reviews" className="font-semibold underline underline-offset-4">
                  ★ {vendor.rating.toFixed(1)} · {reviewsCount} відгуків
                </a>
                <span className="text-ink-soft">·</span>
                <span>{priceText}</span>
              </p>
            </div>
            <a
              href="#contact"
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-sage/50"
            >
              Поділитися ↗
            </a>
          </div>
        </section>

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-16">
          <div className="min-w-0">
            {vendor.dealTitle ? (
              <section className="mb-10 rounded-2xl border border-sage/30 bg-sage/10 p-5 md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
                  Спецпропозиція
                </p>
                <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                      {vendor.dealTitle}
                    </h2>
                    {vendor.dealDescription ? (
                      <p className="mt-2 text-sm text-ink-soft">
                        {vendor.dealDescription}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href="#contact"
                    className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
                  >
                    Запитати деталі
                  </a>
                </div>
              </section>
            ) : null}

            <section id="about" className="scroll-mt-20 border-b border-line pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Знайомство
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
                Про підрядника
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-7 text-ink-soft">
                {vendor.description}
              </p>

              {styles.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <span
                      key={style}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              ) : null}

              {facts.length ? (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex gap-3 rounded-2xl border border-line bg-white p-4"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-sage-deep">
                        {fact.icon}
                      </span>
                      <div>
                        <p className="text-xs text-ink-soft">{fact.label}</p>
                        <p className="mt-1 font-medium text-ink">{fact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {packages.length ? (
              <section id="pricing" className="scroll-mt-20 border-b border-line py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Прозоро про бюджет
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
                  Ціни та пакети
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {packages.map((pkg) => (
                    <article
                      key={pkg.id}
                      className={
                        pkg.isPopular
                          ? "relative rounded-2xl border-2 border-sage bg-white p-5"
                          : "relative rounded-2xl border border-line bg-white p-5"
                      }
                    >
                      {pkg.isPopular ? (
                        <span className="absolute -top-3 left-4 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white">
                          Найпопулярніший
                        </span>
                      ) : null}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-ink">{pkg.title}</h3>
                        <p className="whitespace-nowrap font-semibold text-sage-deep">
                          {formatPrice(pkg.price)} грн
                        </p>
                      </div>
                      {pkg.duration ? (
                        <p className="mt-2 text-sm font-medium text-ink">
                          ◷ {pkg.duration}
                        </p>
                      ) : null}
                      {pkg.description ? (
                        <p className="mt-3 text-sm leading-6 text-ink-soft">
                          {pkg.description}
                        </p>
                      ) : null}
                      {pkg.includes ? (
                        <ul className="mt-4 space-y-2 text-sm text-ink">
                          {pkg.includes
                            .split(/\n|·|,/)
                            .map((item) => item.trim())
                            .filter(Boolean)
                            .map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="text-sage">✓</span>
                                {item}
                              </li>
                            ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
                <p className="mt-3 text-xs text-ink-soft">
                  Фінальна ціна залежить від дати, міста та деталей події.
                </p>
              </section>
            ) : null}

            {services.length ? (
              <section id="services" className="scroll-mt-20 border-b border-line py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Що можна замовити
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
                  Послуги та деталі
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <li
                      key={service}
                      className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-sm text-ink"
                    >
                      <span className="text-sage-deep">✓</span>
                      {service}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {vendor.videoUrl ? (
              <section className="border-b border-line py-10">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                  Відео
                </h2>
                <a
                  href={cleanUrl(vendor.videoUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex min-h-48 items-center justify-center rounded-2xl bg-sage-deep p-6 text-center text-white"
                >
                  <span>
                    <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-xl text-sage-deep">
                      ▶
                    </span>
                    <span className="mt-3 block font-medium">Дивитися showreel</span>
                  </span>
                </a>
              </section>
            ) : null}

            {team.length ? (
              <section id="team" className="scroll-mt-20 border-b border-line py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Люди, яким довіряєш день
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
                  Наша команда
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {team.map((member) => (
                    <article
                      key={member.id}
                      className="overflow-hidden rounded-2xl border border-line bg-white"
                    >
                      {member.photoUrl ? (
                        <div
                          className="aspect-[4/3] bg-cover bg-center"
                          style={{ backgroundImage: `url("${member.photoUrl}")` }}
                          role="img"
                          aria-label={member.name}
                        />
                      ) : null}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-ink">{member.name}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-sage-deep">
                          {member.role}
                        </p>
                        {member.bio ? (
                          <p className="mt-3 text-sm leading-6 text-ink-soft">
                            {member.bio}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {vendor.availabilityNote ? (
              <section
                id="availability"
                className="scroll-mt-20 border-b border-line py-10"
              >
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                  Доступність
                </h2>
                <div className="mt-5 rounded-2xl bg-sage/10 p-5">
                  <p className="leading-7 text-ink">{vendor.availabilityNote}</p>
                  <a
                    href="#contact"
                    className="mt-4 inline-flex rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
                  >
                    Перевірити свою дату
                  </a>
                </div>
              </section>
            ) : null}

            {faqs.length ? (
              <section className="border-b border-line py-10">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                  Часті питання
                </h2>
                <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white px-5">
                  {faqs.map((faq) => (
                    <details key={faq.id} className="group py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                        {faq.question}
                        <span className="text-xl text-sage-deep group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 pr-8 text-sm leading-6 text-ink-soft">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <section id="reviews" className="scroll-mt-20">
              <VendorReviews
                vendorId={vendor.id}
                initialReviews={reviews}
                rating={vendor.rating}
                reviewsCount={reviewsCount}
              />
            </section>

            <section id="contact" className="scroll-mt-20 border-t border-line py-10">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                Зона роботи та контакти
              </h2>
              <div className="mt-5 grid gap-5 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-ink-soft">
                    Локація
                  </p>
                  <p className="mt-2 text-ink">{vendor.address || vendor.city}</p>
                  {vendor.serviceAreas?.length ? (
                    <p className="mt-2 text-sm text-ink-soft">
                      Виїзд: {vendor.serviceAreas.join(", ")}
                    </p>
                  ) : null}
                  {vendor.languages?.length ? (
                    <p className="mt-2 text-sm text-ink-soft">
                      Мови: {vendor.languages.join(", ")}
                    </p>
                  ) : null}
                </div>
                <ul className="space-y-2 text-sm">
                  {vendor.phone ? (
                    <li>
                      <a className="text-sage-deep hover:underline" href={`tel:${vendor.phone}`}>
                        {vendor.phone}
                      </a>
                    </li>
                  ) : null}
                  {vendor.website ? (
                    <li>
                      <a
                        className="text-sage-deep hover:underline"
                        href={cleanUrl(vendor.website)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Сайт ↗
                      </a>
                    </li>
                  ) : null}
                  {vendor.instagram ? (
                    <li>
                      <a
                        className="text-sage-deep hover:underline"
                        href={`https://instagram.com/${vendor.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{vendor.instagram.replace(/^@/, "")} ↗
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </section>
          </div>

          <aside className="relative">
            <div className="sticky top-20">
              <VendorActions
                vendorId={vendor.id}
                vendorCity={vendor.city}
                vendorName={vendor.name}
                priceText={priceText}
                responseTime={vendor.responseTime}
              />
            </div>
          </aside>
        </div>
      </div>

      {similar.length ? (
        <div className="mt-8 border-t border-line pt-12">
          <VendorGrid
            vendors={similar}
            title="Схожі підрядники"
            subtitle="Ще кілька сильних варіантів у цій категорії"
            showAllLink={false}
          />
        </div>
      ) : null}
    </main>
    </>
  );
}
