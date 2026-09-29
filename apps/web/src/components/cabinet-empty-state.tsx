import type { ReactNode } from "react";

type Art = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

type Props = {
  art: Art;
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  className?: string;
  /** Extra nodes inside the card (e.g. hidden file input). */
  children?: ReactNode;
};

export function CabinetEmptyState({
  art,
  title,
  description,
  actions,
  className,
  children,
}: Props) {
  const rootClass = className
    ? `cabinet-empty ${className}`
    : "cabinet-empty";
  const artClass = art.className
    ? `cabinet-empty-art ${art.className}`
    : "cabinet-empty-art";

  return (
    <div className={rootClass}>
      <div className="cabinet-empty-glow" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={artClass}
        src={art.src}
        alt=""
        width={art.width}
        height={art.height}
        aria-hidden
      />
      <h2>{title}</h2>
      {description}
      <div className="cabinet-empty-actions">{actions}</div>
      {children}
    </div>
  );
}
