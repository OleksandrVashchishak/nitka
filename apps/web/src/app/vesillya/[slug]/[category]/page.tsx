import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityCategoryLanding } from "@/components/city-category-landing";
import { getVendors } from "@/lib/api";
import { truncateMeta } from "@/lib/site";
import {
  WEDDING_CITIES,
  WEDDING_CITY_CATEGORIES,
  cityCategoryHref,
  getWeddingCity,
  getWeddingCityCategory,
} from "@/lib/wedding-cities";

type Props = {
  params: Promise<{ slug: string; category: string }>;
};

export function generateStaticParams() {
  return WEDDING_CITIES.flatMap((city) =>
    WEDDING_CITY_CATEGORIES.map((category) => ({
      slug: city.slug,
      category: category.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category: categorySlug } = await params;
  const city = getWeddingCity(slug);
  const category = getWeddingCityCategory(categorySlug);
  if (!city || !category) return {};

  const title = `${category.label} ${city.inCity} — весільний каталог`;
  const description = truncateMeta(category.seoBlurb(city));

  return {
    title,
    description,
    keywords: [
      `${category.labelGenitive} ${city.inCity}`,
      `${category.label.toLowerCase()} ${city.name}`,
      `весілля ${city.inCity}`,
      `весільні підрядники ${city.name}`,
    ],
    alternates: { canonical: cityCategoryHref(city, category.slug) },
    openGraph: {
      title: `${category.label} ${city.inCity} · NITKA`,
      description,
      url: cityCategoryHref(city, category.slug),
      type: "website",
      images: city.image ? [{ url: city.image }] : undefined,
    },
  };
}

export default async function WeddingCityCategoryPage({ params }: Props) {
  const { slug, category: categorySlug } = await params;
  const city = getWeddingCity(slug);
  const category = getWeddingCityCategory(categorySlug);
  if (!city || !category) notFound();

  const vendors = await getVendors({
    city: city.name,
    category: category.slug,
    sort: "rating",
  }).catch(() => []);

  return (
    <CityCategoryLanding city={city} category={category} vendors={vendors} />
  );
}
