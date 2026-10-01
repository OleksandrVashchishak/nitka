type Props = {
  size?: number;
  className?: string;
};

/** Download — from TabProfile.svg export rows. */
export function IconDownload({ size = 20, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M10 2.5v10M13.75 9.25 10 13 6.25 9.25M3.333 14.25v2.083c0 .92.747 1.667 1.667 1.667h10c.92 0 1.667-.747 1.667-1.667V14.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
