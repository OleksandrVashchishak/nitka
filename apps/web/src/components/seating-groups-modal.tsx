"use client";

import { useEffect, useMemo, useState } from "react";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { Button } from "@/components/ui/button";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { TextInput } from "@/components/ui/text-input";
import type { Guest } from "@/lib/guests-api";
import { isChildGuest, parseCompanions } from "@/lib/guest-party";
import type {
  SeatingGuestAssign,
  SeatingGuestGroup,
  SeatingGuestsDraft,
} from "@/components/seating-wizard";
import "@/styles/seating/wizard.scss";
import "@/styles/seating/plan.scss";

type FlatGuest = {
  key: string;
  guestId: string;
  name: string;
  isPlusOne: boolean;
  linkedTo: string | null;
  isChild: boolean;
  side: Guest["side"];
};

type Props = {
  open: boolean;
  guests: Guest[];
  initial: SeatingGuestsDraft;
  hasPresidium: boolean;
  hasKidsTable: boolean;
  onClose: () => void;
  onSave: (guests: SeatingGuestsDraft) => void;
};

const GROUP_BADGE_COLORS = ["#4CAF7A", "#5B8DEF", "#C47A3A", "#7A6BB5"];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function flattenGuests(guests: Guest[]): FlatGuest[] {
  const rows: FlatGuest[] = [];
  for (const g of guests) {
    const key = g.id;
    rows.push({
      key,
      guestId: g.id,
      name: g.name,
      isPlusOne: false,
      linkedTo: null,
      isChild: isChildGuest(g.notes),
      side: g.side,
    });
    const companions = parseCompanions(g.notes, g).filter((c) =>
      c.name.trim(),
    );
    companions.forEach((companion, index) => {
      rows.push({
        key: index === 0 ? `${g.id}:plus` : `${g.id}:plus:${index}`,
        guestId: g.id,
        name: companion.name.trim(),
        isPlusOne: true,
        linkedTo: key,
        isChild: companion.isChild,
        side: g.side,
      });
    });
  }
  return rows;
}

function sideLabel(side: Guest["side"]) {
  if (side === "BRIDE") return "Сторона нареченої";
  if (side === "GROOM") return "Сторона нареченого";
  if (side === "BOTH") return "Спільні";
  return "Інше";
}

export function SeatingGroupsModal({
  open,
  guests,
  initial,
  hasPresidium,
  hasKidsTable,
  onClose,
  onSave,
}: Props) {
  const [groups, setGroups] = useState<SeatingGuestGroup[]>(initial.groups);
  const [assignments, setAssignments] = useState(initial.assignments);
  const [detachedKeys, setDetachedKeys] = useState(
    () => new Set(initial.detachedKeys ?? []),
  );
  const [menuKey, setMenuKey] = useState<string | null>(null);

  const flatGuests = useMemo(() => flattenGuests(guests), [guests]);
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
        if (row.isChild && hasKidsTable) {
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
    setAssignments((prev) => {
      const next = { ...prev, [key]: value };
      const row = flatGuests.find((g) => g.key === key);
      if (row && !row.isPlusOne) {
        for (const plus of flatGuests.filter((g) => g.linkedTo === key)) {
          if (detachedKeys.has(plus.key)) continue;
          if (plus.isChild) continue;
          if (prev[plus.key] === "kids") continue;
          next[plus.key] = value;
        }
      }
      return next;
    });
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
      width={960}
      mobileVariant="center"
      panelClassName="seat-groups-modal"
      footerClassName="cabinet-modal-actions seat-groups-modal-footer"
      footer={
        <>
          <Button type="button" tone="ghost" size="m" onClick={onClose}>
            Скасувати
          </Button>
          <Button type="button" tone="ink" size="m" onClick={handleSave}>
            Додати
          </Button>
        </>
      }
    >
        <div className="seat-groups-modal-grid">
          <section className="seat-groups-modal-col">
            <h3 className="seat-groups-modal-title">Створіть групи гостей</h3>
            <p className="seat-groups-modal-lead">
              Групи допомагають швидше розсадити гостей автоматично — друзі
              разом, родичі поруч, колеги за одним столом.
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
                    className="seat-wiz-icon-btn"
                    style={{ color: "#ff4200" }}
                    aria-label="Видалити групу"
                    onClick={() => removeGroup(group.id)}
                    disabled={groups.length <= 1}
                  >
                    <IconTrash size={18} />
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
              Об’єднайте гостей у групи або залиште без групи. Іконка{" "}
              <LinkGlyph /> означає, що гості сидітимуть разом — роз’єднати
              можна через меню ⋮.
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
                  const canDetach =
                    linked ||
                    (!row.linkedTo &&
                      flatGuests.some(
                        (g) =>
                          g.linkedTo === row.key && !detachedKeys.has(g.key),
                      ));
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
                        {row.isChild ? (
                          <span
                            className="seat-wiz-child-ico"
                            title="Дитина"
                            aria-label="Дитина"
                          >
                            <ChildIcon />
                          </span>
                        ) : linked ? (
                          <span className="seat-wiz-link-ico" aria-hidden>
                            <LinkGlyph />
                          </span>
                        ) : null}
                        <span>{row.name}</span>
                      </div>

                      <div className="seat-wiz-guest-meta">
                        <AssignControl
                          value={assign}
                          groups={namedGroups}
                          hasPresidium={hasPresidium}
                          hasKidsTable={hasKidsTable}
                          onChange={(v) => setAssign(row.key, v)}
                        />

                        <span
                          className="seat-wiz-side-dot"
                          title={sideLabel(row.side)}
                          aria-label={sideLabel(row.side)}
                        >
                          {row.name.trim().charAt(0).toUpperCase() || "·"}
                        </span>

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
                              {hasPresidium ? (
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setAssign(row.key, "presidium");
                                    setMenuKey(null);
                                  }}
                                >
                                  У президіум
                                </button>
                              ) : null}
                              {hasKidsTable ? (
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setAssign(row.key, "kids");
                                    setMenuKey(null);
                                  }}
                                >
                                  На дитячий стіл
                                </button>
                              ) : null}
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                  setAssign(row.key, null);
                                  setMenuKey(null);
                                }}
                              >
                                Без групи
                              </button>
                              {canDetach ? (
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    if (linked) {
                                      detachGuest(row.key);
                                      return;
                                    }
                                    detachGuest(
                                      flatGuests
                                        .filter(
                                          (g) =>
                                            g.linkedTo === row.key &&
                                            !detachedKeys.has(g.key),
                                        )
                                        .map((g) => g.key),
                                    );
                                  }}
                                >
                                  Роз’єднати
                                </button>
                              ) : null}
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
    const group = groups.find((g) => g.id === value);
    if (group) {
      label = group.name;
      className += " is-group";
      style = {
        background:
          GROUP_BADGE_COLORS[
            Math.abs(hashStr(group.id)) % GROUP_BADGE_COLORS.length
          ],
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

function LinkGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M5.5 8.5 8.5 5.5M6.2 4.2l.9-.9a2.2 2.2 0 1 1 3.1 3.1l-.9.9M7.8 9.8l-.9.9a2.2 2.2 0 1 1-3.1-3.1l.9-.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChildIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="4.2" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M3.2 12c.4-2.2 1.8-3.4 3.8-3.4s3.4 1.2 3.8 3.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
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
