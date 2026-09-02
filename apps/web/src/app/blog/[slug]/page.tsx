import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  contentHref,
  contentTopicHref,
  getContentCities,
  getContentPost,
  getContentPosts,
  getContentTopic,
  getContentTopics,
} from "@/lib/content-api";
import { absoluteUrl, getSiteUrl, SITE_NAME, truncateMeta } from "@/lib/site";
import { renderEditorJsHtml } from "@/components/content-blocks";
import { ContentCard } from "@/components/content-card";
import { ContentBlogHero } from "@/components/content-blog-hero";
import { BlogArticle } from "@/components/blog-article";
import { faqForPost } from "@/lib/blog-faq";
import "../../blog.css";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; city?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getContentTopic(slug);
  if (topic) {
    const title = `${topic.name} — гайди з планування весілля`;
    const description =
      topic.description || `Статті про ${topic.name.toLowerCase()} на fata.studio.`;
    const path = contentTopicHref(topic);
    const image = absoluteUrl(topic.coverUrl);
    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: {
        title,
        description,
        url: path,
        type: "website",
        ...(image ? { images: [{ url: image, alt: topic.name }] } : {}),
      },
    };
  }

  const post = await getContentPost(slug);
  if (!post) return { title: "Матеріал не знайдено" };

  const title = post.seoTitle || post.title;
  const description = truncateMeta(
    post.seoDescription || post.excerpt || post.title,
  );
  const path = contentHref(post);
  const image = absoluteUrl(post.ogImageUrl || post.coverUrl);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const topic = await getContentTopic(slug);
  if (topic) {
    const { q, city } = await searchParams;
    const [topics, posts, cities] = await Promise.all([
      getContentTopics(),
      getContentPosts({ topic: slug, limit: 24, q, city }),
      getContentCities(),
    ]);

    return (
      <div className="blog-page">
        <div className="blog-shell">
          <ContentBlogHero
            topics={topics}
            cities={cities}
            activeSlug={topic.slug}
            q={q}
            city={city}
            title={topic.name}
            description={topic.description}
          />
          <section>
            <div className="blog-grid">
              {posts.items.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
            {!posts.items.length ? (
              <p className="blog-empty">У цій темі ще немає публікацій.</p>
            ) : null}
          </section>
        </div>
        <section className="blog-cta">
          <h2>З fata.studio ці речі простіше зробити, ніж просто прочитати</h2>
          <Link href="/register">Розпочати безкоштовно</Link>
        </section>
      </div>
    );
  }

  const post = await getContentPost(slug);
  if (!post) notFound();

  const html = renderEditorJsHtml(post.body);
  const relatedRaw = await getContentPosts({ limit: 12 });
  const related = relatedRaw.items
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${contentHref(post)}`;
  const absImage = absoluteUrl(post.coverUrl);
  const faq = faqForPost(post.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Блог",
          item: `${siteUrl}/blog`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: post.topic.name,
          item: `${siteUrl}${contentTopicHref(post.topic)}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": post.kind === "LANDING" ? "WebPage" : "Article",
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: pageUrl,
      ...(absImage ? { image: absImage } : {}),
      author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: siteUrl,
      },
    },
    ...(faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="blog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticle post={post} related={related} html={html} />
      <section className="blog-cta">
        <h2>З fata.studio ці речі простіше зробити, ніж просто прочитати</h2>
        <Link href="/register">Розпочати безкоштовно</Link>
      </section>
    </div>
  );
}
