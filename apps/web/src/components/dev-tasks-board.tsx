"use client";

import { FormEvent, useEffect, useId, useState } from "react";

type ColumnId = "backlog" | "in_progress" | "in_review" | "done";

type DevTask = {
  id: string;
  title: string;
  assignee: string;
  column: ColumnId;
};

const STORAGE_KEY = "nitka-dev-tasks:v1";

const COLUMNS: Array<{
  id: ColumnId;
  label: string;
  className: string;
}> = [
  {
    id: "backlog",
    label: "Backlog",
    className: "bg-white",
  },
  {
    id: "in_progress",
    label: "In progress",
    className: "bg-[#eceaf8]",
  },
  {
    id: "in_review",
    label: "In review",
    className: "bg-[#e6f4f6]",
  },
  {
    id: "done",
    label: "Done",
    className: "bg-[#e8f5ee] ring-2 ring-[#3b82f6]",
  },
];

const SEED: DevTask[] = [
  {
    id: "seed-style",
    title: "стиль сторінок платформи",
    assignee: "",
    column: "backlog",
  },
];

function loadTasks(): DevTask[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as DevTask[];
    if (!Array.isArray(parsed)) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

function uid() {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function DevTasksBoard() {
  const [tasks, setTasks] = useState<DevTask[]>([]);
  const [ready, setReady] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<ColumnId | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>("backlog");
  const dialogTitleId = useId();
  const titleFieldId = useId();
  const assigneeId = useId();

  useEffect(() => {
    setTasks(loadTasks());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, ready]);

  function openAdd(column: ColumnId = "backlog") {
    setDefaultColumn(column);
    setTitle("");
    setAssignee("");
    setModalOpen(true);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nextTitle = title.trim();
    if (nextTitle.length < 2) return;
    setTasks((prev) => [
      ...prev,
      {
        id: uid(),
        title: nextTitle,
        assignee: assignee.trim(),
        column: defaultColumn,
      },
    ]);
    setModalOpen(false);
  }

  function moveTask(id: string, column: ColumnId) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, column } : task)),
    );
  }

  function updateAssignee(id: string, value: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, assignee: value } : task,
      ),
    );
  }

  function updateTitle(id: string, value: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: value } : task,
      ),
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function onDrop(column: ColumnId) {
    if (!dragId) return;
    moveTask(dragId, column);
    setDragId(null);
    setDropColumn(null);
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-soft">
        Завантажуємо дошку…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ececec] px-3 py-4 sm:px-5 sm:py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
            Dev board
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-ink">
            Tasks
          </h1>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            Локальна дошка пріоритетів на період розробки. Зберігається в цьому
            браузері.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAdd("backlog")}
          className="cursor-pointer bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85"
        >
          + Додати таску
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-4 lg:gap-4">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.column === col.id);
          const isOver = dropColumn === col.id;
          return (
            <section
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDropColumn(col.id);
              }}
              onDragLeave={() => {
                if (dropColumn === col.id) setDropColumn(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(col.id);
              }}
              className={`flex min-h-[70vh] flex-col border border-black/10 p-4 transition ${col.className} ${
                isOver ? "outline outline-2 outline-offset-2 outline-ink/30" : ""
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-ink">{col.label}</h2>
                <button
                  type="button"
                  onClick={() => openAdd(col.id)}
                  className="cursor-pointer text-xs font-medium uppercase tracking-[0.12em] text-ink-soft hover:text-ink"
                  aria-label={`Додати в ${col.label}`}
                >
                  +
                </button>
              </div>

              <ul className="flex flex-1 flex-col gap-2">
                {items.map((task) => (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={() => setDragId(task.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setDropColumn(null);
                    }}
                    className={`border border-black/10 bg-white/90 p-3 shadow-sm ${
                      dragId === task.id ? "opacity-50" : ""
                    }`}
                  >
                    <textarea
                      value={task.title}
                      onChange={(e) => updateTitle(task.id, e.target.value)}
                      rows={2}
                      className="w-full resize-none bg-transparent text-sm text-ink outline-none"
                      aria-label="Назва таски"
                    />
                    <label className="mt-2 block">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                        Кому
                      </span>
                      <input
                        value={task.assignee}
                        onChange={(e) =>
                          updateAssignee(task.id, e.target.value)
                        }
                        placeholder="Імʼя"
                        className="mt-1 w-full border border-black/10 bg-white px-2 py-1.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 focus:border-ink/30"
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {COLUMNS.filter((c) => c.id !== task.column).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => moveTask(task.id, c.id)}
                          className="cursor-pointer border border-black/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-ink-soft hover:border-ink/30 hover:text-ink"
                        >
                          → {c.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="ml-auto cursor-pointer px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-red-600/80 hover:bg-red-50"
                      >
                        Видалити
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          onClick={() => setModalOpen(false)}
        >
          <form
            onSubmit={onSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-lg"
          >
            <h3
              id={dialogTitleId}
              className="font-[family-name:var(--font-display)] text-2xl text-ink"
            >
              Нова таска
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Колонка:{" "}
              {COLUMNS.find((c) => c.id === defaultColumn)?.label ?? "Backlog"}
            </p>

            <label className="mt-4 block" htmlFor={titleFieldId}>
              <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                Назва
              </span>
              <input
                id={titleFieldId}
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={2}
                className="mt-1.5 w-full border border-black/15 px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40"
                placeholder="Що робимо?"
              />
            </label>

            <label className="mt-3 block" htmlFor={assigneeId}>
              <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                Кому (імʼя)
              </span>
              <input
                id={assigneeId}
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="mt-1.5 w-full border border-black/15 px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40"
                placeholder="Напр. Саша, дизайнер…"
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer border border-black/15 px-4 py-2 text-sm text-ink-soft hover:border-ink/30 hover:text-ink"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="cursor-pointer bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/85"
              >
                Додати
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
