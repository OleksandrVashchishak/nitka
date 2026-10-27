import type { ReactNode } from "react";
import { IconCabinetBack } from "@/components/icon-cabinet-back";

export type CabinetBackButtonProps = {
  onClick: () => void;
  className?: string;
};

export function CabinetBackButton({ onClick, className }: CabinetBackButtonProps) {
  return (
    <button
      type="button"
      className={["cabinet-back-button", className].filter(Boolean).join(" ")}
      aria-label="Назад"
      onClick={onClick}
    >
      <IconCabinetBack />
    </button>
  );
}

export type CabinetBackTitleProps = {
  title: ReactNode;
  onBack: () => void;
  /** Right-aligned control after the title (e.g. share button) */
  end?: ReactNode;
  className?: string;
};

/** Mobile page title: back arrow + italic heading (shared by main cabinet pages) */
export function CabinetBackTitle({
  title,
  onBack,
  end,
  className,
}: CabinetBackTitleProps) {
  return (
    <div className={["cabinet-back-title", className].filter(Boolean).join(" ")}>
      <CabinetBackButton onClick={onBack} />
      <h1 className="cabinet-back-title__text">{title}</h1>
      {end}
    </div>
  );
}
