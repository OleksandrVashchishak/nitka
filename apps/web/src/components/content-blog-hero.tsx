import type { ContentTopic } from "@/lib/content-api";
import { ContentBlogFilters } from "@/components/content-blog-filters";

export function ContentBlogHero({
  topics,
  cities,
  activeSlug,
  q,
  city,
  title,
  description,
}: {
  topics: ContentTopic[];
  cities: string[];
  activeSlug?: string;
  q?: string;
  city?: string;
  title?: string;
  description?: string;
}) {
  return (
    <header className="text-center">
      <h1 className="leading-none">
        <span className="font-mak block text-[clamp(56px,8vw,92px)] font-light uppercase text-[#ff4200]">
          Весілля:
        </span>
        <span className="mt-1 block font-[family-name:var(--font-display)] text-[clamp(28px,4vw,48px)] font-medium text-ink">
          {title || "ідеї та натхнення"}
        </span>
      </h1>
      <p className="mx-auto mt-5 max-w-[640px] text-[15px] leading-6 text-[#6f6f6f]">
        {description ||
          "Статті, гайди та підбірки: декор, флористика, стиль, церемонія, локації й банкет."}
      </p>
      <ContentBlogFilters
        topics={topics}
        cities={cities}
        activeSlug={activeSlug}
        q={q}
        city={city}
      />
    </header>
  );
}
