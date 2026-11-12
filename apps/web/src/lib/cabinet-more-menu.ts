export const OPEN_MORE_MENU_EVENT = "cabinet:open-more-menu";

/** Mobile back arrow on «Ще» pages: opens the «Ще» menu instead of history back */
export function openCabinetMoreMenu() {
  window.dispatchEvent(new Event(OPEN_MORE_MENU_EVENT));
}

/** Pages opened from the «Ще» menu: no bottom nav on mobile, back arrow returns to «Ще» */
const MORE_ROUTE_PREFIXES = [
  "/my-vendors",
  "/seating",
  "/day-plan",
  "/inspiration",
  "/settings",
  "/support",
  "/feedback",
  "/website",
];

export function isCabinetMoreRoute(pathname: string) {
  return MORE_ROUTE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}
