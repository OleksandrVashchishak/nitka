import { Suspense } from "react";
import { VendorGrid } from "@/components/vendor-grid";
import { CatalogFilters } from "@/components/catalog-filters";
import {
  getCategories,
  getVendorFilters,
  getVendors,
} from "@/lib/api";

type Props = {
  searchParams: Promise<{
    category?: string;
    city?: string;
    price?: string;
    rating?: string;
    q?: string;
    style?: string;
    sort?: string;
  }>;
};

export default async function VendorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [categories, filterOptions, vendors, featured] = await Promise.all([
    getCategories(),
    getVendorFilters(),
    getVendors({
      category: params.category,
      city: params.city,
      price: params.price,
      rating: params.rating,
      q: params.q,
      style: params.style,
      sort: params.sort,
    }),
    getVendors({ featured: "1", sort: "rating" }),
  ]);

  const hasFilters = Boolean(
    params.category ||
      params.city ||
      params.price ||
      params.rating ||
      params.q ||
      params.style ||
      (params.sort && params.sort !== "rating"),
  );

  const title = params.q
    ? `Пошук: “${params.q}”`
    : params.category
      ? (categories.find((c) => c.slug === params.category)?.name ??
        "Результати")
      : hasFilters
        ? "Результати фільтра"
        : "Усі підрядники";

  const showFeatured = !hasFilters && featured.length > 0;

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-10 md:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
          Каталог підрядників
        </h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Фільтруй за стилем, містом, ціною і рейтингом — як на великому
          маркетплейсі.
        </p>

        <Suspense fallback={null}>
          <CatalogFilters
            categories={categories}
            filters={filterOptions}
            values={params}
          />
        </Suspense>
      </section>

      {showFeatured ? (
        <VendorGrid
          vendors={featured.slice(0, 4)}
          title="Рекомендовані"
          subtitle="Featured-профілі, які варто глянути першими"
          showAllLink={false}
        />
      ) : null}

      {vendors.length > 0 ? (
        <VendorGrid
          vendors={vendors}
          title={title}
          subtitle={`${vendors.length} профілів${hasFilters ? " за фільтрами" : " у каталозі"}`}
          showAllLink={false}
        />
      ) : (
        <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
          <p className="rounded-2xl border border-line bg-mist px-6 py-10 text-ink-soft">
            Нічого не знайшли. Скинь фільтри або спробуй інший стиль / місто.
          </p>
        </section>
      )}
    </div>
  );
}
