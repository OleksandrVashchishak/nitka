import Image from "next/image";
import Link from "next/link";
import type { ContentPost } from "@/lib/content-api";
import { contentTopicHref } from "@/lib/content-api";
import { ContentCard } from "@/components/content-card";
import { faqForPost, type BlogFaqItem } from "@/lib/blog-faq";
import { tocFromHtml } from "@/components/content-blocks";

const HERO =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80";

function articleDate(iso?: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(iso))
    .replace(/\s*р\.?$/i, "")
    .toUpperCase();
}

export function BlogArticle({
  post,
  related,
  html,
}: {
  post: ContentPost;
  related: ContentPost[];
  html?: string;
}) {
  const date = articleDate(post.publishedAt);
  const hero = post.coverUrl || HERO;
  const tags = [post.topic.name].filter(Boolean);
  const faq = faqForPost(post.slug);
  const toc = html ? tocFromHtml(html) : [];
  if (faq.length) {
    toc.push({ id: "chasti-pytannya", text: "Часті питання" });
  }

  return (
    <article className="blog-article">
      <div className="blog-article-head">
        <div className="blog-article-top">
          <nav className="blog-crumbs" aria-label="Хлібні крихти">
            <Link href="/">Головна</Link>
            <span>/</span>
            <Link href="/blog">Блог</Link>
            <span>/</span>
            <Link href={contentTopicHref(post.topic)}>{post.topic.name}</Link>
            <span>/</span>
            <span className="is-current">{post.title}</span>
          </nav>
          {tags.length ? (
            <p className="blog-article-cats">
              {tags.map((tag, index) => (
                <span key={tag}>
                  {index > 0 ? <span className="sep">|</span> : null}
                  {tag}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        <h1 className="blog-article-title">{post.title}</h1>
        <p className="blog-article-date">
          {date ? <span>{date}</span> : null}
          {date ? <span className="sep">|</span> : null}
          <span>8 хвилин читання</span>
        </p>
      </div>

      <div className="blog-article-hero">
        <Image
          src={hero}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 767px) 358px, 1240px"
        />
      </div>

      {toc.length ? (
        <nav className="blog-toc" aria-label="Зміст статті">
          <p className="blog-toc-label">У статті</p>
          <ol>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="blog-prose">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : post.excerpt ? (
          <p>{post.excerpt}</p>
        ) : null}
      </div>

      {faq.length ? <BlogFaq items={faq} /> : null}

      {related.length ? (
        <section className="blog-related">
          <div className="blog-related-head">
            <h2>Схожі публікації</h2>
            <Link href="/blog">
              Усі статті <span aria-hidden>&gt;</span>
            </Link>
          </div>
          <div className="blog-grid">
            {related.map((item) => (
              <ContentCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function BlogFaq({ items }: { items: BlogFaqItem[] }) {
  return (
    <section className="blog-faq" aria-labelledby="chasti-pytannya">
      <h2 id="chasti-pytannya" className="blog-heading">
        Часті питання
      </h2>
      <div className="blog-faq-list">
        {items.map((item) => (
          <details key={item.q} className="blog-faq-item">
            <summary>
              <span>{item.q}</span>
              <span className="blog-faq-mark" aria-hidden>
                +
              </span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
