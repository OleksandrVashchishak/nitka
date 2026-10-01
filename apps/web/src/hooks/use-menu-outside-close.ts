"use client";

import { useEffect, useRef } from "react";

/**
 * Close a context menu on outside mousedown or Escape.
 * `wrapSelector` should match the menu root (default `.cabinet-ctx-menu-wrap`).
 */
export function useMenuOutsideClose(
  open: boolean,
  onClose: () => void,
  wrapSelector = ".cabinet-ctx-menu-wrap",
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(wrapSelector)
      ) {
        onCloseRef.current();
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, wrapSelector]);
}
