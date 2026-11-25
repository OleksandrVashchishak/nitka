/**
 * Пошук у списках кабінету (Гості / Завдання / Бюджет).
 * Входження в будь-якому місці, без регістру й апострофів, зайві пробіли обрізаємо.
 */

const APOSTROPHES = /['’ʼ`]/g;

export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("uk")
    .replace(APOSTROPHES, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** `query` — уже нормалізований (див. `normalizeSearchText`). Порожній — збігається все. */
export function matchesSearch(text: string, query: string) {
  if (!query) return true;
  return normalizeSearchText(text).includes(query);
}
