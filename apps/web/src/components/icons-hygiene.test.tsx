import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { IconCalendar } from "@/components/icon-calendar";
import { IconClose } from "@/components/icon-close";
import { IconTrash } from "@/components/icon-trash";
import {
  IconBackArrow,
  IconInspirationFab,
  IconPlus,
  IconShareNodes,
} from "@/components/inspiration-icons";
import { IconFilters, IconQuickAdd } from "@/components/cabinet-task-icons";

afterEach(() => {
  cleanup();
});

describe("shared icons", () => {
  it("renders IconClose / IconCalendar / IconTrash with size", () => {
    const { container } = render(
      <>
        <IconClose size={16} />
        <IconCalendar size={14} />
        <IconTrash size={14} />
      </>,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(3);
    expect(svgs[0].getAttribute("width")).toBe("16");
    expect(svgs[1].getAttribute("width")).toBe("14");
    expect(svgs[2].getAttribute("width")).toBe("14");
  });

  it("renders cabinet task icons without close/calendar", () => {
    const { container } = render(
      <>
        <IconQuickAdd />
        <IconFilters />
      </>,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("renders inspiration icons", () => {
    const { container } = render(
      <>
        <IconPlus />
        <IconBackArrow />
        <IconShareNodes />
        <IconInspirationFab />
      </>,
    );
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector(".cabinet-inspiration-fab")).toBeTruthy();
  });
});
