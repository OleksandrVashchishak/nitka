"use client";

import { useEffect, useState } from "react";
import { CabinetActionItem } from "@/components/cabinet-context-menu";
import { IconTrash } from "@/components/icon-trash";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { shapedSeatPosition } from "@/lib/seat-layout";

export type SeatTableKind =
  | "presidium"
  | "round"
  | "long"
  | "kids"
  | "t-shape"
  | "p-shape";

export type SeatTableDraft = {
  id: string;
  kind: SeatTableKind;
  shape?: "round" | "long";
  label: string;
  rotation: number;
  seats: { id: string; guestKey: string | null }[];
};

type GuestInfo = {
  key: string;
  name: string;
  color: string;
};

type Props = {
  open: boolean;
  table: SeatTableDraft;
  guests: Map<string, GuestInfo>;
  onClose: () => void;
  onSave: (next: SeatTableDraft) => void;
  onDelete: (id: string) => void;
};

const ROTATIONS = [30, 60, 90, 180] as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function seatPosition(
  kind: SeatTableKind,
  index: number,
  total: number,
  shape?: "round" | "long",
): { left: string; top: string } {
  if (kind === "t-shape" || kind === "p-shape") {
    return shapedSeatPosition(kind, index, total);
  }

  const asRound = kind === "round" || (kind === "kids" && shape !== "long");
  if (asRound) {
    const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
    const r = kind === "kids" ? 42 : 48;
    return {
      left: `${50 + Math.cos(angle) * r}%`,
      top: `${50 + Math.sin(angle) * r}%`,
    };
  }

  if (kind === "presidium") {
    const t = total <= 1 ? 0.5 : index / (total - 1);
    return { left: `${12 + t * 76}%`, top: "0%" };
  }

  const half = Math.ceil(total / 2);
  if (index < half) {
    const t = half <= 1 ? 0.5 : index / (half - 1);
    return { left: `${10 + t * 80}%`, top: "0%" };
  }
  const j = index - half;
  const bottom = Math.max(total - half, 1);
  const t = bottom <= 1 ? 0.5 : j / (bottom - 1);
  return { left: `${10 + t * 80}%`, top: "100%" };
}

function nameSide(
  kind: SeatTableKind,
  index: number,
  total: number,
  shape?: "round" | "long",
): "top" | "bottom" | "radial" {
  const asRound = kind === "round" || (kind === "kids" && shape !== "long");
  if (asRound) return "radial";
  if (kind === "presidium") return "top";
  if (kind === "t-shape" || kind === "p-shape") {
    const half = Math.ceil(total / 2);
    return index < Math.min(half, 8) ? "top" : "bottom";
  }
  const half = Math.ceil(total / 2);
  return index < half ? "top" : "bottom";
}

function TableShapeSilhouette({ kind }: { kind: SeatTableKind }) {
  if (kind === "t-shape") {
    return (
      <div className="seat-table-modal-shape" aria-hidden>
        <span className="seat-table-modal-shape-top" />
        <span className="seat-table-modal-shape-stem" />
      </div>
    );
  }
  if (kind === "p-shape") {
    return (
      <div className="seat-table-modal-shape" aria-hidden>
        <span className="seat-table-modal-shape-top" />
        <span className="seat-table-modal-shape-leg is-left" />
        <span className="seat-table-modal-shape-leg is-right" />
      </div>
    );
  }
  return null;
}

export function SeatingTableModal({
  open,
  table,
  guests,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<SeatTableDraft>(table);

  useEffect(() => {
    if (open) setDraft(table);
  }, [open, table]);

  const filled = draft.seats.filter((s) => s.guestKey).length;
  const isRoundVisual =
    draft.kind === "round" ||
    (draft.kind === "kids" && draft.shape !== "long");
  const isShaped = draft.kind === "t-shape" || draft.kind === "p-shape";
  const canToggleShape =
    draft.kind === "round" ||
    draft.kind === "long" ||
    draft.kind === "kids";

  function toggleShape() {
    setDraft((prev) => {
      if (prev.kind === "round") {
        return { ...prev, kind: "long" };
      }
      if (prev.kind === "long") {
        return { ...prev, kind: "round" };
      }
      if (prev.kind === "kids") {
        return {
          ...prev,
          shape: prev.shape === "long" ? "round" : "long",
        };
      }
      return prev;
    });
  }

  function addSeat() {
    setDraft((prev) => ({
      ...prev,
      seats: [...prev.seats, { id: uid("seat"), guestKey: null }],
    }));
  }

  function clearTable() {
    setDraft((prev) => ({
      ...prev,
      seats: prev.seats.map((s) => ({ ...s, guestKey: null })),
    }));
  }

  function rotateBy(deg: number) {
    setDraft((prev) => ({
      ...prev,
      rotation: ((prev.rotation + deg) % 360 + 360) % 360,
    }));
  }

  const shapeLabel = isRoundVisual ? "Зробити довгим" : "Зробити круглим";
  const previewMod = isRoundVisual
    ? " is-round"
    : isShaped
      ? ` is-${draft.kind}`
      : " is-long";

  return (
    <CabinetOverlay
      open={open}
      onClose={onClose}
      title={draft.label}
      variant="modal"
      width={420}
      mobileVariant="center"
      panelClassName="seat-table-modal"
      footerClassName="cabinet-modal-actions seat-table-modal-footer"
      footer={
        <CabinetFormActions
          onCancel={onClose}
          saveType="button"
          onSave={() => onSave(draft)}
          cancelClassName=""
          saveClassName=""
        />
      }
    >
      <div className={`seat-table-modal-preview${previewMod}`}>
        <div
          className="seat-table-modal-stage"
          style={{ transform: `rotate(${draft.rotation}deg)` }}
        >
          {isShaped ? (
            <TableShapeSilhouette kind={draft.kind} />
          ) : (
            <div className="seat-table-modal-body">
              <span className="seat-table-modal-body-label">{draft.label}</span>
              <span className="seat-table-modal-body-count">
                {filled}/{draft.seats.length}
              </span>
            </div>
          )}

          {draft.seats.map((seat, index) => {
            const guest = seat.guestKey
              ? guests.get(seat.guestKey)
              : undefined;
            const pos = seatPosition(
              draft.kind,
              index,
              draft.seats.length,
              draft.shape,
            );
            const side = nameSide(
              draft.kind,
              index,
              draft.seats.length,
              draft.shape,
            );
            return (
              <div
                key={seat.id}
                className={`seat-table-modal-seat is-${side}${
                  guest ? "" : " is-empty"
                }`}
                style={{
                  left: pos.left,
                  top: pos.top,
                  ["--seat-rot" as string]: `${-draft.rotation}deg`,
                }}
              >
                <span
                  className="seat-table-modal-chip"
                  style={guest ? { background: guest.color } : undefined}
                >
                  {guest ? initials(guest.name) : ""}
                </span>
                {guest ? (
                  <span className="seat-table-modal-name">{guest.name}</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="seat-table-modal-actions">
        <div className="seat-table-modal-col">
          {canToggleShape ? (
            <button type="button" onClick={toggleShape}>
              {shapeLabel}
            </button>
          ) : null}
          <button type="button" onClick={addSeat}>
            Додати крісло
          </button>
          <button type="button" onClick={clearTable}>
            Очистити
          </button>
          <CabinetActionItem
            danger
            icon={<IconTrash size={16} />}
            onClick={() => onDelete(draft.id)}
          >
            Видалити
          </CabinetActionItem>
        </div>
        <div className="seat-table-modal-divider" aria-hidden />
        <div className="seat-table-modal-col">
          {ROTATIONS.map((deg) => (
            <button key={deg} type="button" onClick={() => rotateBy(deg)}>
              Повернути {deg}°
            </button>
          ))}
        </div>
      </div>
    </CabinetOverlay>
  );
}
