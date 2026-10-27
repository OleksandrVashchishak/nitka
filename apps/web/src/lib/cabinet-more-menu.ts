export const OPEN_MORE_MENU_EVENT = "cabinet:open-more-menu";

/** Mobile back arrow on «Ще» pages: opens the «Ще» menu instead of history back */
export function openCabinetMoreMenu() {
  window.dispatchEvent(new Event(OPEN_MORE_MENU_EVENT));
}
