import Link from "next/link";
import Image from "next/image";
import type { Vendor } from "@/lib/api";
import { FavoriteHeartButton } from "@/components/favorite-heart-button";
import { vendorHref } from "@/lib/vendor-href";

type Props = {
  vendors: Vendor[];
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function priceLabel(vendor: Vendor) {
  if (vendor.priceTo && vendor.priceTo > vendor.priceFrom) {
    return `${formatPrice(vendor.priceFrom)}–${formatPrice(vendor.priceTo)} грн`;
  }
  return `від ${formatPrice(vendor.priceFrom)} грн`;
}

export function VendorGrid({
  vendors,
  title = "Популярні зараз",
  subtitle = "Топ підрядників, яких уже зберігають пари",
  showAllLink = true,
}: Props) {
  const [featured, ...rest] = vendors;
  const side = rest.slice(0, 3);

  return (
    <section className="bg-paper px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
              Підбірка
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-ink md:text-5xl">
              {title}
            </h2>
            <p className="mt-3 text-ink-soft">{subtitle}</p>
          </div>
          {showAllLink ? (
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sage-deep transition hover:gap-3"
            >
              Весь каталог →
            </Link>
          ) : null}
        </div>

        {featured ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <VendorTile vendor={featured} large />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {side.map((vendor) => (
                <VendorTile key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function VendorTile({
  vendor,
  large = false,
}: {
  vendor: Vendor;
  large?: boolean;
}) {
  const cover = vendor.photos[0]?.url;
  const styles = (vendor.styles ?? []).slice(0, 2);

  return (
    <article className="group relative">
      <Link href={vendorHref(vendor)} className="block">
        <div
          className={`relative overflow-hidden rounded-[1.5rem] bg-sage/20 ${
            large ? "aspect-[4/5] md:aspect-[5/4] lg:min-h-[560px]" : "aspect-[5/4] lg:aspect-[16/10]"
          }`}
        >
          {cover ? (
            <Image
              src={cover}
              alt={vendor.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes={large ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 30vw"}
            />
          ) : null}
          {vendor.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-sage-deep">
              Featured
            </span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 pt-16 text-white md:p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">
              {vendor.category.name} · {vendor.city}
            </p>
            <p
              className={`mt-1 font-[family-name:var(--font-display)] ${
                large ? "text-3xl md:text-4xl" : "text-2xl"
              }`}
            >
              {vendor.name}
            </p>
            <p className="mt-1 text-sm text-white/85">
              ★ {vendor.rating.toFixed(1)}
              {vendor._count?.reviews ? ` (${vendor._count.reviews})` : ""} ·{" "}
              {priceLabel(vendor)}
            </p>
            {styles.length > 0 ? (
              <p className="mt-2 text-xs text-white/75">{styles.join(" · ")}</p>
            ) : null}
          </div>
        </div>
      </Link>
      <FavoriteHeartButton vendorId={vendor.id} />
    </article>
  );
}
