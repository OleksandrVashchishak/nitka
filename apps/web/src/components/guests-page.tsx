"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { IconQuickAdd } from "@/components/cabinet-task-icons";
import { IconButton } from "@/components/ui/icon-button";
import { CabinetFilterGroup } from "@/components/cabinet-filter-group";
import { CabinetFiltersSheet } from "@/components/cabinet-filters-sheet";
import { CabinetMobileFiltersBar } from "@/components/cabinet-mobile-filters-bar";
import { useMenuOutsideClose } from "@/hooks/use-menu-outside-close";
import { usePagedVisible } from "@/hooks/use-paged-visible";
import { CabinetShowMore } from "@/components/cabinet-show-more";
import {
  CabinetContextMenu,
  CabinetContextMenuDivider,
  CabinetContextMenuItem,
  CabinetContextMenuLabel,
} from "@/components/cabinet-context-menu";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import {
  ResponsibleAvatar,
  ResponsibleAvatarDuo,
} from "@/components/responsible-avatar";
import { RequireAuth } from "@/components/require-auth";
import { CabinetEmptyState } from "@/components/cabinet-empty-state";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  createGuest,
  deleteGuest,
  getGuestList,
  importGuests,
  updateGuest,
  type Guest,
  type GuestListResponse,
  type GuestSide,
  type RsvpStatus,
} from "@/lib/guests-api";
import {
  buildGuestNotes,
  companionsToLegacyFields,
  isChildGuest as notesIsChild,
  isInvitedGuest,
  parseChildNeed,
  parseCompanions,
  parseInviteMethod,
  type ChildNeed,
  type GuestCompanion,
  type InviteMethod,
} from "@/lib/guest-party";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";

type SideFilter = "all" | "BRIDE" | "GROOM";
type InviteFilter = "all" | "not_invited" | "invited";
type RsvpFilter = "all" | RsvpStatus;
type AgeFilter = "all" | "adult" | "child";
type SortMode = "recent" | "alpha" | "rsvp";

type CompanionDraft = GuestCompanion & { key: string };

const SHOW_TEST_TOOLS = process.env.NODE_ENV === "development";

const RANDOM_FIRST_NAMES = [
  "Олена",
  "Андрій",
  "Марія",
  "Іван",
  "Софія",
  "Дмитро",
  "Анна",
  "Олександр",
  "Катерина",
  "Максим",
  "Юлія",
  "Тарас",
  "Наталія",
  "Богдан",
  "Ірина",
];
const RANDOM_LAST_NAMES = [
  "Коваленко",
  "Шевченко",
  "Бондаренко",
  "Ткаченко",
  "Мельник",
  "Кравченко",
  "Олійник",
  "Шевчук",
  "Поліщук",
  "Лисенко",
];
const RANDOM_SIDES: GuestSide[] = ["BRIDE", "GROOM", "BOTH"];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function makeRandomGuests(count: number) {
  return Array.from({ length: count }, () => ({
    name: `${pickRandom(RANDOM_FIRST_NAMES)} ${pickRandom(RANDOM_LAST_NAMES)}`,
    side: pickRandom(RANDOM_SIDES),
    phone: `+380${String(50 + Math.floor(Math.random() * 50)).padStart(2, "0")}${String(
      Math.floor(Math.random() * 10_000_000),
    ).padStart(7, "0")}`,
  }));
}

const INVITE_METHODS: Array<{ id: InviteMethod; label: string }> = [
  { id: "phone", label: "Телефоном" },
  { id: "telegram", label: "Telegram" },
  { id: "messenger", label: "Messenger" },
  { id: "viber", label: "Viber" },
  { id: "email", label: "Email" },
  { id: "meet", label: "При зустрічі" },
  { id: "other", label: "Інше" },
];

const CHILD_NEED_OPTIONS: Array<{ id: ChildNeed; label: string }> = [
  { id: "kids_table", label: "За дитячий стіл" },
  { id: "high_chair", label: "Дитяче крісло потрібне" },
  { id: "with_parents", label: "З батьками в дорослому кріслі" },
];

const RSVP_UI: Record<
  RsvpStatus,
  { label: string; tone: "yes" | "no" | "maybe" | "pending" }
> = {
  YES: { label: "Прийде", tone: "yes" },
  NO: { label: "Відмова", tone: "no" },
  MAYBE: { label: "Можливо прийде", tone: "maybe" },
  PENDING: { label: "Ще не відповіли", tone: "pending" },
};

function isChild(guest: Guest) {
  return notesIsChild(guest.notes);
}

function isInvited(guest: Guest) {
  return isInvitedGuest(guest);
}

function newCompanionKey() {
  return `c-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyCompanion(): CompanionDraft {
  return {
    key: newCompanionKey(),
    name: "",
    isChild: false,
    childNeed: null,
    rsvpStatus: "PENDING",
  };
}

function contactLabel(method: InviteMethod) {
  if (method === "telegram") return "Номер телефону або Telegram нікнейм";
  if (method === "email") return "Email";
  if (method === "meet" || method === "other") return "Контакт (за бажанням)";
  return "Номер телефону";
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

function GuestsInner() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<GuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [ownerName, setOwnerName] = useState("Наречена");
  const [partnerName, setPartnerName] = useState("Наречений");

  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>("all");
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftSide, setDraftSide] = useState<SideFilter>("all");
  const [draftInvite, setDraftInvite] = useState<InviteFilter>("all");
  const [draftRsvp, setDraftRsvp] = useState<RsvpFilter>("all");
  const [draftAge, setDraftAge] = useState<AgeFilter>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [companions, setCompanions] = useState<CompanionDraft[]>([]);
  const [side, setSide] = useState<GuestSide | "">("");
  const [method, setMethod] = useState<InviteMethod>("phone");
  const [phone, setPhone] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"not_invited" | "invited">(
    "not_invited",
  );
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("PENDING");
  const [isChildGuest, setIsChildGuest] = useState(false);
  const [childNeed, setChildNeed] = useState<ChildNeed | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Guest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await getGuestList());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
    void getMyWedding()
      .then((wedding) => {
        const oneRaw =
          wedding?.partnerOneName?.trim() || user?.name?.trim() || "";
        const twoRaw = wedding?.partnerTwoName?.trim() || "";
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
        setOwnerName(firstName(oneRaw) || "Наречена");
        setPartnerName(firstName(twoRaw) || "Наречений");
      })
      .catch(() => undefined);
  }, [user?.name]);

  useEffect(() => {
    if (!filtersOpen) return;
    setDraftSide(sideFilter);
    setDraftInvite(inviteFilter);
    setDraftRsvp(rsvpFilter);
    setDraftAge(ageFilter);
    // Sync draft only when opening the sheet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersOpen]);

  useMenuOutsideClose(Boolean(menuOpenId), () => setMenuOpenId(null));

  const guests = data?.guests ?? [];

  const counts = useMemo(() => {
    const sideCounts = {
      all: guests.length,
      BRIDE: guests.filter((g) => g.side === "BRIDE").length,
      GROOM: guests.filter((g) => g.side === "GROOM").length,
    };
    const invite = {
      all: guests.length,
      not_invited: guests.filter((g) => !isInvited(g)).length,
      invited: guests.filter((g) => isInvited(g)).length,
    };
    const rsvp = {
      all: guests.length,
      YES: guests.filter((g) => g.rsvpStatus === "YES").length,
      NO: guests.filter((g) => g.rsvpStatus === "NO").length,
      MAYBE: guests.filter((g) => g.rsvpStatus === "MAYBE").length,
      PENDING: guests.filter((g) => g.rsvpStatus === "PENDING").length,
    };
    const age = {
      all: guests.length,
      adult: guests.filter((g) => !isChild(g)).length,
      child: guests.filter((g) => isChild(g)).length,
    };
    return { side: sideCounts, invite, rsvp, age };
  }, [guests]);

  const filtered = useMemo(() => {
    const list = guests.filter((guest) => {
      if (sideFilter !== "all" && guest.side !== sideFilter) return false;
      if (inviteFilter === "invited" && !isInvited(guest)) return false;
      if (inviteFilter === "not_invited" && isInvited(guest)) return false;
      if (rsvpFilter !== "all" && guest.rsvpStatus !== rsvpFilter) return false;
      if (ageFilter === "child" && !isChild(guest)) return false;
      if (ageFilter === "adult" && isChild(guest)) return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sortMode === "alpha") return a.name.localeCompare(b.name, "uk");
      if (sortMode === "rsvp") {
        const order: Record<RsvpStatus, number> = {
          YES: 0,
          MAYBE: 1,
          PENDING: 2,
          NO: 3,
        };
        const diff = order[a.rsvpStatus] - order[b.rsvpStatus];
        if (diff !== 0) return diff;
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [guests, sideFilter, inviteFilter, rsvpFilter, ageFilter, sortMode]);

  const { visible, hasMore, showMore } = usePagedVisible(filtered, {
    resetDeps: [sideFilter, inviteFilter, rsvpFilter, ageFilter, sortMode],
  });

  const activeFilterCount = [
    sideFilter !== "all",
    inviteFilter !== "all",
    rsvpFilter !== "all",
    ageFilter !== "all",
  ].filter(Boolean).length;
  const filtersActive = activeFilterCount > 0;

  function applyDraftFilters() {
    setSideFilter(draftSide);
    setInviteFilter(draftInvite);
    setRsvpFilter(draftRsvp);
    setAgeFilter(draftAge);
    setFiltersOpen(false);
  }

  function resetDraftFilters() {
    setDraftSide("all");
    setDraftInvite("all");
    setDraftRsvp("all");
    setDraftAge("all");
  }

  function resetDrawer() {
    setEditingId(null);
    setName("");
    setCompanions([]);
    setSide("");
    setMethod("phone");
    setPhone("");
    setInviteStatus("not_invited");
    setRsvpStatus("PENDING");
    setIsChildGuest(false);
    setChildNeed(null);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    window.setTimeout(() => resetDrawer(), 320);
  }

  function updateCompanion(
    key: string,
    patch: Partial<Omit<CompanionDraft, "key">>,
  ) {
    setCompanions((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, ...patch };
        if (patch.isChild === false) next.childNeed = null;
        if (patch.isChild === true && !next.childNeed) {
          next.childNeed = "with_parents";
        }
        return next;
      }),
    );
  }

  function removeCompanion(key: string) {
    setCompanions((prev) => prev.filter((row) => row.key !== key));
  }

  function addCompanion() {
    setCompanions((prev) => [...prev, emptyCompanion()]);
  }

  function openCreate() {
    resetDrawer();
    setDrawerOpen(true);
  }

  function openEdit(guest: Guest) {
    setEditingId(guest.id);
    setName(guest.name);
    const parsed = parseCompanions(guest.notes, guest);
    setCompanions(
      parsed.map((row) => ({
        ...row,
        key: newCompanionKey(),
      })),
    );
    setSide(guest.side === "OTHER" ? "BOTH" : guest.side);
    setMethod(parseInviteMethod(guest.notes));
    setPhone(guest.phone ?? "");
    setInviteStatus(isInvited(guest) ? "invited" : "not_invited");
    setRsvpStatus(guest.rsvpStatus);
    const child = isChild(guest);
    setIsChildGuest(child);
    setChildNeed(child ? parseChildNeed(guest.notes) : null);
    setMenuOpenId(null);
    setDrawerOpen(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    const nextName = name.trim();
    if (nextName.length < 2) {
      toast.error("Вкажи ім?я гостя");
      return;
    }
    setBusy(true);
    try {
      const invited = inviteStatus === "invited";
      const companionPayload = companions.map(
        ({ name: cName, isChild: cChild, childNeed: cNeed, rsvpStatus: cRsvp }) => ({
          name: cName,
          isChild: cChild,
          childNeed: cChild ? cNeed : null,
          rsvpStatus: cRsvp,
        }),
      );
      const legacy = companionsToLegacyFields(companionPayload);
      const payload = {
        name: nextName,
        side: (side || "BOTH") as GuestSide,
        phone: phone.trim() || undefined,
        plusOne: legacy.plusOne,
        plusOneName: legacy.plusOneName ?? undefined,
        plusOneAttending: legacy.plusOneAttending,
        rsvpStatus,
        notes:
          buildGuestNotes({
            child: isChildGuest,
            childNeed: isChildGuest ? childNeed : null,
            invited,
            method,
            companions: companionPayload,
          }) ?? undefined,
      };

      if (editingId) {
        const updated = await updateGuest(editingId, payload);
        setData((prev) =>
          prev
            ? {
                ...prev,
                guests: prev.guests.map((g) =>
                  g.id === updated.id ? updated : g,
                ),
              }
            : prev,
        );
        toast.success("Оновлено", nextName);
      } else {
        const created = await createGuest(payload);
        setData((prev) =>
          prev
            ? {
                ...prev,
                guests: [created, ...prev.guests],
                stats: {
                  ...prev.stats,
                  total: prev.stats.total + 1,
                  yes: prev.stats.yes + (rsvpStatus === "YES" ? 1 : 0),
                  no: prev.stats.no + (rsvpStatus === "NO" ? 1 : 0),
                  maybe: prev.stats.maybe + (rsvpStatus === "MAYBE" ? 1 : 0),
                  pending:
                    prev.stats.pending + (rsvpStatus === "PENDING" ? 1 : 0),
                  headcount:
                    prev.stats.headcount +
                    (rsvpStatus === "YES" ? 1 : 0) +
                    companionPayload.filter((c) => c.rsvpStatus === "YES")
                      .length,
                },
              }
            : prev,
        );
        toast.success("Додано", nextName);
      }
      setDrawerOpen(false);
      resetDrawer();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : editingId
            ? "Не оновлено"
            : "Не додано",
      );
    } finally {
      setBusy(false);
    }
  }

  function requestDelete(guest: Guest) {
    setMenuOpenId(null);
    setDeleteTarget(guest);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGuest(deleteTarget.id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              guests: prev.guests.filter((g) => g.id !== deleteTarget.id),
              stats: {
                ...prev.stats,
                total: Math.max(0, prev.stats.total - 1),
              },
            }
          : prev,
      );
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setDeleting(false);
    }
  }

  async function onSetSide(guest: Guest, nextSide: GuestSide) {
    if (guest.side === nextSide) {
      setMenuOpenId(null);
      return;
    }
    setBusy(true);
    try {
      const updated = await updateGuest(guest.id, {
        name: guest.name,
        side: nextSide,
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              guests: prev.guests.map((g) => (g.id === updated.id ? updated : g)),
            }
          : prev,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
      setMenuOpenId(null);
    }
  }

  async function onImportCsv(file: File) {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const rows = lines
      .slice(1)
      .map((line) => {
        const [guestName, phoneValue, sideValue] = line.split(/[,;]/);
        if (!guestName?.trim()) return null;
        const sideRaw = sideValue?.trim().toUpperCase();
        const nextSide: GuestSide =
          sideRaw === "BRIDE" || sideRaw === "GROOM" || sideRaw === "BOTH"
            ? sideRaw
            : "BOTH";
        return {
          name: guestName.trim(),
          phone: phoneValue?.trim() || undefined,
          side: nextSide,
        };
      })
      .filter(Boolean) as Array<{
      name: string;
      phone?: string;
      side: GuestSide;
    }>;

    if (rows.length === 0) {
      toast.error("У CSV немає рядків з іменами");
      return;
    }

    setBusy(true);
    try {
      await importGuests(rows);
      await load();
      toast.success("Імпортовано", `${rows.length} гостей`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Імпорт не вдався");
    } finally {
      setBusy(false);
    }
  }

  async function onAddRandomGuests() {
    setBusy(true);
    try {
      const rows = makeRandomGuests(10);
      await importGuests(rows);
      await load();
      toast.success("Тест", "Додано 10 гостей");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не вдалося додати тестових гостей",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо гостей…" />;
  }

  if (!data) {
    return (
      <div className="cabinet-tasks-page">
        <CabinetPageHeader title="Гості" />
        <div className="cabinet-panel" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "#666" }}>
            Спочатку збережи дату весілля в огляді — тоді відкриється список гостей.
          </p>
          <Link href="/dashboard" className="cabinet-panel-link">
            До огляду
          </Link>
        </div>
        {error ? <p className="cabinet-tasks-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="cabinet-tasks-page">
      <CabinetPageHeader
        title={
          <>
            Гості
            {guests.length > 0 ? (
              <span className="cabinet-guests-title-count">
                {" "}
                ({filtered.length})
              </span>
            ) : null}
          </>
        }
        summary={summary}
        initials={partnerInitials}
        actions={
          guests.length > 0 ? (
            <IconButton
              variant="quick-add"
              aria-label="Додати гостя"
              icon={<IconQuickAdd />}
              onClick={openCreate}
            />
          ) : null
        }
      />

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      {guests.length === 0 ? (
        <CabinetEmptyState
          art={{
            src: "/cabinet/empty/guests.png",
            width: 320,
            height: 220,
          }}
          title="Внесіть своїх перших гостей"
          description={
            <>
              <p>
                Єдиний список гостей для вас обох. Всі контакти, статуси
                запрошень, деталі щодо гостей — в одному місці.
              </p>
              <p>Додайте гостей вручну або імпортуйте список із CSV файлу</p>
            </>
          }
          actions={
            <>
              <Button
                type="button"
                tone="ink"
                size="m"
                className="cabinet-empty-cta"
                onClick={openCreate}
              >
                Додати гостей
              </Button>
              <Button
                type="button"
                tone="ghost"
                size="m"
                className="cabinet-guests-import-btn"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
              >
                Імпорт CSV
              </Button>
              {SHOW_TEST_TOOLS ? (
                <Button
                  type="button"
                  tone="ghost"
                  size="m"
                  className="cabinet-guests-import-btn"
                  onClick={() => void onAddRandomGuests()}
                  disabled={busy}
                >
                  10 рандомних гостей
                </Button>
              ) : null}
            </>
          }
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onImportCsv(file);
              e.target.value = "";
            }}
          />
        </CabinetEmptyState>
      ) : (
        <>
          <CabinetMobileFiltersBar
            onOpenFilters={() => setFiltersOpen(true)}
            filtersActive={filtersActive}
            activeFilterCount={activeFilterCount}
            sortValue={sortMode}
            onSortChange={(value) => setSortMode(value as SortMode)}
            sortOptions={[
              { value: "recent", label: "Недавно додані" },
              { value: "alpha", label: "За алфавітом" },
              { value: "rsvp", label: "За відповіддю" },
            ]}
          />

          <div className="cabinet-tasks-layout">
            <aside className="cabinet-tasks-filters">
              <CabinetFilterGroup
                title="Чиї гості"
                items={[
                  { id: "all", label: "Всі", count: counts.side.all },
                  {
                    id: "BRIDE",
                    label: "Гості нареченої",
                    count: counts.side.BRIDE,
                  },
                  {
                    id: "GROOM",
                    label: "Гості нареченого",
                    count: counts.side.GROOM,
                  },
                ]}
                active={sideFilter}
                onChange={(id) => setSideFilter(id as SideFilter)}
              />
              <CabinetFilterGroup
                title="Статус запрошення"
                items={[
                  { id: "all", label: "Всі", count: counts.invite.all },
                  {
                    id: "not_invited",
                    label: "Не запрошені",
                    count: counts.invite.not_invited,
                  },
                  {
                    id: "invited",
                    label: "Запрошені",
                    count: counts.invite.invited,
                  },
                ]}
                active={inviteFilter}
                onChange={(id) => setInviteFilter(id as InviteFilter)}
              />
              <CabinetFilterGroup
                title="Результат запрошення"
                items={[
                  { id: "all", label: "Усі", count: counts.rsvp.all },
                  { id: "YES", label: "Прийдуть", count: counts.rsvp.YES },
                  { id: "NO", label: "Відмовили", count: counts.rsvp.NO },
                  {
                    id: "MAYBE",
                    label: "Можливо прийдуть",
                    count: counts.rsvp.MAYBE,
                  },
                  {
                    id: "PENDING",
                    label: "Ще не відповіли",
                    count: counts.rsvp.PENDING,
                  },
                ]}
                active={rsvpFilter}
                onChange={(id) => setRsvpFilter(id as RsvpFilter)}
              />
              <CabinetFilterGroup
                title="Вік"
                items={[
                  { id: "all", label: "Усі", count: counts.age.all },
                  { id: "adult", label: "Дорослі", count: counts.age.adult },
                  { id: "child", label: "Діти", count: counts.age.child },
                ]}
                active={ageFilter}
                onChange={(id) => setAgeFilter(id as AgeFilter)}
              />
            </aside>

            <section className="cabinet-guest-list-panel">
              <div className="cabinet-tasks-list-head">
                <h2>
                  Список гостей{" "}
                  <span className="cabinet-guests-count">
                    ({filtered.length})
                  </span>
                </h2>
                <div className="cabinet-tasks-list-actions">
                  {SHOW_TEST_TOOLS ? (
                    <Button
                      type="button"
                      tone="ghost"
                      size="m"
                      className="cabinet-guests-import-btn"
                      onClick={() => void onAddRandomGuests()}
                      disabled={busy}
                    >
                      10 рандомних гостей
                    </Button>
                  ) : null}
                  <Select
                    className="cabinet-tasks-sort"
                    size="m"
                    shape="pill"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    aria-label="Сортування"
                  >
                    <option value="recent">Недавно додані</option>
                    <option value="alpha">За алфавітом</option>
                    <option value="rsvp">За відповіддю</option>
                  </Select>
                  <Button
                    type="button"
                    tone="black"
                    size="s"
                    className="cabinet-tasks-add-btn"
                    onClick={openCreate}
                  >
                    <span aria-hidden>+</span>
                    Додати гостей
                  </Button>
                  <Button
                    type="button"
                    tone="ghost"
                    size="m"
                    className="cabinet-guests-import-btn"
                    onClick={() => fileRef.current?.click()}
                    disabled={busy}
                  >
                    Імпорт CSV
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onImportCsv(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              {visible.length === 0 ? (
                <CabinetEmptyState
                  variant="soft"
                  description="Немає гостей у цьому фільтрі."
                />
              ) : (
                <ul className="cabinet-guests-list">
                  {visible.map((guest) => {
                    const ui = RSVP_UI[guest.rsvpStatus];
                    return (
                      <li
                        key={guest.id}
                        className={`cabinet-guest-row${
                          guest.rsvpStatus === "YES" ? " is-yes" : ""
                        }`}
                      >
                        <div className="cabinet-guest-main">
                          <p className="cabinet-guest-name">
                            <span className="cabinet-guest-name-text">
                              {guest.name}
                            </span>
                            {isChild(guest) ? (
                              <span
                                className="cabinet-guest-child"
                                title="Дитина"
                                aria-label="Дитина"
                              >
                                O
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <div className="cabinet-guest-meta">
                          <span
                            className={`cabinet-guest-status is-${ui.tone}`}
                          >
                            <StatusIcon tone={ui.tone} />
                            {ui.label}
                          </span>
                          {guest.side === "BOTH" ? (
                            <ResponsibleAvatarDuo
                              ownerName={ownerName}
                              partnerName={partnerName}
                              title="Обоє"
                              aria-hidden
                            />
                          ) : (
                            <ResponsibleAvatar
                              name={
                                guest.side === "GROOM"
                                  ? partnerName
                                  : ownerName
                              }
                              tone={
                                guest.side === "GROOM" ? "partner" : "owner"
                              }
                            />
                          )}
                          <div className="cabinet-ctx-menu-wrap">
                            <IconButton
                              variant="ghost"
                              aria-label="Меню гостя"
                              aria-expanded={menuOpenId === guest.id}
                              icon={<IconMore />}
                              onClick={() =>
                                setMenuOpenId((id) =>
                                  id === guest.id ? null : guest.id,
                                )
                              }
                            />
                            {menuOpenId === guest.id ? (
                              <CabinetContextMenu>
                                <CabinetContextMenuItem
                                  icon={<IconEdit />}
                                  disabled={busy}
                                  onClick={() => openEdit(guest)}
                                >
                                  Редагувати
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  icon={<IconTrash />}
                                  danger
                                  disabled={busy}
                                  onClick={() => requestDelete(guest)}
                                >
                                  Видалити
                                </CabinetContextMenuItem>

                                <CabinetContextMenuDivider />
                                <CabinetContextMenuLabel>
                                  З чиєї сторони
                                </CabinetContextMenuLabel>

                                <CabinetContextMenuItem
                                  icon={
                                    <ResponsibleAvatar
                                      name={ownerName}
                                      tone="owner"
                                    />
                                  }
                                  active={guest.side === "BRIDE"}
                                  disabled={busy}
                                  onClick={() => void onSetSide(guest, "BRIDE")}
                                >
                                  {ownerName}
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  icon={
                                    <ResponsibleAvatar
                                      name={partnerName}
                                      tone="partner"
                                    />
                                  }
                                  active={guest.side === "GROOM"}
                                  disabled={busy}
                                  onClick={() => void onSetSide(guest, "GROOM")}
                                >
                                  {partnerName}
                                </CabinetContextMenuItem>
                                <CabinetContextMenuItem
                                  icon={
                                    <ResponsibleAvatarDuo
                                      ownerName={ownerName}
                                      partnerName={partnerName}
                                      aria-hidden
                                    />
                                  }
                                  active={guest.side === "BOTH"}
                                  disabled={busy}
                                  onClick={() => void onSetSide(guest, "BOTH")}
                                >
                                  Обоє
                                </CabinetContextMenuItem>
                              </CabinetContextMenu>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <CabinetShowMore hasMore={hasMore} onShowMore={showMore} />
            </section>
          </div>
        </>
      )}

      <CabinetFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={applyDraftFilters}
        onReset={resetDraftFilters}
      >
        <CabinetFilterGroup
          title="Чиї гості"
          items={[
            { id: "all", label: "Всі", count: counts.side.all },
            {
              id: "BRIDE",
              label: "Гості нареченої",
              count: counts.side.BRIDE,
            },
            {
              id: "GROOM",
              label: "Гості нареченого",
              count: counts.side.GROOM,
            },
          ]}
          active={draftSide}
          onChange={(id) => setDraftSide(id as SideFilter)}
        />
        <CabinetFilterGroup
          title="Статус запрошення"
          items={[
            { id: "all", label: "Всі", count: counts.invite.all },
            {
              id: "not_invited",
              label: "Не запрошені",
              count: counts.invite.not_invited,
            },
            {
              id: "invited",
              label: "Запрошені",
              count: counts.invite.invited,
            },
          ]}
          active={draftInvite}
          onChange={(id) => setDraftInvite(id as InviteFilter)}
        />
        <CabinetFilterGroup
          title="Результат запрошення"
          items={[
            { id: "all", label: "Усі", count: counts.rsvp.all },
            { id: "YES", label: "Прийдуть", count: counts.rsvp.YES },
            { id: "NO", label: "Відмовили", count: counts.rsvp.NO },
            {
              id: "MAYBE",
              label: "Можливо прийдуть",
              count: counts.rsvp.MAYBE,
            },
            {
              id: "PENDING",
              label: "Ще не відповіли",
              count: counts.rsvp.PENDING,
            },
          ]}
          active={draftRsvp}
          onChange={(id) => setDraftRsvp(id as RsvpFilter)}
        />
        <CabinetFilterGroup
          title="Вік"
          items={[
            { id: "all", label: "Усі", count: counts.age.all },
            { id: "adult", label: "Дорослі", count: counts.age.adult },
            { id: "child", label: "Діти", count: counts.age.child },
          ]}
          active={draftAge}
          onChange={(id) => setDraftAge(id as AgeFilter)}
        />
      </CabinetFiltersSheet>

      <CabinetOverlay
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingId ? "Редагувати гостя" : "Додати гостя"}
        variant="drawer"
        width={420}
        asForm
        onSubmit={onSave}
        footer={
          <CabinetFormActions
            onCancel={closeDrawer}
            saveTone="black"
            saveDisabled={busy || name.trim().length < 2}
            saveLoading={busy}
            saveLoadingText="…"
          />
        }
      >
              <div className="cabinet-guests-party">
                <div className="cabinet-guests-party-row">
                  <div className="cabinet-guests-plus-line cabinet-guests-plus-line--main">
                    <TextInput
                      label="Ім'я і прізвище"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Наприклад: Ліля Василенко"
                      required
                    />
                    <div
                      className="cabinet-guests-age-toggle"
                      role="group"
                      aria-label="Вік гостя"
                    >
                      <button
                        type="button"
                        className={!isChildGuest ? "is-active" : undefined}
                        onClick={() => {
                          setIsChildGuest(false);
                          setChildNeed(null);
                        }}
                      >
                        Дорослий
                      </button>
                      <button
                        type="button"
                        className={isChildGuest ? "is-active" : undefined}
                        onClick={() => {
                          setIsChildGuest(true);
                          setChildNeed((need) => need ?? "with_parents");
                        }}
                      >
                        Дитина
                      </button>
                    </div>
                  </div>
                  {isChildGuest ? (
                    <div
                      className="cabinet-guests-child-needs"
                      role="group"
                      aria-label="Потрібне для дитини"
                    >
                      {CHILD_NEED_OPTIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={
                            childNeed === item.id ? "is-active" : undefined
                          }
                          onClick={() => setChildNeed(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                {companions.map((row, index) => (
                  <div key={row.key} className="cabinet-guests-party-row">
                    <div className="cabinet-guests-plus-line">
                      <TextInput
                        label={index === 0 ? "Ім'я +1" : undefined}
                        value={row.name}
                        onChange={(e) =>
                          updateCompanion(row.key, { name: e.target.value })
                        }
                        placeholder="Ім'я"
                        aria-label={`Ім'я +1 ${index + 1}`}
                      />
                      <div
                        className="cabinet-guests-age-toggle"
                        role="group"
                        aria-label={`Вік +1 ${index + 1}`}
                      >
                        <button
                          type="button"
                          className={!row.isChild ? "is-active" : undefined}
                          onClick={() =>
                            updateCompanion(row.key, { isChild: false })
                          }
                        >
                          Дорослий
                        </button>
                        <button
                          type="button"
                          className={row.isChild ? "is-active" : undefined}
                          onClick={() =>
                            updateCompanion(row.key, { isChild: true })
                          }
                        >
                          Дитина
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cabinet-guests-plus-remove"
                        aria-label="Видалити +1"
                        onClick={() => removeCompanion(row.key)}
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                    {row.isChild ? (
                      <div
                        className="cabinet-guests-child-needs"
                        role="group"
                        aria-label="Потрібне для дитини"
                      >
                        {CHILD_NEED_OPTIONS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={
                              row.childNeed === item.id
                                ? "is-active"
                                : undefined
                            }
                            onClick={() =>
                              updateCompanion(row.key, {
                                childNeed: item.id,
                              })
                            }
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}

                <button
                  type="button"
                  className="cabinet-guests-plusone"
                  onClick={addCompanion}
                >
                  + Додати +1
                </button>
              </div>

              <Select
                label="Сторона нареченого чи нареченої"
                value={side}
                onChange={(e) => setSide(e.target.value as GuestSide | "")}
              >
                <option value="">Обрати сторону</option>
                <option value="BRIDE">{ownerName || "Наречена"}</option>
                <option value="GROOM">{partnerName || "Наречений"}</option>
                <option value="BOTH">Спільні</option>
              </Select>

              <div className="cabinet-guests-invite-box">
                <p className="cabinet-filter-title">Запрошення</p>
                <Field label="Спосіб запрошення">
                  <div className="cabinet-guests-methods">
                    {INVITE_METHODS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`cabinet-guests-method${
                          method === item.id ? " is-active" : ""
                        }`}
                        onClick={() => {
                          setMethod(item.id);
                          if (item.id === "meet") {
                            setInviteStatus("invited");
                            setRsvpStatus("YES");
                          }
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <TextInput
                  label={contactLabel(method)}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    method === "telegram" ? "@nickname або +380" : "+380"
                  }
                />
                <Select
                  label="Статус"
                  value={inviteStatus}
                  onChange={(e) =>
                    setInviteStatus(e.target.value as "not_invited" | "invited")
                  }
                >
                  <option value="not_invited">Не запрошено</option>
                  <option value="invited">Запрошено</option>
                </Select>

                <Field label="Результат запрошення">
                  <div className="cabinet-guests-rsvp-list">
                    <div className="cabinet-guests-rsvp-row">
                      <span className="cabinet-guests-rsvp-name">
                        {name.trim() || "Основний гість"}
                      </span>
                      <Select
                        value={rsvpStatus}
                        aria-label={`Результат: ${name.trim() || "основний гість"}`}
                        onChange={(e) =>
                          setRsvpStatus(e.target.value as RsvpStatus)
                        }
                      >
                      <option value="YES">? Прийде</option>
                      <option value="MAYBE">0 Можливо прийде</option>
                      <option value="NO">? Не прийде</option>
                      <option value="PENDING">0 Ще не відповіли</option>
                    </Select>
                  </div>
                  {companions.map((row, index) => (
                    <div key={row.key} className="cabinet-guests-rsvp-row">
                      <span className="cabinet-guests-rsvp-name">
                        {row.name.trim() || `+1 #${index + 1}`}
                      </span>
                      <Select
                        value={row.rsvpStatus}
                        aria-label={`Результат: ${
                          row.name.trim() || `+1 #${index + 1}`
                        }`}
                        onChange={(e) =>
                          updateCompanion(row.key, {
                            rsvpStatus: e.target.value as RsvpStatus,
                          })
                        }
                      >
                        <option value="YES">? Прийде</option>
                        <option value="MAYBE">0 Можливо прийде</option>
                        <option value="NO">? Не прийде</option>
                        <option value="PENDING">0 Ще не відповіли</option>
                      </Select>
                    </div>
                  ))}
                  </div>
                </Field>
              </div>
      </CabinetOverlay>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        title="Видалити гостя"
        description={
          deleteTarget
            ? `Ви впевнені, що хочете видалити «${deleteTarget.name}»?`
            : ""
        }
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

function StatusIcon({ tone }: { tone: "yes" | "no" | "maybe" | "pending" }) {
  if (tone === "yes") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path fill="currentColor" d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5-5L12.3 5z" />
      </svg>
    );
  }
  if (tone === "no") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path
          fill="currentColor"
          d="M4.2 3.1 3.1 4.2 6.9 8l-3.8 3.8 1.1 1.1L8 9.1l3.8 3.8 1.1-1.1L9.1 8l3.8-3.8-1.1-1.1L8 6.9 4.2 3.1z"
        />
      </svg>
    );
  }
  if (tone === "maybe") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.2 6.2a1.8 1.8 0 1 1 2.5 1.6c-.5.3-.9.7-.9 1.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.4" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5V8l2.2 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GuestsPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <GuestsInner />
    </RequireAuth>
  );
}
