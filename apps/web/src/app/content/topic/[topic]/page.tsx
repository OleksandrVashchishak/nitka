import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getContentPosts,
  getContentTopic,
  getContentTopics,
} from "@/lib/content-api";
import { ContentCard } from "@/components/content-card";
import {
  ContentTopicChips,
  TopicIcon,
} from "@/components/content-topics";
import { absoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ topic: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = await getContentTopic(slug);
  if (!topic) return { title: "Тему не знайдено" };
  const title = `${topic.name} — ідеї та поради`;
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

export default async function ContentTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const [topic, topics, posts] = await Promise.all([
    getContentTopic(slug),
    getContentTopics(),
    getContentPosts({ topic: slug, limit: 24 }),
  ]);
  if (!topic) notFound();

  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          {topic.coverUrl ? (
            <Image
              src={topic.coverUrl}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-mist to-paper" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/90 to-paper/55" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
          <ContentTopicChips topics={topics} activeSlug={topic.slug} />
          <div className="mt-8 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-deep">
              <TopicIcon icon={topic.icon} className="size-6" />
            </span>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-sage-deep">
              Тема
            </p>
          </div>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl text-ink md:text-6xl">
            {topic.name}
          </h1>
          {topic.description ? (
            <p className="mt-4 max-w-2xl text-lg text-ink-soft">
              {topic.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:pb-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.items.map((post) => (
            <ContentCard key={post.id} post={post} />
          ))}
        </div>
        {!posts.items.length ? (
          <p className="text-ink-soft">У цій темі ще немає публікацій.</p>
        ) : null}
      </section>
    </div>
  );
}
