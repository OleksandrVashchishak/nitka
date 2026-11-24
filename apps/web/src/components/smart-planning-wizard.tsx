"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FLAGS, type FlagId } from "@/lib/smart-planning-config";
import {
  buildPlan,
  groupByCategory,
  labels,
  pluralTasks,
  pruneDoneIds,
  sortByDue,
  step2Templates,
  todayIso,
  type PlanTask,
} from "@/lib/smart-planning";
import { toast } from "@/lib/toast";

type Props = {
  partnerInitials: string;
  /** YYYY-MM-DD або null, якщо дати весілля немає. */
  weddingDate: string | null;
  /** templateId задач, що вже є у вкладці «Завдання» (5.7). */
  existingTemplateIds: ReadonlySet<string>;
  onClose: () => void;
  onComplete: (tasks: PlanTask[]) => Promise<void>;
};

const FLAG_GROUPS = [1, 2, 3, 4, 5].map((group) =>
  FLAGS.filter((flag) => flag.group === group),
);

function formatDue(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function toggleIn<T>(set: ReadonlySet<T>, id: T) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="smart-plan-stepper" aria-label="Кроки планування">
      {([1, 2, 3] as const).map((n, i) => {
        const done = n < step;
        const active = n === step;
        return (
          <li
            key={n}
            className={`smart-plan-step${active ? " is-active" : ""}${
              done ? " is-done" : ""
            }`}
          >
            {i > 0 ? <span className="smart-plan-step-line" aria-hidden /> : null}
            <span className="smart-plan-step-dot">
              {done ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 9L10.5 14.5L8 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                n
              )}
            </span>
            <span className="smart-plan-step-label">Крок {n}</span>
          </li>
        );
      })}
    </ol>
  );
}

function IconTrashSmall() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.25 3.48844C10.3075 3.29594 8.35333 3.19678 6.405 3.19678C5.25 3.19678 4.095 3.25511 2.94 3.37178L1.75 3.48844" />
      <path d="M4.95801 2.899L5.08634 2.13484C5.17967 1.58067 5.24967 1.1665 6.23551 1.1665H7.76384C8.74968 1.1665 8.82551 1.604 8.91301 2.14067L9.04134 2.899" />
      <path d="M10.9956 5.33154L10.6164 11.2057C10.5522 12.1215 10.4997 12.8332 8.87224 12.8332H5.12724C3.49974 12.8332 3.44724 12.1215 3.38307 11.2057L3.00391 5.33154" />
      <path d="M6.02539 9.625H7.96789" />
      <path d="M5.54199 7.2915H8.45866" />
    </svg>
  );
}

export function SmartPlanningWizard({
  partnerInitials,
  weddingDate,
  existingTemplateIds,
  onClose,
  onComplete,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [flags, setFlags] = useState<Set<FlagId>>(() => new Set());
  // 4.4: якщо дата весілля є — «Обрали дату весілля» відмічено одразу.
  const [doneIds, setDoneIds] = useState<Set<string>>(
    () => new Set(weddingDate ? ["pick_date"] : []),
  );
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  /** Явно розгорнуті/згорнуті блоки кроку 2; решта — за правилом «перші 3». */
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const today = useMemo(() => todayIso(), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const step2Groups = useMemo(
    () => groupByCategory(step2Templates(flags, existingTemplateIds)),
    [flags, existingTemplateIds],
  );

  const plan = useMemo(
    () =>
      buildPlan({
        flags,
        doneIds,
        deletedIds,
        existingTemplateIds,
        weddingDate,
        today,
      }),
    [flags, doneIds, deletedIds, existingTemplateIds, weddingDate, today],
  );

  const planGroups = useMemo(
    () =>
      groupByCategory(plan).map((group) => ({
        ...group,
        items: weddingDate ? sortByDue(group.items) : group.items,
      })),
    [plan, weddingDate],
  );

  // 4.5: відмітки шаблонів, що стали невидимими, прибираємо.
  useEffect(() => {
    setDoneIds((prev) => pruneDoneIds(prev, flags));
  }, [flags]);

  function toggleFlag(id: FlagId) {
    setFlags((prev) => toggleIn(prev, id));
  }

  function toggleBlock(ids: string[]) {
    setDoneIds((prev) => {
      const allOn = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      for (const id of ids) {
        if (allOn) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  function removeTask(task: PlanTask) {
    setDeletedIds((prev) => new Set(prev).add(task.id));
    toast.action(
      "Завдання видалено",
      {
        label: "Повернути",
        onClick: () =>
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(task.id);
            return next;
          }),
      },
      { duration: 5000 },
    );
  }

  async function submit() {
    if (submitting || plan.length === 0) return;
    setSubmitting(true);
    try {
      await onComplete(plan);
    } finally {
      setSubmitting(false);
    }
  }

  const n = plan.length;

  return (
    <div className="smart-plan-root" role="dialog" aria-modal="true">
      <header className="smart-plan-top">
        <BrandLogo className="smart-plan-logo" />
        <CabinetProfileMenu initials={partnerInitials} />
      </header>

      <div className="smart-plan-back-row">
        <button type="button" className="smart-plan-back" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M6.99982 2.91602L2.91602 6.99982L6.99982 11.0836M2.91602 6.99982H11.0836"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Назад до Завдань
        </button>
      </div>

      <div className="smart-plan-body">
        <Stepper step={step} />

        {step === 1 ? (
          <>
            <h1 className="smart-plan-title">Що буде на вашому весіллі?</h1>
            <p className="smart-plan-subtitle">
              Оберіть все, що плануєте мати на весіллі — це допоможе нам скласти
              точний план.
            </p>
            <div className="smart-plan-card">
              {FLAG_GROUPS.map((group, gi) => (
                <ul
                  key={gi}
                  className={`smart-plan-option-list${
                    gi > 0 ? " smart-plan-option-list--gap" : ""
                  }`}
                >
                  {group.map((flag) => {
                    const checked = flags.has(flag.id);
                    return (
                      <li key={flag.id}>
                        <button
                          type="button"
                          className={`smart-plan-option${checked ? " is-on" : ""}`}
                          onClick={() => toggleFlag(flag.id)}
                        >
                          <Checkbox checked={checked} />
                          <span>{flag.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 className="smart-plan-title">Що ви вже зробили?</h1>
            <p className="smart-plan-subtitle">
              Оберіть пункти, які ви вже встигли реалізувати. Це допоможе нам
              відсіяти зайве.
            </p>
            <div className="smart-plan-groups">
              {step2Groups.map((group, index) => {
                const ids = group.items.map((t) => t.id);
                const onCount = ids.filter((id) => doneIds.has(id)).length;
                const allOn = onCount === ids.length;
                const someOn = onCount > 0 && !allOn;
                const open = openBlocks[group.id] ?? index < 3;
                return (
                  <section
                    key={group.id}
                    className="smart-plan-card smart-plan-group"
                  >
                    <div className="smart-plan-group-row">
                      <button
                        type="button"
                        className={`smart-plan-group-head${allOn ? " is-on" : ""}${
                          someOn ? " is-partial" : ""
                        }`}
                        onClick={() => toggleBlock(ids)}
                      >
                        <Checkbox checked={allOn} indeterminate={someOn} />
                        <span>{group.title}</span>
                      </button>
                      <button
                        type="button"
                        className={`smart-plan-chevron${open ? " is-open" : ""}`}
                        aria-expanded={open}
                        aria-label={open ? "Згорнути" : "Розгорнути"}
                        onClick={() =>
                          setOpenBlocks((prev) => ({ ...prev, [group.id]: !open }))
                        }
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    {open ? (
                      <ul className="smart-plan-option-list">
                        {group.items.map((t) => {
                          const checked = doneIds.has(t.id);
                          return (
                            <li key={t.id}>
                              <button
                                type="button"
                                className={`smart-plan-option${
                                  checked ? " is-on" : ""
                                }`}
                                onClick={() => setDoneIds((prev) => toggleIn(prev, t.id))}
                              >
                                <Checkbox checked={checked} />
                                <span>{labels(t, flags).step2}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="smart-plan-title">Ваш персональний план</h1>
            {n === 0 ? (
              <div className="smart-plan-empty">
                <p>Схоже, ви вже все зробили!</p>
                <Button type="button" tone="black" size="m" onClick={onClose}>
                  Повернутися до завдань
                </Button>
              </div>
            ) : (
              <>
                <p className="smart-plan-subtitle">
                  Ми сформували{" "}
                  <strong>
                    {n} {pluralTasks(n)}
                  </strong>{" "}
                  на основі ваших відповідей. Перегляньте список і видаліть
                  зайве.
                </p>
                {!weddingDate ? (
                  <aside className="smart-plan-date-banner">
                    Вкажіть дату весілля, щоб ми розставили дедлайни.{" "}
                    <Link href="/settings">Вказати дату</Link>
                  </aside>
                ) : null}
                <div className="smart-plan-result-grid">
                  {[0, 1].map((col) => (
                    <div key={col} className="smart-plan-result-col">
                      {planGroups
                        .filter((_, i) => i % 2 === col)
                        .map((group) => (
                          <section key={group.id} className="smart-plan-card">
                            <h2 className="smart-plan-cat-title">{group.title}</h2>
                            <ul className="smart-plan-result-list">
                              {group.items.map((task) => (
                                <li key={task.id}>
                                  <span className="smart-plan-task">
                                    <span>{task.labels.step3}</span>
                                    {task.dueDate || task.isUrgent ? (
                                      <span className="smart-plan-task-meta">
                                        {task.dueDate ? (
                                          <span>до {formatDue(task.dueDate)}</span>
                                        ) : null}
                                        {task.isUrgent ? (
                                          <span className="smart-plan-urgent">
                                            Терміново
                                          </span>
                                        ) : null}
                                      </span>
                                    ) : null}
                                  </span>
                                  <button
                                    type="button"
                                    className="smart-plan-trash"
                                    aria-label={`Видалити «${task.labels.step3}»`}
                                    onClick={() => removeTask(task)}
                                  >
                                    <IconTrashSmall />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>

      <footer className="smart-plan-footer">
        {step === 1 ? (
          <Button
            type="button"
            tone="ghost"
            size="m"
            className="smart-plan-btn is-ghost"
            onClick={onClose}
          >
            Скасувати
          </Button>
        ) : (
          <Button
            type="button"
            tone="ghost"
            size="m"
            className="smart-plan-btn is-ghost"
            onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
          >
            Назад
          </Button>
        )}
        {step !== 3 ? (
          <Button
            type="button"
            tone="black"
            size="m"
            className="smart-plan-btn is-primary"
            onClick={() => setStep((s) => (s === 1 ? 2 : 3))}
          >
            Далі
          </Button>
        ) : n > 0 ? (
          <Button
            type="button"
            tone="ink"
            size="m"
            className="smart-plan-btn is-primary is-lime"
            disabled={submitting}
            loading={submitting}
            loadingText="Додаємо…"
            onClick={() => void submit()}
          >
            Додати завдання до списку
          </Button>
        ) : null}
      </footer>
    </div>
  );
}
