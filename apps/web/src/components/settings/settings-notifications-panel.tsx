"use client";

import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import {
  IconSettingsMail,
  IconSettingsPush,
} from "@/components/settings/settings-notif-icons";
import { SettingsToggle } from "@/components/settings/settings-toggle";

export type NotifPrefs = {
  guestRsvp: boolean;
  upcomingPayments: boolean;
  taskDeadlines: boolean;
  partnerChanges: boolean;
  push: boolean;
  email: boolean;
};

type Props = {
  prefs: NotifPrefs;
  onChange: (next: NotifPrefs) => void;
};

const EVENT_ROWS: {
  key: keyof Pick<
    NotifPrefs,
    "guestRsvp" | "upcomingPayments" | "taskDeadlines" | "partnerChanges"
  >;
  label: string;
  icon: "guests" | "budget" | "tasks" | "vendors";
}[] = [
  { key: "guestRsvp", label: "Нові відповіді гостей", icon: "guests" },
  { key: "upcomingPayments", label: "Майбутні платежі", icon: "budget" },
  { key: "taskDeadlines", label: "Дедлайни завдань", icon: "tasks" },
  { key: "partnerChanges", label: "Зміни від партнера", icon: "vendors" },
];

export function SettingsNotificationsPanel({ prefs, onChange }: Props) {
  function setPref<K extends keyof NotifPrefs>(key: K, value: NotifPrefs[K]) {
    onChange({ ...prefs, [key]: value });
  }

  return (
    <div className="cabinet-settings-main">
      <header className="cabinet-settings-head">
        <h2 className="cabinet-settings-head-title">Сповіщення</h2>
        <p className="cabinet-settings-head-text">
          Оберіть, як отримувати повідомлення про відповіді гостей, платежі та
          зміни від партнера.
        </p>
      </header>

      <section
        className="cabinet-settings-card cabinet-settings-notif-card"
        aria-labelledby="settings-notif-events-title"
      >
        <h3
          id="settings-notif-events-title"
          className="cabinet-settings-card-title"
        >
          Типи подій
        </h3>
        <ul className="cabinet-settings-notif-list">
          {EVENT_ROWS.map((row) => (
            <li key={row.key} className="cabinet-settings-notif-row">
              <span className="cabinet-settings-notif-icon" aria-hidden>
                <CabinetNavIcon name={row.icon} size={20} />
              </span>
              <span className="cabinet-settings-notif-label">{row.label}</span>
              <SettingsToggle
                checked={prefs[row.key]}
                label={row.label}
                onChange={(next) => setPref(row.key, next)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section
        className="cabinet-settings-card cabinet-settings-notif-card cabinet-settings-notif-card--channels"
        aria-labelledby="settings-notif-channels-title"
      >
        <h3
          id="settings-notif-channels-title"
          className="cabinet-settings-card-title"
        >
          Канали сповіщень
        </h3>
        <ul className="cabinet-settings-notif-list">
          <li className="cabinet-settings-notif-row">
            <span className="cabinet-settings-notif-icon" aria-hidden>
              <IconSettingsPush size={20} />
            </span>
            <span className="cabinet-settings-notif-label">
              Push-повідомлення
            </span>
            <SettingsToggle
              checked={prefs.push}
              label="Push-повідомлення"
              onChange={(next) => setPref("push", next)}
            />
          </li>
          <li className="cabinet-settings-notif-row">
            <span className="cabinet-settings-notif-icon" aria-hidden>
              <IconSettingsMail size={20} />
            </span>
            <span className="cabinet-settings-notif-label">
              Email-повідомлення
            </span>
            <SettingsToggle
              checked={prefs.email}
              label="Email-повідомлення"
              onChange={(next) => setPref("email", next)}
            />
          </li>
        </ul>
      </section>
    </div>
  );
}
