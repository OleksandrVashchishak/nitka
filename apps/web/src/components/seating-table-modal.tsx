"use client";

import { useEffect, useRef, useState } from "react";
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
  onSeatClick?: (tableId: string, seatId: string) => void;
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

function radialDir(
  index: number,
  total: number,
  rotation: number,
): "left" | "right" | "top" | "bottom" {
  const angle =
    (Math.PI * 2 * index) / Math.max(total, 1) -
    Math.PI / 2 +
    (rotation * Math.PI) / 180;
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  if (Math.abs(x) > 0.5) return x > 0 ? "right" : "left";
  return y < 0 ? "top" : "bottom";
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
  onSeatClick,
}: Props) {
  const [draft, setDraft] = useState<SeatTableDraft>(table);
  const lastTableRef = useRef(table);

  // Чернетку скидаємо лише при відкритті / іншому столі. `table` приходить
  // новим об’єктом на кожен ре-рендер плану — інакше губились крісла й поворот.
  useEffect(() => {
    if (!open) return;
    setDraft(table);
    lastTableRef.current = table;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, table.id]);

  // Гостя посадили / пересадили ззовні (модалка «Посадити» поверх цієї) —
  // переносимо в чернетку лише змінені місця, решту правок не чіпаємо.
  useEffect(() => {
    const prev = lastTableRef.current;
    lastTableRef.current = table;
    if (prev === table || prev.id !== table.id) return;
    const before = new Map(prev.seats.map((s) => [s.id, s.guestKey]));
    const changed = new Map<string, string | null>();
    for (const s of table.seats) {
      if (!before.has(s.id) || before.get(s.id) !== s.guestKey) {
        changed.set(s.id, s.guestKey);
      }
    }
    if (changed.size === 0) return;
    const incoming = new Set(
      [...changed.values()].filter((k): k is string => Boolean(k)),
    );
    setDraft((d) => ({
      ...d,
      seats: d.seats.map((s) => {
        if (changed.has(s.id)) return { ...s, guestKey: changed.get(s.id)! };
        if (s.guestKey && incoming.has(s.guestKey)) {
          return { ...s, guestKey: null };
        }
        return s;
      }),
    }));
  }, [table]);

  const [previewEl, setPreviewEl] = useState<HTMLDivElement | null>(null);
  const [availW, setAvailW] = useState(0);

  useEffect(() => {
    if (!previewEl) return;
    const measure = () => {
      const cs = getComputedStyle(previewEl);
      const pad =
        parseFloat(cs.paddingLeft || "0") + parseFloat(cs.paddingRight || "0");
      // запас під чіпи/імена, що виступають за межі сцени
      setAvailW(Math.max(previewEl.clientWidth - pad - 48, 120));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(previewEl);
    return () => ro.disconnect();
  }, [previewEl]);

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

  function removeSeat() {
    setDraft((prev) => {
      let idx = -1;
      for (let i = prev.seats.length - 1; i >= 0; i--) {
        if (!prev.seats[i].guestKey) {
          idx = i;
          break;
        }
      }
      if (idx < 0) return prev;
      return { ...prev, seats: prev.seats.filter((_, i) => i !== idx) };
    });
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

  const seatCount = draft.seats.length;
  const seatScale = (() => {
    if (!isShaped) return 1;
    const free = 12;
    return seatCount <= free ? 1 : Math.max(0.5, Math.pow(free / seatCount, 0.65));
  })();

  // Стіл росте під кількість місць (щоб крісла не злипались),
  // а потім уся сцена зменшується під ширину модалки.
  const SEAT_PITCH = 36;
  const baseW = isRoundVisual ? 220 : isShaped ? 240 : 280;
  const baseH = isRoundVisual ? 220 : isShaped ? 180 : 160;
  const needW = isShaped
    ? baseW
    : isRoundVisual
      ? Math.ceil((seatCount * SEAT_PITCH) / (Math.PI * 0.96))
      : Math.ceil((Math.ceil(seatCount / 2) * SEAT_PITCH) / 0.8);
  const stageW = Math.max(baseW, needW);
  const stageH = isRoundVisual ? stageW : baseH;
  const grown = stageW > baseW;
  const fit =
    availW > 0 ? Math.min(1, availW / Math.max(stageW, stageH)) : 1;

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
      mobileVariant="sheet"
      panelClassName="seat-table-modal"
      footerClassName="cabinet-modal-actions seat-table-modal-footer"
      footer={
        <CabinetFormActions
          onCancel={onClose}
          saveType="button"
          onSave={() => onSave(draft)}
          cancelClassName="seat-table-modal-cancel"
          saveClassName="seat-table-modal-save"
        />
      }
    >
      <div
        ref={setPreviewEl}
        className={`seat-table-modal-preview${previewMod}`}
        style={fit < 1 ? { minHeight: 0 } : undefined}
      >
        <div
          className="seat-table-modal-stage"
          style={{
            transform: `rotate(${draft.rotation}deg) scale(${fit})`,
            ...(grown ? { width: stageW, height: stageH } : null),
            ...(fit < 1
              ? {
                  flexShrink: 0,
                  margin: `${(-stageH * (1 - fit)) / 2}px ${(-stageW * (1 - fit)) / 2}px`,
                }
              : null),
          }}
        >
          {isShaped ? (
            <TableShapeSilhouette kind={draft.kind} />
          ) : (
            <div
              className="seat-table-modal-body"
              style={{
                ...(isRoundVisual && draft.rotation
                  ? { transform: `rotate(${-draft.rotation}deg)` }
                  : null),
                ...(grown && !isRoundVisual ? { width: "72%" } : null),
              }}
            >
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
                role={onSeatClick ? "button" : undefined}
                onClick={
                  onSeatClick ? () => onSeatClick(draft.id, seat.id) : undefined
                }
                className={`seat-table-modal-seat is-${side}${
                  side === "radial" ? ` is-radial-${radialDir(index, draft.seats.length, draft.rotation)}` : ""
                }${guest ? "" : " is-empty"}`}
                style={{
                  left: pos.left,
                  top: pos.top,
                  ["--seat-rot" as string]: `${-draft.rotation}deg`,
                  ["--seat-scale" as string]: seatScale,
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
          {filled < draft.seats.length ? (
            <button type="button" onClick={removeSeat}>
              Забрати крісло
            </button>
          ) : null}
          <button type="button" onClick={clearTable}>
            Очистити стіл
          </button>
          <CabinetActionItem
            danger
            icon={<IconTrash size={16} />}
            onClick={() => onDelete(draft.id)}
          >
            Видалити стіл
          </CabinetActionItem>
        </div>
        <div className="seat-table-modal-divider" aria-hidden />
        <div className="seat-table-modal-col">
          {ROTATIONS.map((deg) => (
            <button key={deg} type="button" onClick={() => rotateBy(deg)}>
              Повернути на {deg}°
            </button>
          ))}
        </div>
      </div>
    </CabinetOverlay>
  );
}
