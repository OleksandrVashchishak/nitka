import { describe, expect, it } from "vitest";
import {
  budgetToXlsXml,
  guestsToCsv,
  jpegToPdf,
} from "@/lib/settings-export";
import type { Guest } from "@/lib/guests-api";
import type { BudgetItem } from "@/lib/budget-api";

function guest(partial: Partial<Guest> & Pick<Guest, "name">): Guest {
  return {
    id: partial.id ?? "g1",
    name: partial.name,
    email: partial.email ?? null,
    phone: partial.phone ?? null,
    side: partial.side ?? "BOTH",
    rsvpStatus: partial.rsvpStatus ?? "PENDING",
    plusOne: partial.plusOne ?? false,
    plusOneName: partial.plusOneName ?? null,
    plusOneAttending: partial.plusOneAttending ?? null,
    allergies: partial.allergies ?? null,
    notes: partial.notes ?? null,
    inviteToken: partial.inviteToken ?? "tok",
    respondedAt: partial.respondedAt ?? null,
    createdAt: partial.createdAt ?? "2026-01-01T00:00:00.000Z",
  };
}

describe("settings-export", () => {
  it("builds guests CSV with BOM and escaped cells", () => {
    const csv = guestsToCsv([
      guest({
        name: 'Оля, "тест"',
        phone: "+380501112233",
        side: "BRIDE",
        rsvpStatus: "YES",
        allergies: "горіхи",
      }),
    ]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("name,phone,email,side,rsvp,allergies,companions");
    expect(csv).toContain('"Оля, ""тест"""');
    expect(csv).toContain("BRIDE");
    expect(csv).toContain("YES");
  });

  it("builds budget SpreadsheetML with numbers", () => {
    const items: BudgetItem[] = [
      {
        id: "1",
        category: "venue",
        title: "Зала",
        estimated: 50000,
        actual: 48000,
        paid: true,
        notes: null,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    const xml = budgetToXlsXml(items, {
      totalBudget: 100000,
      estimated: 50000,
      actual: 48000,
      paid: 48000,
      remaining: 52000,
    });
    expect(xml).toContain("ss:Type=\"Number\">50000</Data>");
    expect(xml).toContain("Локація");
    expect(xml).toContain("Зала");
    expect(xml).toContain("Підсумок");
  });

  it("wraps jpeg bytes into a valid PDF header", () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const pdf = jpegToPdf(jpeg, 10, 10);
    const text = new TextDecoder().decode(pdf.slice(0, 8));
    expect(text).toBe("%PDF-1.4");
    expect(pdf[pdf.length - 6]).toBe("%".charCodeAt(0));
  });
});
