type Props = {
  size?: number;
  className?: string;
};

/** Profile person — mobile-day-planning.svg menu row. */
export function IconSettingsProfile({ size = 20, className }: Props) {
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
        d="M10.23 8.39c-.08-.01-.18-.01-.27 0-1.98-.07-3.56-1.69-3.56-3.69C6.4 2.66 8.05 1 10.1 1c2.04 0 3.7 1.66 3.7 3.7-.01 2-1.58 3.62-3.57 3.69Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.07 11.47c-2.02 1.35-2.02 3.55 0 4.89 2.29 1.53 6.05 1.53 8.34 0 2.02-1.35 2.02-3.55 0-4.89-2.26-1.52-6.02-1.52-8.34 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shield — mobile-day-planning.svg «Безпека і дані». */
export function IconSettingsShield({ size = 20, className }: Props) {
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
        d="M10 2.75 17 5.42v4.44c0 4.53-2.98 7.29-7 8.89-4.02-1.6-7-4.36-7-8.89V5.42L10 2.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10.17 9.2 11.83 13 8.17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bell — mobile-day-planning.svg «Сповіщення». */
export function IconSettingsBell({ size = 20, className }: Props) {
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
        d="M10.73 16.83a2.25 2.25 0 0 1-3.94 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7.95c0-1.58-.63-3.09-1.76-4.2A5.9 5.9 0 0 0 9 2.5a5.9 5.9 0 0 0-4.24 1.74A5.94 5.94 0 0 0 3 7.95c0 6.94-3 8.92-3 8.92h18s-3-1.98-3-8.92Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Logout door+arrow — mobile-day-planning.svg, #FF4200. */
export function IconSettingsLogout({ size = 20, className }: Props) {
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
        d="M12.5 6.75 16.25 10.5 12.5 14.25M16.25 10.5H7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 17.25H4.25A1.5 1.5 0 0 1 2.75 15.75V5.25A1.5 1.5 0 0 1 4.25 3.75H7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
