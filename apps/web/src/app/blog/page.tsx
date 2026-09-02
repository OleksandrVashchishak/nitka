import type { Metadata } from "next";
import Link from "next/link";
import {
  getContentCities,
  getContentPosts,
  getContentTopics,
} from "@/lib/content-api";
import { ContentCard } from "@/components/content-card";
import { ContentBlogHero } from "@/components/content-blog-hero";
import { noIndexRobots } from "@/lib/site";
import "../blog.css";

type Props = {
  searchParams: Promise<{ page?: string; q?: string; city?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const base = {
    title: "Гайди з планування весілля",
    description:
      "Чеклисти, бюджет, гості, запрошення і день весілля — практичні статті для пар в Україні.",
    alternates: { canonical: "/blog" as string | undefined },
    openGraph: {
      title: "Гайди з планування весілля",
      description:
        "Практичні гайди: чеклист, бюджет, гості, запрошення і план дня.",
      url: "/blog",
      type: "website" as const,
    },
  };
  if (page > 1) {
    return {
      ...base,
      title: `Гайди з планування весілля — сторінка ${page}`,
      alternates: { canonical: undefined },
      robots: noIndexRobots,
    };
  }
  return base;
}

function Pagination({
  page,
  totalPages,
  q,
}: {
  page: number;
  totalPages: number;
  q?: string;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => {
    const params = new URLSearchParams();
    if (n > 1) params.set("page", String(n));
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <nav aria-label="Пагінація" className="blog-pages">
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(0, 8)
        .map((n) => (
          <Link key={n} href={href(n)} className={n === page ? "is-on" : undefined}>
            {n}
          </Link>
        ))}
    </nav>
  );
}

export default async function BlogHubPage({ searchParams }: Props) {
  const { page: pageRaw, q, city } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const limit = 12;

  const [topics, latest, cities] = await Promise.all([
    getContentTopics(),
    getContentPosts({ limit, page, q, city }),
    getContentCities(),
  ]);

  const totalPages = Math.max(1, Math.ceil(latest.total / limit));

  return (
    <div className="blog-page">
      <div className="blog-shell">
        <ContentBlogHero topics={topics} cities={cities} q={q} city={city} />
        <section>
          <div className="blog-grid">
            {latest.items.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
          {!latest.items.length ? (
            <p className="blog-empty">Нічого не знайшли за цим запитом.</p>
          ) : null}
          <Pagination page={page} totalPages={totalPages} q={q} />
        </section>
      </div>
      <section className="blog-cta">
        <h2>З fata.studio ці речі простіше зробити, ніж просто прочитати</h2>
        <Link href="/register">Розпочати безкоштовно</Link>
      </section>
    </div>
  );
}
