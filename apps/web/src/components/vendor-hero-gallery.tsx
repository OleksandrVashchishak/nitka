"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { id: string; url: string };

export function VendorHeroGallery({
  photos,
  name,
}: {
  photos: Photo[];
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") {
        setActive((value) => (value + 1) % photos.length);
      }
      if (event.key === "ArrowLeft") {
        setActive((value) => (value - 1 + photos.length) % photos.length);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="mx-auto flex min-h-72 max-w-7xl items-center justify-center rounded-3xl bg-sage-deep px-6 text-center text-white">
        <p className="font-[family-name:var(--font-display)] text-3xl">{name}</p>
      </div>
    );
  }

  function show(index: number) {
    setActive(index);
    setOpen(true);
  }

  const visible = photos.slice(0, 5);

  return (
    <>
      <div className="relative mx-auto grid h-[320px] max-w-7xl grid-cols-2 gap-1.5 overflow-hidden rounded-2xl bg-ink sm:h-[440px] md:grid-cols-4 md:grid-rows-2">
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => show(index)}
            aria-label={`Відкрити фото ${index + 1}`}
            className={
              index === 0
                ? "relative col-span-2 row-span-2 overflow-hidden"
                : index === 1 || index === 2
                  ? "relative hidden overflow-hidden md:block"
                  : "relative hidden overflow-hidden sm:block"
            }
          >
            <Image
              src={photo.url}
              alt={`${name} — фото ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover transition duration-500 hover:scale-[1.02]"
              sizes={
                index === 0
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 50vw, 25vw"
              }
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => show(0)}
          className="absolute bottom-4 right-4 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lg"
        >
          ▦ Усі фото ({photos.length})
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Галерея ${name}`}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-2 text-white">
            <p className="text-sm">
              {active + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/30 px-4 py-2 text-sm"
            >
              Закрити ×
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image
              src={photos[active].url}
              alt={`${name} — фото ${active + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActive((active - 1 + photos.length) % photos.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-xl text-ink"
                  aria-label="Попереднє фото"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setActive((active + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-xl text-ink"
                  aria-label="Наступне фото"
                >
                  →
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
