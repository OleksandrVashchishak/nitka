"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";

type NavLink = {
  href: string;
  label: string;
  badgeKeys?: readonly string[];
};

const COUPLE_PRIMARY: NavLink[] = [
  { href: "/dashboard", label: "Огляд" },
  { href: "/checklist", label: "Чекліст" },
  { href: "/day-plan", label: "План дня" },
  { href: "/budget", label: "Бюджет" },
  { href: "/guests", label: "Гості", badgeKeys: ["newRsvp", "pendingRsvp"] },
  { href: "/seating", label: "Розсадка" },
  { href: "/my-vendors", label: "Підрядники" },
];

const COUPLE_MORE: NavLink[] = [
  { href: "/invitations", label: "Запрошення" },
  { href: "/website", label: "Сайт" },
  { href: "/favorites", label: "Обране" },
  {
    href: "/requests",
    label: "Заявки",
    badgeKeys: ["waitingRequests", "vendorReplied"],
  },
];

const VENDOR_LINKS: NavLink[] = [
  { href: "/vendor/dashboard", label: "Огляд", badgeKeys: ["newRequests"] },
  { href: "/vendor/requests", label: "Заявки", badgeKeys: ["newRequests"] },
  { href: "/vendor/profile", label: "Профіль" },
];

type Props = {
  variant: "COUPLE" | "VENDOR";
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav({ variant }: Props) {
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated || !accessToken) return;
    void (async () => {
      try {
        setSummary(await getNotificationsSummary());
      } catch {
        /* keep previous summary to avoid height jump */
      }
    })();
  }, [hydrated, accessToken, pathname]);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function badgeFor(keys?: readonly string[]) {
    if (!keys?.length || !summary) return 0;
    return summary.items
      .filter((i) => keys.includes(i.key))
      .reduce((sum, i) => sum + i.count, 0);
  }

  if (variant === "VENDOR") {
    return (
      <NavShell summary={summary}>
        <nav
          aria-label="Навігація кабінету"
          className="flex max-w-full flex-wrap gap-1 rounded-2xl bg-mist p-1.5"
        >
          {VENDOR_LINKS.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              active={isActive(pathname, link.href)}
              badge={badgeFor(link.badgeKeys)}
            />
          ))}
        </nav>
      </NavShell>
    );
  }

  const moreActive = COUPLE_MORE.some((link) => isActive(pathname, link.href));
  const moreBadge = COUPLE_MORE.reduce(
    (sum, link) => sum + badgeFor(link.badgeKeys),
    0,
  );

  return (
    <NavShell summary={summary}>
      <nav
        aria-label="Навігація кабінету"
        className="flex max-w-full flex-wrap gap-1 rounded-2xl bg-mist p-1.5"
      >
        {COUPLE_PRIMARY.map((link) => (
          <NavItem
            key={link.href}
            link={link}
            active={isActive(pathname, link.href)}
            badge={badgeFor(link.badgeKeys)}
          />
        ))}

        <div ref={moreRef} className="relative">
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((open) => !open)}
            className={`relative inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3.5 text-sm font-medium transition ${
              moreActive || moreOpen
                ? "bg-sage text-white shadow-sm"
                : "text-ink-soft hover:bg-white/80 hover:text-ink"
            }`}
          >
            Ще
            <span className="text-[10px] opacity-80" aria-hidden>
              {moreOpen ? "▴" : "▾"}
            </span>
            {moreBadge > 0 ? (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                  moreActive || moreOpen
                    ? "bg-white/20 text-white"
                    : "bg-sage text-white"
                }`}
              >
                {moreBadge > 99 ? "99+" : moreBadge}
              </span>
            ) : null}
          </button>

          {moreOpen ? (
            <div
              role="menu"
              className="absolute left-0 z-40 mt-1.5 min-w-[11rem] overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-xl sm:left-auto sm:right-0"
            >
              {COUPLE_MORE.map((link) => {
                const active = isActive(pathname, link.href);
                const badge = badgeFor(link.badgeKeys);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition ${
                      active
                        ? "bg-sage/10 font-semibold text-sage-deep"
                        : "text-ink hover:bg-mist"
                    }`}
                  >
                    <span>{link.label}</span>
                    {badge > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sage px-1.5 text-[11px] font-semibold text-white tabular-nums">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </nav>
    </NavShell>
  );
}

function NavItem({
  link,
  active,
  badge,
}: {
  link: NavLink;
  active: boolean;
  badge: number;
}) {
  return (
    <Link
      href={link.href}
      className={`relative inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-sm font-medium transition ${
        active
          ? "bg-sage text-white shadow-sm"
          : "text-ink-soft hover:bg-white/80 hover:text-ink"
      }`}
    >
      <span>{link.label}</span>
      {badge > 0 ? (
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
            active ? "bg-white/20 text-white" : "bg-sage text-white"
          }`}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

function NavShell({
  children,
  summary,
}: {
  children: ReactNode;
  summary: NotificationsSummary | null;
}) {
  return (
    <div className="mb-8">
      {children}

      {summary && summary.items.length > 0 ? (
        <div className="mt-3 flex min-h-8 flex-wrap items-center gap-2">
          {summary.items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="inline-flex h-8 items-center rounded-full bg-white px-3 text-xs font-medium text-sage-deep ring-1 ring-sage/20 transition hover:ring-sage/40"
            >
              {item.label}: {item.count}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-3 min-h-8" aria-hidden />
      )}
    </div>
  );
}
