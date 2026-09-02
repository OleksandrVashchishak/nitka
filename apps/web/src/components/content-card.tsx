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
  tags,
}: {
  post: ContentPost;
  large?: boolean;
  tags?: string[];
}) {
  const date = formatDate(post.publishedAt);
  const chips = tags?.length
    ? tags
    : [post.topic.name];

  return (
    <article className="blog-card">
      <Link href={contentHref(post)} className="blog-card-cover">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 387px"
          />
        ) : null}
      </Link>
      <div className="blog-card-meta">
        <p>
          {chips.map((tag, index) => (
            <span key={tag}>
              {index > 0 ? " | " : null}
              {post.topic.name === tag ? (
                <Link href={contentTopicHref(post.topic)}>{tag}</Link>
              ) : (
                tag
              )}
            </span>
          ))}
        </p>
        {date ? (
          <time dateTime={post.publishedAt ?? undefined}>{date}</time>
        ) : null}
      </div>
      <Link href={contentHref(post)}>
        <h3 className="blog-card-title">{post.title}</h3>
        {post.excerpt ? (
          <p className="blog-card-excerpt">{post.excerpt}</p>
        ) : null}
        <span className="blog-card-more">Читати статтю &gt;</span>
      </Link>
    </article>
  );
}

export { ContentTopicChips } from "@/components/content-topics";
