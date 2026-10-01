"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { CabinetPageHeader } from "@/components/cabinet-page-header";
import { RequireAuth } from "@/components/require-auth";
import { CabinetEmptyState } from "@/components/cabinet-empty-state";
import { Button } from "@/components/ui/button";
import { SeatingPlan } from "@/components/seating-plan";
import {
  SeatingWizard,
  type SeatingGuestsDraft,
  type SeatingTablesDraft,
} from "@/components/seating-wizard";
import { SeatingGroupsModal } from "@/components/seating-groups-modal";
import { getMyWedding } from "@/lib/dashboard-api";
import { getGuestList, type GuestListResponse } from "@/lib/guests-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import {
  clearSeatingPlan,
  loadSeatingWithMigration,
  saveSeatingDraft,
  type SeatingDraftPayload,
  type SeatingPlanPayload,
} from "@/lib/seating-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "@/styles/cabinet/cabinet.scss";
import "@/styles/seating/wizard.scss";
import "@/styles/seating/plan.scss";

type SeatingDraft = {
  tables: SeatingTablesDraft;
  guests: SeatingGuestsDraft;
};

function guestsPhrase(n: number) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return `${n} гостей`;
  if (last === 1) return `${n} гість`;
  if (last >= 2 && last <= 4) return `${n} гості`;
  return `${n} гостей`;
}

function SeatingInner() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<GuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [partnerOneName, setPartnerOneName] = useState("");
  const [partnerTwoName, setPartnerTwoName] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [draft, setDraft] = useState<SeatingDraft | null>(null);
  const [plan, setPlan] = useState<SeatingPlanPayload | null>(null);
  const [planEpoch, setPlanEpoch] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        const list = await getGuestList();
        setData(list);
        const seating = await loadSeatingWithMigration(list.wedding.id);
        const nextDraft = seating.draft
          ? {
              tables: seating.draft.tables,
              guests: {
                ...seating.draft.guests,
                detachedKeys: seating.draft.guests.detachedKeys ?? [],
              },
            }
          : null;
        setDraft(nextDraft);
        setPlan(seating.plan);
      } catch (err) {
        setData(null);
        setError(err instanceof Error ? err.message : "Не вдалося завантажити");
      } finally {
        setLoading(false);
      }
    })();

    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));

    void getMyWedding()
      .then((wedding) => {
        const oneRaw =
          wedding?.partnerOneName?.trim() || user?.name?.trim() || "";
        const twoRaw = wedding?.partnerTwoName?.trim() || "";
        setPartnerOneName(oneRaw);
        setPartnerTwoName(twoRaw);
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
      })
      .catch(() => undefined);
  }, [user?.name]);

  async function persistDraft(next: SeatingDraftPayload) {
    setDraft(next);
    try {
      await saveSeatingDraft(next);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не збережено");
    }
  }

  async function finishWizard(payload: SeatingDraftPayload, rebuild: boolean) {
    await persistDraft(payload);
    if (rebuild) {
      try {
        await clearSeatingPlan();
      } catch {
        /* ignore */
      }
      setPlan(null);
      setPlanEpoch((n) => n + 1);
    }
    setWizardOpen(false);
  }

  async function refreshGuests() {
    const list = await getGuestList();
    setData(list);
  }

  if (loading) {
    return <PageLoader label="Завантажуємо розсадку…" />;
  }

  if (!data) {
    return (
      <div className="cabinet-tasks-page">
        <CabinetPageHeader title="Розсадка" />
        <div className="cabinet-panel" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "#666" }}>
            Спочатку збережи дату весілля в огляді — тоді відкриється розсадка.
          </p>
          <Link href="/dashboard" className="cabinet-panel-link">
            До огляду
          </Link>
        </div>
        {error ? <p className="cabinet-tasks-error">{error}</p> : null}
      </div>
    );
  }

  const guestCount = data.stats.total;
  const hasGuests = guestCount > 0;

  if (draft) {
    return (
      <div className="cabinet-tasks-page">
        {error ? <p className="cabinet-tasks-error">{error}</p> : null}
        <SeatingPlan
          key={`${data.wedding.id}-${planEpoch}`}
          weddingId={data.wedding.id}
          guests={data.guests}
          draft={draft}
          initialPlan={plan}
          partnerOneName={partnerOneName}
          partnerTwoName={partnerTwoName}
          weddingDate={data.wedding.date}
          onEditGuests={() => setGroupsModalOpen(true)}
          onGuestsRefresh={refreshGuests}
        />
        {groupsModalOpen ? (
          <SeatingGroupsModal
            open
            guests={data.guests}
            initial={draft.guests}
            hasPresidium={draft.tables.hasPresidium}
            hasKidsTable={draft.tables.hasKidsTable}
            onClose={() => setGroupsModalOpen(false)}
            onSave={(guests) => {
              void persistDraft({ ...draft, guests }).then(() => {
                setGroupsModalOpen(false);
                toast.success("Групи оновлено");
              });
            }}
          />
        ) : null}
        {wizardOpen ? (
          <SeatingWizard
            guests={data.guests}
            onClose={() => setWizardOpen(false)}
            onComplete={(payload) => {
              void finishWizard(payload, true).then(() => {
                toast.success("Оновлено", "План перезібрано за новими групами");
              });
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="cabinet-tasks-page">
      <CabinetPageHeader
        title="Розсадка"
        summary={summary}
        initials={partnerInitials}
      />

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      <CabinetEmptyState
        className="cabinet-seating-empty"
        art={{
          src: "/cabinet/empty/seating.svg",
          width: 310,
          height: 202,
          className: "cabinet-seating-empty-art",
        }}
        title={
          hasGuests ? (
            <>
              <span className="cabinet-seating-empty-accent">
                {guestsPhrase(guestCount)}
              </span>{" "}
              чекають на те, щоб ви їх розсадили
            </>
          ) : (
            "Для того, щоб розпочати розсадку, внесіть своїх гостей"
          )
        }
        description={
          <p>
            Розсадіть гостей, побудуйте дизайн посадкової карти, іменні таблички
            на столи — все в одному місці.
          </p>
        }
        actions={
          hasGuests ? (
            <Button
              type="button"
              tone="ink"
              size="m"
              className="cabinet-empty-cta"
              onClick={() => setWizardOpen(true)}
            >
              Розпочати розсадку
            </Button>
          ) : (
            <>
              <Button
                tone="ink"
                size="m"
                className="cabinet-empty-cta"
                href="/guests"
              >
                <span aria-hidden>+</span>
                Додати гостей
              </Button>
              <Button
                tone="ghost"
                size="m"
                className="cabinet-guests-import-btn"
                href="/guests"
              >
                Імпорт CSV
              </Button>
            </>
          )
        }
      />

      {wizardOpen ? (
        <SeatingWizard
          guests={data.guests}
          onClose={() => setWizardOpen(false)}
          onComplete={(payload) => {
            void finishWizard(payload, false).then(() => {
              toast.success("Розсадку зібрано", "Можна правити місця на плані");
            });
          }}
        />
      ) : null}
    </div>
  );
}

export function CoupleSeatingPage() {
  return (
    <RequireAuth roles={["COUPLE"]}>
      <SeatingInner />
    </RequireAuth>
  );
}
