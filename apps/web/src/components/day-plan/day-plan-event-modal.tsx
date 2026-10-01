"use client";

import { useState, type FormEvent } from "react";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import {
  DAY_PLAN_DURATION_OPTIONS,
  formatDurationUk,
  type DayPlanEvent,
} from "@/lib/day-plan";

type Props = {
  mode: "create" | "edit";
  initial?: DayPlanEvent | null;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    time: string;
    durationMin: number;
  }) => void;
};

export function DayPlanEventModal({ mode, initial, onClose, onSave }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [time, setTime] = useState(initial?.time ?? "08:00");
  const [durationMin, setDurationMin] = useState(initial?.durationMin ?? 60);
  const [open, setOpen] = useState(true);

  function requestClose() {
    setOpen(false);
    window.setTimeout(onClose, 280);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || !time) return;
    onSave({ title: nextTitle, time, durationMin });
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={requestClose}
      title={mode === "edit" ? "Редагувати подію" : "Додати подію"}
      variant="modal"
      width={480}
      mobileVariant="fullscreen"
      panelClassName="cabinet-day-plan-modal"
      bodyClassName="cabinet-day-plan-modal-body"
      footerClassName="cabinet-modal-actions cabinet-day-plan-modal-actions"
      asForm
      onSubmit={submit}
      footer={
        <CabinetFormActions
          onCancel={requestClose}
          saveDisabled={!title.trim() || !time}
        />
      }
    >
      <TextInput
        label="Назва дії"
        size="m"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Наприклад: Церемонія"
        required
        autoFocus
      />
      <TextInput
        label="Час"
        size="m"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <Select
        label="Тривалість"
        size="m"
        value={String(durationMin)}
        onChange={(e) => setDurationMin(Number(e.target.value))}
      >
        {DAY_PLAN_DURATION_OPTIONS.map((mins) => (
          <option key={mins} value={mins}>
            {formatDurationUk(mins)}
          </option>
        ))}
      </Select>
    </CabinetOverlay>
  );
}
