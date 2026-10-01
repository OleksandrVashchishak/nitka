"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { PageLoader } from "@/components/ui-loader";
import { RequireAuth } from "@/components/require-auth";
import { SettingsDeleteAccountModal } from "@/components/settings/settings-delete-account-modal";
import { SettingsNotificationsPanel } from "@/components/settings/settings-notifications-panel";
import type { NotifPrefs } from "@/components/settings/settings-notifications-panel";
import { SettingsProfilePanel } from "@/components/settings/settings-profile-panel";
import { SettingsSecurityPanel } from "@/components/settings/settings-security-panel";
import type { SettingsSession } from "@/components/settings/settings-security-panel";
import type {
  PartnerInviteInfo,
  PartnerInviteStatus,
} from "@/components/settings/settings-partner-card";
import {
  SettingsSideNav,
  type SettingsTab,
} from "@/components/settings/settings-side-nav";
import {
  changePasswordRequest,
  deleteAccountRequest,
} from "@/lib/auth-api";
import { uploadFile } from "@/lib/client-api";
import {
  createPartnerInvite,
  getMyWedding,
  removePartner,
  upsertWedding,
  type Wedding,
} from "@/lib/dashboard-api";
import {
  getNotificationPrefs,
  getNotificationsSummary,
  updateNotificationPrefs,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";
import "@/styles/cabinet/settings.scss";

const DEFAULT_NOTIF_PREFS: NotifPrefs = {
  guestRsvp: true,
  upcomingPayments: false,
  taskDeadlines: false,
  partnerChanges: false,
  push: true,
  email: true,
};

function deviceLabelFromUa(ua: string) {
  let browser = "Браузер";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return `${browser} (${os})`;
}

function buildCurrentSession(userName: string): SettingsSession {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const initial = (userName.trim().charAt(0) || "Я").toUpperCase();
  return {
    id: "current",
    initial,
    device: deviceLabelFromUa(ua),
    when: "Зараз",
  };
}
function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

function formatShortDate(iso: string) {
  const raw = iso.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return "";
  const [, yyyy, mm, dd] = match;
  return `${dd}.${mm}.${yyyy.slice(-2)}`;
}

function coupleLabel(wedding: Wedding | null, fallbackName: string) {
  const one = firstName(wedding?.partnerOneName || fallbackName);
  const two = firstName(wedding?.partnerTwoName || "");
  if (one && two) return `${one} & ${two}`;
  return one || two || "Пара";
}

function pendingInviteKey(weddingId: string) {
  return `fata-partner-invite-pending:${weddingId}`;
}

function loadPendingInvite(weddingId: string): PartnerInviteInfo | null {
  try {
    const raw = localStorage.getItem(pendingInviteKey(weddingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PartnerInviteInfo;
    if (!parsed?.name || !parsed?.email) return null;
    return { name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

function savePendingInvite(weddingId: string, invite: PartnerInviteInfo) {
  try {
    localStorage.setItem(pendingInviteKey(weddingId), JSON.stringify(invite));
  } catch {
    /* ignore */
  }
}

function clearPendingInvite(weddingId: string) {
  try {
    localStorage.removeItem(pendingInviteKey(weddingId));
  } catch {
    /* ignore */
  }
}

function partnerFromWedding(
  wedding: Wedding | null,
): {
  status: PartnerInviteStatus;
  partner: PartnerInviteInfo | null;
} {
  const member = (wedding?.members ?? []).find((m) => m.role === "PARTNER");
  if (member) {
    return {
      status: "confirmed",
      partner: {
        name: member.user.name,
        email: member.user.email,
      },
    };
  }

  if (wedding?.id) {
    const pending = loadPendingInvite(wedding.id);
    if (pending) {
      return { status: "pending", partner: pending };
    }
  }

  return { status: "form", partner: null };
}

function CoupleSettingsInner() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [initials, setInitials] = useState("П");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [savedWeddingDate, setSavedWeddingDate] = useState("");
  const [partnerStatus, setPartnerStatus] =
    useState<PartnerInviteStatus>("form");
  const [partner, setPartner] = useState<PartnerInviteInfo | null>(null);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [pendingInvite, setPendingInvite] =
    useState<PartnerInviteInfo | null>(null);
  const [sessions, setSessions] = useState<SettingsSession[]>([]);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF_PREFS);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    setSessions([buildCurrentSession(user?.name || name || "")]);
  }, [user?.name, name]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [weddingData, summaryData, prefsData] = await Promise.all([
          getMyWedding(),
          getNotificationsSummary().catch(() => null),
          getNotificationPrefs().catch(() => null),
        ]);
        if (cancelled) return;
        setWedding(weddingData);
        setSummary(summaryData);
        if (prefsData) setNotifPrefs(prefsData);

        const displayName =
          weddingData?.partnerOneName?.trim() || user?.name?.trim() || "";
        setName(displayName);
        setSavedName(displayName);
        const dateValue = weddingData?.date?.slice(0, 10) || "";
        setWeddingDate(dateValue);
        setSavedWeddingDate(dateValue);

        const one = displayName.trim().charAt(0).toUpperCase();
        const two = (weddingData?.partnerTwoName || "")
          .trim()
          .charAt(0)
          .toUpperCase();
        setInitials(one && two ? `${one}&${two}` : one || two || "П");

        const invite = partnerFromWedding(weddingData);
        setPartnerStatus(invite.status);
        setPartner(invite.partner);
        setPendingInvite(
          invite.status === "pending" || invite.status === "rejected"
            ? invite.partner
            : null,
        );
        if (invite.status === "confirmed" && weddingData?.id) {
          clearPendingInvite(weddingData.id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.name]);

  async function persistWeddingPatch(
    patch: Partial<{
      partnerOneName: string;
      partnerTwoName: string;
      couplePhotoUrl: string | null;
      date: string;
    }>,
  ) {
    if (!wedding) return null;
    const updated = await upsertWedding({
      date: wedding.date,
      city: wedding.city,
      guests: wedding.guests,
      budget: wedding.budget,
      partnerOneName: wedding.partnerOneName,
      partnerTwoName: wedding.partnerTwoName,
      couplePhotoUrl: wedding.couplePhotoUrl,
      planningStage: wedding.planningStage,
      cityUndecided: wedding.cityUndecided,
      guestsUndecided: wedding.guestsUndecided,
      ...patch,
    });
    setWedding(updated);
    return updated;
  }

  async function onNameBlur() {
    const next = name.trim();
    if (!next || next === savedName.trim()) return;
    try {
      await persistWeddingPatch({ partnerOneName: next });
      setSavedName(next);
      const one = next.charAt(0).toUpperCase();
      const two = (wedding?.partnerTwoName || "").trim().charAt(0).toUpperCase();
      setInitials(one && two ? `${one}&${two}` : one || two || "П");
      toast.success("Імʼя збережено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не збережено");
      setName(savedName);
    }
  }

  async function onWeddingDateBlur() {
    const next = weddingDate.trim();
    if (!next || next === savedWeddingDate.trim()) return;
    try {
      await persistWeddingPatch({ date: next });
      setSavedWeddingDate(next);
      toast.success("Дату збережено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не збережено");
      setWeddingDate(savedWeddingDate);
    }
  }

  async function onPhotoPick(file: File) {
    setPhotoBusy(true);
    try {
      const uploaded = await uploadFile(file);
      await persistWeddingPatch({ couplePhotoUrl: uploaded.url });
      toast.success("Фото оновлено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не завантажено фото");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function onPasswordSubmit(input: {
    currentPassword: string;
    newPassword: string;
  }) {
    if (!accessToken) {
      toast.error("Сесію завершено", "Увійди знову");
      return;
    }
    setPasswordBusy(true);
    try {
      const data = await changePasswordRequest(accessToken, input);
      useAuthStore.setState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success("Пароль змінено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не змінено пароль");
      throw err;
    } finally {
      setPasswordBusy(false);
    }
  }

  async function copyInviteLink() {
    const invite = await createPartnerInvite();
    const url = `${window.location.origin}${invite.path}`;
    await navigator.clipboard.writeText(url);
    toast.success("Лінк скопійовано", "Надішли партнеру — діятиме 14 днів");
  }

  async function onSendInvite(input: { name: string; email: string }) {
    setInviteBusy(true);
    try {
      if (input.name) {
        await persistWeddingPatch({ partnerTwoName: input.name });
      }
      await copyInviteLink();
      setPendingInvite(input);
      setPartner(input);
      setPartnerStatus("pending");
      if (wedding?.id) savePendingInvite(wedding.id, input);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не створено лінк");
    } finally {
      setInviteBusy(false);
    }
  }

  async function onResendInvite() {
    setInviteBusy(true);
    try {
      await copyInviteLink();
      if (partnerStatus === "rejected") {
        setPartnerStatus("pending");
        if (wedding?.id && partner) savePendingInvite(wedding.id, partner);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не створено лінк");
    } finally {
      setInviteBusy(false);
    }
  }

  function onSendOtherEmail() {
    setPartnerStatus("form");
    setPartner(pendingInvite);
    if (wedding?.id) clearPendingInvite(wedding.id);
  }

  async function onRemovePartner() {
    if (partnerStatus === "pending" || partnerStatus === "rejected") {
      if (wedding?.id) clearPendingInvite(wedding.id);
      setPendingInvite(null);
      setPartner(
        wedding?.partnerTwoName
          ? { name: wedding.partnerTwoName, email: "" }
          : null,
      );
      setPartnerStatus("form");
      toast.success("Запрошення скасовано");
      return;
    }

    setInviteBusy(true);
    try {
      const updated = await removePartner();
      setWedding(updated);
      if (updated.id) clearPendingInvite(updated.id);
      setPendingInvite(null);
      setPartner(
        updated.partnerTwoName
          ? { name: updated.partnerTwoName, email: "" }
          : null,
      );
      setPartnerStatus("form");
      toast.success("Партнера видалено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено партнера");
    } finally {
      setInviteBusy(false);
    }
  }

  async function onRevokeSession() {
    await logout();
    router.replace("/login");
  }

  async function onNotifPrefsChange(next: NotifPrefs) {
    const prev = notifPrefs;
    setNotifPrefs(next);
    const patch: Partial<NotifPrefs> = {};
    (Object.keys(next) as (keyof NotifPrefs)[]).forEach((key) => {
      if (next[key] !== prev[key]) patch[key] = next[key];
    });
    if (!Object.keys(patch).length) return;
    try {
      const saved = await updateNotificationPrefs(patch);
      setNotifPrefs(saved);
    } catch (err) {
      setNotifPrefs(prev);
      toast.error(err instanceof Error ? err.message : "Не збережено");
    }
  }

  function onExport(id: string) {
    toast.info("Експорт", `Завантаження «${id}» скоро підключимо`);
  }

  function onDeleteAccount() {
    setDeleteOpen(true);
  }

  async function confirmDeleteAccount(password: string) {
    if (!accessToken) {
      throw new Error("Сесію завершено. Увійди знову");
    }
    setDeleteBusy(true);
    try {
      await deleteAccountRequest(accessToken, { password });
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      setDeleteOpen(false);
      toast.success("Акаунт видалено");
      router.replace("/");
    } finally {
      setDeleteBusy(false);
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо налаштування…" />;
  }

  const photoUrl =
    wedding?.couplePhotoUrl?.trim() || "/landing/couple.jpg";
  const names = coupleLabel(wedding, user?.name || "");
  const dateLabel = wedding?.date ? formatShortDate(wedding.date) : "";

  return (
    <div className="cabinet-tasks-page cabinet-settings-page">
      <CabinetPageHeader
        title="Налаштування"
        summary={summary}
        initials={initials}
        accountDesktopOnly={false}
      />

      <div className="cabinet-settings-layout">
        <SettingsSideNav
          photoUrl={photoUrl}
          coupleNames={names}
          weddingDateLabel={dateLabel}
          activeTab={tab}
          photoBusy={photoBusy}
          onTabChange={setTab}
          onPhotoPick={(file) => void onPhotoPick(file)}
        />

        {tab === "profile" ? (
          <SettingsProfilePanel
            name={name}
            email={user?.email || ""}
            weddingDate={weddingDate}
            partnerStatus={partnerStatus}
            partner={
              partner ??
              (partnerStatus === "form" && wedding?.partnerTwoName
                ? {
                    name: wedding.partnerTwoName,
                    email: "",
                  }
                : null)
            }
            inviteBusy={inviteBusy}
            passwordBusy={passwordBusy}
            onNameChange={setName}
            onNameBlur={() => void onNameBlur()}
            onWeddingDateChange={setWeddingDate}
            onWeddingDateBlur={() => void onWeddingDateBlur()}
            onPasswordSubmit={onPasswordSubmit}
            onSendInvite={onSendInvite}
            onResendInvite={onResendInvite}
            onSendOtherEmail={onSendOtherEmail}
            onRemovePartner={onRemovePartner}
          />
        ) : null}

        {tab === "security" ? (
          <SettingsSecurityPanel
            sessions={sessions}
            onRevokeSession={() => void onRevokeSession()}
            onExport={onExport}
            onDeleteAccount={onDeleteAccount}
          />
        ) : null}

        {tab === "notifications" ? (
          <SettingsNotificationsPanel
            prefs={notifPrefs}
            onChange={(next) => void onNotifPrefsChange(next)}
          />
        ) : null}
      </div>

      <SettingsDeleteAccountModal
        open={deleteOpen}
        isOwner={Boolean(wedding) && wedding?.myRole !== "PARTNER"}
        loading={deleteBusy}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDeleteAccount}
      />
    </div>
  );
}

export function CoupleSettingsPage() {
  return (
    <RequireAuth>
      <CoupleSettingsInner />
    </RequireAuth>
  );
}
