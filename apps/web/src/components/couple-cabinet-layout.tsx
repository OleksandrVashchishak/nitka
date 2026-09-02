"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import "../app/couple-cabinet.css";

const CabinetCtx = createContext(false);
export function useCoupleCabinet() {
  return useContext(CabinetCtx);
}

const NAV = [
  { href: "/dashboard", label: "Огляд", icon: "overview" },
  { href: "/checklist", label: "Завдання", icon: "tasks" },
  { href: "/guests", label: "Гості", icon: "guests" },
  { href: "/my-vendors", label: "Підрядники", icon: "vendors" },
  { href: "/budget", label: "Бюджет", icon: "budget" },
  { href: "/website", label: "Сайт-запрошення", icon: "website" },
  { href: "/seating", label: "Розсадка", icon: "seating" },
  { href: "/day-plan", label: "План дня", icon: "day" },
  { href: "/blog", label: "Дошка натхнення", icon: "board" },
] as const;

function activePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/blog") return pathname.startsWith("/blog");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CoupleCabinetLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <CabinetCtx.Provider value={true}>
      <div className="cabinet-ui min-h-screen bg-[#F6F3EC] text-ink">
        <button
          type="button"
          className="fixed left-4 top-4 z-50 rounded-full bg-[#1a1a1a] px-3 py-2 text-sm text-white lg:hidden"
          onClick={() => setOpen(true)}
        >
          Меню
        </button>
        {open ? (
          <button
            type="button"
            aria-label="Закрити меню"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <CoupleSidebar open={open} onClose={() => setOpen(false)} />
        <div className="min-h-screen lg:pl-[256px]">{children}</div>
      </div>
    </CabinetCtx.Provider>
  );
}

function CoupleSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`cabinet-sidebar fixed inset-y-0 left-0 z-50 flex flex-col transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link href="/dashboard" onClick={onClose} className="cabinet-sidebar-logo">
        fata.studi<span className="cabinet-logo-dot">o</span>
      </Link>

      <nav className="cabinet-nav flex-1 overflow-y-auto">
        {NAV.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`cabinet-nav-link${activePath(pathname, link.href) ? " is-active" : ""}`}
          >
            <NavIcon name={link.icon} />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="cabinet-app-card">
        <h3>Мобільний застосунок</h3>
        <p>Керуйте весіллям з телефону — задачі, гості та бюджет завжди під рукою.</p>
        <div className="cabinet-app-row">
          <div className="cabinet-app-qr" aria-hidden>
            <svg viewBox="0 0 60 60" width="60" height="60">
              <rect width="60" height="60" fill="#fff" />
              <rect x="4" y="4" width="16" height="16" fill="#1a1a1a" />
              <rect x="40" y="4" width="16" height="16" fill="#1a1a1a" />
              <rect x="4" y="40" width="16" height="16" fill="#1a1a1a" />
              <rect x="24" y="24" width="4" height="4" fill="#1a1a1a" />
              <rect x="32" y="24" width="4" height="4" fill="#1a1a1a" />
              <rect x="24" y="32" width="4" height="4" fill="#1a1a1a" />
              <rect x="40" y="40" width="4" height="4" fill="#1a1a1a" />
              <rect x="48" y="48" width="4" height="4" fill="#1a1a1a" />
            </svg>
          </div>
        </div>
        <Link href="/" className="cabinet-app-btn">
          Скачати застосунок
        </Link>
      </div>
    </aside>
  );
}

function NavIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "overview":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "tasks":
      return (
        <svg {...common}>
          <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      );
    case "guests":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "vendors":
      return (
        <svg {...common}>
          <path d="M3 9h18v11H3zM8 9V6a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "budget":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M2 10h20M16 15h.01" />
        </svg>
      );
    case "website":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" />
        </svg>
      );
    case "seating":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
        </svg>
      );
    case "day":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4zM8 10h8M8 14h5" />
        </svg>
      );
  }
}
