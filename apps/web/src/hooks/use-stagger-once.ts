"use client";

import { useCallback } from "react";

/** Довше за найпізніший елемент stagger (8 × 24 мс + 240 мс) із запасом. */
const STAGGER_CLEANUP_MS = 700;

/**
 * Callback-ref: вмикає stagger-появу дітей лише в момент монтування списку.
 * Після анімації клас знімається, тож пошук, фільтри й нові рядки
 * вже не «сиплються» повторно. Стилі — `.motion-stagger` у ui/_motion.scss.
 */
export function useStaggerOnce<T extends HTMLElement = HTMLElement>() {
  return useCallback((el: T | null) => {
    if (!el) return;
    el.classList.add("motion-stagger");
    const timer = window.setTimeout(
      () => el.classList.remove("motion-stagger"),
      STAGGER_CLEANUP_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);
}
