import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityLanding } from "@/components/city-landing";
import { getCategories, getVendors } from "@/lib/api";
import { getContentPost, contentHref } from "@/lib/content-api";
import {
  WEDDING_CITIES,
  getWeddingCity,
  weddingCityHref,
} from "@/lib/wedding-cities";
import { truncateMeta } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return WEDDING_CITIES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getWeddingCity(slug);
  if (!city) return {};

  const title = `Весілля ${city.inCity} — підрядники, план і бюджет`;
  const description = truncateMeta(
    `${city.seoIntro} Каталог фото, локацій, музики, декору та beauty ${city.inCity}.`,
  );

  return {
    title,
    description,
    keywords: [
      `весілля ${city.inCity}`,
      `весільні підрядники ${city.name}`,
      `фотографи ${city.name}`,
      `локації ${city.name}`,
      `організація весілля ${city.name}`,
    ],
    alternates: { canonical: weddingCityHref(city) },
    openGraph: {
      title: `Весілля ${city.inCity} · NITKA`,
      description,
      url: weddingCityHref(city),
      type: "website",
      images: city.image ? [{ url: city.image }] : undefined,
    },
  };
}

export default async function WeddingCityPage({ params }: Props) {
  const { slug } = await params;
  const city = getWeddingCity(slug);
  if (!city) notFound();

  const [categories, vendors, related] = await Promise.all([
    getCategories().catch(() => []),
    getVendors({ city: city.name, sort: "rating" }).catch(() => []),
    city.relatedContentSlug
      ? getContentPost(city.relatedContentSlug).catch(() => null)
      : Promise.resolve(null),
  ]);

  const cleanCategories = categories.filter(
    (category) => category.slug !== "dfsdfsdf" && category.name !== "dfsdfsdf",
  );

  return (
    <CityLanding
      city={city}
      vendors={vendors}
      categories={cleanCategories}
      relatedHref={related ? contentHref(related) : null}
      relatedTitle={related?.title ?? null}
    />
  );
}
