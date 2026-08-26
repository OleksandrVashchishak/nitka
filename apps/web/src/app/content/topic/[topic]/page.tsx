import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentCities,
  getContentPosts,
  getContentTopic,
  getContentTopics,
} from "@/lib/content-api";
import { ContentCard } from "@/components/content-card";
import { ContentBlogHero } from "@/components/content-blog-hero";
import { absoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ topic: string }>;
  searchParams: Promise<{ q?: string; city?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = await getContentTopic(slug);
  if (!topic) return { title: "Тему не знайдено" };
  const title = `${topic.name} — ідеї та натхнення`;
  const description =
    topic.description || `Матеріали теми «${topic.name}» на NITKA.`;
  const image = absoluteUrl(topic.coverUrl);
  return {
    title,
    description,
    alternates: { canonical: `/content/topic/${topic.slug}` },
    openGraph: {
      title,
      description,
      url: `/content/topic/${topic.slug}`,
      type: "website",
      ...(image ? { images: [{ url: image, alt: topic.name }] } : {}),
    },
  };
}

export default async function ContentTopicPage({ params, searchParams }: Props) {
  const { topic: slug } = await params;
  const { q, city } = await searchParams;
  const [topic, topics, posts, cities] = await Promise.all([
    getContentTopic(slug),
    getContentTopics(),
    getContentPosts({ topic: slug, limit: 24, q, city }),
    getContentCities(),
  ]);
  if (!topic) notFound();

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-12 md:px-[75px] md:pt-16">
        <ContentBlogHero
          topics={topics}
          cities={cities}
          activeSlug={topic.slug}
          q={q}
          city={city}
          title={topic.name}
          description={topic.description}
        />
        <section className="mt-12">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.items.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
          {!posts.items.length ? (
            <p className="mt-8 text-center text-[#6f6f6f]">
              У цій темі ще немає публікацій.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
