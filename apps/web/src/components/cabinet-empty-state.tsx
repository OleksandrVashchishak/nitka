import type { ReactNode } from "react";

type Art = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

type SoftProps = {
  variant: "soft";
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
  art?: never;
  title?: never;
};

type IllustratedProps = {
  variant?: "illustrated";
  art?: Art;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Extra nodes inside the card (e.g. hidden file input). */
  children?: ReactNode;
};

export type CabinetEmptyStateProps = SoftProps | IllustratedProps;

export function CabinetEmptyState(props: CabinetEmptyStateProps) {
  if (props.variant === "soft") {
    const { description, actions, className, children } = props;
    const rootClass = ["cabinet-empty", "cabinet-empty--soft", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={rootClass}>
        <div className="cabinet-empty-desc">{description}</div>
        {actions ? (
          <div className="cabinet-empty-actions">{actions}</div>
        ) : null}
        {children}
      </div>
    );
  }

  const { art, title, description, actions, className, children } = props;
  const rootClass = className
    ? `cabinet-empty ${className}`
    : "cabinet-empty";
  const artClass = art?.className
    ? `cabinet-empty-art ${art.className}`
    : "cabinet-empty-art";

  return (
    <div className={rootClass}>
      {art ? <div className="cabinet-empty-glow" aria-hidden /> : null}
      {art ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={artClass}
          src={art.src}
          alt=""
          width={art.width}
          height={art.height}
          aria-hidden
        />
      ) : null}
      <h2>{title}</h2>
      {description}
      {actions ? (
        <div className="cabinet-empty-actions">{actions}</div>
      ) : null}
      {children}
    </div>
  );
}
