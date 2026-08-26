import Link from "next/link";
import Image from "next/image";
import {
  contentHref,
  contentTopicHref,
  type ContentPost,
} from "@/lib/content-api";

function formatDate(value?: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ContentCard({
  post,
}: {
  post: ContentPost;
  large?: boolean;
}) {
  const date = formatDate(post.publishedAt);
  const tags = [post.topic.name, post.city || "Всі міста"].filter(Boolean);

  return (
    <article className="group flex flex-col">
      <Link href={contentHref(post)} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f3f3f3]">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#ececec]" />
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3 text-[11px] uppercase tracking-[0.08em] text-[#8a8a8a]">
        <p className="min-w-0">
          {tags.map((tag, index) => (
            <span key={tag}>
              {index > 0 ? " | " : null}
              {post.topic.name === tag ? (
                <Link href={contentTopicHref(post.topic)} className="hover:text-ink">
                  {tag}
                </Link>
              ) : (
                tag
              )}
            </span>
          ))}
        </p>
        {date ? (
          <time dateTime={post.publishedAt ?? undefined} className="shrink-0">
            {date}
          </time>
        ) : null}
      </div>
      <Link href={contentHref(post)} className="mt-3 block">
        <h3 className="font-[family-name:var(--font-display)] text-[28px] font-medium leading-[1.15] text-ink">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-6 text-[#6f6f6f]">
            {post.excerpt}
          </p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#ff4200]">
          Читати статтю <span aria-hidden>&gt;</span>
        </span>
      </Link>
    </article>
  );
}

export { ContentTopicChips } from "@/components/content-topics";
