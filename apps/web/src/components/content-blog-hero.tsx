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
    <header className="blog-hero">
      <h1>
        <span className="blog-kicker">Весілля</span>
        <span className="blog-title">{title || "ідеї та натхнення"}</span>
      </h1>
      <p className="blog-lead">
        {description ||
          "Чеклисти, бюджет, гості, запрошення і день весілля — без журналу про сукні."}
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
