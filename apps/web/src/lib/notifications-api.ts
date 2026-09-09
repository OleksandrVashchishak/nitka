import { apiFetch } from "@/lib/client-api";

export type NotificationItem = {
  key: string;
  label: string;
  count: number;
  href: string;
};

export type NotificationFeedItem = {
  id: string;
  body: string;
  href: string;
  createdAt: string;
  isNew: boolean;
  actionLabel?: string;
  actionHref?: string;
};

export type NotificationsSummary = {
  role: string;
  total: number;
  newCount?: number;
  items: NotificationItem[];
  feed?: NotificationFeedItem[];
  moreHref?: string;
  newRequests?: number;
  pendingRsvp?: number;
  newRsvp?: number;
  waitingRequests?: number;
  vendorReplied?: number;
};

export function getNotificationsSummary() {
  return apiFetch<NotificationsSummary | null>("/api/notifications/summary", {
    silent: true,
  });
}

export function formatNotifyRelativeTime(iso: string, now = Date.now()) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "щойно";
  if (mins < 60) return `${mins} хв тому`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} год тому`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн. тому`;
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });
}

export function newNotificationsWord(n: number) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return "нових";
  if (d === 1) return "нове";
  if (d >= 2 && d <= 4) return "нові";
  return "нових";
}
