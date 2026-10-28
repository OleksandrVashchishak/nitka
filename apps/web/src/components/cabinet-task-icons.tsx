type Props = {
  size?: number;
  className?: string;
};

/** Black circle + lime plus — mobile quick-add (Figma QuickAdd 36). */
export function IconQuickAdd({ size = 40, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect width="36" height="36" rx="18" fill="#1A1A1A" />
      <path
        d="M18 24V12"
        stroke="#F0FEBB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18H24"
        stroke="#F0FEBB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Lime ring + plus — desktop «Додати …» CTA (Figma AddButton). */
export function IconAddCircle({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle
        cx="10"
        cy="10"
        r="9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10h8M10 14V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
