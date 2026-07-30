/** Легкі хелпери для групування чекліста по місяцях (як на вебі). */

export function monthKeyFromIso(iso: string): string {
  return iso.slice(0, 7);
}

export function formatMonthYearUk(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return monthKey;
  const label = new Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Орієнтовний дедлайн: за N місяців до весілля, розкидано по sortOrder. */
export function suggestedDueDate(
  weddingDateIso: string,
  sortOrder = 0,
  monthsBefore = 4,
): string | null {
  const wedding = new Date(`${weddingDateIso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(wedding.getTime())) return null;
  const due = new Date(wedding);
  due.setMonth(due.getMonth() - monthsBefore);
  due.setDate(Math.min(28, 2 + (sortOrder % 12) * 2));
  return due.toISOString().slice(0, 10);
}

export function daysUntil(iso: string): number | null {
  const target = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((day.getTime() - today.getTime()) / 86400000);
}
