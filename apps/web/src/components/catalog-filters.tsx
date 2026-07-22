"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, VendorFilterOptions } from "@/lib/api";
import { CityAutocomplete } from "@/components/city-autocomplete";

type Props = {
  categories: Category[];
  filters: VendorFilterOptions;
  values: {
    category?: string;
    city?: string;
    price?: string;
    rating?: string;
    q?: string;
    style?: string;
    sort?: string;
  };
};

export function CatalogFilters({ categories, filters, values }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(values.q ?? "");
  const [category, setCategory] = useState(values.category ?? "");
  const [city, setCity] = useState(values.city ?? "");
  const [price, setPrice] = useState(values.price ?? "");
  const [rating, setRating] = useState(values.rating ?? "");
  const [style, setStyle] = useState(values.style ?? "");
  const [sort, setSort] = useState(values.sort ?? "rating");

  const priceHint = useMemo(
    () => `до ${new Intl.NumberFormat("uk-UA").format(filters.maxPrice)} грн`,
    [filters.maxPrice],
  );

  function apply(next?: Partial<{
    category: string;
    city: string;
    price: string;
    rating: string;
    q: string;
    style: string;
    sort: string;
  }>) {
    const params = new URLSearchParams();
    const data = {
      category: next?.category ?? category,
      city: next?.city ?? city,
      price: next?.price ?? price,
      rating: next?.rating ?? rating,
      q: next?.q ?? q,
      style: next?.style ?? style,
      sort: next?.sort ?? sort,
    };

    if (data.category) params.set("category", data.category);
    if (data.city) params.set("city", data.city);
    if (data.price) params.set("price", data.price);
    if (data.rating) params.set("rating", data.rating);
    if (data.style) params.set("style", data.style);
    if (data.sort && data.sort !== "rating") params.set("sort", data.sort);
    if (data.q.trim()) params.set("q", data.q.trim());

    const qs = params.toString();
    router.push(qs ? `/vendors?${qs}` : "/vendors");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    apply();
  }

  function reset() {
    setQ("");
    setCategory("");
    setCity("");
    setPrice("");
    setRating("");
    setStyle("");
    setSort("rating");
    router.push("/vendors");
  }

  const hasFilters = Boolean(
    q || category || city || price || rating || style || (sort && sort !== "rating"),
  );

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-5 md:p-6"
    >
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук: назва, місто, опис..."
          className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            apply({ category: e.target.value });
          }}
          className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        >
          <option value="">Усі категорії</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
        >
          Шукати
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="min-w-0">
          <CityAutocomplete
            value={city}
            allowEmpty
            placeholder="Місто України"
            className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            onChange={setCity}
            onSelect={(next) => {
              setCity(next);
              apply({ city: next });
            }}
          />
        </div>

        <select
          value={style}
          onChange={(e) => {
            setStyle(e.target.value);
            apply({ style: e.target.value });
          }}
          className="min-w-0 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        >
          <option value="">Усі стилі</option>
          {(filters.styles ?? []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            apply({ price: e.target.value });
          }}
          className="min-w-0 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        >
          <option value="">Ціна (будь-яка)</option>
          <option value="15000">до 15 000</option>
          <option value="25000">до 25 000</option>
          <option value="40000">до 40 000</option>
          <option value="60000">до 60 000</option>
          <option value={String(filters.maxPrice)}>{priceHint}</option>
        </select>

        <select
          value={rating}
          onChange={(e) => {
            setRating(e.target.value);
            apply({ rating: e.target.value });
          }}
          className="min-w-0 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        >
          <option value="">Рейтинг</option>
          {filters.ratings.map((r) => (
            <option key={r} value={String(r)}>
              від {r.toFixed(1)} ★
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            apply({ sort: e.target.value });
          }}
          className="min-w-0 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
        >
          {(filters.sorts ?? []).map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
        >
          Скинути фільтри
        </button>
      ) : null}
    </form>
  );
}
