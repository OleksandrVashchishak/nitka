import type { ButtonHTMLAttributes, ReactNode } from "react";

type MenuProps = {
  children: ReactNode;
  className?: string;
};

/** Shared cabinet row context menu (guests / budget / checklist / …). */
export function CabinetContextMenu({ children, className }: MenuProps) {
  return (
    <div
      className={`cabinet-ctx-menu${className ? ` ${className}` : ""}`}
      role="menu"
    >
      {children}
    </div>
  );
}

type ActionItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  active?: boolean;
};

/** Text action row (icon + label), optional danger styling. */
export function CabinetActionItem({
  children,
  icon,
  danger,
  active,
  className,
  type = "button",
  ...rest
}: ActionItemProps) {
  const classes = [
    "cabinet-action-item",
    danger ? "is-danger" : null,
    active ? "is-active" : null,
    className || null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function CabinetContextMenuItem({
  className,
  ...rest
}: ActionItemProps) {
  const classes = [
    "cabinet-ctx-menu-item",
    className || null,
  ]
    .filter(Boolean)
    .join(" ");

  return <CabinetActionItem className={classes} {...rest} role="menuitem" />;
}

export function CabinetContextMenuDivider() {
  return <div className="cabinet-ctx-menu-divider" />;
}

type LabelProps = {
  children: ReactNode;
  className?: string;
};

export function CabinetContextMenuLabel({ children, className }: LabelProps) {
  return (
    <p
      className={`cabinet-ctx-menu-label${className ? ` ${className}` : ""}`}
    >
      {children}
    </p>
  );
}
