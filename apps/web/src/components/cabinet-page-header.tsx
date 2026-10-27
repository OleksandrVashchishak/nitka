"use client";

import { openCabinetMoreMenu } from "@/lib/cabinet-more-menu";
import type { ReactNode } from "react";
import { CabinetBackButton } from "@/components/cabinet-back-title";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import type { NotificationsSummary } from "@/lib/notifications-api";

export type CabinetPageHeaderProps = {
  title: ReactNode;
  /** When set with `initials`, renders notifications + profile */
  summary?: NotificationsSummary | null;
  initials?: string;
  /** Controls before the account cluster (quick-add, currency chip, …) */
  actions?: ReactNode;
  /** Extra nodes inside the account cluster before the bell */
  endActions?: ReactNode;
  /**
   * Hide account cluster on mobile via `.cabinet-tasks-desktop-actions`.
   * Default `true`. Settings keeps profile on mobile → pass `false`.
   */
  accountDesktopOnly?: boolean;
  /** Extra class on `.cabinet-tasks-top` */
  className?: string;
  /** Mobile-only back arrow before the title (pages opened from the «Ще» menu) */
  showBack?: boolean;
};

export function CabinetPageHeader({
  title,
  summary = null,
  initials,
  actions,
  endActions,
  accountDesktopOnly = true,
  className,
  showBack = false,
}: CabinetPageHeaderProps) {
  const showAccount = initials != null;
  const showActionsRow =
    showAccount || actions != null || endActions != null;

  const rootClass = ["cabinet-tasks-top", className].filter(Boolean).join(" ");
  const accountClass = [
    "cabinet-overview-actions",
    accountDesktopOnly ? "cabinet-tasks-desktop-actions" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {showBack ? (
        <div className="cabinet-tasks-top__lead">
          <CabinetBackButton
            className="cabinet-tasks-top__back"
            onClick={openCabinetMoreMenu}
          />
          <h1 className="cabinet-tasks-title">{title}</h1>
        </div>
      ) : (
        <h1 className="cabinet-tasks-title">{title}</h1>
      )}
      {showActionsRow ? (
        <div className="cabinet-tasks-top-actions">
          {actions}
          {showAccount ? (
            <div className={accountClass}>
              {endActions}
              <CabinetNotificationsBell summary={summary} />
              <CabinetProfileMenu initials={initials} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
