"use client";

import { IconHeart } from "@/components/icon-heart";
import { IconEdit } from "@/components/icon-edit";
import {
  IconSettingsBell,
  IconSettingsLogout,
  IconSettingsProfile,
  IconSettingsShield,
} from "@/components/settings/settings-mobile-icons";

export type SettingsTab = "profile" | "security" | "notifications";

type Props = {
  photoUrl: string;
  coupleNames: string;
  weddingDateLabel: string;
  activeTab: SettingsTab;
  photoBusy?: boolean;
  /** Mobile hub: no active highlight, full-width cards with icons */
  hubMode?: boolean;
  onTabChange: (tab: SettingsTab) => void;
  onPhotoPick: (file: File) => void;
  onLogout?: () => void;
};

const TABS: {
  id: SettingsTab;
  label: string;
  icon: "profile" | "shield" | "bell";
}[] = [
  { id: "profile", label: "Профіль", icon: "profile" },
  { id: "security", label: "Безпека і дані", icon: "shield" },
  { id: "notifications", label: "Сповіщення", icon: "bell" },
];

function TabIcon({ name }: { name: "profile" | "shield" | "bell" }) {
  if (name === "shield") return <IconSettingsShield size={20} />;
  if (name === "bell") return <IconSettingsBell size={20} />;
  return <IconSettingsProfile size={20} />;
}

export function SettingsSideNav({
  photoUrl,
  coupleNames,
  weddingDateLabel,
  activeTab,
  photoBusy = false,
  hubMode = false,
  onTabChange,
  onPhotoPick,
  onLogout,
}: Props) {
  return (
    <aside
      className={`cabinet-settings-side${hubMode ? " is-hub" : ""}`}
    >
      <div className="cabinet-settings-photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cabinet-settings-photo" src={photoUrl} alt="" />
        <label
          className={`cabinet-settings-photo-edit${photoBusy ? " is-busy" : ""}`}
        >
          <span className="cabinet-settings-sr-only">Змінити фото</span>
          <IconEdit size={15} />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="cabinet-settings-photo-input"
            disabled={photoBusy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onPhotoPick(file);
            }}
          />
        </label>
      </div>

      <div className="cabinet-settings-couple">
        <p className="cabinet-settings-couple-names">{coupleNames}</p>
        <div className="cabinet-settings-couple-meta">
          <IconHeart size={20} className="cabinet-settings-couple-heart" />
          {weddingDateLabel ? (
            <p className="cabinet-settings-couple-date">{weddingDateLabel}</p>
          ) : null}
        </div>
      </div>

      <nav className="cabinet-settings-nav" aria-label="Розділи налаштувань">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cabinet-settings-nav-item${
              !hubMode && activeTab === tab.id ? " is-active" : ""
            }`}
            aria-current={
              !hubMode && activeTab === tab.id ? "page" : undefined
            }
            onClick={() => onTabChange(tab.id)}
          >
            <span className="cabinet-settings-nav-icon" aria-hidden>
              <TabIcon name={tab.icon} />
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {hubMode && onLogout ? (
        <button
          type="button"
          className="cabinet-settings-logout"
          onClick={onLogout}
        >
          <IconSettingsLogout size={20} />
          <span>Вийти з акаунту</span>
        </button>
      ) : null}
    </aside>
  );
}
