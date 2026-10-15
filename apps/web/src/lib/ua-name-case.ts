/** Відмінювання українських особових імен (ім’я, не прізвище). */

export type UaGrammaticalCase =
  | "nominative"
  | "genitive"
  | "accusative"
  | "instrumental"
  | "vocative";

export type UaNameGender = "masculine" | "feminine";

const CYRILLIC = /[А-Яа-яІіЇїЄєҐґ]/;
const CONJUNCTION_SPLIT = /(\s+(?:і|та|й)\s+)/iu;

/** Чоловічі імена на -а */
const MASCULINE_A = new Set(["микола", "сава", "кузьма", "хома", "лука"]);

/** Чоловічі імена на -я */
const MASCULINE_YA = new Set(["ілля", "іля"]);

function lower(s: string): string {
  return s.toLocaleLowerCase("uk-UA");
}

function restoreCase(original: string, next: string): string {
  if (!original) return next;
  if (original === original.toLocaleUpperCase("uk-UA")) {
    return next.toLocaleUpperCase("uk-UA");
  }
  const first = original[0];
  if (first && first === first.toLocaleUpperCase("uk-UA")) {
    return next.charAt(0).toLocaleUpperCase("uk-UA") + next.slice(1);
  }
  return next;
}

export function detectUaNameGender(name: string): UaNameGender {
  const n = lower(name.trim());
  if (!n) return "masculine";
  if (MASCULINE_A.has(n) || MASCULINE_YA.has(n)) return "masculine";
  if (/[ая]$/u.test(n)) return "feminine";
  return "masculine";
}

function softOrHissing(stem: string): boolean {
  return /[йьжчшщґ]$/u.test(stem) || /[еиієїюя]$/u.test(stem);
}

function declineFeminine(name: string, grammaticalCase: UaGrammaticalCase): string {
  const n = lower(name);
  const last = n.slice(-1);

  if (last === "а") {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "accusative") return `${stem}у`;
    if (grammaticalCase === "vocative") return `${stem}о`;
    if (grammaticalCase === "genitive") {
      return softOrHissing(stem) || /[жчшщ]$/u.test(stem) ? `${stem}і` : `${stem}и`;
    }
    return softOrHissing(stem) || /[жчшщ]$/u.test(stem) ? `${stem}ею` : `${stem}ою`;
  }

  if (last === "я") {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "accusative") return `${stem}ю`;
    if (grammaticalCase === "vocative") {
      return /[аеєиіїоуюя]$/u.test(stem) ? `${stem}є` : `${stem}е`;
    }
    if (grammaticalCase === "genitive") {
      return /[аеєиіїоуюя]$/u.test(stem) ? `${stem}ї` : `${stem}і`;
    }
    return /[аеєиіїоуюя]$/u.test(stem) ? `${stem}єю` : `${stem}ею`;
  }

  return n;
}

function declineMasculine(name: string, grammaticalCase: UaGrammaticalCase): string {
  const n = lower(name);

  if (MASCULINE_YA.has(n)) {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "vocative") return `${stem}е`;
    if (grammaticalCase === "instrumental") return `${stem}ею`;
    if (grammaticalCase === "genitive") return `${stem}і`;
    return `${stem}ю`;
  }

  if (n.endsWith("а")) {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "vocative") return `${stem}о`;
    if (grammaticalCase === "accusative") return `${stem}у`;
    if (grammaticalCase === "genitive") return `${stem}и`;
    return `${stem}ою`;
  }

  if (n.endsWith("о")) {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "vocative") return `${stem}е`;
    if (grammaticalCase === "instrumental") return `${stem}ом`;
    return `${stem}а`;
  }

  if (n.endsWith("й")) {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "vocative") return `${stem}ю`;
    if (grammaticalCase === "instrumental") return `${stem}єм`;
    return `${stem}я`;
  }

  if (n.endsWith("ь")) {
    const stem = n.slice(0, -1);
    if (grammaticalCase === "vocative") return `${stem}ю`;
    if (grammaticalCase === "instrumental") return `${stem}ем`;
    return `${stem}я`;
  }

  if (grammaticalCase === "vocative") {
    return /[жчшщ]$/u.test(n) ? `${n}е` : `${n}е`;
  }
  if (grammaticalCase === "instrumental") {
    return /[жчшщ]$/u.test(n) ? `${n}ем` : `${n}ом`;
  }
  return `${n}а`;
}

function declineOneToken(raw: string, grammaticalCase: UaGrammaticalCase): string {
  const name = raw.trim();
  if (!name || grammaticalCase === "nominative") return name;
  if (!CYRILLIC.test(name)) return name;

  const hyphen = name.lastIndexOf("-");
  if (hyphen !== -1) {
    const head = name.slice(0, hyphen + 1);
    const tail = name.slice(hyphen + 1);
    return head + declineOneToken(tail, grammaticalCase);
  }

  const gender = detectUaNameGender(name);
  const declined =
    gender === "feminine"
      ? declineFeminine(name, grammaticalCase)
      : declineMasculine(name, grammaticalCase);

  return restoreCase(name, declined);
}

/**
 * Відмінює українські імена у фразі.
 * «Роман і Олена» → «Романа і Олену»; «Роман Коваленко» → лише ім’я.
 * Некирилиця / порожнє → як є. Очікує називний на вході.
 */
export function declineUaGivenName(
  raw: string,
  grammaticalCase: UaGrammaticalCase,
): string {
  const name = raw.trim();
  if (!name || grammaticalCase === "nominative") return name;
  if (!CYRILLIC.test(name)) return name;

  return name
    .split(CONJUNCTION_SPLIT)
    .map((part) => {
      if (CONJUNCTION_SPLIT.test(part)) return part;
      // ім’я + прізвище → відмінюємо лише перше слово / дефісне ім’я
      const match = /^(\S+)(.*)$/u.exec(part.trimStart());
      if (!match) return part;
      const leading = part.slice(0, part.length - part.trimStart().length);
      return leading + declineOneToken(match[1], grammaticalCase) + match[2];
    })
    .join("");
}

/** Знахідний: «Запросіть Романа», «Додайте Олену». */
export function uaNameAccusative(raw: string, fallback = "партнера"): string {
  const name = raw.trim();
  if (!name || /^партнера?$/i.test(name)) return fallback;
  return declineUaGivenName(name, "accusative");
}

/** Орудний: «з Романом», «з Оленою». */
export function uaNameInstrumental(raw: string): string {
  const name = raw.trim();
  if (!name) return name;
  return declineUaGivenName(name, "instrumental");
}

/** Родовий: «Батьки Романа», «для Олени», «Гості Романа». */
export function uaNameGenitive(raw: string): string {
  const name = raw.trim();
  if (!name) return name;
  return declineUaGivenName(name, "genitive");
}

/** Кличний: «Привіт, Романе!». */
export function uaNameVocative(raw: string): string {
  const name = raw.trim();
  if (!name) return name;
  return declineUaGivenName(name, "vocative");
}

/** «Гості Романа» / фолбек уже в родовому («нареченої»). */
export function uaGuestsOfLabel(
  raw: string | null | undefined,
  fallbackGenitive: string,
): string {
  const name = (raw ?? "").trim();
  if (!name || /^наречен/i.test(name) || /^партнер/i.test(name)) {
    return `Гості ${fallbackGenitive}`;
  }
  return `Гості ${uaNameGenitive(name)}`;
}
