import { describe, expect, it } from "vitest";
import { nearestSeats, placeGuest, type PlaceTable } from "@/lib/seating-place";

function round(id: string, keys: (string | null)[], kind: PlaceTable["kind"] = "round"): PlaceTable {
  return {
    id,
    kind,
    seats: keys.map((guestKey, i) => ({ id: `${id}-s${i}`, guestKey })),
  };
}

function keysOf(tables: PlaceTable[], id: string) {
  return tables.find((t) => t.id === id)!.seats.map((s) => s.guestKey);
}

describe("placeGuest", () => {
  it("drop на зайняте місце сидячим гостем — обмін місцями", () => {
    const tables = [round("a", ["anna", "anton", null]), round("b", ["serhii", null, null])];
    const r = placeGuest(tables, "a", "a-s0", "serhii", []);
    expect(r.status).toBe("placed");
    if (r.status !== "placed") return;
    expect(r.swappedWith).toBe("anna");
    expect(keysOf(r.tables, "a")).toEqual(["serhii", "anton", null]);
    expect(keysOf(r.tables, "b")).toEqual(["anna", null, null]);
  });

  it("гість без місця на зайняте місце — попередній без місця, але про це відомо", () => {
    const tables = [round("a", ["anna", null, null])];
    const r = placeGuest(tables, "a", "a-s0", "olena", []);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(r.evicted).toBe("anna");
    expect(keysOf(r.tables, "a")).toEqual(["olena", null, null]);
  });

  it("партнер сідає на сусіднє місце, а не на перше вільне", () => {
    const tables = [round("a", [null, "x", "x2", "x3", null, null, null, null])];
    const r = placeGuest(tables, "a", "a-s5", "anna", ["anton"]);
    if (r.status !== "placed") throw new Error("expected placed");
    const keys = keysOf(r.tables, "a");
    expect(keys[5]).toBe("anna");
    expect(keys[4] === "anton" || keys[6] === "anton").toBe(true);
    expect(keys[0]).toBeNull();
  });

  it("за круглим столом сусід через «нуль» теж поруч", () => {
    const t = round("a", [null, "x", "x", "x", "x", "x", null, null]);
    expect(nearestSeats(t, "a-s7", ["a-s0", "a-s6"], 1)).toEqual(["a-s0"]);
  });

  it("родина переїжджає разом: партнер і дитина за родинним столом", () => {
    const tables = [round("a", ["anna", "anton", "kid", null]), round("b", [null, null, null, null])];
    const r = placeGuest(tables, "b", "b-s1", "anna", ["anton", "kid"]);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(keysOf(r.tables, "a")).toEqual([null, null, null, null]);
    const b = keysOf(r.tables, "b");
    expect(b[1]).toBe("anna");
    expect(b.filter(Boolean).sort()).toEqual(["anna", "anton", "kid"]);
  });

  it("не вистачає місць для ланцюжка — конфлікт, нічого не змінюємо", () => {
    const tables = [round("a", ["x", null, "y"])];
    const r = placeGuest(tables, "a", "a-s1", "anna", ["anton"]);
    expect(r).toEqual({ status: "conflict", available: 1, mates: ["anton"] });
  });

  it("allowSplit садить скільки влізе", () => {
    const tables = [round("a", ["x", null, null, "y"])];
    const r = placeGuest(tables, "a", "a-s1", "anna", ["anton", "kid"], { allowSplit: true });
    if (r.status !== "placed") throw new Error("expected placed");
    expect(r.leftOut).toEqual(["kid"]);
    expect(keysOf(r.tables, "a")).toEqual(["x", "anna", "anton", "y"]);
  });

  it("за дитячий стіл ланцюжок не йде", () => {
    const tables = [round("k", [null, null, null], "kids"), round("a", ["mom", null, null])];
    const r = placeGuest(tables, "k", "k-s0", "kid", ["mom"]);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(keysOf(r.tables, "k")).toEqual(["kid", null, null]);
    expect(keysOf(r.tables, "a")).toEqual(["mom", null, null]);
  });

  it("власне старе місце за тим самим столом рахується вільним", () => {
    const tables = [round("a", ["anna", null, "x"])];
    const r = placeGuest(tables, "a", "a-s1", "anna", ["anton"]);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(keysOf(r.tables, "a")).toEqual(["anton", "anna", "x"]);
  });

  it("сидячий гість на зайняте місце іншого столу — ланцюжок їде з ним", () => {
    const tables = [round("a", ["anna", "anton", null]), round("b", ["x", null, null, "y"])];
    const r = placeGuest(tables, "b", "b-s0", "anna", ["anton"]);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(r.swappedWith).toBe("x");
    expect(keysOf(r.tables, "a")).toEqual(["x", null, null]);
    const b = keysOf(r.tables, "b");
    expect(b[0]).toBe("anna");
    expect(b.filter(Boolean).sort()).toEqual(["anna", "anton", "y"]);
  });

  it("сидячий гість на зайняте місце іншого столу без місця для ланцюжка — конфлікт", () => {
    const tables = [round("a", ["anna", "anton", null]), round("b", ["x", "y", "z"])];
    const r = placeGuest(tables, "b", "b-s0", "anna", ["anton"]);
    expect(r).toEqual({ status: "conflict", available: 1, mates: ["anton"] });
  });

  it("на місці сидить свій із ланцюжка — він пересідає поруч, а не міняється", () => {
    const tables = [round("a", ["anna", null]), round("b", ["anton", null, null])];
    const r = placeGuest(tables, "b", "b-s0", "anna", ["anton"]);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(keysOf(r.tables, "a")).toEqual([null, null]);
    expect(keysOf(r.tables, "b")[0]).toBe("anna");
    expect(keysOf(r.tables, "b")).toContain("anton");
  });

  it("за тим самим столом на зайняте місце — простий обмін", () => {
    const tables = [round("a", ["anna", "anton", "x", null])];
    const r = placeGuest(tables, "a", "a-s2", "anna", ["anton"]);
    if (r.status !== "placed") throw new Error("expected placed");
    expect(keysOf(r.tables, "a")).toEqual(["x", "anton", "anna", null]);
  });

  it("довгий стіл: сусід у ряду ближче, ніж кінець іншого ряду", () => {
    const t: PlaceTable = {
      id: "l",
      kind: "long",
      seats: Array.from({ length: 8 }, (_, i) => ({ id: `l-s${i}`, guestKey: null })),
    };
    // seat 3 — правий край верхнього ряду, seat 4 — лівий край нижнього.
    expect(nearestSeats(t, "l-s3", ["l-s4", "l-s2"], 1)).toEqual(["l-s2"]);
  });
});
