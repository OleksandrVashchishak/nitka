import type { Role } from "@/lib/auth-api";

export function getHomePath(role?: Role | null) {
  return "/dashboard";
}
