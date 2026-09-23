"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 900;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** Animates a 0–100 progress value + bar width (CSS transition after mount). */
export function useAnimatedProgress(
  target: number,
  durationMs = DEFAULT_DURATION_MS,
) {
  const clamped = Math.min(100, Math.max(0, target));
  const [display, setDisplay] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const displayRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      displayRef.current = clamped;
      setDisplay(clamped);
      setBarWidth(clamped);
      return;
    }

    // Kick bar fill on the next frame so CSS can transition from 0 / previous.
    const startBar = window.requestAnimationFrame(() => setBarWidth(clamped));

    const from = displayRef.current;
    const delta = clamped - from;
    if (delta === 0) {
      setDisplay(clamped);
      return () => window.cancelAnimationFrame(startBar);
    }

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const next = from + delta * easeOutCubic(t);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        displayRef.current = clamped;
        setDisplay(clamped);
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(startBar);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [clamped, durationMs]);

  return {
    displayPercent: Math.round(display),
    barWidth,
  };
}
