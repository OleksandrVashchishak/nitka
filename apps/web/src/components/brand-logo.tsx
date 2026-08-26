import Link from "next/link";

export function BrandLogo({
  href = "/",
  light = false,
  className = "",
}: {
  href?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-baseline gap-0.5 font-editorial text-[1.65rem] italic leading-none tracking-tight ${
        light ? "text-white" : "text-ink"
      } ${className}`}
    >
      nitka
      <span
        className={`mb-1 inline-block size-1.5 rounded-[2px] ${
          light ? "bg-lime" : "bg-olive"
        }`}
        aria-hidden
      />
    </Link>
  );
}
