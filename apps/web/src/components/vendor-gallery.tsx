"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = { id: string; url: string };

export function VendorGallery({
  photos,
  name,
}: {
  photos: Photo[];
  name: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  if (photos.length === 0) return null;

  const rest = photos.slice(1);
  const activePhoto = photos.find((p) => p.id === active) ?? photos[0];

  return (
    <>
      {rest.length > 0 ? (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {rest.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(photo.id)}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={photo.url}
                alt={`${name} фото`}
                fill
                className="object-cover transition hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </button>
          ))}
        </div>
      ) : null}

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={activePhoto.url}
              alt={name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
