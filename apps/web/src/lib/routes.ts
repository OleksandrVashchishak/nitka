import type { Role } from "@/lib/auth-api";

export function getHomePath(role?: Role | null) {
  return "/dashboard";
}

/** Couple cabinet / app shell routes — hide marketing header & footer. */
const CABINET_PREFIXES = [
  "/dashboard",
  "/checklist",
  "/budget",
  "/guests",
  "/seating",
  "/website",
  "/my-vendors",
  "/settings",
  "/day-plan",
  "/inspiration",
  "/more",
  "/invitations",
] as const;

export function isCabinetPath(pathname: string) {
  // Публічний shared view — без маркетингового хедера, лише свій shell.
  if (pathname.startsWith("/day-plan/shared")) return true;
  // Invite accept — як partner-invite, зі звичайним chrome сайту.
  if (pathname.startsWith("/day-plan/invite")) return false;
  return CABINET_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Internal superadmin — hide marketing header & footer. */
export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
