"use client";

import { IconFilters } from "@/components/cabinet-task-icons";
import { Select } from "@/components/ui/select";

export type CabinetMobileFiltersBarOption = {
  value: string;
  label: string;
};

export type CabinetMobileFiltersBarProps = {
  onOpenFilters: () => void;
  filtersActive?: boolean;
  /** When set and > 0, shows a count badge on the filters chip */
  activeFilterCount?: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: CabinetMobileFiltersBarOption[];
  sortAriaLabel?: string;
  filtersLabel?: string;
  className?: string;
};

export function CabinetMobileFiltersBar({
  onOpenFilters,
  filtersActive = false,
  activeFilterCount,
  sortValue,
  onSortChange,
  sortOptions,
  sortAriaLabel = "Сортування",
  filtersLabel = "Фільтри",
  className,
}: CabinetMobileFiltersBarProps) {
  const rootClass = ["cabinet-tasks-mobile-bar", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <button
        type="button"
        className={`cabinet-tasks-chip${filtersActive ? " is-active" : ""}`}
        onClick={onOpenFilters}
      >
        <IconFilters size={14} />
        {filtersLabel}
        {typeof activeFilterCount === "number" && activeFilterCount > 0 ? (
          <span className="cabinet-tasks-chip-badge">{activeFilterCount}</span>
        ) : null}
      </button>
      <div className="cabinet-tasks-chip cabinet-tasks-chip--select">
        <Select
          tone="ghost"
          size="s"
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label={sortAriaLabel}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
