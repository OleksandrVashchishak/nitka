import type { MetadataRoute } from "next";
import {
  contentHref,
  contentTopicHref,
  getContentPosts,
  getContentTopics,
} from "@/lib/content-api";
import { getSiteUrl } from "@/lib/site";

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
      url: `${siteUrl}/content`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
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
  ];

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

  return [...staticRoutes, ...contentRoutes];
}
