import { apiFetch } from "@/lib/client-api";

export type NotificationItem = {
  key: string;
  label: string;
  count: number;
  href: string;
};

export type NotificationsSummary = {
  role: string;
  total: number;
  items: NotificationItem[];
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
