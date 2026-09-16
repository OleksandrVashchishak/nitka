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

export function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 3.5h9M5.5 3.5V2.5h3v1M4 3.5l.5 8h5l.5-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 5.75v4.5M8.25 5.75v4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect
        x="2"
        y="3"
        width="10"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M2 6h10M5 2v2M9 2v2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
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
