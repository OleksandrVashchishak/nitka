import { describe, expect, it } from "vitest";
import type { Guest } from "@/lib/guests-api";
import { buildGuestNotes, type GuestCompanion } from "@/lib/guest-party";
import {
  applyLinkedAssign,
  flattenSeatingGuests,
  syncKidsAssignments,
} from "@/lib/seating-guests";

function guest(
  id: string,
  name: string,
  opts: {
    child?: boolean;
    need?: "kids_table" | "high_chair" | "with_parents";
    partyId?: string;
    companions?: Partial<GuestCompanion>[];
  } = {},
): Guest {
  return {
    id,
    name,
    side: "BRIDE",
    rsvpStatus: "YES",
    notes: buildGuestNotes({
      child: Boolean(opts.child),
      childNeed: opts.need ?? null,
      invited: false,
      method: "phone",
      partyId: opts.partyId,
      companions: (opts.companions ?? []).map((c) => ({
        name: c.name ?? "",
        isChild: Boolean(c.isChild),
        childNeed: c.childNeed ?? null,
        rsvpStatus: c.rsvpStatus ?? "YES",
      })),
    }),
  } as Guest;
}

describe("flattenSeatingGuests", () => {
  it("дитина не буває головою ланцюжка — головою стає перший дорослий", () => {
    const rows = flattenSeatingGuests([
      guest("anya", "Аня Микитюк", {
        child: true,
        need: "with_parents",
        partyId: "p1",
        companions: [{ name: "Настя Микитюк" }],
      }),
    ]);
    expect(rows.map((r) => [r.name, r.linkedTo])).toEqual([
      ["Настя Микитюк", null],
      ["Аня Микитюк", "anya:plus"],
    ]);
  });

  it("член родини-дитина, записаний першим, теж не голова", () => {
    const rows = flattenSeatingGuests([
      guest("kid", "Роман Микитюк", { child: true, partyId: "p2" }),
      guest("dad", "Василь Микитюк", { partyId: "p2" }),
    ]);
    expect(rows[0].key).toBe("dad");
    expect(rows[1]).toMatchObject({ key: "kid", linkedTo: "dad", isPlusOne: true });
  });

  it("лише діти — без ланцюжка", () => {
    const rows = flattenSeatingGuests([
      guest("a", "Аня Іваненко", { child: true, partyId: "p3" }),
      guest("b", "Борис Іваненко", { child: true, partyId: "p3" }),
    ]);
    expect(rows.every((r) => r.linkedTo === null && !r.isPlusOne)).toBe(true);
  });

  it("за дитячий стіл — усі діти, крім дитячого крісла і «з батьками»", () => {
    const rows = flattenSeatingGuests([
      guest("v", "Василь Микитюк", {
        companions: [
          { name: "Ліза Микитюк" },
          { name: "Роман Микитюк", isChild: true, childNeed: "with_parents" },
          { name: "Оля Микитюк", isChild: true, childNeed: "kids_table" },
          { name: "Малий Микитюк", isChild: true, childNeed: "high_chair" },
          { name: "Без потреби Микитюк", isChild: true },
        ],
      }),
    ]);
    const kids = Object.fromEntries(rows.map((r) => [r.name, r.toKidsTable]));
    expect(kids).toEqual({
      "Василь Микитюк": false,
      "Ліза Микитюк": false,
      "Роман Микитюк": false,
      "Оля Микитюк": true,
      "Малий Микитюк": false,
      "Без потреби Микитюк": true,
    });
  });
});

describe("syncKidsAssignments", () => {
  const rows = flattenSeatingGuests([
    guest("v", "Василь Микитюк", {
      companions: [
        { name: "Роман Микитюк", isChild: true, childNeed: "kids_table" },
        { name: "Оля Микитюк", isChild: true },
      ],
    }),
  ]);

  it("дитина без групи йде за дитячий стіл, ручна група лишається", () => {
    const next = syncKidsAssignments(
      { v: "g1", "v:plus": null, "v:plus:1": "g1" },
      rows,
      true,
    );
    expect(next).toEqual({ v: "g1", "v:plus": "kids", "v:plus:1": "g1" });
  });

  it("без дитячого столу «kids» знімається", () => {
    expect(syncKidsAssignments({ "v:plus": "kids" }, rows, false)).toEqual({
      "v:plus": null,
    });
  });
});

describe("applyLinkedAssign", () => {
  it("група дорослого тягне родину, але не дітей за дитячим столом", () => {
    const rows = flattenSeatingGuests([
      guest("v", "Василь Микитюк", {
        companions: [
          { name: "Ліза Микитюк" },
          { name: "Роман Микитюк", isChild: true },
          { name: "Малий Микитюк", isChild: true, childNeed: "high_chair" },
        ],
      }),
    ]);
    const next = applyLinkedAssign(
      { v: null, "v:plus": null, "v:plus:1": "kids", "v:plus:2": null },
      rows,
      new Set(),
      "v",
      "g1",
    );
    expect(next).toEqual({
      v: "g1",
      "v:plus": "g1",
      "v:plus:1": "kids",
      "v:plus:2": "g1",
    });
  });
});
