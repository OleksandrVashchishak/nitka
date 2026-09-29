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
  return CABINET_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
