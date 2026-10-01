import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/cabinet-notifications", () => ({
  CabinetNotificationsBell: ({
    summary,
  }: {
    summary: { total?: number } | null;
  }) => (
    <button type="button" aria-label="Сповіщення">
      bell:{summary?.total ?? 0}
    </button>
  ),
}));

vi.mock("@/components/cabinet-profile-menu", () => ({
  CabinetProfileMenu: ({ initials }: { initials: string }) => (
    <button type="button" aria-label="Профіль">
      {initials}
    </button>
  ),
}));

import { CabinetPageHeader } from "@/components/cabinet-page-header";

afterEach(() => {
  cleanup();
});

describe("CabinetPageHeader", () => {
  it("renders title only when no account", () => {
    const { container } = render(<CabinetPageHeader title="Гості" />);
    expect(screen.getByRole("heading", { name: "Гості" })).toBeTruthy();
    expect(container.querySelector(".cabinet-tasks-top-actions")).toBeNull();
  });

  it("renders account cluster with desktop-only class by default", () => {
    const { container } = render(
      <CabinetPageHeader
        title="Завдання"
        summary={{ total: 2 } as never}
        initials="АК"
        actions={<button type="button">add</button>}
      />,
    );

    expect(screen.getByLabelText("Сповіщення")).toBeTruthy();
    expect(screen.getByLabelText("Профіль").textContent).toBe("АК");
    expect(screen.getByRole("button", { name: "add" })).toBeTruthy();
    expect(
      container.querySelector(
        ".cabinet-overview-actions.cabinet-tasks-desktop-actions",
      ),
    ).toBeTruthy();
  });

  it("keeps account visible on mobile when accountDesktopOnly is false", () => {
    const { container } = render(
      <CabinetPageHeader
        title="Налаштування"
        summary={null}
        initials="АК"
        accountDesktopOnly={false}
      />,
    );

    const account = container.querySelector(".cabinet-overview-actions");
    expect(account?.className).not.toContain("cabinet-tasks-desktop-actions");
  });

  it("renders endActions inside account cluster", () => {
    render(
      <CabinetPageHeader
        title="Бюджет"
        summary={null}
        initials="АК"
        endActions={<span>currency</span>}
      />,
    );
    expect(screen.getByText("currency")).toBeTruthy();
  });
});
