"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui-loader";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { SeatingPlan } from "@/components/seating-plan";
import {
  SeatingWizard,
  type SeatingGuestsDraft,
  type SeatingTablesDraft,
} from "@/components/seating-wizard";
import { getMyWedding } from "@/lib/dashboard-api";
import { getGuestList, type GuestListResponse } from "@/lib/guests-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "../app/couple-cabinet.css";

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

function draftKey(weddingId: string) {
  return `fata-seating-draft:v1:${weddingId}`;
}

function SeatingEmptyArt() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cabinet-guests-empty-art cabinet-seating-empty-art"
      src="/cabinet/empty/seating.svg"
      alt=""
      width={310}
      height={202}
      aria-hidden
    />
  );
}

function SeatingInner() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<GuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [draft, setDraft] = useState<SeatingDraft | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setError(null);
        const list = await getGuestList();
        setData(list);
        try {
          const raw = localStorage.getItem(draftKey(list.wedding.id));
          if (raw) setDraft(JSON.parse(raw) as SeatingDraft);
        } catch {
          /* ignore */
        }
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
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
      })
      .catch(() => undefined);
  }, [user?.name]);

  function persistDraft(next: SeatingDraft) {
    setDraft(next);
    if (!data) return;
    try {
      localStorage.setItem(draftKey(data.wedding.id), JSON.stringify(next));
    } catch {
      /* ignore */
    }
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
        <div className="cabinet-tasks-top">
          <h1 className="cabinet-tasks-title">Розсадка</h1>
        </div>
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

  const guestCount =
    data.stats.total > 0 ? data.stats.total : data.wedding.plannedGuests;

  if (draft) {
    return (
      <div className="cabinet-tasks-page">
        {error ? <p className="cabinet-tasks-error">{error}</p> : null}
        <SeatingPlan
          weddingId={data.wedding.id}
          guests={data.guests}
          draft={draft}
          onEditGuests={() => setWizardOpen(true)}
          onGuestsRefresh={refreshGuests}
        />
        {wizardOpen ? (
          <SeatingWizard
            guests={data.guests}
            onClose={() => setWizardOpen(false)}
            onComplete={(payload) => {
              persistDraft(payload);
              setWizardOpen(false);
              try {
                localStorage.removeItem(
                  `fata-seating-plan:v1:${data.wedding.id}`,
                );
              } catch {
                /* ignore */
              }
              toast.success("Оновлено", "План перезібрано за новими групами");
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="cabinet-tasks-page">
      <div className="cabinet-tasks-top">
        <h1 className="cabinet-tasks-title">Розсадка</h1>
        <div className="cabinet-tasks-top-actions">
          <div className="cabinet-overview-actions cabinet-tasks-desktop-actions">
            <CabinetNotificationsBell summary={summary} />
            <CabinetProfileMenu initials={partnerInitials} />
          </div>
        </div>
      </div>

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      <div className="cabinet-guests-empty cabinet-seating-empty">
        <div className="cabinet-guests-empty-glow" aria-hidden />
        <SeatingEmptyArt />
        <h2>
          <span className="cabinet-seating-empty-accent">
            {guestsPhrase(guestCount)}
          </span>{" "}
          чекають на те, щоб ви їх розсадили
        </h2>
        <p>
          Розсадіть гостей, побудуйте дизайн посадкової карти, іменні таблички
          на столи — все в одному місці.
        </p>
        <div className="cabinet-guests-empty-actions">
          {data.stats.total === 0 ? (
            <Button
              type="button"
              tone="ink"
              size="m"
              className="cabinet-empty-cta"
              onClick={() => router.push("/guests")}
            >
              Спочатку додати гостей
            </Button>
          ) : (
            <Button
              type="button"
              tone="ink"
              size="m"
              className="cabinet-empty-cta"
              onClick={() => setWizardOpen(true)}
            >
              Розпочати розсадку
            </Button>
          )}
        </div>
      </div>

      {wizardOpen ? (
        <SeatingWizard
          guests={data.guests}
          onClose={() => setWizardOpen(false)}
          onComplete={(payload) => {
            persistDraft(payload);
            setWizardOpen(false);
            toast.success("Розсадку зібрано", "Можна правити місця на плані");
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
