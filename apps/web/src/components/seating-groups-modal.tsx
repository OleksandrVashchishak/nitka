"use client";

import { useEffect, useMemo, useState } from "react";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { CabinetFormActions } from "@/components/cabinet-form-actions";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { TextInput } from "@/components/ui/text-input";
import type { Guest } from "@/lib/guests-api";
import { GuestRowMenu } from "@/components/seating-plan-popovers";
import { IconBaby } from "@/components/icon-baby";
import {
  applyLinkedAssign,
  flattenSeatingGuests,
} from "@/lib/seating-guests";
import {
  SideAvatar,
  type SeatingGuestAssign,
  type SeatingGuestGroup,
  type SeatingGuestsDraft,
} from "@/components/seating-wizard";
import "@/styles/seating/wizard.scss";
import "@/styles/seating/plan.scss";

type Props = {
  open: boolean;
  guests: Guest[];
  initial: SeatingGuestsDraft;
  hasPresidium: boolean;
  hasKidsTable: boolean;
  partnerOneName?: string;
  partnerTwoName?: string;
  onClose: () => void;
  onSave: (guests: SeatingGuestsDraft) => void;
};

const GROUP_BADGE_COLORS = ["#6AAE7B", "#5B8DEF", "#C47A3A", "#7A6BB5"];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function SeatingGroupsModal({
  open,
  guests,
  initial,
  hasPresidium,
  hasKidsTable,
  partnerOneName = "",
  partnerTwoName = "",
  onClose,
  onSave,
}: Props) {
  const [groups, setGroups] = useState<SeatingGuestGroup[]>(initial.groups);
  const [assignments, setAssignments] = useState(initial.assignments);
  const [detachedKeys, setDetachedKeys] = useState(
    () => new Set(initial.detachedKeys ?? []),
  );
  const [menuKey, setMenuKey] = useState<string | null>(null);

  const flatGuests = useMemo(() => flattenSeatingGuests(guests), [guests]);
  const namedGroups = groups.filter((g) => g.name.trim());

  useEffect(() => {
    if (!open) return;
    setGroups(initial.groups);
    setAssignments(initial.assignments);
    setDetachedKeys(new Set(initial.detachedKeys ?? []));
    setMenuKey(null);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    setAssignments((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const row of flatGuests) {
        if (next[row.key] !== undefined) continue;
        if (row.toKidsTable && hasKidsTable) {
          next[row.key] = "kids";
          changed = true;
        } else {
          next[row.key] = null;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [flatGuests, hasKidsTable, open]);

  function setAssign(key: string, value: SeatingGuestAssign) {
    setAssignments((prev) =>
      applyLinkedAssign(prev, flatGuests, detachedKeys, key, value),
    );
  }

  function detachGuest(keys: string | string[]) {
    const list = Array.isArray(keys) ? keys : [keys];
    setDetachedKeys((prev) => {
      const next = new Set(prev);
      for (const k of list) next.add(k);
      return next;
    });
    setMenuKey(null);
  }

  function addGroup() {
    setGroups((prev) => [...prev, { id: uid("grp"), name: "" }]);
  }

  function updateGroup(id: string, name: string) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
  }

  function removeGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setAssignments((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[key] === id) next[key] = null;
      }
      return next;
    });
  }

  function handleSave() {
    onSave({
      groups,
      assignments,
      detachedKeys: Array.from(detachedKeys),
    });
  }

  return (
    <CabinetOverlay
      open={open}
      onClose={onClose}
      title="Редагувати групи"
      variant="modal"
      width={1162}
      mobileVariant="fullscreen"
      panelClassName="seat-groups-modal"
      footerClassName="cabinet-modal-actions seat-groups-modal-footer"
      footer={
        <CabinetFormActions
          onCancel={onClose}
          saveType="button"
          onSave={handleSave}
          saveLabel="Додати"
          cancelClassName="seat-groups-modal-cancel"
          saveClassName="seat-groups-modal-save"
        />
      }
    >
        <div className="seat-groups-modal-grid">
          <section className="seat-groups-modal-col">
            <h3 className="seat-groups-modal-title">Створіть групи гостей</h3>
            <p className="seat-groups-modal-lead">
              Створіть групи гостей, щоб було зручніше розсаджувати гостей та
              орієнтуватися в розсадці. Автоматична розсадка посадить усіх по
              групах.
            </p>

            <div className="seat-wiz-group-list">
              {groups.map((group, index) => (
                <div key={group.id} className="seat-wiz-group-field">
                  <TextInput
                    id={`edit-seat-group-${group.id}`}
                    size="m"
                    className="seat-wiz-group-text"
                    label={`Група ${index + 1}`}
                    type="text"
                    placeholder="Наприклад: Родина Романа"
                    value={group.name}
                    onChange={(e) => updateGroup(group.id, e.target.value)}
                  />
                  <button
                    type="button"
                    className="seat-wiz-icon-btn seat-wiz-icon-btn--danger"
                    aria-label="Видалити групу"
                    onClick={() => removeGroup(group.id)}
                  >
                    <IconTrash size={22} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="seat-wiz-add-btn"
              onClick={addGroup}
            >
              <AddCircleIcon />
              Додати групу
            </button>
          </section>

          <section className="seat-groups-modal-col">
            <h3 className="seat-groups-modal-title">Гості</h3>
            <p className="seat-groups-modal-lead">
              Додайте гостей в групи. Перегляньте гостей, якщо деякі з них
              пов’язані, вони будуть посаджені завжди разом. Ви можете їх
              роз’єднати, натиснувши на 3 крапки і вибравши опцію
              “Від’єднати”.
            </p>

            <div className="seat-wiz-guest-list seat-groups-modal-guests">
              {flatGuests.length === 0 ? (
                <p className="seat-groups-modal-lead">Список гостей порожній.</p>
              ) : (
                flatGuests.map((row, index) => {
                  const next = flatGuests[index + 1];
                  const linked =
                    Boolean(row.linkedTo) && !detachedKeys.has(row.key);
                  const clusterPrimaryKey = linked ? row.linkedTo! : row.key;
                  const nextInCluster = Boolean(
                    next &&
                      next.linkedTo === clusterPrimaryKey &&
                      !detachedKeys.has(next.key),
                  );
                  const clusterStart =
                    !row.linkedTo &&
                    Boolean(
                      next &&
                        next.linkedTo === row.key &&
                        !detachedKeys.has(next.key),
                    );
                  const clusterMid = linked;
                  const clusterEnd =
                    (clusterStart || clusterMid) && !nextInCluster;
                  const linkedName = linked
                    ? (flatGuests.find((g) => g.key === row.linkedTo)?.name ??
                      null)
                    : null;
                  const assign = assignments[row.key] ?? null;

                  return (
                    <div
                      key={row.key}
                      className={`seat-wiz-guest-row${
                        clusterStart || clusterMid ? " is-linked" : ""
                      }${clusterStart ? " is-cluster-start" : ""}${
                        clusterMid ? " is-cluster-mid" : ""
                      }${clusterEnd ? " is-cluster-end" : ""}`}
                    >
                      <div className="seat-wiz-guest-name">
                        <span>{row.name}</span>
                        {row.isChild ? (
                          <span
                            className="seat-wiz-child-ico"
                            title="Дитина"
                            aria-label="Дитина"
                          >
                            <IconBaby />
                          </span>
                        ) : null}
                      </div>

                      <div className="seat-wiz-guest-meta">
                        {!linked ||
                        assign !== null ||
                        assignments[row.linkedTo!] === "kids" ? (
                          <AssignControl
                            value={assign}
                            groups={namedGroups}
                            hasPresidium={hasPresidium}
                            hasKidsTable={hasKidsTable}
                            onChange={(v) => setAssign(row.key, v)}
                          />
                        ) : null}

                        <SideAvatar
                          side={row.side}
                          partnerOneName={partnerOneName}
                          partnerTwoName={partnerTwoName}
                        />

                        <div className="seat-wiz-more-wrap">
                          <button
                            type="button"
                            className="seat-wiz-icon-btn"
                            aria-label="Дії"
                            aria-expanded={menuKey === row.key}
                            onClick={() =>
                              setMenuKey(menuKey === row.key ? null : row.key)
                            }
                          >
                            <IconMore size={16} />
                          </button>
                          {menuKey === row.key ? (
                            <div className="seat-wiz-more-menu" role="menu">
                              <GuestRowMenu
                                status={row.rsvpStatus}
                                linkedName={linkedName}
                                onDetach={() => detachGuest(row.key)}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

    </CabinetOverlay>
  );
}

function AssignControl({
  value,
  groups,
  hasPresidium,
  hasKidsTable,
  onChange,
}: {
  value: SeatingGuestAssign;
  groups: SeatingGuestGroup[];
  hasPresidium: boolean;
  hasKidsTable: boolean;
  onChange: (v: SeatingGuestAssign) => void;
}) {
  let label = "Обрати групу";
  let className = "seat-wiz-assign";
  let style: { background?: string } | undefined;

  if (value === "presidium") {
    label = "Президіум";
    className += " is-presidium";
  } else if (value === "kids") {
    label = "Дитячий стіл";
    className += " is-kids";
  } else if (typeof value === "string") {
    const index = groups.findIndex((g) => g.id === value);
    if (index >= 0) {
      label = groups[index].name;
      className += " is-group";
      style = {
        background: GROUP_BADGE_COLORS[index % GROUP_BADGE_COLORS.length],
      };
    }
  }

  const selectValue =
    value === null || value === undefined ? "" : String(value);

  return (
    <label className={className} style={style}>
      <span className="seat-wiz-assign-label">{label}</span>
      <span className="seat-wiz-sr">Обрати групу</span>
      <select
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) onChange(null);
          else if (v === "presidium" || v === "kids") onChange(v);
          else onChange(v);
        }}
      >
        <option value="">Обрати групу</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
        {hasPresidium ? <option value="presidium">Президіум</option> : null}
        {hasKidsTable ? <option value="kids">Дитячий стіл</option> : null}
      </select>
      <ChevronIcon />
    </label>
  );
}

function AddCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 10h6M10 7v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 4.5 6 7.5 9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
