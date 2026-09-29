"use client";

import { useState, type FormEvent } from "react";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  DAY_PLAN_ACCESS_OPTIONS,
  dayPlanShareUrl,
  type DayPlanAccessLevel,
  type DayPlanSharePerson,
} from "@/lib/day-plan";
import { toast } from "@/lib/toast";

type Props = {
  weddingId: string;
  people: DayPlanSharePerson[];
  onClose: () => void;
  onChangePeople: (people: DayPlanSharePerson[]) => void;
};

function newShareId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `share-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function displayNameFromInvite(value: string) {
  const trimmed = value.trim();
  if (!trimmed.includes("@")) return trimmed;
  const local = trimmed.split("@")[0] ?? trimmed;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DayPlanShareModal({
  weddingId,
  people,
  onClose,
  onChangePeople,
}: Props) {
  const [invite, setInvite] = useState("");
  const [inviteAccess, setInviteAccess] =
    useState<DayPlanAccessLevel>("view");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(true);

  function requestClose() {
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  function onInvite(event: FormEvent) {
    event.preventDefault();
    const value = invite.trim();
    if (!value) return;

    const email = value.includes("@") ? value.toLowerCase() : undefined;
    if (email && people.some((p) => p.email?.toLowerCase() === email)) {
      toast.error("Ця людина вже має доступ");
      return;
    }

    setSending(true);
    onChangePeople([
      ...people,
      {
        id: newShareId(),
        name: displayNameFromInvite(value),
        email,
        access: inviteAccess,
      },
    ]);
    setInvite("");
    setInviteAccess("view");
    setSending(false);
    toast.success("Запрошення надіслано", "Доступ додано до списку");
  }

  function setAccess(id: string, access: DayPlanAccessLevel) {
    onChangePeople(
      people.map((person) =>
        person.id === id ? { ...person, access } : person,
      ),
    );
  }

  async function onCopyLink() {
    try {
      await navigator.clipboard.writeText(dayPlanShareUrl(weddingId));
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
            type="text"
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
              setInviteAccess(e.target.value as DayPlanAccessLevel)
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
                  <Select
                    size="s"
                    value={person.access}
                    aria-label={`Доступ для ${person.name}`}
                    onChange={(e) =>
                      setAccess(
                        person.id,
                        e.target.value as DayPlanAccessLevel,
                      )
                    }
                    className="cabinet-day-plan-share-row-select"
                  >
                    {DAY_PLAN_ACCESS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
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
        >
          Скопіювати посилання
        </Button>
      </div>
    </CabinetOverlay>
  );
}
