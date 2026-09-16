"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CabinetBottomNav } from "@/components/cabinet-bottom-nav";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { createPartnerInvite, getMyWedding } from "@/lib/dashboard-api";
import { toast } from "@/lib/toast";
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
  return (
    <CabinetCtx.Provider value={true}>
      <div className="cabinet-ui min-h-screen text-ink">
        <CoupleSidebar />
        <div className="cabinet-main min-h-screen lg:pl-[256px]">{children}</div>
        <CabinetBottomNav />
      </div>
    </CabinetCtx.Provider>
  );
}

function CoupleSidebar() {
  const pathname = usePathname();
  const showInvite = pathname.startsWith("/checklist");

  return (
    <aside className="cabinet-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col lg:flex">
      <Link href="/dashboard" className="cabinet-sidebar-logo">
        fata.studi<span className="cabinet-logo-dot">o</span>
      </Link>

      <nav className="cabinet-nav flex-1 overflow-y-auto">
        {NAV.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`cabinet-nav-link${activePath(pathname, link.href) ? " is-active" : ""}`}
          >
            <CabinetNavIcon name={link.icon} />
            {link.label}
          </Link>
        ))}
      </nav>

      {showInvite ? <SidebarInviteCard /> : <SidebarAppCard />}
    </aside>
  );
}

function SidebarAppCard() {
  return (
    <div className="cabinet-app-card">
        <h3>Мобільний застосунок</h3>
        <p>Нехай все, що стосується вашого весілля, завжди буде у вас в кишені.</p>
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
  );
}

function SidebarInviteCard() {
  const [busy, setBusy] = useState(false);
  const [partnerName, setPartnerName] = useState("партнера");

  useEffect(() => {
    void getMyWedding()
      .then((wedding) => {
        const name = wedding?.partnerTwoName?.trim().split(/\s+/)[0];
        if (name) setPartnerName(name);
      })
      .catch(() => undefined);
  }, []);

  async function onInvite() {
    setBusy(true);
    try {
      const invite = await createPartnerInvite();
      const url = `${window.location.origin}${invite.path}`;
      await navigator.clipboard.writeText(url);
      toast.success("Лінк скопійовано", "Надішли партнеру — діятиме 14 днів");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не створено лінк");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cabinet-app-card cabinet-invite-card">
      <div className="cabinet-invite-icon" aria-hidden>
        +
      </div>
      <div>
        <h3>Запросіть {partnerName}</h3>
        <p>Додайте партнера до кабінету — разом ведіть задачі, гостей і бюджет.</p>
      </div>
      <button
        type="button"
        className="cabinet-app-btn"
        disabled={busy}
        onClick={() => void onInvite()}
      >
        {busy ? "…" : "Запросити"}
      </button>
    </div>
  );
}

