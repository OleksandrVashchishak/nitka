"use client";

import { IconHeart } from "@/components/icon-heart";
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

export const SETTINGS_TAB_TITLES: Record<SettingsTab, string> = {
  profile: "Профіль",
  security: "Безпека і дані",
  notifications: "Сповіщення",
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
          <svg width="20" height="20" viewBox="10 10 20 20" fill="none" aria-hidden>
            <g stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.0475 13L14.2058 20.2417C13.9475 20.5167 13.6975 21.0584 13.6475 21.4334L13.3392 24.1333C13.2308 25.1083 13.9308 25.775 14.8975 25.6084L17.5808 25.15C17.9558 25.0834 18.4808 24.8084 18.7392 24.525L25.5809 17.2834C26.7642 16.0334 27.2975 14.6084 25.4558 12.8667C23.6225 11.1417 22.2308 11.75 21.0475 13Z" />
              <path d="M19.9062 14.209C20.2646 16.509 22.1312 18.2673 24.4479 18.5007" />
              <path d="M12.5 28.334H27.5" />
            </g>
          </svg>
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
              activeTab === tab.id ? " is-active" : ""
            }`}
            aria-current={activeTab === tab.id ? "page" : undefined}
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
