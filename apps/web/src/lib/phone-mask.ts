/** Ukrainian phone mask: +38 (0XX) XXX-XX-XX */

const LOCAL_MAX = 10; // 0XX XXX XX XX

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * National digits with trunk `0` (max 10).
 * Accepts masked, E.164 (`+380…`), or bare local.
 */
export function toUaLocalDigits(raw: string): string {
  let d = digitsOnly(raw);
  if (!d) return "";

  if (d.startsWith("380")) {
    // E.164 after country 380 → prepend trunk 0
    return (`0${d.slice(3)}`).slice(0, LOCAL_MAX);
  }
  if (d.startsWith("38")) {
    const rest = d.slice(2);
    if (!rest) return "";
    if (rest.startsWith("0")) return rest.slice(0, LOCAL_MAX);
    return (`0${rest}`).slice(0, LOCAL_MAX);
  }
  if (d.startsWith("0")) return d.slice(0, LOCAL_MAX);
  return d.slice(0, LOCAL_MAX);
}

/** Compact storage: `+380…`. Empty → "". */
export function toUaPhoneE164(raw: string): string {
  const local = toUaLocalDigits(raw);
  if (!local) return "";
  if (local.startsWith("0")) return `+380${local.slice(1)}`;
  return `+380${local}`;
}

/** Display mask. Empty → "". */
export function formatUaPhoneMask(raw: string): string {
  const local = toUaLocalDigits(raw);
  if (!local) return "";

  let out = "+38";
  out += ` (${local.slice(0, Math.min(3, local.length))}`;
  if (local.length < 3) return out;
  out += ")";
  if (local.length === 3) return out;

  out += ` ${local.slice(3, Math.min(6, local.length))}`;
  if (local.length <= 6) return out;

  out += `-${local.slice(6, Math.min(8, local.length))}`;
  if (local.length <= 8) return out;

  out += `-${local.slice(8, Math.min(10, local.length))}`;
  return out;
}

export function isCompleteUaPhone(raw: string): boolean {
  return toUaLocalDigits(raw).length === LOCAL_MAX;
}

export function digitCountBeforeCaret(formatted: string, caret: number): number {
  let count = 0;
  const end = Math.max(0, Math.min(caret, formatted.length));
  for (let i = 0; i < end; i += 1) {
    if (/\d/.test(formatted[i]!)) count += 1;
  }
  return count;
}

/** Caret after N digits in formatted string (`38` + local). */
export function caretFromDigitCount(formatted: string, digitCount: number): number {
  if (!formatted) return 0;
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i]!)) {
      seen += 1;
      if (seen >= digitCount) return i + 1;
    }
  }
  return formatted.length;
}

function removeAt(str: string, index: number): string {
  if (index < 0 || index >= str.length) return str;
  return str.slice(0, index) + str.slice(index + 1);
}

/**
 * One browser `input` event → next controlled value + caret in display.
 * Backspace on spaces / `()` / `-` removes the nearest digit.
 */
export function applyUaPhoneInput(args: {
  prevValue: string;
  inputValue: string;
  caret: number;
}): { value: string; display: string; caret: number } {
  const prevDisplay = formatUaPhoneMask(args.prevValue);
  const prevLocal = toUaLocalDigits(args.prevValue);
  const wasShrunk = args.inputValue.length < prevDisplay.length;

  let nextLocal: string;

  if (wasShrunk) {
    const inputLocal = toUaLocalDigits(args.inputValue);
    if (inputLocal.length < prevLocal.length) {
      nextLocal = inputLocal;
    } else {
      // Mask char deleted — remove local digit before caret
      const digitsBefore = digitCountBeforeCaret(args.inputValue, args.caret);
      const localBefore = digitsBefore - 2; // strip country `38`
      nextLocal = removeAt(prevLocal, localBefore - 1);
    }
  } else {
    nextLocal = toUaLocalDigits(args.inputValue);
  }

  nextLocal = nextLocal.slice(0, LOCAL_MAX);
  const value = toUaPhoneE164(nextLocal);
  const display = formatUaPhoneMask(value);

  const digitsBefore = digitCountBeforeCaret(args.inputValue, args.caret);
  let localBefore = Math.max(0, digitsBefore - 2);
  if (!prevLocal && !wasShrunk) {
    localBefore = nextLocal.length;
  } else if (wasShrunk) {
    localBefore = Math.max(0, Math.min(nextLocal.length, localBefore));
  } else {
    localBefore = Math.max(0, Math.min(nextLocal.length, localBefore));
  }

  const caret = display
    ? caretFromDigitCount(display, localBefore + 2)
    : 0;

  return { value, display, caret };
}
