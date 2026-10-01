type Props = {
  size?: number;
  className?: string;
};

/** Close X for drawers / modals — 20×20 from close-button.svg. */
export function IconClose({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <line
        x1="5.06066"
        y1="4"
        x2="18.1421"
        y2="17.0815"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="14.9393"
        x2="17.0815"
        y2="1.85786"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
