import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/api";

const CATEGORY_VISUAL: Record<
  string,
  { hint: string; image: string; span?: string }
> = {
  photo: {
    hint: "Галереї і стиль зйомки",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    span: "md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[440px]",
  },
  venue: {
    hint: "Зали, садиби, terrace",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215a07?w=900&q=80",
    span: "min-h-[220px]",
  },
  music: {
    hint: "DJ і живі сети",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
    span: "min-h-[220px]",
  },
  decor: {
    hint: "Квіти і атмосфера",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
    span: "min-h-[220px]",
  },
  beauty: {
    hint: "Макіяж і зачіски",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80",
    span: "min-h-[220px]",
  },
};

type Props = {
  categories: Category[];
};

export function Categories({ categories }: Props) {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-24 md:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sage/10 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
              Категорії
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-5xl">
              Підрядники під будь-який вайб
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft md:text-right">
            Обери напрям — далі вже фільтр по місту, ціні й рейтингу.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4 md:grid-rows-2">
          {categories.map((category) => {
            const visual = CATEGORY_VISUAL[category.slug] ?? {
              hint: "Переглянути",
              image:
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
              span: "min-h-[220px]",
            };

            return (
              <Link
                key={category.id}
                href={`/vendors?category=${category.slug}`}
                className={`group relative overflow-hidden rounded-[1.5rem] ${visual.span}`}
              >
                <Image
                  src={visual.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
                    {category.name}
                  </p>
                  <p className="mt-1 text-sm text-white/75">{visual.hint}</p>
                  <span className="mt-4 inline-flex translate-y-1 text-sm font-medium text-white opacity-80 transition group-hover:translate-y-0 group-hover:opacity-100">
                    Дивитись →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
