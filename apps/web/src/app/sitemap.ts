import type { MetadataRoute } from "next";
import { getVendors } from "@/lib/api";
import {
  contentHref,
  contentTopicHref,
  getContentPosts,
  getContentTopics,
} from "@/lib/content-api";
import {
  WEDDING_CITIES,
  WEDDING_CITY_CATEGORIES,
  cityCategoryHref,
  weddingCityHref,
} from "@/lib/wedding-cities";
import { getSiteUrl } from "@/lib/site";
import { vendorHref } from "@/lib/vendor-href";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/vendors`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/content`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/vesillya`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${siteUrl}/vesilnyy-plan`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/vesilnyy-byudzhet`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/zaprosinnya`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/vesilnyy-sayt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...WEDDING_CITIES.map((city) => ({
      url: `${siteUrl}${weddingCityHref(city)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.86,
    })),
    ...WEDDING_CITIES.flatMap((city) =>
      WEDDING_CITY_CATEGORIES.map((category) => ({
        url: `${siteUrl}${cityCategoryHref(city, category.slug)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.84,
      })),
    ),
    {
      url: `${siteUrl}/spysok-gostey`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${siteUrl}/plan-dnya-vesillya`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${siteUrl}/rozsadka-gostey`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${siteUrl}/moyi-pidryadnyky`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ];

  let vendorRoutes: MetadataRoute.Sitemap = [];
  try {
    const vendors = await getVendors({ sort: "newest" });
    vendorRoutes = vendors.map((vendor) => ({
      url: `${siteUrl}${vendorHref(vendor)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    vendorRoutes = [];
  }

  let contentRoutes: MetadataRoute.Sitemap = [];
  try {
    const [topics, posts] = await Promise.all([
      getContentTopics(),
      getContentPosts({ limit: 50 }),
    ]);
    const topicRoutes = topics.map((topic) => ({
      url: `${siteUrl}${contentTopicHref(topic)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Пагінація всіх опублікованих
    const allPosts = [...posts.items];
    let page = 2;
    while (allPosts.length < posts.total && page < 40) {
      const next = await getContentPosts({ limit: 50, page });
      if (!next.items.length) break;
      allPosts.push(...next.items);
      page += 1;
    }

    const postRoutes = allPosts.map((post) => ({
      url: `${siteUrl}${contentHref(post)}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    contentRoutes = [...topicRoutes, ...postRoutes];
  } catch {
    contentRoutes = [];
  }

  return [...staticRoutes, ...vendorRoutes, ...contentRoutes];
}
