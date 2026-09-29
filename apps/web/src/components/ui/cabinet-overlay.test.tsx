import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

beforeEach(() => {
  vi.useRealTimers();
});

describe("CabinetOverlay", () => {
  it("does not render when closed", () => {
    render(
      <CabinetOverlay open={false} onClose={() => {}} title="Тест">
        body
      </CabinetOverlay>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("mounts into document.body and gets is-open after rAF", async () => {
    render(
      <CabinetOverlay open onClose={() => {}} title="Додати завдання">
        body
      </CabinetOverlay>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog.parentElement).toBe(document.body);

    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    expect(dialog.className).toContain("is-open");
    expect(dialog.className).toContain("cabinet-drawer-root");
  });

  it("calls onClose on Escape and backdrop click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CabinetOverlay open onClose={onClose} title="Форма">
        content
      </CabinetOverlay>,
    );

    await act(async () => {
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
      );
    });

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    const backdrop = document.querySelector(
      ".cabinet-drawer-backdrop",
    ) as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when closeOnEscape is false", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CabinetOverlay
        open
        onClose={onClose}
        title="Locked"
        closeOnEscape={false}
      >
        content
      </CabinetOverlay>,
    );

    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when closeDisabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CabinetOverlay open onClose={onClose} title="Busy" closeDisabled>
        content
      </CabinetOverlay>,
    );

    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();

    const backdrop = document.querySelector(
      ".cabinet-drawer-backdrop",
    ) as HTMLButtonElement;
    expect(backdrop.disabled).toBe(true);
  });

  it("sets --cabinet-overlay-width from width prop", async () => {
    render(
      <CabinetOverlay open onClose={() => {}} title="W" width={500}>
        body
      </CabinetOverlay>,
    );

    await screen.findByRole("dialog");
    const panel = document.querySelector(".cabinet-drawer") as HTMLElement;
    expect(panel.style.getPropertyValue("--cabinet-overlay-width")).toBe(
      "500px",
    );
  });

  it("uses modal root classes for variant=modal", async () => {
    render(
      <CabinetOverlay
        open
        onClose={() => {}}
        title="Modal"
        variant="modal"
        width={480}
      >
        body
      </CabinetOverlay>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog.className).toContain("cabinet-modal-root");
    expect(dialog.getAttribute("data-variant")).toBe("modal");
    expect(dialog.getAttribute("data-mobile-variant")).toBe("fullscreen");
  });

  it("uses confirm layout for variant=confirm", async () => {
    render(
      <CabinetOverlay
        open
        onClose={() => {}}
        title="Видалити?"
        variant="confirm"
        footer={<button type="button">Так</button>}
      >
        <p>Опис</p>
      </CabinetOverlay>,
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog.getAttribute("data-variant")).toBe("confirm");
    expect(document.querySelector(".cabinet-confirm-modal")).toBeTruthy();
    expect(
      document.querySelector(".cabinet-confirm-modal__title")?.textContent,
    ).toBe("Видалити?");
  });

  it("locks body scroll while mounted", async () => {
    vi.useFakeTimers();
    const { rerender, unmount } = render(
      <CabinetOverlay open onClose={() => {}} title="Scroll">
        body
      </CabinetOverlay>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <CabinetOverlay open={false} onClose={() => {}} title="Scroll">
        body
      </CabinetOverlay>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    unmount();
    vi.useRealTimers();
  });

  it("unmounts after exit delay", async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <CabinetOverlay open onClose={() => {}} title="Exit">
        body
      </CabinetOverlay>,
    );

    expect(screen.getByRole("dialog")).toBeTruthy();

    rerender(
      <CabinetOverlay open={false} onClose={() => {}} title="Exit">
        body
      </CabinetOverlay>,
    );

    expect(screen.getByRole("dialog")).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(320);
    });

    expect(screen.queryByRole("dialog")).toBeNull();
    vi.useRealTimers();
  });
});
