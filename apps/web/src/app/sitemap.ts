import type { MetadataRoute } from "next";
import {
  contentHref,
  contentTopicHref,
  getContentPosts,
  getContentTopics,
} from "@/lib/content-api";
import { getSiteUrl } from "@/lib/site";

/** Don't block Render builds on a sleeping free-tier API. */
export const dynamic = "force-dynamic";

/** Статичні сторінки без lastModified: справжньої дати змін у нас немає, а «зараз» Google ігнорує. */
const STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: "daily" | "monthly";
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/napyshit-nam", changeFrequency: "monthly", priority: 0.6 },
  { path: "/vesilnyy-plan", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vesilnyy-sayt", changeFrequency: "monthly", priority: 0.8 },
  { path: "/rozsadka-gostey", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pidryadnyky", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vesilnyy-byudzhet", changeFrequency: "monthly", priority: 0.8 },
  { path: "/spysok-gostey", changeFrequency: "monthly", priority: 0.8 },
  { path: "/plan-dnya", changeFrequency: "monthly", priority: 0.8 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let contentRoutes: MetadataRoute.Sitemap = [];
  try {
    const [topics, posts] = await Promise.all([
      getContentTopics(),
      getContentPosts({ limit: 50 }),
    ]);

    // Пагінація всіх опублікованих
    const allPosts = [...posts.items];
    let page = 2;
    while (allPosts.length < posts.total && page < 40) {
      const next = await getContentPosts({ limit: 50, page });
      if (!next.items.length) break;
      allPosts.push(...next.items);
      page += 1;
    }

    // Тема змінюється, коли змінюється її найновіша стаття
    const topicUpdated = new Map<string, Date>();
    for (const post of allPosts) {
      if (!post.updatedAt) continue;
      const date = new Date(post.updatedAt);
      const prev = topicUpdated.get(post.topic.slug);
      if (!prev || date > prev) topicUpdated.set(post.topic.slug, date);
    }

    const topicRoutes = topics.map((topic) => ({
      url: `${siteUrl}${contentTopicHref(topic)}`,
      lastModified: topicUpdated.get(topic.slug),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const postRoutes = allPosts.map((post) => ({
      url: `${siteUrl}${contentHref(post)}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    contentRoutes = [...topicRoutes, ...postRoutes];
  } catch {
    contentRoutes = [];
  }

  return [...staticRoutes, ...contentRoutes];
}
