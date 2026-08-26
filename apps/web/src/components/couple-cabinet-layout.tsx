"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getMyWedding, type Wedding } from "@/lib/dashboard-api";

const CabinetCtx = createContext(false);
export function useCoupleCabinet() {
  return useContext(CabinetCtx);
}

const PLAN = [
  { href: "/dashboard", label: "Огляд", icon: "overview" },
  { href: "/checklist", label: "Мої задачі", icon: "tasks" },
  { href: "/guests", label: "Гості", icon: "guests" },
  { href: "/my-vendors", label: "Підрядники", icon: "vendors" },
  { href: "/budget", label: "Бюджет", icon: "budget" },
  { href: "/invitations", label: "Запрошення", icon: "invite" },
  { href: "/seating", label: "Розсадка", icon: "seating" },
  { href: "/day-plan", label: "План дня", icon: "day" },
] as const;

const INSPIRE = [
  { href: "/content", label: "Стилі весілля", icon: "styles" },
  { href: "/content", label: "Ідеї", icon: "ideas" },
  { href: "/content", label: "Блог", icon: "blog" },
] as const;

function activePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/content") return pathname.startsWith("/content");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function daysUntil(iso: string) {
  const target = new Date(iso);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.ceil((end.getTime() - start.getTime()) / 86400000);
}

function daysWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return "днів";
  if (d === 1) return "день";
  if (d >= 2 && d <= 4) return "дні";
  return "днів";
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
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
        <div className="min-h-screen lg:pl-[272px]">{children}</div>
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
  const [wedding, setWedding] = useState<Wedding | null>(null);

  useEffect(() => {
    void getMyWedding()
      .then(setWedding)
      .catch(() => setWedding(null));
  }, []);

  const one = firstName(wedding?.partnerOneName || "");
  const two = firstName(wedding?.partnerTwoName || "");
  const coupleLabel = one && two ? `${one} & ${two}` : one || two || "Пара";
  const left = wedding ? daysUntil(wedding.date) : null;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#1a1a1a] text-[#f4f1ea] transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="px-6 pb-5 pt-7">
        <Link href="/dashboard" onClick={onClose} className="inline-flex items-center">
          <img src="/landing/logo-foot.svg" alt="fata.studio" width={154} height={32} />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-6">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          Планування
        </p>
        <div className="space-y-0.5">
          {PLAN.map((link) => (
            <SideLink
              key={link.label}
              href={link.href}
              label={link.label}
              icon={link.icon}
              active={activePath(pathname, link.href)}
              onClick={onClose}
            />
          ))}
        </div>
        <p className="mt-8 px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
          Натхнення
        </p>
        <div className="space-y-0.5">
          {INSPIRE.map((link) => (
            <SideLink
              key={link.label}
              href={link.href}
              label={link.label}
              icon={link.icon}
              active={false}
              onClick={onClose}
            />
          ))}
        </div>
      </nav>

      <div className="px-4 pb-5">
        <Link
          href="/dashboard#wedding-plan"
          onClick={onClose}
          className="mb-3 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <NavIcon name="settings" />
          Налаштування
        </Link>
        <div className="rounded-2xl bg-white/[0.07] px-4 py-3">
          <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm text-white">
            <span aria-hidden>💍</span>
            {coupleLabel}
          </p>
          <p className="mt-1 text-xs text-white/45">
            {left == null
              ? "Кабінет пари"
              : left > 0
                ? `${left} ${daysWord(left)} до весілля`
                : left === 0
                  ? "Весілля сьогодні"
                  : "Весілля вже було"}
          </p>
        </div>
      </div>
    </aside>
  );
}

function SideLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/[0.12] font-medium text-white"
          : "text-white/65 hover:bg-white/5 hover:text-white"
      }`}
    >
      <NavIcon name={icon} />
      {label}
    </Link>
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
    case "invite":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H4zM4 8l8 6 8-6" />
        </svg>
      );
    case "seating":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
        </svg>
      );
    case "day":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "styles":
      return (
        <svg {...common}>
          <path d="M12 3c4 4 7 8 7 11a7 7 0 1 1-14 0c0-3 3-7 7-11Z" />
        </svg>
      );
    case "ideas":
      return (
        <svg {...common}>
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-.6.7-1 1.6-1 2.5V16H9v-.5c0-.9-.4-1.8-1-2.5A6 6 0 0 1 12 3Z" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <path d="M5 5h14v14H5zM8 9h8M8 13h6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a7.8 7.8 0 0 0 .1-2 7.8 7.8 0 0 0-.1-2l2-1.5-2-3.5-2.4 1a7.4 7.4 0 0 0-3.4-2L11.2 2H8.8l-.4 2.5a7.4 7.4 0 0 0-3.4 2l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0-.1 2 7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a7.4 7.4 0 0 0 3.4 2l.4 2.5h2.4l.4-2.5a7.4 7.4 0 0 0 3.4-2l2.4 1 2-3.5-2-1.5Z" />
        </svg>
      );
  }
}
