"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SMART_DONE_GROUPS,
  SMART_FEATURES,
  buildSmartPlan,
  type SmartDoneId,
  type SmartFeatureId,
  type SmartPlanTask,
} from "@/lib/smart-planning";

type Props = {
  partnerInitials: string;
  onClose: () => void;
  onComplete: (tasks: SmartPlanTask[]) => Promise<void>;
};

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

export function SmartPlanningWizard({
  partnerInitials,
  onClose,
  onComplete,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [features, setFeatures] = useState<Set<SmartFeatureId>>(new Set());
  const [done, setDone] = useState<Set<SmartDoneId>>(new Set());
  const [planTasks, setPlanTasks] = useState<SmartPlanTask[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const planGroups = useMemo(() => {
    if (step !== 3) return [];
    const ids = new Set(planTasks.map((t) => t.id));
    return buildSmartPlan(features, done)
      .map((g) => ({
        ...g,
        tasks: g.tasks.filter((t) => ids.has(t.id)),
      }))
      .filter((g) => g.tasks.length > 0);
  }, [step, planTasks, features, done]);

  function toggleFeature(id: SmartFeatureId) {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleDone(id: SmartDoneId) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleGroup(groupId: string) {
    const group = SMART_DONE_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const allOn = group.items.every((item) => done.has(item.id));
    setDone((prev) => {
      const next = new Set(prev);
      for (const item of group.items) {
        if (allOn) next.delete(item.id);
        else next.add(item.id);
      }
      return next;
    });
  }

  function goToStep3() {
    const groups = buildSmartPlan(features, done);
    setPlanTasks(groups.flatMap((g) => g.tasks));
    setStep(3);
  }

  function removePlanTask(id: string) {
    setPlanTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function submit() {
    if (submitting || planTasks.length === 0) return;
    setSubmitting(true);
    try {
      await onComplete(planTasks);
    } finally {
      setSubmitting(false);
    }
  }

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
              <ul className="smart-plan-option-list">
                {SMART_FEATURES.map((item) => {
                  const checked = features.has(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`smart-plan-option${checked ? " is-on" : ""}`}
                        onClick={() => toggleFeature(item.id)}
                      >
                        <Checkbox checked={checked} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 className="smart-plan-title">Що ви уже зробили?</h1>
            <p className="smart-plan-subtitle">
              Оберіть пункти, які ви вже встигли реалізувати. Це допоможе нам
              відсіяти зайве.
            </p>
            <div className="smart-plan-groups">
              {SMART_DONE_GROUPS.map((group) => {
                const allOn = group.items.every((item) => done.has(item.id));
                const someOn =
                  !allOn && group.items.some((item) => done.has(item.id));
                return (
                  <section key={group.id} className="smart-plan-card smart-plan-group">
                    <button
                      type="button"
                      className={`smart-plan-group-head${allOn ? " is-on" : ""}${
                        someOn ? " is-partial" : ""
                      }`}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <Checkbox checked={allOn} indeterminate={someOn} />
                      <span>{group.title}</span>
                    </button>
                    <ul className="smart-plan-option-list">
                      {group.items.map((item) => {
                        const checked = done.has(item.id);
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              className={`smart-plan-option${
                                checked ? " is-on" : ""
                              }`}
                              onClick={() => toggleDone(item.id)}
                            >
                              <Checkbox checked={checked} />
                              <span>{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="smart-plan-title">Ваш персональний план</h1>
            <p className="smart-plan-subtitle">
              Ми сформували {planTasks.length}{" "}
              {planTasks.length === 1
                ? "завдання"
                : planTasks.length < 5
                  ? "завдання"
                  : "завдань"}{" "}
              на основі ваших відповідей. Перегляньте список і видаліть зайве.
            </p>
            {planGroups.length === 0 ? (
              <p className="smart-plan-empty">
                Немає задач для додавання — змініть відповіді на попередніх
                кроках або додайте завдання вручну.
              </p>
            ) : (
              <div className="smart-plan-result-grid">
                {[0, 1].map((col) => (
                  <div key={col} className="smart-plan-result-col">
                    {planGroups
                      .map((group, i) => ({ group, i }))
                      .filter(({ i }) => i % 2 === col)
                      .map(({ group, i }) => (
                        <section
                          key={group.categoryId}
                          className="smart-plan-card"
                          style={{ order: i }}
                        >
                          <h2 className="smart-plan-cat-title">
                            {group.title}
                          </h2>
                          <ul className="smart-plan-result-list">
                            {group.tasks.map((task) => (
                              <li key={task.id}>
                                <span>{task.title}</span>
                                <button
                                  type="button"
                                  className="smart-plan-trash"
                                  aria-label={`Видалити «${task.title}»`}
                                  onClick={() => removePlanTask(task.id)}
                                >
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
                                </button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                  </div>
                ))}
              </div>
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
        {step === 1 ? (
          <Button
            type="button"
            tone="black"
            size="m"
            className="smart-plan-btn is-primary"
            onClick={() => setStep(2)}
          >
            Далі
          </Button>
        ) : null}
        {step === 2 ? (
          <Button
            type="button"
            tone="black"
            size="m"
            className="smart-plan-btn is-primary"
            onClick={goToStep3}
          >
            Далі
          </Button>
        ) : null}
        {step === 3 ? (
          <Button
            type="button"
            tone="ink"
            size="m"
            className="smart-plan-btn is-primary is-lime"
            disabled={submitting || planTasks.length === 0}
            loading={submitting}
            loadingText="Додаємо…"
            onClick={() => void submit()}
          >
            Додати завдання
          </Button>
        ) : null}
      </footer>
    </div>
  );
}
