"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";

const COUPLE_LINKS = [
  { href: "/dashboard", label: "План весілля" },
  { href: "/budget", label: "Бюджет" },
  { href: "/guests", label: "Гості", badgeKeys: ["newRsvp", "pendingRsvp"] },
  { href: "/invitations", label: "Запрошення" },
  { href: "/website", label: "Сайт" },
  { href: "/favorites", label: "Обране" },
  {
    href: "/requests",
    label: "Заявки",
    badgeKeys: ["waitingRequests", "vendorReplied"],
  },
] as const;

const VENDOR_LINKS = [
  { href: "/vendor/dashboard", label: "Огляд", badgeKeys: ["newRequests"] },
  { href: "/vendor/requests", label: "Заявки", badgeKeys: ["newRequests"] },
  { href: "/vendor/profile", label: "Профіль" },
] as const;

type Props = {
  variant: "COUPLE" | "VENDOR";
};

export function DashboardNav({ variant }: Props) {
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);

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

  const links = variant === "VENDOR" ? VENDOR_LINKS : COUPLE_LINKS;

  function badgeFor(keys?: readonly string[]) {
    if (!keys?.length || !summary) return 0;
    return summary.items
      .filter((i) => keys.includes(i.key))
      .reduce((sum, i) => sum + i.count, 0);
  }

  return (
    <div className="mb-8">
      <nav
        aria-label="Навігація кабінету"
        className="flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-mist p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          const badge = badgeFor(
            "badgeKeys" in link ? link.badgeKeys : undefined,
          );

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition ${
                active
                  ? "bg-sage text-white shadow-sm"
                  : "text-ink-soft hover:bg-white/80 hover:text-ink"
              }`}
            >
              <span>{link.label}</span>
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                  badge > 0
                    ? active
                      ? "bg-white/20 text-white"
                      : "bg-sage text-white"
                    : "invisible"
                }`}
                aria-hidden={badge === 0}
              >
                {badge > 0 ? (badge > 99 ? "99+" : badge) : "0"}
              </span>
            </Link>
          );
        })}
      </nav>

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
