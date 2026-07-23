const UA_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ye',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'yi',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'yu',
  я: 'ya',
};

const SKIP = new Set(["'", '`', '\u2019', '\u02BC']);

/** Трансліт UA/кирилиці → латиниця для URL slug. */
export function slugify(input: string): string {
  const lower = input.trim().toLowerCase();
  let out = '';
  for (const ch of lower) {
    if (SKIP.has(ch)) continue;
    if (UA_MAP[ch] !== undefined) {
      out += UA_MAP[ch];
      continue;
    }
    if (/[a-z0-9]/.test(ch)) {
      out += ch;
      continue;
    }
    if (/[\s._/\\—–-]+/.test(ch)) {
      out += '-';
    }
  }
  return (
    out
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || 'vendor'
  );
}
