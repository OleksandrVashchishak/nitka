"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { setupPrefooterOrbit } from "./prefooter-orbit";
import { MOBILE_SHOT_IDS, SHOTS } from "./shots";
import "./prefooter.scss";

const ORBIT_MQ =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const MOBILE_ID_SET = new Set<number>(MOBILE_SHOT_IDS);

function usePrefersOrbit(): boolean {
  const [orbit, setOrbit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(ORBIT_MQ);
    const sync = () => setOrbit(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return orbit;
}

export function Prefooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersOrbit = usePrefersOrbit();

  useEffect(() => {
    if (!prefersOrbit) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>(".prefooter__card"),
    );
    return setupPrefooterOrbit({ section, track, cards });
  }, [prefersOrbit]);

  return (
    <section
      ref={sectionRef}
      className={`prefooter${prefersOrbit ? " prefooter--orbit" : ""}`}
      aria-label="Почати з fata.studio"
    >
      <div className="prefooter__stage">
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

        {prefersOrbit ? (
          <div ref={trackRef} className="prefooter__track" aria-hidden>
            {/* Two loops so the strip stays dense while crossing the viewport */}
            {[0, 1].flatMap((loop) =>
              SHOTS.map((shot, i) => {
                const w = Math.round(shot.width * 1.45);
                const h = Math.round(shot.height * 1.45);
                const idx = loop * SHOTS.length + i;
                return (
                  <div
                    key={`orbit-${loop}-${shot.id}`}
                    className="prefooter__card"
                    data-orbit={shot.orbit}
                    style={{ width: w, height: h }}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      width={w}
                      height={h}
                      sizes={`${w}px`}
                      priority={idx < 8}
                    />
                  </div>
                );
              }),
            )}
          </div>
        ) : (
          <div className="prefooter__collage" aria-hidden>
            {SHOTS.map((shot) => (
              <div
                key={`collage-${shot.id}`}
                className={`prefooter__image prefooter__image--${shot.id}${
                  MOBILE_ID_SET.has(shot.id) ? " prefooter__image--mobile" : ""
                }`}
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
        )}
      </div>
    </section>
  );
}
