import { cleanup, render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CabinetShowMore } from "@/components/cabinet-show-more";
import {
  CABINET_PAGE_SIZE,
  usePagedVisible,
} from "@/hooks/use-paged-visible";

afterEach(() => {
  cleanup();
});

describe("usePagedVisible", () => {
  it("slices to page size and expands on showMore", () => {
    const items = Array.from({ length: 30 }, (_, i) => i);
    const { result } = renderHook(() => usePagedVisible(items));

    expect(result.current.visible).toHaveLength(CABINET_PAGE_SIZE);
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.showMore();
    });

    expect(result.current.visible).toHaveLength(CABINET_PAGE_SIZE * 2);
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.showMore();
    });

    expect(result.current.visible).toHaveLength(30);
    expect(result.current.hasMore).toBe(false);
  });

  it("resets when resetDeps change", () => {
    const items = Array.from({ length: 30 }, (_, i) => i);
    const { result, rerender } = renderHook(
      ({ filter }) => usePagedVisible(items, { resetDeps: [filter] }),
      { initialProps: { filter: "a" } },
    );

    act(() => {
      result.current.showMore();
    });
    expect(result.current.visible).toHaveLength(CABINET_PAGE_SIZE * 2);
    expect(result.current.hasMore).toBe(true);

    rerender({ filter: "b" });
    expect(result.current.visible).toHaveLength(CABINET_PAGE_SIZE);
    expect(result.current.hasMore).toBe(true);
  });

  it("hasMore is false when list fits one page", () => {
    const { result } = renderHook(() =>
      usePagedVisible([1, 2, 3], { pageSize: 12 }),
    );
    expect(result.current.hasMore).toBe(false);
    expect(result.current.visible).toEqual([1, 2, 3]);
  });
});

describe("CabinetShowMore", () => {
  it("renders nothing when hasMore is false", () => {
    const { container } = render(
      <CabinetShowMore hasMore={false} onShowMore={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders button and calls onShowMore", async () => {
    const user = userEvent.setup();
    const onShowMore = vi.fn();
    const { container } = render(
      <CabinetShowMore hasMore onShowMore={onShowMore} />,
    );

    const btn = screen.getByRole("button", { name: "Показати більше" });
    expect(btn.className).toContain("cabinet-show-more");
    expect(container.querySelector(".cabinet-tasks-more")).toBeNull();

    await user.click(btn);
    expect(onShowMore).toHaveBeenCalledTimes(1);
  });

  it("supports custom label", () => {
    render(
      <CabinetShowMore hasMore onShowMore={() => {}} label="Ще" />,
    );
    expect(screen.getByRole("button", { name: "Ще" })).toBeTruthy();
  });
});
