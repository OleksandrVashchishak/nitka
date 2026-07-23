"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";

type Props = {
  title: string;
  description: string;
  seoHref: string;
  seoLabel: string;
};

export function ComingSoonToolPage({
  title,
  description,
  seoHref,
  seoLabel,
}: Props) {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <DashboardNav variant="COUPLE" />
          <div className="rounded-[1.75rem] border border-line bg-gradient-to-br from-mist via-white to-sage/10 px-8 py-14 text-center md:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
              Скоро буде
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink-soft">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-deep"
              >
                До кабінету
              </Link>
              <Link
                href={seoHref}
                className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-sage/40"
              >
                {seoLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </RequireAuth>
  );
}
