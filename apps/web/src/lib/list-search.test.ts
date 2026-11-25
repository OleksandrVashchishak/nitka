import { describe, expect, it } from "vitest";
import { matchesSearch, normalizeSearchText } from "@/lib/list-search";

describe("list search", () => {
  it("normalizes case, apostrophes and spaces", () => {
    expect(normalizeSearchText("  Пʼять   Пам'ять ")).toBe("пять память");
  });

  it("matches substring anywhere, ignoring apostrophe variants", () => {
    const q = normalizeSearchText("м'я");
    expect(matchesSearch("Ім’я Прізвище", q)).toBe(true);
    expect(matchesSearch("Лисенко", normalizeSearchText("сен"))).toBe(true);
    expect(matchesSearch("Лисенко", normalizeSearchText("коваль"))).toBe(false);
    expect(matchesSearch("Будь-хто", "")).toBe(true);
  });
});
