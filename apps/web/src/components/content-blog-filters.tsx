"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContentTopic } from "@/lib/content-api";
import { contentTopicHref } from "@/lib/content-api";

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
  const listHref = activeSlug ? contentTopicHref({ slug: activeSlug }) : "/content";

  return (
    <div className="mt-10">
      <form action={listHref} method="get" className="relative max-w-xl">
        {city ? <input type="hidden" name="city" value={city} /> : null}
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#b3b3b3]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Пошук"
          className="w-full border-0 border-b border-[#e6e6e6] bg-transparent py-3 pl-7 pr-3 font-[family-name:var(--font-sans)] text-base text-ink outline-none placeholder:text-[#b3b3b3] focus:border-[#ff4200]"
        />
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec]">
        <nav className="flex min-w-0 flex-1 flex-wrap gap-x-6 gap-y-2" aria-label="Теми блогу">
          <FilterTab href={qHref("/content", q, city)} active={!activeSlug}>
            Усі
          </FilterTab>
          {topics.map((topic) => (
            <FilterTab
              key={topic.slug}
              href={qHref(contentTopicHref(topic), q, city)}
              active={activeSlug === topic.slug}
            >
              {topic.name}
            </FilterTab>
          ))}
        </nav>

        {cities.length ? (
          <label className="relative shrink-0">
            <span className="sr-only">Місто</span>
            <select
              value={city || ""}
              onChange={(event) => {
                const next = event.target.value;
                const params = new URLSearchParams();
                if (q) params.set("q", q);
                if (next) params.set("city", next);
                const qs = params.toString();
                router.push(qs ? `${listHref}?${qs}` : listHref);
              }}
              className="appearance-none rounded-full border border-[#d9d9d9] bg-white py-2 pl-4 pr-9 text-sm text-ink outline-none"
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

function FilterTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "-mb-px inline-flex border-b-2 border-[#ff4200] pb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-ink"
          : "inline-flex pb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a] hover:text-ink"
      }
    >
      {children}
    </Link>
  );
}

function qHref(path: string, q?: string, city?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (city) params.set("city", city);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
