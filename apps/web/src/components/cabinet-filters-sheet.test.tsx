import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CabinetFiltersSheet } from "@/components/cabinet-filters-sheet";

afterEach(() => {
  cleanup();
});

async function flushOpenAnimation() {
  await act(async () => {
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
  });
}

describe("CabinetFiltersSheet", () => {
  it("does not render when closed", () => {
    render(
      <CabinetFiltersSheet
        open={false}
        onClose={() => {}}
        onApply={() => {}}
        onReset={() => {}}
      >
        body
      </CabinetFiltersSheet>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens with is-open after rAF and renders children", async () => {
    render(
      <CabinetFiltersSheet
        open
        onClose={() => {}}
        onApply={() => {}}
        onReset={() => {}}
      >
        <div>filter groups</div>
      </CabinetFiltersSheet>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(screen.getByText("filter groups")).toBeTruthy();
    expect(screen.getByText("Фільтри")).toBeTruthy();

    await flushOpenAnimation();
    expect(dialog.className).toContain("is-open");
  });

  it("calls onClose from backdrop, close button and Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CabinetFiltersSheet
        open
        onClose={onClose}
        onApply={() => {}}
        onReset={() => {}}
      >
        body
      </CabinetFiltersSheet>,
    );

    await flushOpenAnimation();

    await user.click(screen.getByLabelText("Закрити фільтри"));
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    await user.click(screen.getByLabelText("Закрити"));
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onApply and onReset", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onReset = vi.fn();
    render(
      <CabinetFiltersSheet
        open
        onClose={() => {}}
        onApply={onApply}
        onReset={onReset}
      >
        body
      </CabinetFiltersSheet>,
    );

    await user.click(screen.getByRole("button", { name: "Застосувати" }));
    expect(onApply).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Скинути фільтри" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
