import { Hero } from "@/components/hero";
import {
  HomeBudgetTeaser,
  HomeFinalCta,
  HomeHowItWorks,
  HomeIdeas,
  HomeReviews,
  HomeSeoIntro,
  HomeTools,
} from "@/components/home-sections";
import { getContentPosts } from "@/lib/content-api";

export default async function HomePage() {
  const ideas = await getContentPosts({ limit: 6 }).catch(() => ({
    items: [],
    total: 0,
    page: 1,
    limit: 6,
  }));

  return (
    <>
      <Hero />
      <HomeSeoIntro />
      <HomeBudgetTeaser />
      <div id="how-it-works">
        <HomeHowItWorks />
      </div>
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
