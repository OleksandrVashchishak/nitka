import type { GuestSide } from "@/lib/types";

export type ParsedGuestRow = {
  name: string;
  phone?: string;
  email?: string;
  side?: GuestSide;
};

/** Simple paste lines: name;phone;email */
export function parseImportText(raw: string): ParsedGuestRow[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[;,|\t]/).map((p) => p.trim());
      return {
        name: parts[0] ?? "",
        phone: parts[1] || undefined,
        email: parts[2] || undefined,
      };
    })
    .filter((g) => g.name.length >= 2);
}

/** CSV with optional header (name/side UA+EN), quotes, BOM */
export function parseGuestCsv(text: string): ParsedGuestRow[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const split = (line: string) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if ((ch === "," || ch === ";") && !inQuotes) {
        cells.push(current.trim());
        current = "";
        continue;
      }
      current += ch;
    }
    cells.push(current.trim());
    return cells;
  };

  const headerCells = split(lines[0]!).map((c) => c.toLowerCase());
  const hasHeader = headerCells.some((c) =>
    [
      "name",
      "імя",
      "ім'я",
      "імʼя",
      "гость",
      "guest",
      "сторона",
      "side",
      "телефон",
      "phone",
      "email",
    ].includes(c),
  );
  const rows = hasHeader ? lines.slice(1) : lines;
  const idx = (aliases: string[]) =>
    headerCells.findIndex((c) => aliases.includes(c));
  const nameIdx = hasHeader
    ? Math.max(0, idx(["name", "імя", "ім'я", "імʼя", "гость", "guest"]))
    : 0;
  const sideIdx = hasHeader ? idx(["side", "сторона"]) : -1;
  const phoneIdx = hasHeader
    ? idx(["phone", "телефон", "tel", "mobile"])
    : hasHeader
      ? -1
      : 1;
  const emailIdx = hasHeader
    ? idx(["email", "пошта", "mail"])
    : hasHeader
      ? -1
      : 2;

  const sideMap: Record<string, GuestSide> = {
    bride: "BRIDE",
    наречена: "BRIDE",
    groom: "GROOM",
    наречений: "GROOM",
    both: "BOTH",
    обидві: "BOTH",
    спільні: "BOTH",
    other: "OTHER",
    інше: "OTHER",
  };

  return rows
    .map((line): ParsedGuestRow | null => {
      const cells = split(line);
      const name = (cells[nameIdx] ?? "").trim();
      if (name.length < 2) return null;
      const sideRaw =
        sideIdx >= 0 ? cells[sideIdx]?.trim().toLowerCase() ?? "" : "";
      const phone =
        phoneIdx >= 0 ? cells[phoneIdx]?.trim() || undefined : undefined;
      const email =
        emailIdx >= 0 ? cells[emailIdx]?.trim() || undefined : undefined;
      return {
        name,
        phone,
        email,
        side: sideRaw ? sideMap[sideRaw] : undefined,
      };
    })
    .filter((row): row is ParsedGuestRow => row !== null);
}
