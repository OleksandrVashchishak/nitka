import Link from "next/link";
import Image from "next/image";
import {
  contentHref,
  contentKindLabel,
  contentTopicHref,
  type ContentPost,
} from "@/lib/content-api";

function formatDate(value?: string | null) {
  if (!value) return null;
  // UTC — щоб SSR і клієнт не розʼїжджались по timezone
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ContentCard({
  post,
  large = false,
}: {
  post: ContentPost;
  large?: boolean;
}) {
  const date = formatDate(post.publishedAt);
  return (
    <article className="group">
      <Link href={contentHref(post)} className="block">
        <div
          className={`relative overflow-hidden rounded-2xl bg-sage/15 ${
            large ? "aspect-[16/10] md:aspect-[5/3]" : "aspect-[16/10]"
          }`}
        >
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes={
                large
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sage/40 via-mist to-paper" />
          )}
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <span className="font-medium text-sage-deep">
              {contentKindLabel(post.kind)}
            </span>
            <span>·</span>
            <span>{post.topic.name}</span>
            {date ? (
              <>
                <span>·</span>
                <time dateTime={post.publishedAt ?? undefined}>{date}</time>
              </>
            ) : null}
          </div>
          <h3
            className={`mt-2 font-[family-name:var(--font-display)] text-ink transition group-hover:text-sage-deep ${
              large ? "text-3xl md:text-4xl" : "text-2xl"
            }`}
          >
            {post.title}
          </h3>
          {post.excerpt ? (
            <p
              className={`mt-2 text-sm leading-6 text-ink-soft ${
                large ? "line-clamp-3 md:text-base" : "line-clamp-2"
              }`}
            >
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
      <Link
        href={contentTopicHref(post.topic)}
        className="mt-3 inline-block text-xs font-medium text-ink-soft hover:text-sage-deep"
      >
        Усі в «{post.topic.name}»
      </Link>
    </article>
  );
}

export { ContentTopicChips } from "@/components/content-topics";
