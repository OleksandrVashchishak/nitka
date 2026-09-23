"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BrandLogo } from "@/components/brand-logo";
import { IconMore } from "@/components/icon-more";
import { RadioGroup, RadioOption } from "@/components/ui/radio";
import { TextInput } from "@/components/ui/text-input";
import type { Guest } from "@/lib/guests-api";
import "@/app/seating-wizard.css";

export type SeatingFormatId =
  | "presidium-round"
  | "presidium-long"
  | "presidium-mixed"
  | "p-shape"
  | "t-shape";

export type SeatingTablesDraft = {
  hasPresidium: boolean;
  presidiumSeats: number;
  format: SeatingFormatId;
  roundTableCount: string;
  roundSeatsPerTable: string;
  longTableCount: string;
  longSeatsPerTable: string;
  hasKidsTable: boolean;
};

export type SeatingGuestGroup = {
  id: string;
  name: string;
};

export type SeatingGuestAssign = string | "presidium" | "kids" | null;

export type SeatingGuestsDraft = {
  groups: SeatingGuestGroup[];
  assignments: Record<string, SeatingGuestAssign>;
};

type WizardStep = 1 | 2 | 3;

type Props = {
  guests: Guest[];
  onClose: () => void;
  onComplete?: (payload: {
    tables: SeatingTablesDraft;
    guests: SeatingGuestsDraft;
  }) => void;
};

const STEPS = [
  { id: 1 as const, label: "Столи" },
  { id: 2 as const, label: "Гості" },
  { id: 3 as const, label: "Розсадка" },
];

const GROUP_BADGE_COLORS = ["#4CAF7A", "#5B8DEF", "#C47A3A", "#7A6BB5"];

function formatNeedsRound(format: SeatingFormatId) {
  return format === "presidium-round" || format === "presidium-mixed";
}

function formatNeedsLong(format: SeatingFormatId) {
  return format === "presidium-long" || format === "presidium-mixed";
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function isChildGuest(guest: Guest) {
  return (guest.notes ?? "").includes("[child]");
}

type FlatGuest = {
  key: string;
  guestId: string;
  name: string;
  isPlusOne: boolean;
  linkedTo: string | null;
  isChild: boolean;
  side: Guest["side"];
};

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
      isChild: isChildGuest(g),
      side: g.side,
    });
    if (g.plusOne && g.plusOneName?.trim()) {
      const plusKey = `${g.id}:plus`;
      rows.push({
        key: plusKey,
        guestId: g.id,
        name: g.plusOneName.trim(),
        isPlusOne: true,
        linkedTo: key,
        isChild: false,
        side: g.side,
      });
    }
  }
  return rows;
}

type FormatItem = {
  id: SeatingFormatId;
  label: string;
  Icon: () => ReactNode;
};

const FORMATS: FormatItem[] = [
  {
    id: "presidium-round",
    label: "Президіум + Круглі",
    Icon: FormatIconPresidiumRound,
  },
  {
    id: "presidium-long",
    label: "Президіум + Довгі",
    Icon: FormatIconPresidiumLong,
  },
  {
    id: "presidium-mixed",
    label: "Президіум + Довгі + Круглі",
    Icon: FormatIconPresidiumMixed,
  },
  { id: "p-shape", label: "П-форма", Icon: FormatIconP },
  { id: "t-shape", label: "Т-форма", Icon: FormatIconT },
];

export function SeatingWizard({ guests, onClose, onComplete }: Props) {
  const [step, setStep] = useState<WizardStep>(1);

  const [hasPresidium, setHasPresidium] = useState(true);
  const [presidiumSeats, setPresidiumSeats] = useState("6");
  const [format, setFormat] = useState<SeatingFormatId>("presidium-round");
  const [roundTableCount, setRoundTableCount] = useState("");
  const [roundSeatsPerTable, setRoundSeatsPerTable] = useState("");
  const [longTableCount, setLongTableCount] = useState("");
  const [longSeatsPerTable, setLongSeatsPerTable] = useState("");
  const [hasKidsTable, setHasKidsTable] = useState(true);

  const [groups, setGroups] = useState<SeatingGuestGroup[]>([
    { id: uid("grp"), name: "Друзі" },
    { id: uid("grp"), name: "" },
  ]);
  const [assignments, setAssignments] = useState<
    Record<string, SeatingGuestAssign>
  >({});
  const [menuKey, setMenuKey] = useState<string | null>(null);

  const showRound = formatNeedsRound(format);
  const showLong = formatNeedsLong(format);
  const flatGuests = useMemo(() => flattenGuests(guests), [guests]);

  const tablesDraft = useMemo<SeatingTablesDraft>(
    () => ({
      hasPresidium,
      presidiumSeats: Math.max(0, Number.parseInt(presidiumSeats, 10) || 0),
      format,
      roundTableCount,
      roundSeatsPerTable,
      longTableCount,
      longSeatsPerTable,
      hasKidsTable,
    }),
    [
      hasPresidium,
      presidiumSeats,
      format,
      roundTableCount,
      roundSeatsPerTable,
      longTableCount,
      longSeatsPerTable,
      hasKidsTable,
    ],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (menuKey) setMenuKey(null);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, menuKey]);

  useEffect(() => {
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
  }, [flatGuests, hasKidsTable]);

  function setAssign(key: string, value: SeatingGuestAssign) {
    setAssignments((prev) => {
      const next = { ...prev, [key]: value };
      const row = flatGuests.find((g) => g.key === key);
      if (row && !row.isPlusOne) {
        const plus = flatGuests.find((g) => g.linkedTo === key);
        if (plus) next[plus.key] = value;
      }
      if (row?.linkedTo) {
        // plus-one follows own select independently unless same — keep linked sync only parent→child
      }
      return next;
    });
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

  function headerBack() {
    if (step === 1) onClose();
    else setStep((s) => (s === 3 ? 2 : 1));
  }

  function footerLeft() {
    if (step === 1) onClose();
    else setStep((s) => (s === 3 ? 2 : 1));
  }

  function footerRight() {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      onComplete?.({
        tables: tablesDraft,
        guests: { groups, assignments },
      });
      return;
    }
  }

  const title =
    step === 1
      ? "Які столи у вас будуть?"
      : step === 2
        ? "Погрупуйте гостей для розсадки"
        : "Розсадка";

  return (
    <div
      className="seat-wiz-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seat-wiz-title"
    >
      <header className="seat-wiz-header">
        <button
          type="button"
          className="seat-wiz-back"
          aria-label="Назад"
          onClick={headerBack}
        >
          <BackIcon />
        </button>
        <BrandLogo className="seat-wiz-logo" />
      </header>

      <div className={`seat-wiz-body${step === 2 ? " is-narrow" : ""}`}>
        <Stepper current={step} />

        <h1 id="seat-wiz-title" className="seat-wiz-title">
          {title}
        </h1>

        {step === 1 ? (
          <StepTables
            hasPresidium={hasPresidium}
            setHasPresidium={setHasPresidium}
            presidiumSeats={presidiumSeats}
            setPresidiumSeats={setPresidiumSeats}
            format={format}
            setFormat={setFormat}
            showRound={showRound}
            showLong={showLong}
            roundTableCount={roundTableCount}
            setRoundTableCount={setRoundTableCount}
            roundSeatsPerTable={roundSeatsPerTable}
            setRoundSeatsPerTable={setRoundSeatsPerTable}
            longTableCount={longTableCount}
            setLongTableCount={setLongTableCount}
            longSeatsPerTable={longSeatsPerTable}
            setLongSeatsPerTable={setLongSeatsPerTable}
            hasKidsTable={hasKidsTable}
            setHasKidsTable={setHasKidsTable}
          />
        ) : null}

        {step === 2 ? (
          <StepGuests
            groups={groups}
            onAddGroup={addGroup}
            onUpdateGroup={updateGroup}
            onRemoveGroup={removeGroup}
            flatGuests={flatGuests}
            assignments={assignments}
            onAssign={setAssign}
            hasPresidium={hasPresidium}
            hasKidsTable={hasKidsTable}
            menuKey={menuKey}
            setMenuKey={setMenuKey}
          />
        ) : null}
      </div>

      <footer className="seat-wiz-footer">
        <button
          type="button"
          className="seat-wiz-btn seat-wiz-btn--ghost"
          onClick={footerLeft}
        >
          {step === 1 ? "Скасувати" : "Назад"}
        </button>
        <button
          type="button"
          className="seat-wiz-btn seat-wiz-btn--primary seat-wiz-btn--wide"
          onClick={footerRight}
        >
          {step === 1 ? "Далі" : "Розсадити автоматично"}
        </button>
      </footer>
    </div>
  );
}

function Stepper({ current }: { current: WizardStep }) {
  return (
    <ol className="seat-wiz-stepper" aria-label="Кроки розсадки">
      {STEPS.map((step, index) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <li
            key={step.id}
            className={`seat-wiz-step${active ? " is-active" : ""}${
              done ? " is-done" : ""
            }`}
          >
            {index > 0 ? (
              <span className="seat-wiz-step-line" aria-hidden />
            ) : null}
            <span className="seat-wiz-step-dot">
              {done ? <CheckIcon /> : step.id}
            </span>
            <span className="seat-wiz-step-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function StepTables({
  hasPresidium,
  setHasPresidium,
  presidiumSeats,
  setPresidiumSeats,
  format,
  setFormat,
  showRound,
  showLong,
  roundTableCount,
  setRoundTableCount,
  roundSeatsPerTable,
  setRoundSeatsPerTable,
  longTableCount,
  setLongTableCount,
  longSeatsPerTable,
  setLongSeatsPerTable,
  hasKidsTable,
  setHasKidsTable,
}: {
  hasPresidium: boolean;
  setHasPresidium: (v: boolean) => void;
  presidiumSeats: string;
  setPresidiumSeats: (v: string) => void;
  format: SeatingFormatId;
  setFormat: (v: SeatingFormatId) => void;
  showRound: boolean;
  showLong: boolean;
  roundTableCount: string;
  setRoundTableCount: (v: string) => void;
  roundSeatsPerTable: string;
  setRoundSeatsPerTable: (v: string) => void;
  longTableCount: string;
  setLongTableCount: (v: string) => void;
  longSeatsPerTable: string;
  setLongSeatsPerTable: (v: string) => void;
  hasKidsTable: boolean;
  setHasKidsTable: (v: boolean) => void;
}) {
  return (
    <div className="seat-wiz-stack">
      <section className="seat-wiz-card">
        <p className="seat-wiz-question">
          Чи буде президіум (головний стіл для наречених)?
        </p>
        <RadioGroup>
          <RadioOption
            selected={hasPresidium}
            onSelect={() => setHasPresidium(true)}
          >
            Так, буде президіум
          </RadioOption>
          <RadioOption
            selected={!hasPresidium}
            onSelect={() => setHasPresidium(false)}
          >
            Ні, без окремого президіуму
          </RadioOption>
        </RadioGroup>
        {hasPresidium ? (
          <TextInput
            id="presidium-seats"
            size="m"
            className="seat-wiz-field"
            label="Скільки людей за президіумом?"
            type="number"
            min={1}
            inputMode="numeric"
            value={presidiumSeats}
            onChange={(e) => setPresidiumSeats(e.target.value)}
          />
        ) : null}
      </section>

      <section className="seat-wiz-card">
        <h2 className="seat-wiz-card-title">Оберіть формат</h2>
        <div className="seat-wiz-formats" role="radiogroup">
          {FORMATS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={format === item.id}
              className={`seat-wiz-format${
                format === item.id ? " is-selected" : ""
              }`}
              onClick={() => setFormat(item.id)}
            >
              <span className="seat-wiz-format-icon" aria-hidden>
                <item.Icon />
              </span>
              <span className="seat-wiz-format-label">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {showRound ? (
        <section className="seat-wiz-card">
          <h2 className="seat-wiz-card-title">Налаштування круглих столів</h2>
          <div className="seat-wiz-fields">
            <TextInput
              id="round-count"
              size="m"
              label="Кількість круглих столів"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Наприклад: 5"
              value={roundTableCount}
              onChange={(e) => setRoundTableCount(e.target.value)}
            />
            <TextInput
              id="round-seats"
              size="m"
              label="Кількість гостей за круглим столом"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Наприклад: 10"
              value={roundSeatsPerTable}
              onChange={(e) => setRoundSeatsPerTable(e.target.value)}
            />
          </div>
        </section>
      ) : null}

      {showLong ? (
        <section className="seat-wiz-card">
          <h2 className="seat-wiz-card-title">Налаштування довгих столів</h2>
          <div className="seat-wiz-fields">
            <TextInput
              id="long-count"
              size="m"
              label="Кількість довгих столів"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Наприклад: 4"
              value={longTableCount}
              onChange={(e) => setLongTableCount(e.target.value)}
            />
            <TextInput
              id="long-seats"
              size="m"
              label="Кількість гостей за довгим столом"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Наприклад: 12"
              value={longSeatsPerTable}
              onChange={(e) => setLongSeatsPerTable(e.target.value)}
            />
          </div>
        </section>
      ) : null}

      <section className="seat-wiz-card">
        <p className="seat-wiz-question">Чи буде окремий дитячий стіл?</p>
        <RadioGroup>
          <RadioOption
            selected={hasKidsTable}
            onSelect={() => setHasKidsTable(true)}
          >
            Так, потрібен дитячий стіл
          </RadioOption>
          <RadioOption
            selected={!hasKidsTable}
            onSelect={() => setHasKidsTable(false)}
          >
            Ні, діти сидітимуть з батьками
          </RadioOption>
        </RadioGroup>
      </section>
    </div>
  );
}

function StepGuests({
  groups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  flatGuests,
  assignments,
  onAssign,
  hasPresidium,
  hasKidsTable,
  menuKey,
  setMenuKey,
}: {
  groups: SeatingGuestGroup[];
  onAddGroup: () => void;
  onUpdateGroup: (id: string, name: string) => void;
  onRemoveGroup: (id: string) => void;
  flatGuests: FlatGuest[];
  assignments: Record<string, SeatingGuestAssign>;
  onAssign: (key: string, value: SeatingGuestAssign) => void;
  hasPresidium: boolean;
  hasKidsTable: boolean;
  menuKey: string | null;
  setMenuKey: (key: string | null) => void;
}) {
  const namedGroups = groups.filter((g) => g.name.trim());

  return (
    <div className="seat-wiz-stack">
      <section className="seat-wiz-card">
        <h2 className="seat-wiz-card-title">Створіть групи гостей</h2>
        <p className="seat-wiz-card-lead">
          Групи допомагають швидше розсадити гостей автоматично — друзі разом,
          родичі поруч, колеги за одним столом.
        </p>

        <div className="seat-wiz-group-list">
          {groups.map((group, index) => (
            <div key={group.id} className="seat-wiz-group-row">
              <div className="seat-wiz-group-field">
                <TextInput
                  id={`seat-group-${group.id}`}
                  size="m"
                  className="seat-wiz-group-text"
                  label={`Група ${index + 1}`}
                  type="text"
                  placeholder="Наприклад: Родина Романа"
                  value={group.name}
                  onChange={(e) => onUpdateGroup(group.id, e.target.value)}
                />
                <button
                  type="button"
                  className="seat-wiz-icon-btn"
                  aria-label="Видалити групу"
                  onClick={() => onRemoveGroup(group.id)}
                  disabled={groups.length <= 1}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="seat-wiz-add-btn"
          onClick={onAddGroup}
        >
          <AddCircleIcon />
          Додати групу
        </button>
      </section>

      <section className="seat-wiz-card">
        <h2 className="seat-wiz-card-title">Гості</h2>
        <p className="seat-wiz-card-lead">
          Об’єднайте гостей у групи або залиште без групи. Іконка{" "}
          <LinkGlyph /> означає, що гості сидітимуть разом.
        </p>

        <div className="seat-wiz-guest-list">
          {flatGuests.length === 0 ? (
            <p className="seat-wiz-card-lead">Список гостей порожній.</p>
          ) : (
            flatGuests.map((row, index) => {
              const next = flatGuests[index + 1];
              const clusterStart =
                row.linkedTo === null && next?.linkedTo === row.key;
              const clusterMid = Boolean(row.linkedTo);
              const assign = assignments[row.key] ?? null;

              return (
                <div
                  key={row.key}
                  className={`seat-wiz-guest-row${
                    clusterStart || clusterMid ? " is-linked" : ""
                  }${clusterStart ? " is-cluster-start" : ""}${
                    clusterMid ? " is-cluster-mid" : ""
                  }`}
                >
                  <div className="seat-wiz-guest-name">
                    {clusterMid ? (
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
                      onChange={(v) => onAssign(row.key, v)}
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
                                onAssign(row.key, "presidium");
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
                                onAssign(row.key, "kids");
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
                              onAssign(row.key, null);
                              setMenuKey(null);
                            }}
                          >
                            Без групи
                          </button>
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
  if (value === "presidium") {
    return <span className="seat-wiz-badge seat-wiz-badge--presidium">Президіум</span>;
  }
  if (value === "kids") {
    return (
      <span className="seat-wiz-badge seat-wiz-badge--kids">дитячий стіл</span>
    );
  }
  if (typeof value === "string") {
    const group = groups.find((g) => g.id === value);
    if (group) {
      const color =
        GROUP_BADGE_COLORS[
          Math.abs(hashStr(group.id)) % GROUP_BADGE_COLORS.length
        ];
      return (
        <button
          type="button"
          className="seat-wiz-badge"
          style={{ background: color }}
          onClick={() => onChange(null)}
          title="Змінити групу"
        >
          {group.name}
        </button>
      );
    }
  }

  return (
    <label className="seat-wiz-assign">
      <span className="seat-wiz-sr">Обрати групу</span>
      <select
        value=""
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
        {hasPresidium ? (
          <option value="presidium">Президіум</option>
        ) : null}
        {hasKidsTable ? <option value="kids">Дитячий стіл</option> : null}
      </select>
      <ChevronIcon />
    </label>
  );
}

function sideLabel(side: Guest["side"]) {
  if (side === "BRIDE") return "Сторона нареченої";
  if (side === "GROOM") return "Сторона нареченого";
  if (side === "BOTH") return "Спільні";
  return "Інше";
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}


function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12.5 4.5 7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.2 4.8 8.5 9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3.5 5.5h11M7 5.5V4.2A1.2 1.2 0 0 1 8.2 3h1.6A1.2 1.2 0 0 1 11 4.2v1.3M6.2 5.5l.5 8.2a1 1 0 0 0 1 .9h2.6a1 1 0 0 0 1-.9l.5-8.2"
        stroke="#ff4200"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function FormatIconPresidiumRound() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden>
      <rect x="18" y="4" width="52" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="22" cy="36" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="44" cy="36" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="66" cy="36" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FormatIconPresidiumLong() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden>
      <rect x="18" y="4" width="52" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="26" width="28" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="48" y="26" width="28" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="40" width="28" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="48" y="40" width="28" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FormatIconPresidiumMixed() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden>
      <rect x="18" y="4" width="52" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="28" width="24" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="48" cy="36" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="70" cy="36" r="8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="42" width="24" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FormatIconP() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden>
      <rect x="14" y="8" width="10" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="24" y="8" width="50" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="64" y="8" width="10" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FormatIconT() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden>
      <rect x="14" y="10" width="60" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="39" y="20" width="10" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
