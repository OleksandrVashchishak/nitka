"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BrandLogo } from "@/components/brand-logo";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import { RadioGroup, RadioOption } from "@/components/ui/radio";
import { TextInput } from "@/components/ui/text-input";
import type { Guest } from "@/lib/guests-api";
import { GuestRowMenu } from "@/components/seating-plan-popovers";
import { IconBaby } from "@/components/icon-baby";
import {
  ResponsibleAvatar,
  ResponsibleAvatarDuo,
} from "@/components/responsible-avatar";
import {
  applyLinkedAssign,
  clusterFlags,
  orderDetachedLast,
  flattenSeatingGuests,
  type SeatingFlatGuest,
  SEATING_GROUP_COLORS,
} from "@/lib/seating-guests";
import "@/styles/seating/wizard.scss";

export type SeatingFormatId =
  | "round"
  | "long"
  | "mixed"
  | "p-shape"
  | "t-shape";

export type KidsTableShape = "round" | "long";

export type SeatingTablesDraft = {
  hasPresidium: boolean;
  presidiumSeats: number;
  format: SeatingFormatId;
  roundTableCount: string;
  roundSeatsPerTable: string;
  longTableCount: string;
  longSeatsPerTable: string;
  hasKidsTable: boolean;
  kidsTableCount: string;
  kidsTableShape: KidsTableShape;
};

const LEGACY_FORMAT_MAP: Record<string, SeatingFormatId> = {
  "presidium-round": "round",
  "presidium-long": "long",
  "presidium-mixed": "mixed",
};

export function normalizeSeatingFormat(id: unknown): SeatingFormatId {
  if (typeof id !== "string") return "round";
  if (id in LEGACY_FORMAT_MAP) return LEGACY_FORMAT_MAP[id]!;
  if (
    id === "round" ||
    id === "long" ||
    id === "mixed" ||
    id === "p-shape" ||
    id === "t-shape"
  ) {
    return id;
  }
  return "round";
}

export type SeatingGuestGroup = {
  id: string;
  name: string;
};

export type SeatingGuestAssign = string | "presidium" | "kids" | null;

export type SeatingGuestsDraft = {
  groups: SeatingGuestGroup[];
  assignments: Record<string, SeatingGuestAssign>;
  /** Locally unlinked companion keys (wizard / plan). */
  detachedKeys: string[];
};

type WizardStep = 1 | 2 | 3;

type Props = {
  guests: Guest[];
  partnerOneName?: string;
  partnerTwoName?: string;
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

const GROUP_BADGE_COLORS = SEATING_GROUP_COLORS;

function formatNeedsRound(format: SeatingFormatId) {
  return format === "round" || format === "mixed";
}

function formatNeedsLong(format: SeatingFormatId) {
  return format === "long" || format === "mixed";
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

type FlatGuest = SeatingFlatGuest;

type FormatItem = {
  id: SeatingFormatId;
  label: string;
  Icon: () => ReactNode;
};

const FORMATS: FormatItem[] = [
  { id: "round", label: "Круглі столи", Icon: FormatIconRound },
  { id: "long", label: "Довгі столи", Icon: FormatIconLong },
  { id: "mixed", label: "Довгі + Круглі", Icon: FormatIconMixed },
  { id: "p-shape", label: "П-форма", Icon: FormatIconP },
  { id: "t-shape", label: "Т-форма", Icon: FormatIconT },
];

export function SeatingWizard({
  guests,
  partnerOneName = "",
  partnerTwoName = "",
  onClose,
  onComplete,
}: Props) {
  const [step, setStep] = useState<WizardStep>(1);

  const [hasPresidium, setHasPresidium] = useState(false);
  const [presidiumSeats, setPresidiumSeats] = useState("6");
  const [format, setFormat] = useState<SeatingFormatId>("round");
  const [roundTableCount, setRoundTableCount] = useState("");
  const [roundSeatsPerTable, setRoundSeatsPerTable] = useState("");
  const [longTableCount, setLongTableCount] = useState("");
  const [longSeatsPerTable, setLongSeatsPerTable] = useState("");
  const [hasKidsTable, setHasKidsTable] = useState(true);
  const [kidsTableCount, setKidsTableCount] = useState("");
  const [kidsTableShape, setKidsTableShape] =
    useState<KidsTableShape>("round");

  const [groups, setGroups] = useState<SeatingGuestGroup[]>([]);
  const [assignments, setAssignments] = useState<
    Record<string, SeatingGuestAssign>
  >({});
  const [detachedKeys, setDetachedKeys] = useState<Set<string>>(new Set());
  const [menuKey, setMenuKey] = useState<string | null>(null);

  const showRound = formatNeedsRound(format);
  const showLong = formatNeedsLong(format);
  const flatGuests = useMemo(() => flattenSeatingGuests(guests), [guests]);

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
      kidsTableCount,
      kidsTableShape,
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
      kidsTableCount,
      kidsTableShape,
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
  }, [flatGuests, hasKidsTable]);

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
        guests: {
          groups,
          assignments,
          detachedKeys: Array.from(detachedKeys),
        },
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
          <span className="seat-wiz-back-label">Назад</span>
        </button>
        <BrandLogo className="seat-wiz-logo" />
      </header>

      <div className={"seat-wiz-body is-narrow"}>
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
            kidsTableCount={kidsTableCount}
            setKidsTableCount={setKidsTableCount}
            kidsTableShape={kidsTableShape}
            setKidsTableShape={setKidsTableShape}
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
            detachedKeys={detachedKeys}
            onDetach={detachGuest}
            hasPresidium={hasPresidium}
            hasKidsTable={hasKidsTable}
            menuKey={menuKey}
            setMenuKey={setMenuKey}
            partnerOneName={partnerOneName}
            partnerTwoName={partnerTwoName}
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
          className={`seat-wiz-btn seat-wiz-btn--primary seat-wiz-btn--wide${
            step === 2 ? " seat-wiz-btn--lime-text" : ""
          }`}
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
  kidsTableCount,
  setKidsTableCount,
  kidsTableShape,
  setKidsTableShape,
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
  kidsTableCount: string;
  setKidsTableCount: (v: string) => void;
  kidsTableShape: KidsTableShape;
  setKidsTableShape: (v: KidsTableShape) => void;
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
        {hasKidsTable ? (
          <>
            <TextInput
              id="kids-count"
              size="m"
              className="seat-wiz-field"
              label="Кількість дитячих столів"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="Наприклад: 5"
              value={kidsTableCount}
              onChange={(e) => setKidsTableCount(e.target.value)}
            />
            <p className="seat-wiz-question seat-wiz-field">
              Круглий чи довгий?
            </p>
            <RadioGroup>
              <RadioOption
                selected={kidsTableShape === "round"}
                onSelect={() => setKidsTableShape("round")}
              >
                Круглий
              </RadioOption>
              <RadioOption
                selected={kidsTableShape === "long"}
                onSelect={() => setKidsTableShape("long")}
              >
                Довгий
              </RadioOption>
            </RadioGroup>
          </>
        ) : null}
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
  detachedKeys,
  onDetach,
  hasPresidium,
  hasKidsTable,
  menuKey,
  setMenuKey,
  partnerOneName,
  partnerTwoName,
}: {
  groups: SeatingGuestGroup[];
  onAddGroup: () => void;
  onUpdateGroup: (id: string, name: string) => void;
  onRemoveGroup: (id: string) => void;
  flatGuests: FlatGuest[];
  assignments: Record<string, SeatingGuestAssign>;
  onAssign: (key: string, value: SeatingGuestAssign) => void;
  detachedKeys: Set<string>;
  onDetach: (keys: string | string[]) => void;
  hasPresidium: boolean;
  hasKidsTable: boolean;
  menuKey: string | null;
  setMenuKey: (key: string | null) => void;
  partnerOneName: string;
  partnerTwoName: string;
}) {
  const namedGroups = groups.filter((g) => g.name.trim());

  return (
    <div className="seat-wiz-stack">
      <section className="seat-wiz-card">
        <h2 className="seat-wiz-card-title">Створіть групи гостей</h2>
        <p className="seat-wiz-card-lead">
          Створіть групи гостей (наприклад, друзі, колеги ітд), щоб було
          зручніше розсаджувати гостей та орієнтуватися в розсадці.
          Автоматична розсадка посадить усіх по групах.
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
                  className="seat-wiz-icon-btn seat-wiz-icon-btn--danger"
                  aria-label="Видалити групу"
                  onClick={() => onRemoveGroup(group.id)}
                >
                  <IconTrash size={22} />
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
          Додайте гостей в групи. Перегляньте гостей, якщо деякі з них
          пов’язані, вони будуть посаджені завжди разом. Ви можете їх
          роз’єднати, натиснувши на 3 крапки і вибравши опцію “Від’єднати”.
        </p>

        <div className="seat-wiz-guest-list">
          {flatGuests.length === 0 ? (
            <p className="seat-wiz-card-lead">Список гостей порожній.</p>
          ) : (
            orderDetachedLast(flatGuests, detachedKeys).map((row, index, shown) => {
              const linked =
                Boolean(row.linkedTo) && !detachedKeys.has(row.key);
              const cluster = clusterFlags(shown, index, (r) =>
                detachedKeys.has(r.key) ? null : (r.linkedTo ?? r.key),
              );
              const linkedName = linked
                ? (flatGuests.find((g) => g.key === row.linkedTo)?.name ??
                  null)
                : null;
              const assign = assignments[row.key] ?? null;

              return (
                <div
                  key={row.key}
                  className={`seat-wiz-guest-row${
                    cluster.linked ? " is-linked" : ""
                  }${cluster.start ? " is-cluster-start" : ""}${
                    cluster.mid ? " is-cluster-mid" : ""
                  }${cluster.end ? " is-cluster-end" : ""}`}
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
                        onChange={(v) => onAssign(row.key, v)}
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
                            onDetach={() => {
                              onDetach(row.key);
                              setMenuKey(null);
                            }}
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
        {hasPresidium ? (
          <option value="presidium">Президіум</option>
        ) : null}
        {hasKidsTable ? <option value="kids">Дитячий стіл</option> : null}
      </select>
      <ChevronIcon />
    </label>
  );
}

export function SideAvatar({
  side,
  partnerOneName,
  partnerTwoName,
}: {
  side: Guest["side"];
  partnerOneName: string;
  partnerTwoName: string;
}) {
  if (side === "BRIDE" || side === "GROOM") {
    const name = side === "GROOM" ? partnerTwoName : partnerOneName;
    return (
      <ResponsibleAvatar
        name={name || undefined}
        tone={side === "GROOM" ? "partner" : "owner"}
        title={sideLabel(side)}
        className="seat-wiz-side-dot"
      />
    );
  }
  return (
    <ResponsibleAvatarDuo
      ownerName={partnerOneName}
      partnerName={partnerTwoName}
      title={sideLabel(side)}
      className="seat-wiz-side-dot"
    />
  );
}

function sideLabel(side: Guest["side"]) {
  if (side === "BRIDE") return "Сторона нареченої";
  if (side === "GROOM") return "Сторона нареченого";
  if (side === "BOTH") return "Спільні";
  return "Інше";
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

function AddCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7 10h6M10 7v6"
        stroke="currentColor"
        strokeWidth="1.75"
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

/** Format picker icons — geometry from Figma Frame SVG (140×70 artboard). */

function FormatIconRound() {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" aria-hidden>
      <RoundTableIcon
        cx={45.39}
        cy={23.75}
        r={7.6}
        chairs={[
          [43.69, 10.3],
          [54.09, 16.3],
          [54.09, 28.3],
          [43.69, 34.3],
          [33.3, 28.3],
          [33.3, 16.3],
        ]}
      />
      <RoundTableIcon
        cx={95.39}
        cy={20.75}
        r={7.6}
        chairs={[
          [93.69, 7.3],
          [104.09, 13.3],
          [104.09, 25.3],
          [93.69, 31.3],
          [83.3, 25.3],
          [83.3, 13.3],
        ]}
      />
      <RoundTableIcon
        cx={70.39}
        cy={48.75}
        r={7.6}
        chairs={[
          [68.69, 35.3],
          [79.09, 41.3],
          [79.09, 53.3],
          [68.69, 59.3],
          [58.3, 53.3],
          [58.3, 41.3],
        ]}
      />
    </svg>
  );
}

function FormatIconLong() {
  const xs = [25.52, 37.75, 49.97, 62.19, 74.41, 86.63, 98.86, 111.08];
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" aria-hidden>
      <LongTableIcon x={15.4} y={8.4} w={109.2} h={5.2} seatXs={xs} />
      <LongTableIcon x={15.4} y={30.4} w={109.2} h={5.2} seatXs={xs} />
      <LongTableIcon x={15.4} y={52.4} w={109.2} h={5.2} seatXs={xs} />
    </svg>
  );
}

function FormatIconMixed() {
  const leftXs = [28.3, 37.3, 46.3, 55.3];
  const rightXs = [81.3, 90.3, 99.3, 108.3];
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" aria-hidden>
      <LongTableIcon x={21.4} y={12.9} w={44.2} h={4.2} seatXs={leftXs} />
      <LongTableIcon x={74.4} y={12.9} w={44.2} h={4.2} seatXs={rightXs} />
      <RoundTableIcon
        cx={35}
        cy={42}
        r={6.6}
        chairs={[
          [33.3, 29.55],
          [42.83, 35.05],
          [42.83, 46.05],
          [33.3, 51.55],
          [23.78, 46.05],
          [23.78, 35.05],
        ]}
      />
      <RoundTableIcon
        cx={70}
        cy={48}
        r={6.6}
        chairs={[
          [68.3, 35.55],
          [77.83, 41.05],
          [77.83, 52.05],
          [68.3, 57.55],
          [58.78, 52.05],
          [58.78, 41.05],
        ]}
      />
      <RoundTableIcon
        cx={105}
        cy={42}
        r={6.6}
        chairs={[
          [103.3, 29.55],
          [112.83, 35.05],
          [112.83, 46.05],
          [103.3, 51.55],
          [93.78, 46.05],
          [93.78, 35.05],
        ]}
      />
    </svg>
  );
}

function FormatIconP() {
  const sideYsOuter = [20.3, 28.3, 36.3, 44.3, 52.3];
  const sideYsInner = [28.3, 36.3, 44.3, 52.3];
  const topXs = [50.3, 61.55, 72.8, 84.05];
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" aria-hidden>
      <rect
        x="45.4"
        y="14.4"
        width="48.2"
        height="5.2"
        rx="1.6"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect
        x="44.9"
        y="14.4"
        width="5.2"
        height="47.2"
        rx="1.1"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect
        x="88.9"
        y="14.4"
        width="5.2"
        height="47.2"
        rx="1.1"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {topXs.map((x) => (
        <ChairH key={`t-${x}`} x={x} y={9.3} />
      ))}
      {sideYsOuter.map((y) => (
        <ChairV key={`lo-${y}`} x={39.3} y={y} />
      ))}
      {sideYsInner.map((y) => (
        <ChairV key={`li-${y}`} x={52.8} y={y} />
      ))}
      {sideYsInner.map((y) => (
        <ChairV key={`ri-${y}`} x={83.3} y={y} />
      ))}
      {sideYsOuter.map((y) => (
        <ChairV key={`ro-${y}`} x={96.8} y={y} />
      ))}
    </svg>
  );
}

function FormatIconT() {
  const topXs = [32.3, 42.3, 53.3, 63.3, 74.3, 84.3, 95.3, 106.3];
  const sideYs = [24.3, 32.3, 40.3, 48.3, 56.3];
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" aria-hidden>
      <rect
        x="28.4"
        y="9.4"
        width="86.2"
        height="5.2"
        rx="1.6"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect
        x="67.4"
        y="18.4"
        width="5.2"
        height="47.2"
        rx="1.1"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {topXs.map((x) => (
        <ChairH key={`t-${x}`} x={x} y={4.3} />
      ))}
      {sideYs.map((y) => (
        <ChairV key={`l-${y}`} x={61.8} y={y} />
      ))}
      {sideYs.map((y) => (
        <ChairV key={`r-${y}`} x={75.3} y={y} />
      ))}
    </svg>
  );
}

function ChairH({ x, y }: { x: number; y: number }) {
  return (
    <rect
      x={x}
      y={y}
      width="3.4"
      height="2.9"
      rx="1.2"
      fill="#fff"
      stroke="currentColor"
      strokeWidth="0.6"
    />
  );
}

function ChairV({ x, y }: { x: number; y: number }) {
  return (
    <rect
      x={x}
      y={y}
      width="2.9"
      height="3.4"
      rx="1.2"
      fill="#fff"
      stroke="currentColor"
      strokeWidth="0.6"
    />
  );
}

function RoundTableIcon({
  cx,
  cy,
  r,
  chairs,
}: {
  cx: number;
  cy: number;
  r: number;
  chairs: [number, number][];
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {chairs.map(([x, y], i) => (
        <ChairH key={i} x={x} y={y} />
      ))}
    </g>
  );
}

function LongTableIcon({
  x,
  y,
  w,
  h,
  seatXs,
  gap = 2.7,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seatXs: number[];
  gap?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="1.1"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {seatXs.map((sx) => (
        <g key={sx}>
          <ChairH x={sx} y={y - gap - 2.9} />
          <ChairH x={sx} y={y + h + gap} />
        </g>
      ))}
    </g>
  );
}
