import type { Role } from "@/lib/auth-api";

export function getHomePath(role?: Role | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "VENDOR") return "/vendor/dashboard";
  return "/dashboard";
}
