import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  WEDDING_CITIES,
  weddingCityHref,
} from "@/lib/wedding-cities";

export const metadata: Metadata = {
  title: "Весілля в містах України — Київ, Львів, Одеса та інші",
  description:
    "Підбірки весільних підрядників по містах: Київ, Львів, Одеса, Харків, Дніпро. Каталог, план і бюджет для організації весілля в Україні.",
  alternates: { canonical: "/vesillya" },
  openGraph: {
    title: "Весілля в містах України · NITKA",
    description:
      "Гео-підбірки для пар: підрядники й поради для весілля в вашому місті.",
    url: "/vesillya",
    type: "website",
  },
};

export default function VesillyaHubPage() {
  return (
    <div className="bg-paper">
      <section className="border-b border-line bg-gradient-to-br from-sage/20 via-mist to-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-sage-deep">
            Міста
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl text-ink md:text-6xl">
            Весілля в містах України
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft md:text-lg">
            Оберіть місто — відкриється підбірка з каталогом підрядників,
            порадами й інструментами для пари. Зручний старт, якщо шукаєте
            «весілля в Києві», «фотографи Львів» чи локації в Одесі.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WEDDING_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={weddingCityHref(city)}
              className="group relative overflow-hidden rounded-[1.35rem] border border-line bg-ink"
            >
              <div className="relative aspect-[16/11]">
                <Image
                  src={city.image}
                  alt={`Весілля ${city.inCity}`}
                  fill
                  className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/70">
                    {city.region}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                    {city.name}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-white/80">
                    {city.lead}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-ink-soft">
          Немає вашого міста в списку?{" "}
          <Link
            href="/vendors"
            className="font-medium text-sage-deep hover:underline"
          >
            Шукайте в каталозі по всій Україні →
          </Link>
        </p>
      </section>
    </div>
  );
}
