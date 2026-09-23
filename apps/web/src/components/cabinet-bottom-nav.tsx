"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { CabinetMoreMenu } from "@/components/cabinet-more-menu";

const BOTTOM_TABS = [
  { href: "/dashboard", label: "Огляд", icon: "overview" },
  { href: "/checklist", label: "Завдання", icon: "tasks" },
  { href: "/guests", label: "Гості", icon: "guests" },
  { href: "/budget", label: "Бюджет", icon: "budget" },
] as const;

const MORE_PREFIXES = [
  "/my-vendors",
  "/seating",
  "/day-plan",
  "/blog",
  "/settings",
  "/website",
];

function isTabActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isMoreRoute(pathname: string) {
  return MORE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function CabinetBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const moreActive = moreOpen || isMoreRoute(pathname);

  return (
    <>
      <CabinetMoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
      <nav className="cabinet-bottom-nav" aria-label="Основна навігація">
        {BOTTOM_TABS.map((tab) => {
          const active = !moreOpen && isTabActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`cabinet-bottom-nav-item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => setMoreOpen(false)}
            >
              <CabinetNavIcon name={tab.icon} size={24} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className={`cabinet-bottom-nav-item${moreActive ? " is-active" : ""}`}
          aria-expanded={moreOpen}
          aria-controls="cabinet-more-menu"
          onClick={() => setMoreOpen((open) => !open)}
        >
          <CabinetNavIcon name="more" size={24} />
          <span>Ще</span>
        </button>
      </nav>
    </>
  );
}
