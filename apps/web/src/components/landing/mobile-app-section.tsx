"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MobileAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const phrase = phraseRef.current;
    const copy = copyRef.current;
    const cta = ctaRef.current;
    if (!section || !phrase || !copy || !cta) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Longer pin distance so the marquee breathes instead of flying past
          const travel = () =>
            Math.round(
              (phrase.scrollWidth + window.innerWidth) * 1.85 +
                window.innerHeight * 0.9,
            );
          const headerOffset = () => {
            const header = document.querySelector(".fata-site-header");
            if (!(header instanceof HTMLElement)) return 0;
            return Math.round(header.getBoundingClientRect().height);
          };

          gsap.set(phrase, {
            x: () => window.innerWidth,
            yPercent: -50,
            force3D: true,
          });

          // CTA keeps its layout offset (CSS translateX(-71px)); animate y+opacity only.
          gsap.set(copy, { opacity: 0, y: 36 });
          gsap.set(cta, { opacity: 0, x: -71, y: 36 });

          gsap.to(copy, {
            opacity: 1,
            y: 0,
            duration: 1.35,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.to(cta, {
            opacity: 1,
            x: -71,
            y: 0,
            duration: 1.35,
            delay: 0.16,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.to(phrase, {
            x: () => -phrase.scrollWidth,
            // soft start/end mapped onto scroll — kills the “hit”
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: section,
              start: () => `top top+=${headerOffset()}`,
              end: () => `+=${travel()}`,
              pin: true,
              scrub: 1.45,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const onLoad = () => ScrollTrigger.refresh();
          window.addEventListener("load", onLoad);
          return () => window.removeEventListener("load", onLoad);
        },
      );

      mm.add(
        "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        () => {
          gsap.set(phrase, {
            x: () => Math.round((window.innerWidth - phrase.scrollWidth) * 0.12),
            yPercent: -50,
            clearProps: "force3D",
          });
          gsap.set(copy, { opacity: 1, y: 0 });
          gsap.set(cta, { opacity: 1, y: 0, clearProps: "x" });
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="fata-mobile">
      <div
        ref={phraseRef}
        className="fata-phrase"
        aria-hidden="true"
      >
        <em>Ваше</em> <span>ВЕСІЛЛЯ</span> у вас в кишені
      </div>
      <div className="fata-shell fata-mobile-stage">
        <div ref={copyRef} className="fata-mobile-copy">
          <p>
            Зустріч із флористом? Примірка сукні чи дегустація меню?
            <br />
            Усі деталі, контакти підрядників, списки та кошторис — у твоєму
            смартфоні.
          </p>
        </div>
        <div className="fata-phone">
          <Image
            src="/landing/phone.png"
            alt="Мобільний застосунок fata.studio"
            width={373}
            height={773}
            sizes="(max-width: 1023px) 220px, 373px"
          />
        </div>
        <Link ref={ctaRef} href="/register" className="fata-dl">
          Скачати мобільний застосунок
        </Link>
      </div>
    </section>
  );
}
