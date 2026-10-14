import { describe, expect, it } from "vitest";
import {
  applyUaPhoneInput,
  formatUaPhoneMask,
  isCompleteUaPhone,
  toUaLocalDigits,
  toUaPhoneE164,
} from "@/lib/phone-mask";

function typeDigits(digits: string) {
  let value = "";
  for (const ch of digits) {
    const display = formatUaPhoneMask(value);
    const inputValue = display + ch;
    const next = applyUaPhoneInput({
      prevValue: value,
      inputValue,
      caret: inputValue.length,
    });
    value = next.value;
  }
  return value;
}

function backspace(value: string, times = 1) {
  let current = value;
  for (let i = 0; i < times; i += 1) {
    const display = formatUaPhoneMask(current);
    if (!display) return "";
    const inputValue = display.slice(0, -1);
    const next = applyUaPhoneInput({
      prevValue: current,
      inputValue,
      caret: inputValue.length,
    });
    current = next.value;
  }
  return current;
}

describe("phone-mask", () => {
  it("formats from paste shapes", () => {
    expect(formatUaPhoneMask("+380664816295")).toBe("+38 (066) 481-62-95");
    expect(formatUaPhoneMask("0664816295")).toBe("+38 (066) 481-62-95");
    expect(formatUaPhoneMask("380664816295")).toBe("+38 (066) 481-62-95");
  });

  it("keeps trunk 0 when reading masked partials", () => {
    expect(toUaLocalDigits("+38 (066)")).toBe("066");
    expect(toUaLocalDigits("+38 (0")).toBe("0");
    expect(toUaLocalDigits("+38")).toBe("");
  });

  it("types a full number with mask separators", () => {
    const value = typeDigits("0664816295");
    expect(value).toBe("+380664816295");
    expect(formatUaPhoneMask(value)).toBe("+38 (066) 481-62-95");
    expect(isCompleteUaPhone(value)).toBe(true);
  });

  it("backspaces through separators without getting stuck", () => {
    let value = typeDigits("066");
    expect(formatUaPhoneMask(value)).toBe("+38 (066)");

    value = backspace(value, 1); // delete `)` → drop last `6`
    expect(formatUaPhoneMask(value)).toBe("+38 (06");

    value = backspace(value, 1);
    expect(formatUaPhoneMask(value)).toBe("+38 (0");

    value = backspace(value, 1);
    expect(value).toBe("");
    expect(formatUaPhoneMask(value)).toBe("");
  });

  it("backspaces across space after closing paren", () => {
    let value = typeDigits("0664");
    expect(formatUaPhoneMask(value)).toBe("+38 (066) 4");

    value = backspace(value, 1); // digit
    expect(formatUaPhoneMask(value)).toBe("+38 (066)");

    value = backspace(value, 1); // `)` → drop `6`
    expect(formatUaPhoneMask(value)).toBe("+38 (06");
  });

  it("backspaces a complete number down to empty", () => {
    let value = typeDigits("0664816295");
    value = backspace(value, 20);
    expect(value).toBe("");
  });

  it("round-trips E.164", () => {
    expect(toUaPhoneE164("+38 (066) 481-62-95")).toBe("+380664816295");
    expect(toUaLocalDigits("+380664816295")).toBe("0664816295");
  });
});
