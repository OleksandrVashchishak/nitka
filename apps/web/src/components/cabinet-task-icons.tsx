type Props = {
  size?: number;
  className?: string;
};

/** Black circle + lime ring + plus — mobile quick-add. */
export function IconQuickAdd({ size = 40, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="20" cy="20" r="20" fill="#1A1A1A" />
      <circle cx="20" cy="20" r="14.5" stroke="#F0FEBB" strokeWidth="1.4" />
      <path
        d="M20 13.5v13M13.5 20h13"
        stroke="#F0FEBB"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Horizontal sliders — filters trigger. */
export function IconFilters({ size = 16, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2 4h5.5M10.5 4H14M2 8h9M14 8h0M2 12h3.5M8.5 12H14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="9" cy="4" r="1.4" fill="currentColor" />
      <circle cx="12.5" cy="8" r="1.4" fill="currentColor" />
      <circle cx="7" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Close X for drawers. */
export function IconClose({ size = 16, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Checkmark for task checkbox (animated via CSS). */
export function IconTaskCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        className="cabinet-task-check__path"
        d="M2.4 6.2 4.9 8.7 9.6 3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
