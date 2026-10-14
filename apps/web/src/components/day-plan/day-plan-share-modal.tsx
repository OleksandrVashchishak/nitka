"use client";

import { useState, type FormEvent } from "react";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  DAY_PLAN_ACCESS_OPTIONS,
  DAY_PLAN_REVOKE_VALUE,
  dayPlanSharedUrl,
  inviteDayPlanShare,
  revokeDayPlanShareGrant,
  updateDayPlanShareGrant,
  type DayPlanShareAccess,
  type DayPlanSharePerson,
  type DayPlanShareState,
} from "@/lib/day-plan-share-api";
import { toast } from "@/lib/toast";

type Props = {
  shareToken: string;
  people: DayPlanSharePerson[];
  onClose: () => void;
  onShareChange: (state: DayPlanShareState) => void;
};

export function DayPlanShareModal({
  shareToken,
  people,
  onClose,
  onShareChange,
}: Props) {
  const [invite, setInvite] = useState("");
  const [inviteAccess, setInviteAccess] =
    useState<DayPlanShareAccess>("VIEW");
  const [sending, setSending] = useState(false);
  const [busyGrantId, setBusyGrantId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  function requestClose() {
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  async function onInvite(event: FormEvent) {
    event.preventDefault();
    const email = invite.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      toast.error("Вкажи коректний email");
      return;
    }

    setSending(true);
    try {
      const next = await inviteDayPlanShare({
        email,
        access: inviteAccess,
      });
      onShareChange(next);
      setInvite("");
      setInviteAccess("VIEW");
      toast.success("Запрошення надіслано", "Доступ додано до списку");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не вдалося надіслати запрошення",
      );
    } finally {
      setSending(false);
    }
  }

  async function onGrantChange(person: DayPlanSharePerson, value: string) {
    if (person.locked || person.kind !== "grant") return;

    setBusyGrantId(person.id);
    try {
      if (value === DAY_PLAN_REVOKE_VALUE) {
        const next = await revokeDayPlanShareGrant(person.id);
        onShareChange(next);
        toast.success("Доступ прибрано");
        return;
      }

      const access = value as DayPlanShareAccess;
      if (access !== "VIEW" && access !== "EDIT") return;
      const next = await updateDayPlanShareGrant(person.id, access);
      onShareChange(next);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не вдалося оновити доступ",
      );
    } finally {
      setBusyGrantId(null);
    }
  }

  async function onCopyLink() {
    try {
      await navigator.clipboard.writeText(dayPlanSharedUrl(shareToken));
      toast.success("Скопійовано", "Посилання на план дня в буфері");
    } catch {
      toast.error("Не вдалося скопіювати посилання");
    }
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={requestClose}
      title="Поділитися планом дня"
      variant="modal"
      width={480}
      mobileVariant="fullscreen"
      panelClassName="cabinet-day-plan-share-modal"
    >
      <div className="cabinet-day-plan-share-scroll">
        <form className="cabinet-day-plan-share-invite" onSubmit={onInvite}>
          <TextInput
            label="Email або посилання"
            size="m"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            placeholder="name@example.com"
            required
            autoFocus
          />
          <Select
            label="Рівень доступу"
            size="m"
            value={inviteAccess}
            onChange={(e) =>
              setInviteAccess(e.target.value as DayPlanShareAccess)
            }
          >
            {DAY_PLAN_ACCESS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button
            type="submit"
            tone="ink"
            size="l"
            fullWidth
            className="cabinet-day-plan-share-invite-btn"
            loading={sending}
            loadingText="Надсилаємо…"
            disabled={!invite.trim()}
          >
            Надіслати запрошення
          </Button>
        </form>

        {people.length ? (
          <div className="cabinet-day-plan-share-access">
            <p className="cabinet-day-plan-share-access-label">Мають доступ</p>
            <ul className="cabinet-day-plan-share-list">
              {people.map((person) => (
                <li key={person.id} className="cabinet-day-plan-share-row">
                  <span className="cabinet-day-plan-share-name">
                    {person.name}
                  </span>
                  {person.locked ? (
                    <span className="cabinet-day-plan-share-locked">
                      Може редагувати
                    </span>
                  ) : (
                    <Select
                      size="s"
                      value={person.access}
                      aria-label={`Доступ для ${person.name}`}
                      disabled={busyGrantId === person.id}
                      onChange={(e) =>
                        void onGrantChange(person, e.target.value)
                      }
                      className="cabinet-day-plan-share-row-select"
                    >
                      {DAY_PLAN_ACCESS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      <option value={DAY_PLAN_REVOKE_VALUE}>
                        Прибрати доступ
                      </option>
                    </Select>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="cabinet-day-plan-share-or">або</p>

        <Button
          type="button"
          tone="dark"
          size="l"
          fullWidth
          className="cabinet-day-plan-share-copy-btn"
          onClick={() => void onCopyLink()}
          disabled={!shareToken}
        >
          Скопіювати посилання
        </Button>
      </div>
    </CabinetOverlay>
  );
}
