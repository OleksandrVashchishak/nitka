import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CabinetMobileFiltersBar } from "@/components/cabinet-mobile-filters-bar";

afterEach(() => {
  cleanup();
});

const SORT_OPTIONS = [
  { value: "recent", label: "Недавно додані" },
  { value: "alpha", label: "За алфавітом" },
];

describe("CabinetMobileFiltersBar", () => {
  it("renders filters chip and sort options", () => {
    render(
      <CabinetMobileFiltersBar
        onOpenFilters={() => {}}
        sortValue="recent"
        onSortChange={() => {}}
        sortOptions={SORT_OPTIONS}
      />,
    );

    expect(screen.getByRole("button", { name: /Фільтри/ })).toBeTruthy();
    expect(screen.getByLabelText("Сортування")).toBeTruthy();
    expect(screen.getByRole("option", { name: "За алфавітом" })).toBeTruthy();
  });

  it("marks filters active and shows badge when count > 0", () => {
    const { container } = render(
      <CabinetMobileFiltersBar
        onOpenFilters={() => {}}
        filtersActive
        activeFilterCount={3}
        sortValue="recent"
        onSortChange={() => {}}
        sortOptions={SORT_OPTIONS}
      />,
    );

    expect(container.querySelector(".cabinet-tasks-chip.is-active")).toBeTruthy();
    expect(container.querySelector(".cabinet-tasks-chip-badge")?.textContent).toBe(
      "3",
    );
  });

  it("does not show badge without activeFilterCount", () => {
    const { container } = render(
      <CabinetMobileFiltersBar
        onOpenFilters={() => {}}
        filtersActive
        sortValue="recent"
        onSortChange={() => {}}
        sortOptions={SORT_OPTIONS}
      />,
    );

    expect(container.querySelector(".cabinet-tasks-chip-badge")).toBeNull();
  });

  it("calls onOpenFilters and onSortChange", async () => {
    const user = userEvent.setup();
    const onOpenFilters = vi.fn();
    const onSortChange = vi.fn();
    render(
      <CabinetMobileFiltersBar
        onOpenFilters={onOpenFilters}
        sortValue="recent"
        onSortChange={onSortChange}
        sortOptions={SORT_OPTIONS}
        className="cabinet-budget-mobile-bar"
      />,
    );

    await user.click(screen.getByRole("button", { name: /Фільтри/ }));
    expect(onOpenFilters).toHaveBeenCalledTimes(1);

    await user.selectOptions(screen.getByLabelText("Сортування"), "alpha");
    expect(onSortChange).toHaveBeenCalledWith("alpha");
  });
});
