"use client";

import { useEffect, useState } from "react";
import { normalizeSearchText } from "@/lib/list-search";

export const LIST_SEARCH_DEBOUNCE_MS = 300;

/**
 * Стан пошуку для сторінки зі списком.
 * `query` — те, що в полі; `term` — нормалізований запит із debounce 300 мс
 * (порожній рядок = пошук неактивний). Очищення застосовується одразу.
 */
export function useListSearch(delay = LIST_SEARCH_DEBOUNCE_MS) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    const next = normalizeSearchText(query);
    if (!next) {
      setTerm("");
      return;
    }
    const id = window.setTimeout(() => setTerm(next), delay);
    return () => window.clearTimeout(id);
  }, [query, delay]);

  return { query, setQuery, term, clear: () => setQuery("") };
}
