"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { RequireAuth } from "@/components/require-auth";
import { PageLoader } from "@/components/ui-loader";
import { WebsiteEmptyState } from "@/components/website/website-empty-state";
import { WebsiteInvitesPanel } from "@/components/website/website-invites-panel";
import { WebsiteSummary } from "@/components/website/website-summary";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  getGuestList,
  updateGuest,
  type Guest,
} from "@/lib/guests-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { getErrorMessage, toast } from "@/lib/toast";
import {
  getMyWebsite,
  upsertMyWebsite,
  type WebsiteMineResponse,
  type WeddingWebsite,
} from "@/lib/website-api";
import "@/app/website/styles/index.scss";

const COVER_FALLBACK = "/landing/couple.jpg";

function formatUaDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function formatEditDate(iso: string) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  } catch {
    return iso.slice(0, 10);
  }
}

function genitiveFirst(name: string) {
  const first = name.trim().split(/\s+/)[0] || name;
  if (first.endsWith("я") || first.endsWith("а")) {
    return `${first.slice(0, -1)}і`;
  }
  if (first.endsWith("й")) return `${first.slice(0, -1)}я`;
  if (first.endsWith("о")) return `${first}а`;
  return first;
}

function markInvitedNotes(notes: string | null): string | undefined {
  const raw = notes ?? "";
  if (raw.includes("[invited]")) return raw || undefined;
  return `${raw} [invited]`.trim() || "[invited]";
}

function WebsiteDashboardInner() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needWedding, setNeedWedding] = useState(false);
  const [mine, setMine] = useState<WebsiteMineResponse | null>(null);
  const [site, setSite] = useState<WeddingWebsite | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [profileInitials, setProfileInitials] = useState("П");
  const [ownerInitial, setOwnerInitial] = useState("О");
  const [partnerInitial, setPartnerInitial] = useState("Р");
  const [origin, setOrigin] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [websiteRes, guestsRes, wedding, notif] = await Promise.all([
        getMyWebsite(),
        getGuestList().catch(() => null),
        getMyWedding().catch(() => null),
        getNotificationsSummary().catch(() => null),
      ]);
      setMine(websiteRes);
      setSite(websiteRes.site);
      setGuests(guestsRes?.guests ?? []);
      setSummary(notif);
      setNeedWedding(!wedding);

      const one = wedding?.partnerOneName?.trim() || "О";
      const two = wedding?.partnerTwoName?.trim() || "Р";
      setOwnerInitial(one.charAt(0).toUpperCase() || "О");
      setPartnerInitial(two.charAt(0).toUpperCase() || "Р");
      setProfileInitials(
        `${one.charAt(0) || "О"}&${two.charAt(0) || "Р"}`.toUpperCase(),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалось завантажити сайт"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function onCreate() {
    if (!mine) return;
    setCreating(true);
    setError(null);
    try {
      const templateId = mine.templates[0]?.id ?? "classic-white";
      const created = await upsertMyWebsite({
        slug: mine.suggestedSlug || mine.site?.slug,
        templateId,
        published: false,
        content: mine.defaults,
      });
      setSite(created);
      toast.success("Чернетку збережено");
      router.push("/website/edit");
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалось створити сайт"));
    } finally {
      setCreating(false);
    }
  }

  async function onPublish() {
    if (!site) return;
    setBusy(true);
    try {
      const next = await upsertMyWebsite({ published: true });
      setSite(next);
      toast.success("Опубліковано");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось опублікувати"));
    } finally {
      setBusy(false);
    }
  }

  async function onUnpublish() {
    if (!site) return;
    setBusy(true);
    try {
      const next = await upsertMyWebsite({ published: false });
      setSite(next);
      toast.success("Публікацію скасовано");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось оновити публікацію"));
    } finally {
      setBusy(false);
    }
  }

  async function onCopyLink() {
    if (!site) return;
    const url = `${origin}${site.publicPath}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Лінк скопійовано");
    } catch {
      toast.error("Не вдалось скопіювати");
    }
  }

  function onEdit() {
    router.push("/website/edit");
  }

  async function onMarkSent(guestId: string) {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) return;
    try {
      const updated = await updateGuest(guestId, {
        notes: markInvitedNotes(guest.notes),
      });
      setGuests((list) => list.map((g) => (g.id === guestId ? updated : g)));
      toast.success("Позначено як надіслано");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось оновити статус"));
    }
  }

  async function onMarkAllSent() {
    const pending = guests.filter(
      (g) => !(g.notes ?? "").includes("[invited]") && !g.respondedAt,
    );
    if (pending.length === 0) return;
    setSendingAll(true);
    try {
      const updatedList = [...guests];
      for (const guest of pending) {
        const updated = await updateGuest(guest.id, {
          notes: markInvitedNotes(guest.notes),
        });
        const idx = updatedList.findIndex((g) => g.id === guest.id);
        if (idx >= 0) updatedList[idx] = updated;
      }
      setGuests(updatedList);
      toast.success("Усіх позначено як надіслано");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось надіслати всім"));
    } finally {
      setSendingAll(false);
    }
  }

  if (loading) {
    return (
      <div className="ws-dashboard">
        <PageLoader label="Завантажуємо сайт…" />
      </div>
    );
  }

  if (needWedding) {
    return (
      <div className="ws-dashboard">
        <div className="ws-dashboard__top">
          <h1 className="ws-dashboard__title">Сайт-запрошення</h1>
          <div className="ws-dashboard__actions">
            <CabinetNotificationsBell summary={summary} />
            <CabinetProfileMenu initials={profileInitials} />
          </div>
        </div>
        <section className="ws-empty">
          <h2 className="ws-empty__title">Спочатку створи весілля</h2>
          <p className="ws-empty__text">
            Імена й дата підтягнуться в сайт-запрошення автоматично.
          </p>
          <div className="ws-empty__cta">
            <Link href="/dashboard" className="ws-btn ws-btn--solid">
              До огляду
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const one = site?.wedding.partnerOneName?.trim() || "Пара";
  const two = site?.wedding.partnerTwoName?.trim() || "";
  const names = two ? `${one} & ${two}` : one;
  const dateLabel = site?.wedding.date
    ? formatUaDate(site.wedding.date)
    : "";
  const description = two
    ? `Запрошення на весілля ${genitiveFirst(one)} і ${genitiveFirst(two)}${
        dateLabel ? ` ${dateLabel}` : ""
      }`
    : `Запрошення на весілля${dateLabel ? ` ${dateLabel}` : ""}`;
  const coverUrl =
    site?.content.coupleImageUrl ||
    site?.content.heroImageUrl ||
    COVER_FALLBACK;
  const displayUrl = site
    ? `${origin.replace(/^https?:\/\//, "")}${site.publicPath}`
    : "";
  const publicHref = site ? `${origin}${site.publicPath}` : "#";

  const summaryVariant = !site
    ? null
    : site.published
      ? "published"
      : site.publishedAt
        ? "unpublished"
        : "draft";

  return (
    <div className="ws-dashboard">
      <div className="ws-dashboard__top">
        <h1 className="ws-dashboard__title">Сайт-запрошення</h1>
        <div className="ws-dashboard__actions">
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={profileInitials} />
        </div>
      </div>

      {error ? <p className="ws-dashboard__error">{error}</p> : null}

      {!site || !summaryVariant ? (
        <WebsiteEmptyState creating={creating} onCreate={() => void onCreate()} />
      ) : summaryVariant === "published" ? (
        <div className="ws-dashboard__layout">
          <div className="ws-dashboard__col">
            <WebsiteSummary
              variant="published"
              coverUrl={coverUrl}
              names={names}
              description={description}
              displayUrl={displayUrl}
              publicHref={publicHref}
              busy={busy}
              onCopyLink={() => void onCopyLink()}
              onPublish={() => void onPublish()}
              onUnpublish={() => void onUnpublish()}
              onEdit={onEdit}
            />
          </div>
          <div className="ws-dashboard__col ws-dashboard__col--right">
            <WebsiteInvitesPanel
              guests={guests}
              ownerInitial={ownerInitial}
              partnerInitial={partnerInitial}
              onMarkSent={(id) => void onMarkSent(id)}
              onMarkAllSent={() => void onMarkAllSent()}
              sendingAll={sendingAll}
            />
          </div>
        </div>
      ) : (
        <div className="ws-dashboard__solo">
          <WebsiteSummary
            variant={summaryVariant}
            coverUrl={coverUrl}
            names={names}
            description={description}
            displayUrl={displayUrl}
            publicHref={publicHref}
            lastEditedLabel={formatEditDate(site.updatedAt)}
            busy={busy}
            onCopyLink={() => void onCopyLink()}
            onPublish={() => void onPublish()}
            onUnpublish={() => void onUnpublish()}
            onEdit={onEdit}
          />
        </div>
      )}
    </div>
  );
}

export function WebsiteDashboard() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <WebsiteDashboardInner />
    </RequireAuth>
  );
}
