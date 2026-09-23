export function splitCoupleNames(headline: string): [string, string] {
  const parts = headline.split(/\s+(?:та|and|&|·)\s+/i);
  if (parts.length >= 2) {
    return [parts[0].trim(), parts.slice(1).join(" ").trim()];
  }
  const words = headline.trim().split(/\s+/);
  if (words.length >= 2) {
    return [words[0], words.slice(1).join(" ")];
  }
  return [headline.trim() || "Наречена", "Наречений"];
}

export function coupleInitials(bride: string, groom: string) {
  const a = bride.trim().charAt(0);
  const b = groom.trim().charAt(0);
  if (!a && !b) return "";
  if (!a) return b.toUpperCase();
  if (!b) return a.toUpperCase();
  return `${a.toUpperCase()} & ${b.toUpperCase()}`;
}

export function parseWeddingDate(
  weddingDate?: string | null,
  dateLabel?: string,
): Date | null {
  if (weddingDate) {
    const d = new Date(weddingDate);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (!dateLabel) return null;
  const iso = dateLabel.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T12:00:00`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const ua = dateLabel.match(/(\d{1,2})[./](\d{1,2})[./](\d{2,4})/);
  if (ua) {
    const year = ua[3].length === 2 ? `20${ua[3]}` : ua[3];
    const d = new Date(`${year}-${ua[2].padStart(2, "0")}-${ua[1].padStart(2, "0")}T12:00:00`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const parsed = Date.parse(dateLabel);
  if (!Number.isNaN(parsed)) return new Date(parsed);
  return null;
}

export function themeClass(templateId: string) {
  if (templateId === "navy-gold") return "wsite--navy-gold";
  if (templateId === "dark-botanical") return "wsite--dark-botanical";
  return "wsite--classic-white";
}

export function safeHref(url: string, fallback = "#") {
  const value = url.trim();
  if (!value) return fallback;
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("#")) {
    return value;
  }
  return fallback;
}
