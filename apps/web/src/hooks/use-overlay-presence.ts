"use client";

import { useEffect, useState } from "react";

export const OVERLAY_EXIT_MS = {
  drawer: 320,
  modal: 280,
  confirm: 280,
} as const;

/**
 * Mount / visible / delayed unmount for CSS enter-exit overlays.
 * When `open` becomes true: mount → double rAF → visible.
 * When `open` becomes false: hide → wait `exitMs` → unmount.
 */
export function useOverlayPresence(open: boolean, exitMs: number = OVERLAY_EXIT_MS.drawer) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      const timer = window.setTimeout(() => setMounted(false), exitMs);
      return () => window.clearTimeout(timer);
    }

    setMounted(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setVisible(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, exitMs]);

  return { mounted, visible };
}
