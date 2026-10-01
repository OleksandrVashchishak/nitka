import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CabinetFormActions } from "@/components/cabinet-form-actions";

afterEach(() => {
  cleanup();
});

describe("CabinetFormActions", () => {
  it("renders cancel and save with default labels/classes", () => {
    const { container } = render(
      <CabinetFormActions onCancel={() => {}} />,
    );

    const cancel = screen.getByRole("button", { name: "Скасувати" });
    const save = screen.getByRole("button", { name: "Зберегти" });
    expect(cancel.className).toContain("cabinet-drawer-cancel");
    expect(save.className).toContain("cabinet-drawer-save");
    expect(save.getAttribute("type")).toBe("submit");
    expect(container.querySelector(".fata-button--ink")).toBeTruthy();
  });

  it("calls onCancel and supports button save", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onSave = vi.fn();
    render(
      <CabinetFormActions
        onCancel={onCancel}
        saveType="button"
        onSave={onSave}
        saveLabel="Додати"
        saveTone="black"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Скасувати" }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Додати" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Додати" }).className,
    ).toContain("fata-button--black");
  });

  it("honors disabled and loading on save", () => {
    render(
      <CabinetFormActions
        onCancel={() => {}}
        saveDisabled
        saveLoading
        saveLoadingText="…"
      />,
    );

    expect(screen.getByRole("button", { name: "…" })).toBeDisabled();
  });
});
