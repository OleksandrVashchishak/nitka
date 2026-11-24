import { describe, expect, it } from "vitest";
import type { FlagId } from "@/lib/smart-planning-config";
import {
  buildPlan,
  computeDue,
  groupByCategory,
  pluralTasks,
  pruneDoneIds,
  sortByDue,
  step2Templates,
} from "@/lib/smart-planning";

const TODAY = "2026-11-22";
const NEXT_YEAR = "2027-11-22";
const none = new Set<string>();

function plan(
  flags: FlagId[],
  opts: Partial<{
    doneIds: Set<string>;
    deletedIds: Set<string>;
    existing: Set<string>;
    weddingDate: string | null;
  }> = {},
) {
  return buildPlan({
    flags: new Set(flags),
    doneIds: opts.doneIds ?? none,
    deletedIds: opts.deletedIds ?? none,
    existingTemplateIds: opts.existing ?? none,
    weddingDate: opts.weddingDate === undefined ? NEXT_YEAR : opts.weddingDate,
    today: TODAY,
  });
}

function counts(tasks: ReturnType<typeof plan>) {
  return Object.fromEntries(
    groupByCategory(tasks).map((g) => [g.id, g.items.length]),
  );
}

describe("smart planning — сценарії зі специфікації", () => {
  it("1: без флагів — 28 базових завдань у 6 категоріях", () => {
    const tasks = plan([]);
    expect(tasks).toHaveLength(28);
    expect(counts(tasks)).toEqual({
      basics: 4,
      team: 5,
      looks: 5,
      guests: 5,
      banquet: 3,
      wedding_day: 6,
    });
  });

  it("2: тільки offsite_banquet — 42 завдання", () => {
    const tasks = plan(["offsite_banquet"]);
    expect(tasks).toHaveLength(42);
    const ids = tasks.map((t) => t.id);
    expect(ids).not.toContain("menu");
    expect(ids).not.toContain("tasting");
    expect(ids).not.toContain("restaurant_generator");
    expect(counts(tasks).offsite).toBe(17);
    expect(tasks.find((t) => t.id === "book_venue")?.labels.step3).toBe(
      "Забронювати локацію для банкету",
    );
  });

  it("3: church + traditions — rushnyk один раз у «Церемонії»", () => {
    const rushnyk = plan(["church", "traditions"]).filter(
      (t) => t.id === "rushnyk",
    );
    expect(rushnyk).toHaveLength(1);
    expect(rushnyk[0].category).toBe("ceremony");
  });

  it("4: тільки traditions — «Церемонія» з rushnyk, «Традиції» з 4 пунктів", () => {
    const groups = groupByCategory(step2Templates(new Set(["traditions"]), none));
    const ceremony = groups.find((g) => g.id === "ceremony");
    expect(ceremony?.items.map((t) => t.id)).toEqual(["rushnyk"]);
    expect(groups.find((g) => g.id === "traditions")?.items).toHaveLength(4);
  });

  it("5: відмітка базового завдання переживає зміну флагів", () => {
    const done = new Set(["photographer"]);
    expect(pruneDoneIds(done, new Set(["kids", "cake"])).has("photographer")).toBe(true);
    expect(pruneDoneIds(done, new Set()).has("photographer")).toBe(true);
  });

  it("6: зняли kids — kids_menu видаляється з doneIds", () => {
    const done = pruneDoneIds(new Set(["kids_menu"]), new Set());
    expect(done.has("kids_menu")).toBe(false);
  });

  it("7: весілля через місяць — дальні завдання термінові, +7 днів", () => {
    const tasks = plan([], { weddingDate: "2026-12-22" });
    for (const t of tasks) {
      if ("months" in t.due && t.due.months > 1) {
        expect(t.dueDate).toBe("2026-11-29");
        expect(t.isUrgent).toBe(true);
      }
    }
    const drinks = tasks.find((t) => t.id === "drinks");
    expect(drinks).toMatchObject({ dueDate: "2026-11-22", isUrgent: false });
  });

  it("8: без дати — dueDate null, порядок конфігу", () => {
    const tasks = plan([], { weddingDate: null });
    expect(tasks.every((t) => t.dueDate === null && !t.isUrgent)).toBe(true);
    expect(sortByDue(tasks).map((t) => t.id)).toEqual(tasks.map((t) => t.id));
  });

  it("9: повторний запуск — існуючий templateId не показується ніде", () => {
    const existing = new Set(["photographer"]);
    expect(step2Templates(new Set(), existing).map((t) => t.id)).not.toContain(
      "photographer",
    );
    expect(plan([], { existing }).map((t) => t.id)).not.toContain("photographer");
  });

  it("10: видалені на кроці 3 лишаються видаленими", () => {
    const deletedIds = new Set(["dj", "band"]);
    expect(plan([], { deletedIds })).toHaveLength(26);
  });

  it("11: плюралізація", () => {
    expect([1, 3, 5, 11, 21, 22].map(pluralTasks)).toEqual([
      "завдання",
      "завдання",
      "завдань",
      "завдань",
      "завдання",
      "завдання",
    ]);
  });
});

describe("computeDue", () => {
  it("кінець місяця клемпиться", () => {
    expect(computeDue({ months: 1 }, "2027-03-31", "2026-01-01").dueDate).toBe(
      "2027-02-28",
    );
  });

  it("тижні", () => {
    expect(computeDue({ weeks: 2 }, "2027-01-10", TODAY).dueDate).toBe(
      "2026-12-27",
    );
  });
});
