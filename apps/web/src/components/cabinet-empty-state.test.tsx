import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CabinetEmptyState } from "@/components/cabinet-empty-state";

afterEach(() => {
  cleanup();
});

describe("CabinetEmptyState", () => {
  it("renders illustrated empty with art, title, description, actions", () => {
    const { container } = render(
      <CabinetEmptyState
        art={{ src: "/cabinet/empty/guests.png", width: 320, height: 220 }}
        title="Порожньо"
        description={<p>Додай перший запис</p>}
        actions={<button type="button">Додати</button>}
      />,
    );

    expect(container.querySelector(".cabinet-empty")).toBeTruthy();
    expect(container.querySelector(".cabinet-empty--soft")).toBeNull();
    expect(container.querySelector(".cabinet-empty-glow")).toBeTruthy();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "/cabinet/empty/guests.png",
    );
    expect(screen.getByRole("heading", { name: "Порожньо" })).toBeTruthy();
    expect(screen.getByText("Додай перший запис")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Додати" })).toBeTruthy();
  });

  it("renders soft empty without art/glow", () => {
    const { container } = render(
      <CabinetEmptyState
        variant="soft"
        description="Немає задач у цьому фільтрі."
        actions={
          <button type="button" className="cabinet-empty-soft-link">
            Скинути
          </button>
        }
      />,
    );

    expect(container.querySelector(".cabinet-empty--soft")).toBeTruthy();
    expect(container.querySelector(".cabinet-empty-glow")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("Немає задач у цьому фільтрі.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Скинути" })).toBeTruthy();
  });

  it("allows soft empty without actions", () => {
    const { container } = render(
      <CabinetEmptyState
        variant="soft"
        description="Немає гостей у цьому фільтрі."
      />,
    );

    expect(container.querySelector(".cabinet-empty-actions")).toBeNull();
    expect(screen.getByText("Немає гостей у цьому фільтрі.")).toBeTruthy();
  });

  it("renders illustrated empty without art", () => {
    const { container } = render(
      <CabinetEmptyState
        title="Проблеми на сервері"
        description={<p>Почекай трохи</p>}
        actions={<button type="button">Спробувати ще</button>}
      />,
    );

    expect(container.querySelector(".cabinet-empty-glow")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Проблеми на сервері" }),
    ).toBeTruthy();
    expect(screen.getByText("Почекай трохи")).toBeTruthy();
  });
});
