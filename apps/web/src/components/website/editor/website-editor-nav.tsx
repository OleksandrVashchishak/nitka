"use client";

import {
  IconLayers,
  IconPalette,
  IconSettings,
} from "@/components/website/editor/website-editor-icons";

export type EditorTab = "design" | "content" | "settings";

type Props = {
  active: EditorTab;
  onChange: (tab: EditorTab) => void;
};

const ITEMS: Array<{
  id: EditorTab;
  label: string;
  step: number;
  icon: typeof IconPalette;
  enabled: boolean;
}> = [
  { id: "design", label: "Дизайн", step: 1, icon: IconPalette, enabled: true },
  {
    id: "content",
    label: "Наповнення",
    step: 2,
    icon: IconLayers,
    enabled: true,
  },
  {
    id: "settings",
    label: "Налаштування",
    step: 3,
    icon: IconSettings,
    enabled: true,
  },
];

export function WebsiteEditorNav({ active, onChange }: Props) {
  const activeStep = ITEMS.find((item) => item.id === active)?.step ?? 1;

  return (
    <nav className="we-nav" aria-label="Розділи редактора">
      <ol className="we-nav__steps">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          const isDone = item.step < activeStep;
          return (
            <li key={item.id} className="we-nav__step">
              <button
                type="button"
                className={`we-nav__item${isActive ? " we-nav__item--active" : ""}${
                  isDone ? " we-nav__item--done" : ""
                }`}
                disabled={!item.enabled}
                aria-current={isActive ? "step" : undefined}
                onClick={() => item.enabled && onChange(item.id)}
              >
                <span className="we-nav__icon">
                  <Icon />
                </span>
                <span className="we-nav__num" aria-hidden>
                  {isDone ? (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5.2 4.2 7.4 8 2.8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    item.step
                  )}
                </span>
                <span className="we-nav__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
