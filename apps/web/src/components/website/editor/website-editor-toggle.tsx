type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
};

/** Pill toggle matching design SVG (green ON / gray OFF). */
export function WebsiteToggle({
  checked,
  onChange,
  label,
  disabled,
}: ToggleProps) {
  return (
    <button
      type="button"
      className="we-toggle"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
    >
      <svg
        className="we-toggle__svg"
        width="36"
        height="20"
        viewBox="0 0 36 20"
        fill="none"
        aria-hidden
      >
        <rect
          x="0"
          y="0"
          width="36"
          height="20"
          rx="10"
          fill={checked ? "#22C55E" : "#E4E4E7"}
        />
        <circle
          cx={checked ? 26 : 10}
          cy="10"
          r="7"
          fill="#FFFFFF"
        />
      </svg>
    </button>
  );
}

export function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 5.25 7 8.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
