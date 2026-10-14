import { describe, expect, it } from "vitest";
import {
  formatDayPlanTime,
  parseDayPlanTime,
  rechainDayPlanTimes,
  reorderDayPlanEvents,
  type DayPlanEvent,
} from "@/lib/day-plan";

const sample: DayPlanEvent[] = [
  { id: "a", title: "A", time: "08:00", durationMin: 45 },
  { id: "b", title: "B", time: "08:45", durationMin: 30 },
  { id: "c", title: "C", time: "09:15", durationMin: 90 },
];

describe("day-plan reorder", () => {
  it("parses and formats time", () => {
    expect(parseDayPlanTime("08:45")).toBe(8 * 60 + 45);
    expect(formatDayPlanTime(8 * 60 + 45)).toBe("08:45");
  });

  it("rechains without gaps from anchor", () => {
    const next = rechainDayPlanTimes(
      [
        { id: "c", title: "C", time: "09:15", durationMin: 90 },
        { id: "a", title: "A", time: "08:00", durationMin: 45 },
        { id: "b", title: "B", time: "08:45", durationMin: 30 },
      ],
      "08:00",
    );
    expect(next.map((e) => [e.id, e.time])).toEqual([
      ["c", "08:00"],
      ["a", "09:30"],
      ["b", "10:15"],
    ]);
  });

  it("reorders and keeps day start as anchor", () => {
    const next = reorderDayPlanEvents(sample, 2, 0);
    expect(next.map((e) => [e.id, e.time])).toEqual([
      ["c", "08:00"],
      ["a", "09:30"],
      ["b", "10:15"],
    ]);
  });

  it("no-ops on same index", () => {
    expect(reorderDayPlanEvents(sample, 1, 1)).toBe(sample);
  });
});
