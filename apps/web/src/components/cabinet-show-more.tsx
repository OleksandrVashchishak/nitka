"use client";

type Props = {
  hasMore: boolean;
  onShowMore: () => void;
  label?: string;
  className?: string;
};

export function CabinetShowMore({
  hasMore,
  onShowMore,
  label = "Показати більше",
  className,
}: Props) {
  if (!hasMore) return null;

  const rootClass = className
    ? `cabinet-show-more ${className}`
    : "cabinet-show-more";

  return (
    <button type="button" className={rootClass} onClick={onShowMore}>
      {label}
    </button>
  );
}
