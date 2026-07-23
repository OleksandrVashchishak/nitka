import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { VendorGrid } from "@/components/vendor-grid";
import {
  HomeBudgetTeaser,
  HomeCities,
  HomeFinalCta,
  HomeHowItWorks,
  HomeIdeas,
  HomeReviews,
  HomeSeoIntro,
  HomeTools,
} from "@/components/home-sections";
import { getCategories, getVendors } from "@/lib/api";
import { getContentPosts } from "@/lib/content-api";

export default async function HomePage() {
  const [categories, vendors, ideas] = await Promise.all([
    getCategories(),
    getVendors(),
    getContentPosts({ limit: 6 }).catch(() => ({
      items: [],
      total: 0,
      page: 1,
      limit: 6,
    })),
  ]);

  const cleanCategories = categories.filter(
    (category) => category.slug !== "dfsdfsdf" && category.name !== "dfsdfsdf",
  );

  return (
    <>
      <Hero categories={cleanCategories} />
      <HomeSeoIntro />
      <Categories categories={cleanCategories} />
      <HomeCities />
      <HomeBudgetTeaser />
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
      <HomeIdeas posts={ideas.items} />
      <div id="reviews">
        <HomeReviews />
      </div>
      <HomeFinalCta />
    </>
  );
}
