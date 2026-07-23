import Link from "next/link";
import Image from "next/image";
import type { ContentTopic } from "@/lib/content-api";
import { contentTopicHref } from "@/lib/content-api";

const ICON_PATHS: Record<string, string> = {
  calendar:
    "M8 2v2M16 2v2M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  wallet:
    "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 13h.01",
  pin: "M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11zM12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.1a4 4 0 0 1 0 7.8M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  check: "M20 6L9 17l-5-5",
  spark: "M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z",
};

export function TopicIcon({
  icon,
  className = "size-5",
}: {
  icon?: string | null;
  className?: string;
}) {
  const d = ICON_PATHS[icon || "spark"] || ICON_PATHS.spark;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export function ContentTopicChips({
  topics,
  activeSlug,
}: {
  topics: Array<{ name: string; slug: string; icon?: string | null }>;
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/content"
        className={
          !activeSlug
            ? "inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sm font-medium text-white"
            : "inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-4 py-2 text-sm text-ink-soft backdrop-blur hover:border-sage/40"
        }
      >
        Усе
      </Link>
      {topics.map((topic) => {
        const active = activeSlug === topic.slug;
        return (
          <Link
            key={topic.slug}
            href={contentTopicHref(topic)}
            className={
              active
                ? "inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2 text-sm font-medium text-white"
                : "inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-4 py-2 text-sm text-ink-soft backdrop-blur hover:border-sage/40"
            }
          >
            <TopicIcon icon={topic.icon} className="size-4" />
            {topic.name}
          </Link>
        );
      })}
    </div>
  );
}

export function PopularTopicsGrid({ topics }: { topics: ContentTopic[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={contentTopicHref(topic)}
          className="group relative overflow-hidden rounded-[1.35rem] border border-line bg-ink"
        >
          <div className="relative aspect-[16/10]">
            {topic.coverUrl ? (
              <Image
                src={topic.coverUrl}
                alt={topic.name}
                fill
                className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-sage to-sage-deep" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="mb-2 inline-flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <TopicIcon icon={topic.icon} className="size-5" />
              </div>
              <p className="font-[family-name:var(--font-display)] text-2xl">
                {topic.name}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-white/80">
                {topic.description || "Матеріали цієї теми"}
              </p>
              {typeof topic._count?.posts === "number" ? (
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/70">
                  {topic._count.posts} матеріалів
                </p>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function TopicIconCards({ topics }: { topics: ContentTopic[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={contentTopicHref(topic)}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-white px-3 py-5 text-center transition hover:border-sage/50 hover:shadow-[0_12px_40px_-24px_rgba(58,82,66,0.45)]"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-sage/10 text-sage-deep transition group-hover:bg-sage group-hover:text-white">
            <TopicIcon icon={topic.icon} className="size-5" />
          </span>
          <span className="text-sm font-semibold text-ink">{topic.name}</span>
        </Link>
      ))}
    </div>
  );
}
