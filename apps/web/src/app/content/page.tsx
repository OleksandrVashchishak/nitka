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

type Props = {
  searchParams: Promise<{ page?: string; q?: string; city?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const base = {
    title: "Весілля: ідеї та натхнення",
    description:
      "Статті, гайди та підбірки: декор, флористика, стиль, церемонія, локації й банкет.",
    alternates: { canonical: "/content" as string | undefined },
    openGraph: {
      title: "Весілля: ідеї та натхнення · NITKA",
      description:
        "Статті та підбірки для планування весілля в Україні.",
      url: "/content",
      type: "website" as const,
    },
  };
  if (page > 1) {
    return {
      ...base,
      title: `Ідеї та натхнення — сторінка ${page}`,
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
  city,
}: {
  page: number;
  totalPages: number;
  q?: string;
  city?: string;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => {
    const params = new URLSearchParams();
    if (n > 1) params.set("page", String(n));
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    const qs = params.toString();
    return qs ? `/content?${qs}` : "/content";
  };

  return (
    <nav aria-label="Пагінація" className="mt-14 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(0, 8)
        .map((n) => (
          <Link
            key={n}
            href={href(n)}
            className={
              n === page
                ? "border-b-2 border-[#ff4200] px-2 py-1 text-sm font-medium text-ink"
                : "px-2 py-1 text-sm text-[#8a8a8a] hover:text-ink"
            }
          >
            {n}
          </Link>
        ))}
    </nav>
  );
}

export default async function ContentHubPage({ searchParams }: Props) {
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
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-12 md:px-[75px] md:pt-16">
        <ContentBlogHero topics={topics} cities={cities} q={q} city={city} />

        <section className="mt-12">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {latest.items.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
          {!latest.items.length ? (
            <p className="mt-8 text-center text-[#6f6f6f]">
              Нічого не знайшли за цим запитом.
            </p>
          ) : null}
          <Pagination page={page} totalPages={totalPages} q={q} city={city} />
        </section>
      </div>
    </div>
  );
}
