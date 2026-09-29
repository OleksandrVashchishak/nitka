/** Build printable seating-chart content from the floor plan. */

export type SeatingChartGuest = {
  key: string;
  name: string;
};

export type SeatingChartTable = {
  id: string;
  kind: string;
  label: string;
  seats: { guestKey: string | null }[];
};

/** One guest table on the chart (presidium / kids are separate). */
export type SeatingChartTableBlock = {
  id: string;
  label: string;
  /** Seat order as on the floor plan. */
  names: string[];
};

export type SeatingChartData = {
  coupleLabel: string;
  dateLabel: string;
  /** Presidium seats in plan order. */
  presidium: string[];
  /** Kids table seats in plan order. */
  kids: string[];
  /** Regular tables with seated guests, plan order. */
  tables: SeatingChartTableBlock[];
};

export function firstName(full: string) {
  return full.trim().split(/\s+/).filter(Boolean)[0] ?? "";
}

export function formatCoupleLabel(one: string, two: string) {
  const a = firstName(one).toUpperCase();
  const b = firstName(two).toUpperCase();
  if (a && b) return `${a} і ${b}`;
  return a || b || "НАРЕЧЕНІ";
}

export function formatChartDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

export function chartName(name: string) {
  return name.trim().replace(/\s+/g, " ").toUpperCase();
}

function seatedNames(
  table: SeatingChartTable,
  guestsByKey: Map<string, SeatingChartGuest>,
): string[] {
  const names: string[] = [];
  for (const seat of table.seats) {
    if (!seat.guestKey) continue;
    const guest = guestsByKey.get(seat.guestKey);
    if (!guest?.name.trim()) continue;
    names.push(chartName(guest.name));
  }
  return names;
}

/** Split a long table list into 1–2 visual columns (Frame 74 pairs). */
export function splitTableColumns(names: string[]): string[][] {
  if (names.length === 0) return [[]];
  if (names.length <= 10) return [names];
  const mid = Math.ceil(names.length / 2);
  return [names.slice(0, mid), names.slice(mid)];
}

export function buildSeatingChartData(input: {
  tables: SeatingChartTable[];
  guestsByKey: Map<string, SeatingChartGuest>;
  partnerOneName: string;
  partnerTwoName: string;
  weddingDate: string | null | undefined;
}): SeatingChartData {
  let presidium: string[] = [];
  let kids: string[] = [];
  const tables: SeatingChartTableBlock[] = [];

  for (const table of input.tables) {
    const names = seatedNames(table, input.guestsByKey);
    if (names.length === 0) continue;

    if (table.kind === "presidium") {
      presidium = names;
      continue;
    }
    if (table.kind === "kids") {
      kids = names;
      continue;
    }

    tables.push({
      id: table.id,
      label: (table.label || "Стіл").trim().toUpperCase(),
      names,
    });
  }

  return {
    coupleLabel: formatCoupleLabel(
      input.partnerOneName,
      input.partnerTwoName,
    ),
    dateLabel: formatChartDate(input.weddingDate),
    presidium,
    kids,
    tables,
  };
}

export const SEATING_CHART_DESIGNS = [
  {
    id: "modern",
    name: "Сучасний",
    description:
      "Сучасна композиція з акцентною типографікою та чіткими полями.",
  },
  {
    id: "minimal",
    name: "Мінімалістичний",
    description: "Простора композиція з тихими полями, чистий дизайн.",
    soon: true,
  },
  {
    id: "romantic",
    name: "Романтичний",
    description: "М’які тони й квіткові патерни, квіти та органіка.",
    soon: true,
  },
  {
    id: "botanical",
    name: "Ботанічний",
    description: "Елегантні органічні лінії листя й дикої оливи.",
    soon: true,
  },
  {
    id: "elegant",
    name: "Елегантний",
    description: "Вишуканий дизайн у чорно-золотій оздобі.",
    soon: true,
  },
] as const;

export type SeatingChartDesignId =
  (typeof SEATING_CHART_DESIGNS)[number]["id"];
