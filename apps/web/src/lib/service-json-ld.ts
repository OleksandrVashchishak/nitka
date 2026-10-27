import { getSiteUrl, SITE_NAME } from "@/lib/site";

type ServiceJsonLdInput = {
  /** Шлях сторінки, напр. `/vesilnyy-plan`. */
  path: string;
  /** Повний заголовок сторінки (WebPage.name). */
  title: string;
  /** Коротка назва для хлібних крихт і застосунку, напр. «План весілля». */
  shortName: string;
  description: string;
  faq: ReadonlyArray<{ readonly q: string; readonly a: string }>;
};

/** JSON-LD graph сервісної сторінки: Organization, WebSite, WebPage, Breadcrumb, WebApplication, FAQ. */
export function buildServiceJsonLd({
  path,
  title,
  shortName,
  description,
  faq,
}: ServiceJsonLdInput) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${path}`;
  const orgId = `${siteUrl}/#organization`;
  const siteId = `${siteUrl}/#website`;
  const pageId = `${pageUrl}#webpage`;
  const appId = `${pageUrl}#app`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/landing/logo-dark.svg`,
        },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: "uk-UA",
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        name: title,
        description,
        url: pageUrl,
        inLanguage: "uk-UA",
        isPartOf: { "@id": siteId },
        about: { "@id": appId },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
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
            name: shortName,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": appId,
        name: `${SITE_NAME} — ${shortName.toLowerCase()}`,
        description,
        url: pageUrl,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        inLanguage: "uk-UA",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "UAH",
        },
        provider: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        isPartOf: { "@id": pageId },
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** JSON-LD головної: Organization + WebSite. */
export function buildHomeJsonLd() {
  const siteUrl = getSiteUrl();
  const orgId = `${siteUrl}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/landing/logo-dark.svg`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: "uk-UA",
        publisher: { "@id": orgId },
      },
    ],
  };
}

/** Серіалізація для `<script type="application/ld+json">` без ризику закрити тег через `</script>`. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
