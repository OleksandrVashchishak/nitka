"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CityAutocomplete } from "@/components/city-autocomplete";
import type { Category } from "@/lib/api";

type Props = {
  categories: Category[];
};

export function Hero({ categories }: Props) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city.trim()) params.set("city", city.trim());
    const qs = params.toString();
    router.push(qs ? `/vendors?${qs}` : "/vendors");
  }

  return (
    <section className="relative min-h-[100svh] bg-ink">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80"
          alt="Пара на весіллі"
          fill
          priority
          className="animate-hero-media object-cover object-[center_30%] opacity-80"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p className="animate-rise font-[family-name:var(--font-display)] text-5xl leading-none tracking-[0.04em] text-white md:text-7xl lg:text-8xl">
          NITKA
        </p>
        <h1 className="animate-rise-delay mt-5 max-w-2xl font-[family-name:var(--font-display)] text-3xl leading-tight text-white md:text-5xl">
          Знайдіть ідеальних весільних професіоналів
        </h1>
        <p className="animate-rise-late mt-4 max-w-xl text-base text-white/85 md:text-lg">
          Фотографи, локації, музика, декор і beauty — в одному місці, під ваш
          стиль і бюджет.
        </p>

        <form
          onSubmit={onSearch}
          className="relative z-20 mt-8 grid w-full max-w-3xl gap-2 rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:grid-cols-[1.1fr_1fr_auto]"
        >
          <CityAutocomplete
            value={city}
            onChange={setCity}
            onOpenChange={setCityMenuOpen}
            allowEmpty
            placeholder="Місто"
            className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-ink outline-none placeholder:text-ink-soft/70"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-ink outline-none"
          >
            <option value="">Усі категорії</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep"
          >
            Шукати
          </button>
        </form>

        <div
          className={`relative z-0 mt-5 flex flex-wrap gap-3 ${
            cityMenuOpen ? "invisible" : ""
          }`}
        >
          <Link
            href="/vendors"
            className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Весь каталог
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Почати планування
          </Link>
        </div>
      </div>
    </section>
  );
}
