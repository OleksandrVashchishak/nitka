"use client";

import { CabinetNavIcon } from "@/components/cabinet-nav-icons";
import { IconDownload } from "@/components/icon-download";
import { IconTrash } from "@/components/icon-trash";
import { Button } from "@/components/ui/button";

export type SettingsSession = {
  id: string;
  initial: string;
  device: string;
  when: string;
};

export type SettingsExportItem = {
  id: string;
  label: string;
  icon: "guests" | "budget" | "dayplan";
};

type Props = {
  sessions: SettingsSession[];
  onRevokeSession: (id: string) => void;
  onExport: (id: string) => void;
  onDeleteAccount: () => void;
};

const EXPORT_ITEMS: SettingsExportItem[] = [
  { id: "guests", label: "Гості (CSV)", icon: "guests" },
  { id: "budget", label: "Бюджет (XLS)", icon: "budget" },
  { id: "dayplan", label: "План дня (PDF)", icon: "dayplan" },
];

export function SettingsSecurityPanel({
  sessions,
  onRevokeSession,
  onExport,
  onDeleteAccount,
}: Props) {
  return (
    <div className="cabinet-settings-main">
      <header className="cabinet-settings-head">
        <h2 className="cabinet-settings-head-title">Безпека і дані</h2>
        <p className="cabinet-settings-head-text">
          Керуйте сесіями, експортуйте дані та налаштуйте безпеку акаунта.
        </p>
      </header>

      <section
        className="cabinet-settings-card cabinet-settings-sessions"
        aria-labelledby="settings-sessions-title"
      >
        <h3 id="settings-sessions-title" className="cabinet-settings-card-title">
          Активні сесії
        </h3>
        <ul className="cabinet-settings-session-list">
          {sessions.map((session) => (
            <li key={session.id} className="cabinet-settings-session-row">
              <span className="cabinet-settings-session-avatar" aria-hidden>
                {session.initial}
              </span>
              <div className="cabinet-settings-session-meta">
                <p className="cabinet-settings-session-device">{session.device}</p>
                <p className="cabinet-settings-session-when">{session.when}</p>
              </div>
              <button
                type="button"
                className="cabinet-settings-session-revoke"
                aria-label={`Завершити сесію ${session.device}`}
                onClick={() => onRevokeSession(session.id)}
              >
                <IconTrash size={18} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="cabinet-settings-card cabinet-settings-export"
        aria-labelledby="settings-export-title"
      >
        <h3 id="settings-export-title" className="cabinet-settings-card-title">
          Експорт даних
        </h3>
        <ul className="cabinet-settings-export-list">
          {EXPORT_ITEMS.map((item) => (
            <li key={item.id} className="cabinet-settings-export-row">
              <span className="cabinet-settings-export-icon" aria-hidden>
                <CabinetNavIcon name={item.icon} size={20} />
              </span>
              <span className="cabinet-settings-export-label">{item.label}</span>
              <button
                type="button"
                className="cabinet-settings-export-download"
                aria-label={`Завантажити ${item.label}`}
                onClick={() => onExport(item.id)}
              >
                <IconDownload size={20} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="cabinet-settings-danger"
        aria-labelledby="settings-danger-title"
      >
        <div className="cabinet-settings-danger-head">
          <IconTrash size={18} className="cabinet-settings-danger-icon" />
          <h3 id="settings-danger-title" className="cabinet-settings-danger-title">
            Видалення акаунта
          </h3>
        </div>
        <p className="cabinet-settings-danger-text">
          Видалення акаунта призведе до повного знищення всіх даних, включно з
          архівами.
        </p>
        <div className="cabinet-settings-danger-actions">
          <Button
            type="button"
            tone="outline"
            size="s"
            className="cabinet-settings-danger-btn"
            onClick={onDeleteAccount}
          >
            Видалити акаунт
          </Button>
        </div>
      </section>
    </div>
  );
}
