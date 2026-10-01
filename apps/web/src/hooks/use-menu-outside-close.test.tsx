import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { useMenuOutsideClose } from "@/hooks/use-menu-outside-close";

afterEach(() => {
  cleanup();
});

function Harness({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(true);
  useMenuOutsideClose(open, () => {
    setOpen(false);
    onClose();
  });

  if (!open) return <div>closed</div>;

  return (
    <div>
      <div className="cabinet-ctx-menu-wrap">
        <button type="button">inside</button>
      </div>
      <button type="button">outside</button>
    </div>
  );
}

describe("useMenuOutsideClose", () => {
  it("keeps open for inside click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "inside" }));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "inside" })).toBeTruthy();
  });

  it("closes on outside mousedown", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText("closed")).toBeTruthy();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
