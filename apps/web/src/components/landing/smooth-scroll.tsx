"use client";

import { useEffect } from "react";
import { LANDING_PIN_IDS } from "@/components/landing/landing-pin-ids";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

type SlowZone = {
  /** Exact ScrollTrigger.start (document Y) */
  pinStart: number;
  approach: number;
  softEnter: number;
};

const DESKTOP_MQ = "(min-width: 1024px)";
const BASE_DURATION = 1.35;
/** Floor at pin edge — soft, not a hard stop / handoff */
const MIN_FACTOR = 0.22;
const ENTER_MIN_FACTOR = 0.4;

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Zones from ScrollTrigger only — same numbers the pins actually use.
 */
function measureZones(): SlowZone[] {
  if (!window.matchMedia(DESKTOP_MQ).matches) return [];

  const vh = window.innerHeight;
  const approach = Math.round(vh * 1.1);
  const softEnter = Math.round(vh * 0.3);
  const zones: SlowZone[] = [];

  for (const id of LANDING_PIN_IDS) {
    const st = ScrollTrigger.getById(id);
    if (!st) continue;
    zones.push({
      pinStart: st.start,
      approach,
      softEnter,
    });
  }

  return zones;
}

/**
 * 1 = full speed. Drops toward MIN_FACTOR while approaching a pin,
 * then eases back over softEnter after lock.
 */
function wheelFactor(scrollY: number, deltaY: number, zones: SlowZone[]): number {
  if (deltaY <= 0 || zones.length === 0) return 1;

  let factor = 1;

  for (const zone of zones) {
    const { pinStart, approach, softEnter } = zone;
    const before = pinStart - scrollY;

    if (before > approach || before < -softEnter) continue;

    if (before >= 0) {
      const t = Math.min(1, Math.max(0, before / approach));
      const shaped = Math.pow(t, 0.55);
      factor = Math.min(factor, MIN_FACTOR + (1 - MIN_FACTOR) * shaped);
    } else {
      const t = smoothstep(-before / softEnter);
      factor = Math.min(
        factor,
        ENTER_MIN_FACTOR + (1 - ENTER_MIN_FACTOR) * t,
      );
    }
  }

  return factor;
}

/**
 * Smooth wheel scroll for the home landing + keep ScrollTrigger in sync.
 * Slows the wheel before pinned sections (no scroll hijack / handoff).
 */
export function useHomeSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const runtime: {
      lenis: Lenis | null;
      zones: SlowZone[];
    } = { lenis: null, zones: [] };

    const lenis = new Lenis({
      duration: BASE_DURATION,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
      autoRaf: false,
      virtualScroll: (data) => {
        const instance = runtime.lenis;
        const scroll =
          data.deltaY > 0
            ? (instance?.targetScroll ?? instance?.scroll ?? window.scrollY)
            : (instance?.scroll ?? window.scrollY);

        const factor = wheelFactor(scroll, data.deltaY, runtime.zones);
        if (factor < 1) {
          data.deltaY *= factor;
          data.deltaX *= factor;
        }

        if (instance) {
          instance.options.duration =
            factor < 0.98
              ? BASE_DURATION + (1 - factor) * 1.5
              : BASE_DURATION;
        }

        return true;
      },
    });
    runtime.lenis = lenis;

    const remasure = () => {
      runtime.zones = measureZones();
    };

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      if (
        runtime.zones.length < LANDING_PIN_IDS.length &&
        window.matchMedia(DESKTOP_MQ).matches
      ) {
        remasure();
      }
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      ScrollTrigger.refresh();
      remasure();
    };
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", remasure);
    ScrollTrigger.addEventListener("refresh", remasure);
    const remasureTimers = [400, 1000, 2000].map((ms) =>
      window.setTimeout(remasure, ms),
    );

    return () => {
      for (const id of remasureTimers) window.clearTimeout(id);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", remasure);
      ScrollTrigger.removeEventListener("refresh", remasure);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
