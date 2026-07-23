import type { Metadata } from "next";
import Link from "next/link";
import {
  getContentPosts,
  getContentTopics,
} from "@/lib/content-api";
import { ContentCard } from "@/components/content-card";
import {
  ContentTopicChips,
  PopularTopicsGrid,
  TopicIconCards,
} from "@/components/content-topics";
import { noIndexRobots } from "@/lib/site";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const base = {
    title: "Ідеї та поради для весілля",
    description:
      "Статті, гайди та підбірки: бюджет, чеклисти, локації, підрядники й онлайн-запрошення.",
    alternates: { canonical: "/content" as string | undefined },
    openGraph: {
      title: "Ідеї та поради для весілля · NITKA",
      description:
        "Статті, гайди та підбірки для планування весілля в Україні.",
      url: "/content",
      type: "website" as const,
    },
  };
  if (page > 1) {
    return {
      ...base,
      title: `Ідеї та поради — сторінка ${page}`,
      alternates: { canonical: undefined },
      robots: noIndexRobots,
    };
  }
  return base;
}

function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    0,
    8,
  );

  return (
    <nav
      aria-label="Пагінація"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={page === 2 ? "/content" : `/content?page=${page - 1}`}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-sage/40"
        >
          ← Назад
        </Link>
      ) : null}
      {pages.map((n) => (
        <Link
          key={n}
          href={n === 1 ? "/content" : `/content?page=${n}`}
          className={
            n === page
              ? "rounded-full bg-sage px-3.5 py-2 text-sm font-medium text-white"
              : "rounded-full border border-line bg-white px-3.5 py-2 text-sm text-ink-soft hover:border-sage/40"
          }
        >
          {n}
        </Link>
      ))}
      {page < totalPages ? (
        <Link
          href={`/content?page=${page + 1}`}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-sage/40"
        >
          Далі →
        </Link>
      ) : null}
    </nav>
  );
}

export default async function ContentHubPage({ searchParams }: Props) {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const limit = 6;

  const [topics, featured, latest, trending] = await Promise.all([
    getContentTopics(),
    getContentPosts({ featured: true, limit: 4 }),
    getContentPosts({ limit, page }),
    getContentPosts({ limit: 5, page: 1 }),
  ]);

  const featuredIds = new Set(featured.items.map((p) => p.id));
  const rest =
    page === 1
      ? latest.items.filter((p) => !featuredIds.has(p.id))
      : latest.items;
  const totalPages = Math.max(1, Math.ceil(latest.total / limit));
  const [hero, ...editorRest] = featured.items;

  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/25 via-mist to-paper" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-18">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-sage-deep">
            Ideas & Advice
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl text-ink md:text-6xl">
            Ідеї та поради для весілля
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft md:text-lg">
            Статті, гайди й підбірки міст — від бюджету до онлайн-запрошень.
            Далі можна одразу перейти до каталогу підрядників.
          </p>
          <div className="mt-8">
            <ContentTopicChips topics={topics} />
          </div>
        </div>
      </section>

      {page === 1 ? (
        <>
          <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
            <TopicIconCards topics={topics} />
          </section>

          {hero ? (
            <section className="mx-auto max-w-6xl px-5 pb-6 md:px-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-sage-deep">
                    Editor picks
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
                    Обране редакцією
                  </h2>
                </div>
                <Link
                  href="/vendors"
                  className="text-sm font-medium text-sage-deep hover:underline"
                >
                  До каталогу →
                </Link>
              </div>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
                <ContentCard post={hero} large />
                <div className="grid gap-8">
                  {editorRest.slice(0, 2).map((post) => (
                    <ContentCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <section className="border-y border-line bg-mist/60">
            <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-sage-deep">
                Popular topics
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
                Популярні теми
              </h2>
              <p className="mt-3 max-w-2xl text-ink-soft">
                Оберіть тему — як на The Knot: планування, бюджет, локації,
                підрядники, запрошення й чеклисти.
              </p>
              <div className="mt-8">
                <PopularTopicsGrid topics={topics} />
              </div>
            </div>
          </section>

          {trending.items.length ? (
            <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-sage-deep">
                Loved by couples
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink">
                Зараз читають
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {trending.items.slice(0, 3).map((post) => (
                  <ContentCard key={`trend-${post.id}`} post={post} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
          {page === 1 ? "Останні матеріали" : `Сторінка ${page}`}
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(rest.length ? rest : latest.items).map((post) => (
            <ContentCard key={post.id} post={post} />
          ))}
        </div>
        {!latest.items.length ? (
          <p className="mt-8 text-ink-soft">
            Поки що немає опублікованих матеріалів.
          </p>
        ) : null}
        <Pagination page={page} totalPages={totalPages} />
      </section>
    </div>
  );
}
