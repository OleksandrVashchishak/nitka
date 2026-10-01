"use client";

import { useEffect, useState } from "react";

export const CABINET_PAGE_SIZE = 12;

type Options = {
  pageSize?: number;
  /** Reset the visible window when these change (filters / sort). */
  resetDeps?: readonly unknown[];
};

/**
 * Slice a list into pages of `pageSize` (default 12).
 * Call `showMore` to reveal the next page; resets when `resetDeps` change.
 */
export function usePagedVisible<T>(
  items: readonly T[],
  { pageSize = CABINET_PAGE_SIZE, resetDeps = [] }: Options = {},
) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
    // Intentionally depend on caller-provided reset keys.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, ...resetDeps]);

  return {
    visible: items.slice(0, visibleCount) as T[],
    hasMore: items.length > visibleCount,
    showMore: () => setVisibleCount((n) => n + pageSize),
  };
}
