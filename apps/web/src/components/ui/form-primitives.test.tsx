import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IconButton } from "@/components/ui/icon-button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";

afterEach(() => {
  cleanup();
});

describe("IconButton", () => {
  it("renders aria-label and calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton
        aria-label="Додати"
        variant="quick-add"
        icon={<span>+</span>}
        onClick={onClick}
      />,
    );
    const btn = screen.getByRole("button", { name: "Додати" });
    expect(btn.className).toContain("fata-icon-button--quick-add");
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Field", () => {
  it("renders label and children", () => {
    render(
      <Field label="Спосіб">
        <button type="button">pick</button>
      </Field>,
    );
    expect(screen.getByText("Спосіб")).toBeTruthy();
    expect(screen.getByRole("button", { name: "pick" })).toBeTruthy();
  });
});

describe("Textarea", () => {
  it("renders labeled control and supports plain mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Textarea label="Текст" value="hi" onChange={onChange} />,
    );
    expect(screen.getByLabelText("Текст")).toBeTruthy();
    await user.type(screen.getByLabelText("Текст"), "!");
    expect(onChange).toHaveBeenCalled();

    rerender(
      <Textarea
        plain
        inputClassName="we-blocks__textarea"
        aria-label="plain"
        defaultValue="x"
      />,
    );
    expect(screen.getByLabelText("plain").className).toBe(
      "we-blocks__textarea",
    );
  });
});

describe("DateInput", () => {
  it("shows placeholder when empty and hides when valued", () => {
    const { rerender, container } = render(
      <DateInput label="Дедлайн" value="" onChange={() => {}} />,
    );
    expect(screen.getByLabelText("Дедлайн")).toBeTruthy();
    expect(container.querySelector(".fata-date-input__placeholder")).toBeTruthy();

    rerender(
      <DateInput label="Дедлайн" value="2026-10-01" onChange={() => {}} />,
    );
    expect(container.querySelector(".fata-date-input__placeholder")).toBeNull();
    expect(container.querySelector(".fata-date-input__control.has-value")).toBeTruthy();
  });
});
