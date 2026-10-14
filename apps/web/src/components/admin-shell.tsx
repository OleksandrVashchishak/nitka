"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RequireSuperadmin } from "@/components/require-superadmin";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";

const NAV = [
  { href: "/admin", label: "Огляд", exact: true },
  { href: "/admin/users", label: "Юзери", exact: false },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminAuthStore((s) => s.logout);
  const email = useAdminAuthStore((s) => s.user?.email);

  return (
    <RequireSuperadmin>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/admin" className="admin-sidebar__brand">
            fata <span>ops</span>
          </Link>
          <nav className="admin-nav">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav__link${active ? " is-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {email ? (
            <div className="admin-muted" style={{ fontSize: 12, padding: "0 12px" }}>
              {email}
            </div>
          ) : null}
          <button
            type="button"
            className="admin-sidebar__logout"
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
          >
            Вийти
          </button>
        </aside>
        <div className="admin-main">{children}</div>
      </div>
    </RequireSuperadmin>
  );
}
