import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { VendorGrid } from "@/components/vendor-grid";
import {
  HomeFinalCta,
  HomeHowItWorks,
  HomeReviews,
  HomeTools,
} from "@/components/home-sections";
import { getCategories, getVendors } from "@/lib/api";

export default async function HomePage() {
  const [categories, vendors] = await Promise.all([
    getCategories(),
    getVendors(),
  ]);

  const cleanCategories = categories.filter(
    (category) => category.slug !== "dfsdfsdf" && category.name !== "dfsdfsdf",
  );

  return (
    <>
      <Hero categories={cleanCategories} />
      <Categories categories={cleanCategories} />
      <div id="how-it-works">
        <HomeHowItWorks />
      </div>
      <VendorGrid
        vendors={vendors.slice(0, 4)}
        title="Топ підрядників"
        subtitle="Почни з перевірених профілів — далі збережи в обране"
      />
      <div id="tools">
        <HomeTools />
      </div>
      <div id="reviews">
        <HomeReviews />
      </div>
      <HomeFinalCta />
    </>
  );
}
