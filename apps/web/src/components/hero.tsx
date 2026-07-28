"use client";

import Image from "next/image";
import Link from "next/link";
export function Hero() {

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
          Плануйте весілля спокійно і по кроках
        </h1>
        <p className="animate-rise-late mt-4 max-w-xl text-base text-white/85 md:text-lg">
          Чекліст, бюджет, гості, розсадка, запрошення й сайт пари — все в
          одному кабінеті.
        </p>

        <div className="relative z-20 mt-8 flex w-full max-w-3xl flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-sage px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep"
          >
            Почати планування
          </Link>
          <Link
            href="/vesilnyy-plan"
            className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Переглянути інструменти
          </Link>
        </div>
      </div>
    </section>
  );
}
