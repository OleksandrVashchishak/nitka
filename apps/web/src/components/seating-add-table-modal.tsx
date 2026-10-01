"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { TextInput } from "@/components/ui/text-input";
import type { SeatTableKind } from "@/components/seating-table-modal";

export type SeatingAddTableResult = {
  kind: SeatTableKind;
  tableCount: number;
  seatsPerTable: number;
};

type Props = {
  open: boolean;
  kind: SeatTableKind;
  onClose: () => void;
  onAdd: (result: SeatingAddTableResult) => void;
};

const KIND_TITLE: Record<SeatTableKind, string> = {
  long: "Додати довгий стіл",
  round: "Додати круглий стіл",
  presidium: "Додати президіум",
  kids: "Додати дитячий стіл",
  "t-shape": "Додати Т-форму",
  "p-shape": "Додати П-форму",
};

function parsePositiveInt(raw: string): number | null {
  const n = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export function SeatingAddTableModal({
  open,
  kind,
  onClose,
  onAdd,
}: Props) {
  const [tableCount, setTableCount] = useState("");
  const [seatsPerTable, setSeatsPerTable] = useState("");

  useEffect(() => {
    if (!open) return;
    setTableCount("");
    setSeatsPerTable("");
  }, [open, kind]);

  const tables = parsePositiveInt(tableCount);
  const seats = parsePositiveInt(seatsPerTable);
  const canSubmit = tables != null && seats != null;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (tables == null || seats == null) return;
    onAdd({ kind, tableCount: tables, seatsPerTable: seats });
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={onClose}
      title={KIND_TITLE[kind]}
      variant="modal"
      width={790}
      mobileVariant="center"
      panelClassName="seat-add-table-modal"
      bodyClassName="seat-add-table-modal-body"
      footerClassName="cabinet-modal-actions seat-add-table-modal-actions"
      asForm
      onSubmit={submit}
      footer={
        <CabinetFormActions
          onCancel={onClose}
          saveLabel="Додати"
          saveDisabled={!canSubmit}
        />
      }
    >
      <TextInput
        label="Кількість столів"
        size="m"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Наприклад: 10"
        value={tableCount}
        onChange={(e) => setTableCount(e.target.value)}
        autoFocus
      />
      <TextInput
        label="Кількість гостей за столом"
        size="m"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Наприклад: 10"
        value={seatsPerTable}
        onChange={(e) => setSeatsPerTable(e.target.value)}
      />
      <p className="seat-add-table-modal-hint">
        Ви зможете змінити кількість потім.
      </p>
    </CabinetOverlay>
  );
}
