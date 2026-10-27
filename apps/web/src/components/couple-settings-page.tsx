"use client";

import { Suspense, useEffect, useState } from "react";
import { openCabinetMoreMenu } from "@/lib/cabinet-more-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { CabinetBackTitle } from "@/components/cabinet-back-title";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
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
  SETTINGS_TAB_TITLES,
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
import {
  runSettingsExport,
  type SettingsExportId,
} from "@/lib/settings-export";
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

  return { status: "form", partner: null };
}

function parseSettingsTab(value: string | null): SettingsTab | null {
  if (value === "profile" || value === "security" || value === "notifications") {
    return value;
  }
  return null;
}

function CoupleSettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [initials, setInitials] = useState("П");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SettingsTab>(
    () => parseSettingsTab(searchParams.get("tab")) ?? "profile",
  );
  const [mobileDetail, setMobileDetail] = useState(
    () => parseSettingsTab(searchParams.get("tab")) != null,
  );
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
  const [sessions, setSessions] = useState<SettingsSession[]>([]);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF_PREFS);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState<SettingsExportId | null>(null);

  useEffect(() => {
    const next = parseSettingsTab(searchParams.get("tab"));
    if (next) {
      setTab(next);
      setMobileDetail(true);
    }
  }, [searchParams]);

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

  async function copyInviteLink(email?: string) {
    const invite = await createPartnerInvite(email);
    const url = `${window.location.origin}${invite.path}`;
    await navigator.clipboard.writeText(url);
    toast.success(
      "Лінк скопійовано",
      invite.emailed
        ? "Лист із запрошенням надіслано — діятиме 14 днів"
        : "Надішли партнеру — діятиме 14 днів",
    );
  }

  async function onCopyInvite(input: { name: string; email: string }) {
    setInviteBusy(true);
    try {
      if (input.name) {
        await persistWeddingPatch({ partnerTwoName: input.name });
      }
      await copyInviteLink(input.email || undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не створено лінк");
    } finally {
      setInviteBusy(false);
    }
  }

  async function onRemovePartner() {
    setInviteBusy(true);
    try {
      const updated = await removePartner();
      setWedding(updated);
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

  function onMobileBack() {
    if (mobileDetail) {
      setMobileDetail(false);
      router.replace("/settings", { scroll: false });
      return;
    }
    openCabinetMoreMenu();
  }

  async function onLogout() {
    setLogoutBusy(true);
    await logout();
    router.replace("/login");
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
    } catch {
      // toast уже з apiFetch на mutation error
      setNotifPrefs(prev);
    }
  }

  async function onExport(id: string) {
    if (exportBusy) return;
    const exportId = id as SettingsExportId;
    if (exportId !== "guests" && exportId !== "budget" && exportId !== "dayplan") {
      return;
    }
    setExportBusy(exportId);
    try {
      const count = await runSettingsExport(exportId);
      const labels: Record<SettingsExportId, string> = {
        guests: "Гості (CSV)",
        budget: "Бюджет (XLS)",
        dayplan: "План дня (PDF)",
      };
      toast.success(
        "Завантажено",
        count > 0
          ? `${labels[exportId]} · ${count}`
          : `${labels[exportId]} (порожньо)`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Експорт не вдався");
    } finally {
      setExportBusy(null);
    }
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
    <div
      className={`cabinet-tasks-page cabinet-settings-page ${
        mobileDetail ? "is-mobile-detail" : "is-mobile-hub"
      }`}
    >
      <CabinetPageHeader
        title={SETTINGS_TAB_TITLES[tab]}
        summary={summary}
        initials={initials}
        accountDesktopOnly={false}
        className="cabinet-settings-desktop-top"
      />

      <div className="cabinet-settings-mobile-top">
        <CabinetBackTitle
          title={mobileDetail ? SETTINGS_TAB_TITLES[tab] : "Налаштування"}
          onBack={onMobileBack}
        />
      </div>

      <div className="cabinet-settings-layout">
        <SettingsSideNav
          photoUrl={photoUrl}
          coupleNames={names}
          weddingDateLabel={dateLabel}
          activeTab={tab}
          photoBusy={photoBusy}
          hubMode
          onLogout={() => setLogoutOpen(true)}
          onTabChange={(next) => {
            setTab(next);
            setMobileDetail(true);
            router.replace(
              next === "profile" ? "/settings" : `/settings?tab=${next}`,
              { scroll: false },
            );
          }}
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
            onCopyInvite={onCopyInvite}
            onRemovePartner={onRemovePartner}
          />
        ) : null}

        {tab === "security" ? (
          <SettingsSecurityPanel
            sessions={sessions}
            exportBusyId={exportBusy}
            onRevokeSession={() => void onRevokeSession()}
            onExport={(id) => void onExport(id)}
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

      <DeleteConfirmModal
        open={logoutOpen}
        title="Вийти з акаунту?"
        description="Ви впевнені, що хочете вийти з акаунту?"
        confirmLabel="Так, вийти"
        loading={logoutBusy}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => void onLogout()}
      />

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
      <Suspense fallback={<PageLoader label="Завантажуємо налаштування…" />}>
        <CoupleSettingsInner />
      </Suspense>
    </RequireAuth>
  );
}
