"use client";

import Image from "next/image";
import Link from "next/link";
import "./prefooter.scss";

type Shot = {
  id: number;
  src: string;
  width: number;
  height: number;
};

/** 1x coords relative to 1440×821 artboard (desktop) */
const SHOTS: Shot[] = [
  { id: 1, src: "/landing/prefooter/footer-placeholder-1.jpg", width: 140, height: 153 },
  { id: 2, src: "/landing/prefooter/footer-placeholder-2.jpg", width: 140, height: 153 },
  { id: 3, src: "/landing/prefooter/footer-placeholder-3.jpg", width: 140, height: 153 },
  { id: 4, src: "/landing/prefooter/footer-placeholder-4.jpg", width: 140, height: 91 },
  { id: 5, src: "/landing/prefooter/footer-placeholder-5.jpg", width: 140, height: 91 },
  { id: 6, src: "/landing/prefooter/footer-placeholder-6.jpg", width: 140, height: 91 },
  { id: 7, src: "/landing/prefooter/footer-placeholder-7.jpg", width: 140, height: 91 },
  { id: 8, src: "/landing/prefooter/footer-placeholder-8.jpg", width: 140, height: 119 },
  { id: 9, src: "/landing/prefooter/footer-placeholder-9.jpg", width: 140, height: 119 },
  { id: 10, src: "/landing/prefooter/footer-placeholder-10.jpg", width: 140, height: 184 },
  { id: 11, src: "/landing/prefooter/footer-placeholder-11.jpg", width: 112, height: 122 },
  { id: 12, src: "/landing/prefooter/footer-placeholder-12.jpg", width: 93, height: 122 },
  { id: 13, src: "/landing/prefooter/footer-placeholder-13.jpg", width: 113, height: 127 },
  { id: 14, src: "/landing/prefooter/footer-placeholder-14.jpg", width: 68, height: 76 },
  { id: 15, src: "/landing/prefooter/footer-placeholder-15.jpg", width: 68, height: 76 },
  { id: 16, src: "/landing/prefooter/footer-placeholder-16.png", width: 106, height: 76 },
  { id: 17, src: "/landing/prefooter/footer-placeholder-17.jpg", width: 68, height: 76 },
  { id: 18, src: "/landing/prefooter/footer-placeholder-18.jpg", width: 102, height: 76 },
];

export function Prefooter() {
  return (
    <section className="prefooter" aria-label="Почати з fata.studio">
      <div className="prefooter__container">
        <div className="prefooter__images" aria-hidden>
          {SHOTS.map((shot) => (
            <div
              key={shot.id}
              className={`prefooter__image prefooter__image--${shot.id}`}
            >
              <Image
                src={shot.src}
                alt=""
                width={shot.width}
                height={shot.height}
                sizes={`${shot.width}px`}
              />
            </div>
          ))}
        </div>

        <div className="prefooter__content">
          <h2 className="prefooter__title">
            З fata.studio
            <br className="prefooter__br prefooter__br--m" />{" "}
            всі ці речі
            <br className="prefooter__br prefooter__br--d" />{" "}
            простіше і
            <br className="prefooter__br prefooter__br--m" />{" "}
            безкоштовно
          </h2>
          <Link href="/register" className="prefooter__btn">
            Розпочати безкоштовно
          </Link>
        </div>
      </div>
    </section>
  );
}
