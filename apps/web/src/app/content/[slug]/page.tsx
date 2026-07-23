import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVendors } from "@/lib/api";
import {
  contentHref,
  contentKindLabel,
  contentTopicHref,
  getContentPost,
  getContentPosts,
} from "@/lib/content-api";
import { absoluteUrl, getSiteUrl, truncateMeta } from "@/lib/site";
import { renderEditorJsHtml } from "@/components/content-blocks";
import { ContentCard } from "@/components/content-card";
import { VendorGrid } from "@/components/vendor-grid";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

export default async function ContentPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentPost(slug);
  if (!post) notFound();

  const html = renderEditorJsHtml(post.body);
  const image = post.coverUrl;
  const showVendors = Boolean(post.city || post.vendorCategorySlug);

  const [vendors, relatedRaw] = await Promise.all([
    showVendors
      ? getVendors({
          city: post.city || undefined,
          category: post.vendorCategorySlug || undefined,
          sort: "rating",
        })
      : Promise.resolve([]),
    getContentPosts({ topic: post.topic.slug, limit: 6 }),
  ]);

  const related = relatedRaw.items
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${contentHref(post)}`;
  const absImage = absoluteUrl(image);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ідеї",
          item: `${siteUrl}/content`,
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
      author: post.author
        ? { "@type": "Person", name: post.author.name }
        : { "@type": "Organization", name: "NITKA" },
      publisher: {
        "@type": "Organization",
        name: "NITKA",
        url: siteUrl,
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-paper pb-16">
        <header className="mx-auto max-w-3xl px-5 pt-10 md:px-8">
          <nav
            aria-label="Хлібні крихти"
            className="flex flex-wrap items-center gap-2 text-sm text-ink-soft"
          >
            <Link href="/content" className="hover:text-sage-deep">
              Ідеї
            </Link>
            <span>/</span>
            <Link
              href={contentTopicHref(post.topic)}
              className="hover:text-sage-deep"
            >
              {post.topic.name}
            </Link>
            <span>/</span>
            <span className="text-ink line-clamp-1">{post.title}</span>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <span className="rounded-full bg-sage/15 px-2.5 py-1 text-xs font-medium text-sage-deep">
              {contentKindLabel(post.kind)}
            </span>
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("uk-UA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(post.publishedAt))}
              </time>
            ) : null}
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg leading-8 text-ink-soft">{post.excerpt}</p>
          ) : null}
        </header>

        {image ? (
          <div className="mx-auto mt-8 max-w-4xl px-5 md:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-mist">
              <Image
                src={image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        ) : null}

        <div
          className="mx-auto max-w-3xl px-5 pt-4 md:px-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-4 px-5 md:px-8">
          <Link
            href={contentTopicHref(post.topic)}
            className="text-sm font-medium text-sage-deep hover:underline"
          >
            ← {post.topic.name}
          </Link>
          <Link
            href="/content"
            className="text-sm font-medium text-ink-soft hover:text-sage-deep"
          >
            Усі ідеї
          </Link>
          <Link
            href="/vendors"
            className="text-sm font-medium text-ink-soft hover:text-sage-deep"
          >
            Каталог підрядників →
          </Link>
        </div>

        {showVendors ? (
          <div className="mt-10 border-t border-line pt-4">
            <VendorGrid
              vendors={vendors.slice(0, 6)}
              title={
                post.city
                  ? `Підрядники · ${post.city}`
                  : "Підрядники з каталогу"
              }
              subtitle="Живі профілі з NITKA — можна зберегти в обране"
              showAllLink
            />
            <div className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
              <Link
                href={`/vendors?${new URLSearchParams({
                  ...(post.city ? { city: post.city } : {}),
                  ...(post.vendorCategorySlug
                    ? { category: post.vendorCategorySlug }
                    : {}),
                }).toString()}`}
                className="text-sm font-medium text-sage-deep hover:underline"
              >
                Дивитись усі в каталозі →
              </Link>
            </div>
          </div>
        ) : null}

        {related.length ? (
          <section className="mx-auto max-w-6xl border-t border-line px-5 py-14 md:px-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
              Ще з теми «{post.topic.name}»
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ContentCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
