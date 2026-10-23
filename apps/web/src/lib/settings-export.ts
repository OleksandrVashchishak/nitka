import { getBudget, categoryLabel, type BudgetItem } from "@/lib/budget-api";
import {
  fetchDayPlan,
  formatDayPlanDate,
  formatDurationUk,
  sortDayPlanEvents,
  type DayPlanEvent,
} from "@/lib/day-plan";
import { getMyWedding } from "@/lib/dashboard-api";
import { listPartyPeople } from "@/lib/guest-party";
import { getGuestList, type Guest, type RsvpStatus } from "@/lib/guests-api";

export type SettingsExportId = "guests" | "budget" | "dayplan";

const RSVP_LABEL: Record<RsvpStatus, string> = {
  YES: "Прийде",
  NO: "Відмова",
  MAYBE: "Можливо прийде",
  PENDING: "Ще не відповіли",
};

function escapeCsvCell(value: string) {
  if (/[",\n\r;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function guestsToCsv(guests: Guest[]) {
  const header = [
    "name",
    "phone",
    "email",
    "side",
    "rsvp",
    "allergies",
    "companions",
  ];
  const rows = guests.map((guest) => {
    const party = listPartyPeople(guest);
    const companions = party.companions
      .map((c) => {
        const bits = [c.name || "Супровід"];
        if (c.isChild) bits.push("дитина");
        bits.push(RSVP_LABEL[c.rsvpStatus]);
        return bits.join(" / ");
      })
      .join("; ");
    return [
      guest.name,
      guest.phone ?? "",
      guest.email ?? "",
      guest.side,
      guest.rsvpStatus,
      guest.allergies ?? "",
      companions,
    ].map((cell) => escapeCsvCell(String(cell)));
  });
  // BOM so Excel on Windows opens UTF-8 correctly
  return `\uFEFF${[header.join(","), ...rows.map((r) => r.join(","))].join("\r\n")}\r\n`;
}

function budgetRows(items: BudgetItem[]) {
  return items.map((item) => ({
    category: categoryLabel(item.category),
    title: item.title,
    estimated: item.estimated,
    actual: item.actual,
    paid: item.paid ? "Так" : "Ні",
    notes: item.notes ?? "",
  }));
}

export function budgetToCsv(
  items: BudgetItem[],
  summary?: {
    totalBudget: number;
    estimated: number;
    actual: number;
    paid: number;
    remaining: number;
  },
) {
  const header = [
    "Категорія",
    "Стаття",
    "План, грн",
    "Факт, грн",
    "Оплачено",
    "Нотатки",
  ];
  const lines = [
    header,
    ...budgetRows(items).map((row) => [
      row.category,
      row.title,
      row.estimated,
      row.actual,
      row.paid,
      row.notes,
    ]),
  ];
  if (summary) {
    lines.push(
      [],
      ["Підсумок"],
      ["Бюджет", summary.totalBudget],
      ["План", summary.estimated],
      ["Факт", summary.actual],
      ["Оплачено", summary.paid],
      ["Залишок", summary.remaining],
    );
  }
  // BOM so Excel/Numbers open UTF-8 correctly
  return `\uFEFF${lines
    .map((line) => line.map((cell) => escapeCsvCell(String(cell))).join(","))
    .join("\r\n")}\r\n`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

function stamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Minimal single-image PDF (JPEG), A4 points. */
export function jpegToPdf(jpeg: Uint8Array, widthPx: number, heightPx: number) {
  const pageW = 595.28;
  const pageH = 841.89;
  const scale = Math.min(pageW / widthPx, pageH / heightPx);
  const drawW = widthPx * scale;
  const drawH = heightPx * scale;
  const offsetX = (pageW - drawW) / 2;
  const offsetY = (pageH - drawH) / 2;

  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [0];
  let size = 0;

  const push = (chunk: Uint8Array | string) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    parts.push(bytes);
    size += bytes.length;
  };

  const markObj = () => {
    offsets.push(size);
  };

  push("%PDF-1.4\n");

  markObj();
  push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  markObj();
  push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  markObj();
  push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\nendobj\n`,
  );

  const content = `q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${offsetX.toFixed(2)} ${offsetY.toFixed(2)} cm\n/Im0 Do\nQ\n`;
  markObj();
  push(
    `4 0 obj\n<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream\nendobj\n`,
  );

  markObj();
  push(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  push(jpeg);
  push("\nendstream\nendobj\n");

  const xrefStart = size;
  push(`xref\n0 ${offsets.length}\n`);
  push("0000000000 65535 f \n");
  for (let i = 1; i < offsets.length; i++) {
    push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  push(
    `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`,
  );

  const out = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function dataUrlToUint8(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function renderDayPlanJpeg(
  dateLabel: string,
  events: DayPlanEvent[],
): { jpeg: Uint8Array; width: number; height: number } {
  const sorted = sortDayPlanEvents(events);
  const dpr = 2;
  const width = 794;
  const rowH = 44;
  const padX = 48;
  const padTop = 72;
  const headerH = 88;
  const height = Math.max(
    1123,
    padTop + headerH + sorted.length * rowH + 64,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не вдалося намалювати PDF");

  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#111111";
  ctx.font = "600 28px system-ui, Segoe UI, sans-serif";
  ctx.fillText("План дня", padX, padTop);

  ctx.fillStyle = "#666666";
  ctx.font = "400 16px system-ui, Segoe UI, sans-serif";
  ctx.fillText(dateLabel, padX, padTop + 28);

  if (sorted.length === 0) {
    ctx.fillStyle = "#888888";
    ctx.font = "400 15px system-ui, Segoe UI, sans-serif";
    ctx.fillText("Подій поки немає", padX, padTop + headerH);
  } else {
    sorted.forEach((event, index) => {
      const y = padTop + headerH + index * rowH;
      ctx.fillStyle = index % 2 === 0 ? "#f7f7f5" : "#ffffff";
      ctx.fillRect(padX - 12, y - 28, width - padX * 2 + 24, rowH);

      ctx.fillStyle = "#111111";
      ctx.font = "600 15px system-ui, Segoe UI, sans-serif";
      ctx.fillText(event.time, padX, y);

      ctx.font = "400 15px system-ui, Segoe UI, sans-serif";
      ctx.fillText(event.title, padX + 72, y);

      ctx.fillStyle = "#666666";
      ctx.font = "400 13px system-ui, Segoe UI, sans-serif";
      const dur = formatDurationUk(event.durationMin);
      const durW = ctx.measureText(dur).width;
      ctx.fillText(dur, width - padX - durW, y);
    });
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  return {
    jpeg: dataUrlToUint8(dataUrl),
    width: canvas.width,
    height: canvas.height,
  };
}

export async function exportGuestsCsv() {
  const data = await getGuestList();
  const csv = guestsToCsv(data.guests);
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
    `fata-guests-${stamp()}.csv`,
  );
  return data.guests.length;
}

export async function exportBudgetCsv() {
  const data = await getBudget();
  const csv = budgetToCsv(data.items, data.summary);
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
    `fata-budget-${stamp()}.csv`,
  );
  return data.items.length;
}

export async function exportDayPlanPdf() {
  const [plan, wedding] = await Promise.all([
    fetchDayPlan(),
    getMyWedding().catch(() => null),
  ]);
  const events = plan.events ?? [];
  const dateLabel = formatDayPlanDate(wedding?.date);
  const { jpeg, width, height } = renderDayPlanJpeg(dateLabel, events);
  const pdf = jpegToPdf(jpeg, width, height);
  downloadBlob(new Blob([pdf], { type: "application/pdf" }), `fata-day-plan-${stamp()}.pdf`);
  return events.length;
}

export async function runSettingsExport(id: SettingsExportId) {
  if (id === "guests") return exportGuestsCsv();
  if (id === "budget") return exportBudgetCsv();
  return exportDayPlanPdf();
}
