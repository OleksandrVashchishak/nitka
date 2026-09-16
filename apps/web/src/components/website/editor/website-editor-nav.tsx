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
  icon: typeof IconPalette;
  enabled: boolean;
}> = [
  { id: "design", label: "Дизайн", icon: IconPalette, enabled: true },
  { id: "content", label: "Наповнення", icon: IconLayers, enabled: true },
  { id: "settings", label: "Налаштування", icon: IconSettings, enabled: true },
];

export function WebsiteEditorNav({ active, onChange }: Props) {
  return (
    <nav className="we-nav" aria-label="Розділи редактора">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`we-nav__item${isActive ? " we-nav__item--active" : ""}`}
            disabled={!item.enabled}
            aria-current={isActive ? "page" : undefined}
            onClick={() => item.enabled && onChange(item.id)}
          >
            <span className="we-nav__icon">
              <Icon />
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
