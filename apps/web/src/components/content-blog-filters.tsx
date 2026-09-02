"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContentTopic } from "@/lib/content-api";
import { contentTopicHref } from "@/lib/content-api";

function SearchIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M23.7501 23.7501L20.4951 20.4951M22.25 16.25C22.25 19.5637 19.5637 22.25 16.25 22.25C12.9363 22.25 10.25 19.5637 10.25 16.25C10.25 12.9363 12.9363 10.25 16.25 10.25C19.5637 10.25 22.25 12.9363 22.25 16.25Z"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ContentBlogFilters({
  topics,
  cities,
  activeSlug,
  q,
  city,
}: {
  topics: Array<Pick<ContentTopic, "name" | "slug">>;
  cities: string[];
  activeSlug?: string;
  q?: string;
  city?: string;
}) {
  const router = useRouter();
  const listHref = activeSlug ? contentTopicHref({ slug: activeSlug }) : "/blog";

  function pushFilters(next: { topic?: string; city?: string }) {
    const topic = next.topic === undefined ? activeSlug : next.topic;
    const nextCity = next.city === undefined ? city : next.city;
    const path = topic ? contentTopicHref({ slug: topic }) : "/blog";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (nextCity) params.set("city", nextCity);
    const qs = params.toString();
    router.push(qsPath(path, qs));
  }

  return (
    <div>
      <form action={listHref} method="get" className="blog-search">
        {city ? <input type="hidden" name="city" value={city} /> : null}
        <button type="submit" className="blog-search-btn" aria-label="Шукати">
          <SearchIcon />
        </button>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Пошук"
        />
      </form>

      <div className="blog-picks">
        <label className="blog-pick-wrap">
          <span className="sr-only">Категорія</span>
          <select
            className="blog-pick"
            value={activeSlug || ""}
            onChange={(event) => {
              pushFilters({ topic: event.target.value || undefined });
            }}
          >
            <option value="">Всі категорії</option>
            {topics.map((topic) => (
              <option key={topic.slug} value={topic.slug}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="blog-pick-wrap">
          <span className="sr-only">Місто</span>
          <select
            className="blog-pick"
            value={city || ""}
            onChange={(event) => {
              pushFilters({ city: event.target.value || undefined });
            }}
          >
            <option value="">Всі міста</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="blog-toolbar">
        <nav className="blog-cats" aria-label="Теми блогу">
          <Link
            href={withQuery("/blog", q, city)}
            className={`blog-cat${!activeSlug ? " is-on" : ""}`}
          >
            Усі
          </Link>
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={withQuery(contentTopicHref(topic), q, city)}
              className={`blog-cat${activeSlug === topic.slug ? " is-on" : ""}`}
            >
              {topic.name}
            </Link>
          ))}
        </nav>

        {cities.length ? (
          <label>
            <span className="sr-only">Місто</span>
            <select
              value={city || ""}
              className="blog-city"
              onChange={(event) => {
                pushFilters({ city: event.target.value || undefined });
              }}
            >
              <option value="">Всі міста</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}

function qsPath(path: string, qs: string) {
  return qs ? `${path}?${qs}` : path;
}

function withQuery(path: string, q?: string, city?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (city) params.set("city", city);
  return qsPath(path, params.toString());
}
