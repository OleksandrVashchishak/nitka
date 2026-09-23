import type { TaskAssignee } from "@/lib/dashboard-api";

export type ResponsibleTone =
  | "owner"
  | "partner"
  | "none"
  | "other"
  | "couple"
  | "parents_owner"
  | "parents_partner"
  | "unknown";

function initialFromName(name: string, fallback = "?"): string {
  const ch = name.trim().charAt(0);
  return ch ? ch.toUpperCase() : fallback;
}

type AvatarProps = {
  name?: string;
  letter?: string;
  tone?: ResponsibleTone;
  title?: string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
};

/** 18×18 circle with the first letter of the responsible person. */
export function ResponsibleAvatar({
  name,
  letter,
  tone = "partner",
  title,
  className,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
}: AvatarProps) {
  const mark =
    letter ??
    (name
      ? initialFromName(name)
      : tone === "none"
        ? "—"
        : "?");

  return (
    <span
      className={`responsible-avatar is-${tone}${className ? ` ${className}` : ""}`}
      title={title}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {mark}
    </span>
  );
}

type DuoProps = {
  ownerName: string;
  partnerName: string;
  title?: string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
};

/** Overlapping owner + partner avatars («Обоє») — owner behind, partner on top with white ring. */
export function ResponsibleAvatarDuo({
  ownerName,
  partnerName,
  title,
  className,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
}: DuoProps) {
  return (
    <span
      className={`responsible-avatar-duo${className ? ` ${className}` : ""}`}
      title={title}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      <ResponsibleAvatar name={ownerName} tone="owner" />
      <ResponsibleAvatar name={partnerName} tone="partner" />
    </span>
  );
}

type TaskProps = {
  who: TaskAssignee;
  ownerName: string;
  partnerName: string;
  className?: string;
};

/** Task assignee badge from `TaskAssignee` + partner names. */
export function TaskResponsibleAvatar({
  who,
  ownerName,
  partnerName,
  className,
}: TaskProps) {
  if (who === "both") {
    return (
      <ResponsibleAvatarDuo
        ownerName={ownerName}
        partnerName={partnerName}
        title="Обоє"
        className={className}
        aria-hidden
      />
    );
  }
  if (who === "none") {
    return (
      <ResponsibleAvatar
        tone="none"
        letter="—"
        title="Ніхто"
        className={className}
      />
    );
  }
  if (who === "other") {
    return (
      <ResponsibleAvatar
        tone="other"
        letter="?"
        title="Хтось інший"
        className={className}
      />
    );
  }
  if (who === "owner") {
    return (
      <ResponsibleAvatar
        name={ownerName}
        tone="owner"
        title={ownerName}
        className={className}
      />
    );
  }
  return (
    <ResponsibleAvatar
      name={partnerName}
      tone="partner"
      title={partnerName}
      className={className}
    />
  );
}
