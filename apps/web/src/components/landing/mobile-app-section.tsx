"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LANDING_PIN_IDS } from "@/components/landing/landing-pin-ids";
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
          const travel = () =>
            Math.round(
              (phrase.scrollWidth + window.innerWidth) * 0.7 +
                window.innerHeight * 0.35,
            );
          const headerOffset = () => {
            const header = document.querySelector(".fata-site-header");
            if (!(header instanceof HTMLElement)) return 0;
            return Math.round(header.getBoundingClientRect().height);
          };
          const pinStart = () => `top top+=${headerOffset()}`;
          const phone = section.querySelector<HTMLElement>(".fata-phone");

          gsap.set(phrase, {
            x: () => window.innerWidth,
            yPercent: -50,
            force3D: true,
          });

          // CTA keeps its layout offset (CSS translateX(-71px)); animate y+opacity only.
          gsap.set(copy, { opacity: 0, y: 36 });
          gsap.set(cta, { opacity: 0, x: -71, y: 36 });
          // Keep CSS translateX(-32px) under GSAP so runway y doesn't wipe it
          if (phone) gsap.set(phone, { x: -32, y: 40, force3D: true });

          // Timed reveal = soft approach before pin (not scrub — avoids dead feel)
          gsap.to(copy, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.to(cta, {
            opacity: 1,
            x: -71,
            y: 0,
            duration: 1.2,
            delay: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          // Phone settles before pin — low scrub so it doesn't lag into the lock
          if (phone) {
            gsap.to(phone, {
              x: -32,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                end: "top 22%",
                scrub: 0.45,
              },
            });
          }

          gsap.to(phrase, {
            x: () => -phrase.scrollWidth,
            ease: "none",
            scrollTrigger: {
              id: LANDING_PIN_IDS[0],
              trigger: section,
              start: pinStart,
              end: () => `+=${travel()}`,
              pin: true,
              scrub: 0.4,
              anticipatePin: 0,
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
          const phone = section.querySelector<HTMLElement>(".fata-phone");
          gsap.set(phrase, {
            x: () => Math.round((window.innerWidth - phrase.scrollWidth) * 0.12),
            yPercent: -50,
            clearProps: "force3D",
          });
          gsap.set(copy, { opacity: 1, y: 0 });
          gsap.set(cta, { opacity: 1, y: 0, clearProps: "x" });
          if (phone) gsap.set(phone, { clearProps: "x,y,force3D" });
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
