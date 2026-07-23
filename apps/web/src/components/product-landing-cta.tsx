"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";

type Props = {
  coupleHref: string;
  primaryLabel?: string;
  registerHint?: string;
  tone?: "light" | "dark";
};

export function ProductLandingCta({
  coupleHref,
  primaryLabel = "Спробувати безкоштовно",
  registerHint,
  tone = "light",
}: Props) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const primary =
    tone === "light"
      ? "inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
      : "inline-flex rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-deep";
  const secondary =
    tone === "light"
      ? "inline-flex rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
      : "inline-flex rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-sage/40";
  const hintClass =
    tone === "light" ? "text-sm text-white/75" : "text-sm text-ink-soft";

  if (!hydrated) {
    return (
      <div
        className={`h-11 w-48 animate-pulse rounded-full ${
          tone === "light" ? "bg-white/25" : "bg-mist"
        }`}
      />
    );
  }

  if (user?.role === "COUPLE" || user?.role === "ADMIN") {
    return (
      <Link href={coupleHref} className={primary}>
        Відкрити в кабінеті →
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href="/register" className={primary}>
        {primaryLabel}
      </Link>
      <Link href="/login" className={secondary}>
        Увійти
      </Link>
      {registerHint ? (
        <p className={`basis-full sm:basis-auto ${hintClass}`}>{registerHint}</p>
      ) : null}
    </div>
  );
}
