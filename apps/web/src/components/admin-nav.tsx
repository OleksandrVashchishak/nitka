"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/content", label: "Контент" },
  { href: "/admin/users", label: "Юзери" },
  { href: "/admin/categories", label: "Категорії" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-full bg-sage px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft hover:border-sage/40"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
