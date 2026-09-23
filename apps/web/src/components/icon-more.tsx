type Props = {
  size?: number;
  className?: string;
};

/** Horizontal “more” (⋯) — cabinet menus, task rows, etc. */
export function IconMore({ size = 20, className }: Props) {
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
        d="M10.0003 10.8327C10.4606 10.8327 10.8337 10.4596 10.8337 9.99935C10.8337 9.53911 10.4606 9.16602 10.0003 9.16602C9.54009 9.16602 9.16699 9.53911 9.16699 9.99935C9.16699 10.4596 9.54009 10.8327 10.0003 10.8327Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8333 10.8327C16.2936 10.8327 16.6667 10.4596 16.6667 9.99935C16.6667 9.53911 16.2936 9.16602 15.8333 9.16602C15.3731 9.16602 15 9.53911 15 9.99935C15 10.4596 15.3731 10.8327 15.8333 10.8327Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16634 10.8327C4.62658 10.8327 4.99967 10.4596 4.99967 9.99935C4.99967 9.53911 4.62658 9.16602 4.16634 9.16602C3.7061 9.16602 3.33301 9.53911 3.33301 9.99935C3.33301 10.4596 3.7061 10.8327 4.16634 10.8327Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
