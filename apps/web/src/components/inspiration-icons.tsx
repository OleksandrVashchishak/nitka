type Props = {
  size?: number;
  className?: string;
};

/** Simple plus — board create / add chip. */
export function IconPlus({ size = 16, className }: Props) {
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
        d="M8 3.333v9.334M3.333 8h9.334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Arrow 1.svg — inspiration back link. */
export function IconBackArrow({ className }: { className?: string }) {
  return (
    <svg
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M0.146446 3.32809C-0.0488157 3.52335 -0.0488157 3.83993 0.146446 4.03519L3.32843 7.21717C3.52369 7.41244 3.84027 7.41244 4.03553 7.21717C4.2308 7.02191 4.2308 6.70533 4.03553 6.51007L1.20711 3.68164L4.03553 0.853214C4.2308 0.657951 4.2308 0.341369 4.03553 0.146107C3.84027 -0.0491555 3.52369 -0.0491555 3.32843 0.146107L0.146446 3.32809ZM10.5 3.68164V3.18164L0.5 3.18164V3.68164V4.18164L10.5 4.18164V3.68164Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Network share — inspiration «Поширити». */
export function IconShareNodes({ size = 18, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle
        cx="13.5"
        cy="3.75"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="4.5" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="13.5"
        cy="14.25"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.45 8.1 11.55 4.65M6.45 9.9l5.1 3.45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Black circle + gold plus — mobile board FAB glyph. */
export function IconInspirationFab() {
  return (
    <svg
      className="cabinet-inspiration-fab"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
    >
      <rect width="36" height="36" rx="18" fill="#1A1A1A" />
      <path
        d="M18 24V12M12 18H24"
        stroke="#F0FEBB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
