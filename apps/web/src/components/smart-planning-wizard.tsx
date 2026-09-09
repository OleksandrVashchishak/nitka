"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
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

function CircleCheck({
  checked,
  tone = "default",
}: {
  checked: boolean;
  tone?: "default" | "lime";
}) {
  return (
    <span
      className={`smart-plan-check${checked ? " is-checked" : ""}${
        tone === "lime" && checked ? " is-lime" : ""
      }`}
      aria-hidden
    >
      {checked ? (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path
            d="M3.5 8.2 6.4 11l6-6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
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
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.5 8.2 6.4 11l6-6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
        <Link href="/" className="smart-plan-logo" aria-label="fata.studio">
          fata.studi<span className="cabinet-logo-dot">o</span>
        </Link>
        <CabinetProfileMenu initials={partnerInitials} />
      </header>

      <div className="smart-plan-back-row">
        <button type="button" className="smart-plan-back" onClick={onClose}>
          ← Назад до Завдань
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
                        <CircleCheck checked={checked} />
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
                      <CircleCheck checked={allOn || someOn} tone="lime" />
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
                              <CircleCheck checked={checked} tone="lime" />
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
                {planGroups.map((group) => (
                  <section key={group.categoryId} className="smart-plan-card">
                    <h2 className="smart-plan-cat-title">{group.title}</h2>
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
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              aria-hidden
                            >
                              <path
                                d="M3.5 4.5h9M6.5 4.5V3.25A.75.75 0 0 1 7.25 2.5h1.5a.75.75 0 0 1 .75.75V4.5m1.5 0v8.25a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75V4.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      <footer className="smart-plan-footer">
        {step === 1 ? (
          <button type="button" className="smart-plan-btn is-ghost" onClick={onClose}>
            Скасувати
          </button>
        ) : (
          <button
            type="button"
            className="smart-plan-btn is-ghost"
            onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
          >
            Назад
          </button>
        )}
        {step === 1 ? (
          <button
            type="button"
            className="smart-plan-btn is-primary"
            onClick={() => setStep(2)}
          >
            Далі
          </button>
        ) : null}
        {step === 2 ? (
          <button
            type="button"
            className="smart-plan-btn is-primary"
            onClick={goToStep3}
          >
            Далі
          </button>
        ) : null}
        {step === 3 ? (
          <button
            type="button"
            className="smart-plan-btn is-primary"
            disabled={submitting || planTasks.length === 0}
            onClick={() => void submit()}
          >
            {submitting ? "Додаємо…" : "Додати завдання до списку"}
          </button>
        ) : null}
      </footer>
    </div>
  );
}
