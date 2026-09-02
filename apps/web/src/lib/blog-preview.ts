import type { ContentPost } from "@/lib/content-api";

const COVER =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80";

/** Картка 1:1 з макета Figma (x1) — перша в стрічці блогу. */
export const BLOG_FIGMA_POST: ContentPost = {
  id: "figma-autumn-palette",
  title: "Стиль поза часом: Як обрати ідеальну палітру для осіннього весілля",
  slug: "styl-poza-chasom-osinnya-palitra",
  excerpt:
    "Осінь диктує свої правила в колористиці. Розповідаємо, як поєднувати глибокий бордо, теракоту та оливкові відтінки без кліше.",
  coverUrl: COVER,
  kind: "ARTICLE",
  status: "PUBLISHED",
  body: { blocks: [] },
  seoTitle: "Стиль поза часом: осіннє весілля",
  seoDescription:
    "Осінь диктує свої правила в колористиці. Розповідаємо, як поєднувати глибокий бордо, теракоту та оливкові відтінки без кліше.",
  featured: true,
  topicId: "figma-style",
  publishedAt: "2025-10-12T00:00:00.000Z",
  createdAt: "2023-09-15T00:00:00.000Z",
  updatedAt: "2023-09-15T00:00:00.000Z",
  city: null,
  topic: {
    id: "figma-style",
    name: "Стиль",
    slug: "styl",
    description: "Стиль і палітра",
    sortOrder: 7,
  },
};

export const BLOG_FIGMA_TAGS = ["Стиль", "Декор", "Всі міста"] as const;
export const BLOG_FIGMA_CATEGORY = "Новини та поради";

function previewCard(
  id: string,
  slug: string,
  title: string,
  excerpt: string,
  coverUrl: string,
): ContentPost {
  return {
    ...BLOG_FIGMA_POST,
    id,
    slug,
    title,
    excerpt,
    coverUrl,
    seoTitle: title,
    seoDescription: excerpt,
    featured: false,
  };
}

export const BLOG_RELATED_PREVIEWS: ContentPost[] = [
  previewCard(
    "preview-floristry",
    "kvitkova-kompozytsiya-na-stil",
    "Квіткова композиція на стіл: як зібрати осінній букет без перебору",
    "Евкаліпт, жоржини й сухі гілки. Розбираємо, скільки зелені треба, щоб стіл не виглядав як вітрина.",
    "https://images.unsplash.com/photo-1478144592103-25e319a38028?auto=format&fit=crop&w=1200&q=80",
  ),
  previewCard(
    "preview-stationery",
    "poligrafiya-yaka-pasuye-do-dekoru",
    "Поліграфія, яка пасує до декору: запрошення, картки і меню",
    "Бордо в друці легко стає коричневим. Як тримати колір на папері й не роз’їхатись із декором залу.",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80",
  ),
  previewCard(
    "preview-ceramics",
    "keramika-i-tekstyl-na-vesilli",
    "Кераміка і текстиль: дрібниці, які тримають стиль",
    "Матові тарілки, грубий льон і латунь у деталях. Набір текстур, який працює на фото і вживу.",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
  ),
];

export const BLOG_PREVIEW_BY_SLUG: Record<string, ContentPost> = Object.fromEntries(
  [BLOG_FIGMA_POST, ...BLOG_RELATED_PREVIEWS].map((post) => [post.slug, post]),
);

export function withBlogPreviewPosts(items: ContentPost[]): ContentPost[] {
  if (items.some((post) => post.slug === BLOG_FIGMA_POST.slug)) return items;
  return [BLOG_FIGMA_POST, ...items];
}

export function relatedBlogPosts(
  currentSlug: string,
  items: ContentPost[],
): ContentPost[] {
  const pool = [...withBlogPreviewPosts(items), ...BLOG_RELATED_PREVIEWS];
  const seen = new Set<string>();
  return pool.filter((post) => {
    if (post.slug === currentSlug || seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  }).slice(0, 3);
}
