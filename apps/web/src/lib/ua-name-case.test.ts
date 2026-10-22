import { describe, expect, it } from "vitest";
import {
  declineUaGivenName,
  uaGuestsOfLabel,
  uaNameAccusative,
  uaNameGenitive,
  uaNameInstrumental,
  uaNameVocative,
} from "@/lib/ua-name-case";

describe("declineUaGivenName", () => {
  it("відмінює чоловічі імена", () => {
    expect(declineUaGivenName("Роман", "accusative")).toBe("Романа");
    expect(declineUaGivenName("Роман", "genitive")).toBe("Романа");
    expect(declineUaGivenName("Роман", "instrumental")).toBe("Романом");
    expect(declineUaGivenName("Роман", "vocative")).toBe("Романе");

    expect(declineUaGivenName("Андрій", "accusative")).toBe("Андрія");
    expect(declineUaGivenName("Андрій", "instrumental")).toBe("Андрієм");
    expect(declineUaGivenName("Андрій", "vocative")).toBe("Андрію");

    expect(declineUaGivenName("Петро", "accusative")).toBe("Петра");
    expect(declineUaGivenName("Петро", "vocative")).toBe("Петре");

    expect(declineUaGivenName("Василь", "accusative")).toBe("Василя");
    expect(declineUaGivenName("Василь", "vocative")).toBe("Василю");

    expect(declineUaGivenName("Микола", "accusative")).toBe("Миколу");
    expect(declineUaGivenName("Микола", "vocative")).toBe("Миколо");

    expect(declineUaGivenName("Ілля", "accusative")).toBe("Іллю");
    expect(declineUaGivenName("Ілля", "genitive")).toBe("Іллі");
    expect(declineUaGivenName("Сергій", "accusative")).toBe("Сергія");
  });

  it("відмінює жіночі імена", () => {
    expect(declineUaGivenName("Олена", "accusative")).toBe("Олену");
    expect(declineUaGivenName("Олена", "genitive")).toBe("Олени");
    expect(declineUaGivenName("Олена", "instrumental")).toBe("Оленою");
    expect(declineUaGivenName("Олена", "vocative")).toBe("Олено");

    expect(declineUaGivenName("Марія", "accusative")).toBe("Марію");
    expect(declineUaGivenName("Марія", "genitive")).toBe("Марії");
    expect(declineUaGivenName("Марія", "vocative")).toBe("Маріє");

    expect(declineUaGivenName("Надія", "accusative")).toBe("Надію");
    expect(declineUaGivenName("Катя", "accusative")).toBe("Катю");
    expect(declineUaGivenName("Оля", "vocative")).toBe("Олю");
    expect(declineUaGivenName("Оля", "genitive")).toBe("Олі");
    expect(declineUaGivenName("Наташа", "genitive")).toBe("Наташі");
  });

  it("відмінює кілька імен у фразі, прізвище не чіпає", () => {
    expect(declineUaGivenName("Роман і Олена", "accusative")).toBe(
      "Романа і Олену",
    );
    expect(declineUaGivenName("Роман та Олена", "genitive")).toBe(
      "Романа та Олени",
    );
    expect(declineUaGivenName("Анна-Марія", "accusative")).toBe("Анна-Марію");
    expect(declineUaGivenName("Роман Коваленко", "accusative")).toBe(
      "Романа Коваленко",
    );
  });

  it("не чіпає називний і некирилицю", () => {
    expect(declineUaGivenName("Роман", "nominative")).toBe("Роман");
    expect(declineUaGivenName("Alex", "accusative")).toBe("Alex");
    expect(declineUaGivenName("", "accusative")).toBe("");
  });
});

describe("helpers", () => {
  it("uaNameAccusative з фолбеком", () => {
    expect(uaNameAccusative("Роман")).toBe("Романа");
    expect(uaNameAccusative("")).toBe("партнера");
    expect(uaNameAccusative("партнера")).toBe("партнера");
  });

  it("орудний / родовий / кличний", () => {
    expect(uaNameInstrumental("Роман")).toBe("Романом");
    expect(uaNameGenitive("Олена")).toBe("Олени");
    expect(uaNameVocative("Роман")).toBe("Романе");
  });

  it("uaGuestsOfLabel", () => {
    expect(uaGuestsOfLabel("Роман", "нареченого")).toBe("Гості Романа");
    expect(uaGuestsOfLabel("", "нареченої")).toBe("Гості нареченої");
    expect(uaGuestsOfLabel("наречена", "нареченої")).toBe("Гості нареченої");
  });
});
