type Props = {
  size?: number;
  className?: string;
};

/** Black circle + lime ring + plus — mobile quick-add (Figma QuickAdd @1x 44). */
export function IconQuickAdd({ size = 40, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect width="44" height="44" rx="22" fill="#1A1A1A" />
      <path
        d="M22 32C27.5 32 32 27.5 32 22C32 16.5 27.5 12 22 12C16.5 12 12 16.5 12 22C12 27.5 16.5 32 22 32Z"
        stroke="#F0FEBB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 22H26"
        stroke="#F0FEBB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 26V18"
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
