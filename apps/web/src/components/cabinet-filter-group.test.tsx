import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CabinetFilterGroup } from "@/components/cabinet-filter-group";

afterEach(() => {
  cleanup();
});

describe("CabinetFilterGroup", () => {
  const items = [
    { id: "all", label: "Всі", count: 12 },
    { id: "open", label: "Не виконано", count: 5 },
    { id: "done", label: "Виконано", count: "7 шт" },
  ];

  it("renders title, labels and counts", () => {
    render(
      <CabinetFilterGroup
        title="Статус"
        items={items}
        active="all"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Статус")).toBeTruthy();
    expect(screen.getByText("Всі")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("7 шт")).toBeTruthy();
  });

  it("marks the active item", () => {
    const { container } = render(
      <CabinetFilterGroup
        title="Статус"
        items={items}
        active="open"
        onChange={() => {}}
      />,
    );

    const active = container.querySelector(".cabinet-filter-item.is-active");
    expect(active?.textContent).toContain("Не виконано");
  });

  it("calls onChange with item id", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CabinetFilterGroup
        title="Статус"
        items={items}
        active="all"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^Виконано/ }));
    expect(onChange).toHaveBeenCalledWith("done");
  });
});
